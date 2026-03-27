#!/bin/bash

# Build client
echo "Building client..."
cd client
npm install
npm run build

# Build server
echo "Building server..."
cd ../server
npm install

# NOTE: Production env vars are set in the deployment platform (Render/Vercel)
# Never copy .env files for production use

echo "Build complete!"