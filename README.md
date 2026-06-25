# Rica Mae Pintoy Portfolio

This is a portfolio site built to run as a simple static website with no build step required.

## Run it

Open [index.html](/C:/Users/Admin/Desktop/Rica_proj/Portfolio/index.html) in a browser.

If you prefer to serve it locally, run this from the project folder:

```powershell
powershell -ExecutionPolicy Bypass -File .\start-local.ps1
```

Then open `http://127.0.0.1:4173/`.

Your resume is included at [assets/Rica_Mae_Pintoy_Resume_Web_Dev.pdf](/C:/Users/Admin/Desktop/Rica_proj/Portfolio/assets/Rica_Mae_Pintoy_Resume_Web_Dev.pdf).

## Run with Docker

After installing Docker Desktop, run this from the project root:

```powershell
docker compose up --build
```

Then open `http://localhost:4173/`.

To stop the container:

```powershell
docker compose down
```

## Vercel Deployment

This project is Vercel-ready as a static site.

- Framework preset: `Other`
- Root directory: project root
- Build command: leave empty
- Output directory: leave empty

`vercel.json` rewrites all routes to `index.html`, which keeps the single-page app behavior working on deployment.

## Update your website thumbnails and links

Edit [src/data.js](/C:/Users/Admin/Desktop/Rica_proj/Portfolio/src/data.js) and update the `projects` array:

- `title`: project or website name
- `liveUrl`: live website link
- `repoUrl`: code repository link
- `thumbnailLabel`: short text shown in the thumbnail
- `accent`: `orange`, `yellow`, `green`, or `blue`

If you want real image thumbnails later, the next step is to add image files and swap the gradient thumbnail blocks for images in [src/main.js](/C:/Users/Admin/Desktop/Rica_proj/Portfolio/src/main.js).
