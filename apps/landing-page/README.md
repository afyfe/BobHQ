# AskBob Landing Page

Simple static landing page for Ask Bob.

## Purpose

This app is storytelling infrastructure for Ask Bob. It explains the early product idea, introduces Discovery Mode and keeps the message grounded in MORSE and NAIB:

- operational AI for real-world businesses
- trust, provenance and explainability
- practical discovery before heavy platform work
- no AI hype

This is not core Bob platform infrastructure.

## Local Run Instructions

Open `index.html` directly in a browser:

```text
apps/landing-page/index.html
```

Or serve this folder with any static web server:

```powershell
cd apps/landing-page
python -m http.server 8080
```

Then open `http://localhost:8080`.

## Deployment Options

No build tooling is required. Deploy the folder as static HTML/CSS using any simple static hosting target, such as:

- Cloudflare Pages
- Netlify
- Vercel
- Azure Static Web Apps
- any standard web host

## Structure

```text
apps/landing-page/
  index.html
  what-is-askbob.html
  built-for-messy-businesses.html
  operational-knowledge-loss.html
  discovery-mode.html
  styles.css
  sitemap.xml
  robots.txt
  README.md
  public/
    assets/
```

## Notes

Keep `public/assets` for images, logos and media only. Do not add backend services, build tooling or framework code unless the landing page genuinely needs them.
