# Synctask Demo Pack

Deploy-ready React demo for the Synctask signature dashboard.

## What's included
- Signature Dashboard
- AI Insight Layer
- Variation Builder
- RFI Builder
- Commercial Screen
- Weekly Report Generator
- Mock project data

## Run locally
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
```

## Deploy to Vercel
1. Create a new GitHub repo
2. Upload these files
3. Import the repo into Vercel
4. Framework preset: Vite
5. Build command: `npm run build`
6. Output directory: `dist`

## Deploy to Netlify
1. Upload repo to GitHub
2. Import into Netlify
3. Build command: `npm run build`
4. Publish directory: `dist`

## Notes
- This is a front-end prototype with mock data
- No backend or database is connected yet
- Best next step is wiring the dashboard to the Laravel backend spec


## V2 update
- Variation button now opens a prefilled variation screen
- Dynamic quick action labels based on project data
- Mock submission alert for generated claim
