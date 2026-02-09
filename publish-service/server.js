import express from 'express';
import cors from 'cors';

// Environment variables needed:
// GITHUB_TOKEN (repo contents write scope)
// REPO_OWNER (e.g. aminssutt)
// REPO_NAME (e.g. Fabulous)
// REPO_BRANCH (e.g. gh-pages)
// OPTIONAL_BASIC_SECRET (simple shared secret to avoid public misuse)

const app = express();
app.use(cors());
app.use(express.json({limit: '1mb'}));

const {
  GITHUB_TOKEN,
  REPO_OWNER = 'aminssutt',
  REPO_NAME = 'Fabulous',
  REPO_BRANCH = 'gh-pages',
  OPTIONAL_BASIC_SECRET
} = process.env;

if(!GITHUB_TOKEN){
  console.warn('[WARN] Missing GITHUB_TOKEN environment variable. Service will NOT be able to commit.');
}

const CONTENT_PATH = 'gallery.json';

const b64 = str => Buffer.from(str, 'utf8').toString('base64');

async function getCurrentFileSha(){
  const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${CONTENT_PATH}?ref=${REPO_BRANCH}`;
  const resp = await fetch(url, { headers: { Authorization: `Bearer ${GITHUB_TOKEN}`, Accept: 'application/vnd.github+json' }});
  if(resp.status === 200){
    const json = await resp.json();
    return json.sha;
  }
  return null;
}

app.get('/health', (_,res)=> res.json({ ok:true, repo:`${REPO_OWNER}/${REPO_NAME}`, branch: REPO_BRANCH }));

app.post('/publish', async (req,res)=>{
  try {
    if(OPTIONAL_BASIC_SECRET){
      const header = req.headers['x-publish-secret'];
      if(header !== OPTIONAL_BASIC_SECRET){
        return res.status(401).json({error:'invalid secret'});
      }
    }
    if(!GITHUB_TOKEN) return res.status(500).json({error:'server missing token'});

    const { images } = req.body;
    if(!Array.isArray(images) || !images.length){
      return res.status(400).json({error:'images array required'});
    }
    // Basic validation & normalization
    const cleaned = images.filter(it=> it && typeof it === 'object' && (it.url||it.data) )
      .map(it=> ({
        id: typeof it.id === 'string' ? it.id : (Date.now().toString(36)+Math.random().toString(36).slice(2)),
        theme: ['general','residential','commercial'].includes(it.theme) ? it.theme : 'general',
        url: it.url || undefined,
        data: it.data || undefined
      }));

    if(!cleaned.length) return res.status(400).json({error:'no valid images'});

    const sha = await getCurrentFileSha();
    const commitUrl = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${CONTENT_PATH}`;
    const body = {
      message: `chore(gallery): update via publish-service (${new Date().toISOString()})`,
      content: b64(JSON.stringify(cleaned,null,2)),
      branch: REPO_BRANCH,
      sha: sha || undefined
    };

    const putResp = await fetch(commitUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github+json'
      },
      body: JSON.stringify(body)
    });

    if(!putResp.ok){
      const txt = await putResp.text();
      return res.status(500).json({error:'github api error', status: putResp.status, body: txt.slice(0,300)});
    }
    const json = await putResp.json();
    return res.json({ ok:true, committed: true, sha: json.content?.sha });
  } catch(err){
    console.error(err);
    return res.status(500).json({error:'server error', detail: err.message});
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=> console.log(`[publish-service] listening on ${PORT}`));
