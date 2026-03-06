# Angular18 Portfolio — Deployment

This project is an Angular 18 single-page portfolio. Below are quick ways to host it for free.

Prerequisites
- Node.js (>=18)
- npm

Local production build
```bash
npm install
npm run build -- --configuration production
```
The built files will be in `dist/angular18-portfolio`.

Deploy options

- GitHub Pages (CI):
  - Create a GitHub repo and push this project (example commands below).
  - On push to `main`, the included GitHub Actions workflow will run and publish `dist/angular18-portfolio` to the `gh-pages` branch.

- GitHub push example
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/<your-username>/<repo>.git
git branch -M main
git push -u origin main
```

- Netlify (drag & drop):
  - After building, open https://app.netlify.com/drop and drop the `dist/angular18-portfolio` folder.

- Netlify / Vercel (connect repo):
  - Connect your GitHub repo in Netlify/Vercel.
  - Set the build command to:
    `npm run build -- --configuration production`
  - Set the publish/output directory to:
    `dist/angular18-portfolio`

Netlify configuration (included): see `netlify.toml` for automatic repo deploy settings.

If you want, I can create the GitHub repo for you (you'll need to provide the repo name and push permissions), or walk you through connecting Netlify/Vercel step-by-step.
# Angular 18 Portfolio (converted from HTML mock)

This project is a direct Angular 18 (standalone) conversion of the provided single-page HTML mock:
- Sections split into standalone components (Navbar/Hero/About/Skills/Projects/Experience/Contact/Footer)
- Theme toggle (dark/light) via `body[data-theme]`
- Mobile menu toggle
- Smooth anchor scrolling, scroll-reveal animations, and hero tilt effect implemented in `AppComponent`

## Run locally

```bash
npm install
npm start
```

Open: http://localhost:4200

## Customize

- Update content inside:
  - `src/app/components/*/*.component.html`
- Replace the brand name in:
  - `src/app/components/navbar/navbar.component.html`
  - `src/app/components/footer/footer.component.html`
- Global styling is in:
  - `src/styles.scss`
