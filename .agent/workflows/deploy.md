---
description: Deployment guide for Vercel/Netlify
---

# Deploying Mindful Architecture

The project is a standard React/Vite application, making it easy to deploy on modern frontend platforms like Vercel or Netlify.

## Option 1: Vercel (Recommended)

1.  **Install Vercel CLI** (Optional, or just use the web UI):
    ```bash
    npm i -g vercel
    ```

2.  **Deploy via Web UI**:
    *   Push your code to a GitHub repository.
    *   Go to [vercel.com](https://vercel.com) and log in.
    *   Click "Add New..." -> "Project".
    *   Import your `Mindful-Architecture` repository.
    *   **Build Settings**: Vercel usually auto-detects Vite.
        *   Framework Preset: `Vite`
        *   Build Command: `npm run build`
        *   Output Directory: `dist`
    *   Click **Deploy**.

3.  **Deploy via CLI**:
    Run the following command in your terminal:
    ```bash
    vercel
    ```
    Follow the prompts (set up and deploy? [Y], scope?, link to existing project? [N], project name?, directory? [./]).

## Option 2: Netlify

1.  **Drag and Drop**:
    *   Run `npm run build` locally.
    *   This creates a `dist` folder.
    *   Log in to [netlify.com](https://netlify.com).
    *   Drag the `dist` folder into the "Sites" area.

2.  **Git Integration**:
    *   Push to GitHub.
    *   "New site from Git" on Netlify.
    *   Connect repository.
    *   Build command: `npm run build`
    *   Publish directory: `dist`

## Post-Deployment Checks

*   **Routing**: Ensure refreshing a page (e.g., `/dashboard`) works. If you see 404s on refresh, you need a rewrite rule.
    *   *Vercel*: Automatic with Vite preset usually, or add `vercel.json` with rewrites to `/index.html`.
    *   *Netlify*: Create a `_redirects` file in `public/` containing: `/* /index.html 200`.

## PWA Check
*   The app is PWA-ready. Check if the "Install App" prompt appears on mobile devices after deployment.
