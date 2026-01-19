# Create folder structure
mkdir -p contracts backend frontend database scripts docs
mkdir -p backend/src/{routes,models,services,utils}
mkdir -p frontend/src/{components,pages,styles,utils}
mkdir -p database/migrations scripts/deployment

# Initialize packages
cd backend && npm init -y
cd ../frontend && npm create vite@latest . -- --template react
cd ../contracts && npm init -y

# Go back to root
cd ..

# Create root package.json for monorepo
cat > package.json << 'EOF'
{
  "name": "godseed",
  "version": "1.0.0",
  "private": true,
  "workspaces": [
    "contracts",
    "backend",
    "frontend"
  ],
  "scripts": {
    "dev": "concurrently \"npm run dev:backend\" \"npm run dev:frontend\"",
    "dev:backend": "cd backend && npm run dev",
    "dev:frontend": "cd frontend && npm run dev",
    "build": "npm run build:contracts && npm run build:backend && npm run build:frontend",
    "deploy": "bash scripts/deployment/deploy.sh"
  },
  "devDependencies": {
    "concurrently": "^8.2.2"
  }
}
EOF

# Install concurrent execution
npm install concurrently --save-dev