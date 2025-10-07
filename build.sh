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

# Create production env files if they don't exist
echo "Checking environment files..."
if [ ! -f .env.production ]; then
	echo "Creating server .env.production..."
	cp .env .env.production
fi

if [ ! -f ../client/.env.production ]; then
	echo "Creating client .env.production..."
	cp .env .env.production
fi

echo "Build complete!"