# StreamFlow — IPTV Web App

A modern OTT-style IPTV player built with Next.js 14. Supports Xtream Codes API servers with Live TV, Movies (VOD), and Series.

## Features

- 🔐 Secure login — credentials stored in browser session only, never in code
- 📺 Live TV with HLS streaming (hls.js)
- 🎬 Movies (VOD) browser
- 📚 Series browser
- 🗂️ Category sidebar filtering
- 🔍 Search by channel/title name
- 📱 Fully responsive (mobile + desktop)
- ▶️ Built-in video player with fullscreen & mute

---

## Deploy to Vercel (Recommended)

### Step 1 — Push to GitHub

1. Create a new repo on [github.com](https://github.com) (name it `streamflow` or anything you like)
2. In your terminal:

```bash
cd iptv-app
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### Step 2 — Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and sign in (or sign up free)
2. Click **"Add New Project"**
3. Import your GitHub repo
4. Vercel auto-detects Next.js — just click **"Deploy"**
5. Done! You'll get a URL like `https://streamflow-xxx.vercel.app`

No environment variables needed — all credentials are entered at login.

---

## Run Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## How to Use

1. Open the app URL
2. Enter your Xtream Codes server details:
   - **Server URL** — e.g. `http://yourserver.com:8080`
   - **Username** — your account username
   - **Password** — your account password
3. Click **Connect & Watch**
4. Browse Live TV, Movies, or Series
5. Click any channel/movie to start playing

---

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **hls.js** — HLS stream playback
- **lucide-react** — icons
- API proxy via Next.js Route Handlers (avoids CORS issues)

---

## Notes

- The `/api/iptv` route acts as a server-side proxy to avoid browser CORS restrictions
- Credentials are only stored in `sessionStorage` — cleared when you close the tab
- Some streams may not play if the server doesn't support HLS or the channel is offline
