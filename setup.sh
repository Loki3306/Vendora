#!/usr/bin/env bash
set -euo pipefail
npm install
npm --prefix vendora-backend install
npm --prefix vendora-frontend install
if [ ! -f vendora-backend/.env ]; then cp vendora-backend/.env.example vendora-backend/.env; fi
echo "Ensure MongoDB is running locally at mongodb://127.0.0.1:27017 or edit vendora-backend/.env with an Atlas URI."
echo "Then run: npm run seed && npm run dev"
