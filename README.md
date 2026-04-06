# SetForge — AI DJ Set Planner

## Deploy to Vercel (Step by Step)

### 1. Upload to GitHub
- Go to github.com and log in
- Click the "+" icon → "New repository"
- Name it "setforge", keep it Public, click "Create repository"
- Click "uploading an existing file"
- Drag and drop ALL files from this folder into the upload area
- Click "Commit changes"

### 2. Deploy on Vercel
- Go to vercel.com and log in with GitHub
- Click "Add New Project"
- Find "setforge" in your repository list and click "Import"
- Before clicking Deploy, click "Environment Variables"
- Add a new variable:
  - Name: ANTHROPIC_API_KEY
  - Value: (paste your Anthropic API key here)
- Click "Deploy"

### 3. You're live!
Vercel will give you a URL like: setforge.vercel.app
Open it on your phone — it's fully working.

## Local Development
```
npm install
npm run dev
```
Then open http://localhost:3000

You'll need a .env.local file with:
ANTHROPIC_API_KEY=your_key_here
