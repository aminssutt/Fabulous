import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faSpinner, faHome, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { API_URL } from '../../config';

const Wrap = styled.div`min-height:100vh;display:flex;align-items:center;justify-content:center;background:${p=>p.theme.colors.background};padding:2rem;`;
const Card = styled.div`background:rgba(255,255,255,.02);border:1px solid rgba(212,175,55,.1);border-radius:15px;padding:2rem;width:100%;max-width:400px;position:relative;`;
const Title = styled.h2`color:${p=>p.theme.colors.primary};text-align:center;margin:0 0 2rem;font-size:2rem;`;
const Form = styled.form`display:flex;flex-direction:column;gap:1.5rem;`;
const Group = styled.div`position:relative;`;
const Input = styled.input`width:100%;padding:1rem 1rem 1rem 2.5rem;background:rgba(255,255,255,.05);border:1px solid rgba(212,175,55,.2);border-radius:5px;color:${p=>p.theme.colors.text};font-size:1rem;`;
const Icon = styled.span`position:absolute;left:1rem;top:50%;transform:translateY(-50%);color:${p=>p.theme.colors.primary};`;
const Btn = styled.button`width:100%;padding:1rem;background:${p=>p.theme.colors.primary};color:${p=>p.theme.colors.background};border:none;border-radius:5px;font-size:1rem;font-weight:600;cursor:pointer;transition:.3s; &:hover{transform:translateY(-2px);box-shadow:0 5px 15px rgba(212,175,55,.2);} &:disabled{opacity:.7;cursor:not-allowed;}`;
const Spinner = styled(FontAwesomeIcon)`animation:spin 1s linear infinite; @keyframes spin{0%{transform:rotate(0);}100%{transform:rotate(360deg);}}`;
const Msg = styled.div`text-align:center;margin-top:1rem;padding:1rem;border-radius:5px;background:${p=>p.$t==='error'?'rgba(244,67,54,.1)':p.$t==='success'?'rgba(76,175,80,.1)':'rgba(212,175,55,.1)'};border:1px solid ${p=>p.$t==='error'?'#f44336':p.$t==='success'?'#4CAF50':'#D4AF37'};color:${p=>p.$t==='error'?'#f44336':p.$t==='success'?'#4CAF50':'#D4AF37'};`;
const HomeBtn = styled.button`position:absolute;top:2rem;left:2rem;background:rgba(76,175,80,.1);color:#4CAF50;border:none;padding:.8rem 1.5rem;border-radius:5px;cursor:pointer;display:flex;align-items:center;gap:.5rem;font-weight:600;font-size:1rem;`;

export default function AdminLogin(){
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [step, setStep] = useState('login'); // 'login' or 'verify'
  const [status, setStatus] = useState({state:'idle', msg:''});

  useEffect(() => { 
    if(localStorage.getItem('adminLogged') === 'true') nav('/admin/dashboard'); 
  }, [nav]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setStatus({state:'loading', msg:'Envoi du code de vérification...'});

    try {
      const response = await fetch(`${API_URL}/api/admin/login`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        setStatus({state:'success', msg:data.message});
        setStep('verify');
      } else {
        setStatus({state:'error', msg:data.message || 'Erreur de connexion'});
      }
    } catch (error) {
      console.error('Erreur:', error);
      setStatus({state:'error', msg:'Erreur réseau. Vérifiez que le serveur est démarré.'});
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setStatus({state:'loading', msg:'Vérification du code...'});

    try {
      const response = await fetch(`${API_URL}/api/admin/verify-code`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ code: verificationCode, email })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('adminLogged', 'true');
        localStorage.setItem('adminToken', data.token);
        setStatus({state:'success', msg:'Connexion réussie! Redirection...'});
        setTimeout(() => nav('/admin/dashboard'), 600);
      } else {
        setStatus({state:'error', msg:data.message || 'Code invalide'});
      }
    } catch (error) {
      console.error('Erreur:', error);
      setStatus({state:'error', msg:'Erreur réseau'});
    }
  };

  return (
    <Wrap>
      <HomeBtn onClick={()=> nav('/')}> <FontAwesomeIcon icon={faHome}/> Accueil</HomeBtn>
      <Card>
        <Title>Administration</Title>
        
        {step === 'login' ? (
          <Form onSubmit={handleLogin}>
            <Group>
              <Icon><FontAwesomeIcon icon={faEnvelope}/></Icon>
              <Input 
                type="email" 
                placeholder="Email administrateur" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                required 
              />
            </Group>
            <Group>
              <Icon><FontAwesomeIcon icon={faLock}/></Icon>
              <Input 
                type="password" 
                placeholder="Mot de passe" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                required 
              />
            </Group>
            <Btn type="submit" disabled={status.state === 'loading'}>
              {status.state === 'loading' ? (
                <><Spinner icon={faSpinner}/> Envoi...</>
              ) : (
                'Se connecter'
              )}
            </Btn>
            {status.msg && (
              <Msg $t={status.state === 'error' ? 'error' : status.state === 'success' ? 'success' : 'idle'}>
                {status.msg}
              </Msg>
            )}
          </Form>
        ) : (
          <Form onSubmit={handleVerify}>
            <p style={{textAlign:'center',marginBottom:'1.5rem',opacity:.8}}>
              Un code de vérification a été envoyé à votre email
            </p>
            <Group>
              <Icon><FontAwesomeIcon icon={faLock}/></Icon>
              <Input 
                type="text" 
                placeholder="Code à 6 chiffres" 
                value={verificationCode} 
                onChange={e => setVerificationCode(e.target.value)} 
                maxLength={6}
                pattern="[0-9]{6}"
                required 
              />
            </Group>
            <Btn type="submit" disabled={status.state === 'loading'}>
              {status.state === 'loading' ? (
                <><Spinner icon={faSpinner}/> Vérification...</>
              ) : (
                'Vérifier le code'
              )}
            </Btn>
            <Btn 
              type="button" 
              onClick={() => {setStep('login'); setStatus({state:'idle',msg:''});}}
              style={{background:'rgba(255,255,255,.05)',marginTop:'.5rem'}}
            >
              Retour
            </Btn>
            {status.msg && (
              <Msg $t={status.state === 'error' ? 'error' : status.state === 'success' ? 'success' : 'idle'}>
                {status.msg}
              </Msg>
            )}
          </Form>
        )}
      </Card>
    </Wrap>
  );
}
