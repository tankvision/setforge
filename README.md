# SetForge v2 — AI DJ Set Planner

## What changed in v2
- Genre deselect bug fixed
- Larger text throughout
- BPM shown per track
- Better mobile layout (track list stacks cleanly)
- Wider desktop layout (uses full screen width)
- Artist and title in separate columns for quick scanning
- Upsell updated with live BPM filter feature mention

## Deploy to Vercel

### Upload to GitHub
- Go to your existing "setforge" repo on github.com
- Click "Add file" → "Upload files"
- Delete old files and upload all files from this folder
- Click "Commit changes"
- Vercel will auto-redeploy within 30 seconds

### First time setup
- Go to vercel.com → "Add New Project"
- Import your "setforge" GitHub repo
- Add environment variable: ANTHROPIC_API_KEY = your key
- Click Deploy

## Local Development
Create a .env.local file:
ANTHROPIC_API_KEY=your_key_here

Then run:
npm install
npm run dev

Open http://localhost:3000
