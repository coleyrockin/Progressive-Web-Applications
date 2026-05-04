# Progressive Web Applications — JATE

![Webpack](https://img.shields.io/badge/Webpack-5.x-8DD6F9?style=flat&logo=webpack&logoColor=white)
![PWA](https://img.shields.io/badge/PWA-Installable-5A0FC8?style=flat&logo=googlechrome&logoColor=white)
![IndexedDB](https://img.shields.io/badge/IndexedDB-Storage-FF6F00?style=flat)
![Express.js](https://img.shields.io/badge/Express.js-4.x-000000?style=flat&logo=express&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-20+-339933?style=flat&logo=node.js&logoColor=white)
![License](https://img.shields.io/badge/License-ISC-blue?style=flat)

## About

**JATE** (Just Another Text Editor) is a single-page Progressive Web App. The editor runs in the browser, persists content to IndexedDB with a `localStorage` fallback, registers a Workbox-driven service worker for offline use, and can be installed as a standalone app.

### User story

> As a user, I want to create notes or code snippets with or without internet, so I can reliably access them later.

## Live demo

The original Heroku deployment was retired when the Heroku free tier ended in November 2022. Run locally — see **Install and run** below.

## Screenshot

![App screenshot](./assets/images/PMAtexteditor.png)

## Features

- **PWA Installable** — manifest + service worker; installable on supported browsers
- **Offline-capable** — Workbox precaches the app shell and assets for offline use after first load
- **Resilient persistence** — IndexedDB is primary, `localStorage` is fallback, header-string is last-resort default
- **Code editor** — syntax-highlighted via CodeMirror with the Monokai theme
- **Auto-save** — content is written to `localStorage` on every change and to IndexedDB on blur
- **Bundled** — Webpack 5 with Workbox `InjectManifest` and `webpack-pwa-manifest`

## Tech stack

| Category | Technology |
|----------|------------|
| Bundler | Webpack 5 |
| Runtime | Node.js 20+ |
| Server | Express.js 4 (static) |
| Storage | IndexedDB (`idb`), `localStorage` |
| PWA | Workbox, Service Workers, Web App Manifest |
| Editor | CodeMirror 5 |
| Dev tools | Concurrently, Nodemon |

## Repo structure

```text
Progressive-Web-Applications/
├── assets/images/      # Screenshots
├── client/             # Webpack-bundled PWA front end
│   ├── dist/           # Built artifacts served in production
│   ├── src/            # Editor source (js, css, images)
│   ├── index.html      # HTML template
│   ├── src-sw.js       # Workbox service worker source
│   └── webpack.config.js
├── server/             # Express static server
│   ├── routes/         # html routes (catch-all to client/dist/index.html)
│   └── server.js       # Server entry point
├── .env.example
├── .nvmrc              # Node 20
└── package.json
```

## Prerequisites

- Node.js 20+ (see `.nvmrc`)
- npm 9+

## Environment

```bash
cp .env.example .env
```

Variables:

- `PORT` — port for Express (default: `3000`)
- `NODE_ENV` — optional environment hint

## Install and run

```bash
# From the repo root
npm install     # also installs client deps via postinstall
npm run build   # webpack production build → client/dist/
npm start       # build + node server/server.js
```

For development:

```bash
npm run start:dev   # nodemon server + webpack dev server
```

The production server statically serves `client/dist/`.

## How to test

Manual smoke checks:

- Loads without console errors
- Editor initializes and accepts typing
- Content persists across reload
- Service worker registers in supported browsers
- Install prompt appears on supported browsers/devices

Future automated coverage (see *Future improvements*):

- Playwright smoke checks for install/offline workflows
- Lighthouse PWA and accessibility audits

## Security notes

- No API keys, user accounts, or privileged actions are stored in this app.
- All editor input is local-only.
- `.env` is git-ignored. `.env.example` is the shared template.
- Server hardening:
  - `helmet()` baseline security headers (CSP intentionally disabled — see *Future improvements*)
  - `X-Powered-By` disabled
  - JSON 404 for unknown routes
  - Generic 500 error handler
  - Graceful shutdown on `SIGTERM` / `SIGINT`

## What I learned

- Resilient offline-first frontends require explicit fallback paths, not just one storage technology.
- PWA behavior is a product concern, not a build artifact concern — service-worker caching strategy needs to be picked deliberately.
- Keeping a single active execution path (rather than carrying half-finished alternates) makes a project trustworthy.

## Known limitations

- CodeMirror is loaded from a CDN. The editor will not initialize on a cold offline visit until that CDN bundle has been cached by the browser at least once.
- Install/launch behavior depends on browser support.

## Future improvements

- Bundle CodeMirror locally so the editor is genuinely offline-first on first visit.
- Migrate to CodeMirror v6 (`@codemirror/*`) for a smaller, modern API.
- Add Playwright smoke tests and Lighthouse CI.
- Bundle CodeMirror locally so a strict Content-Security-Policy can be re-enabled (currently disabled because `cdnjs.cloudflare.com` is required for the editor).
- GitHub Actions: build + lint on push/PR.

## Author

- [@coleyrockin](https://github.com/coleyrockin)
- [coleyrockin@aol.com](mailto:coleyrockin@aol.com)

## License

ISC — see [`LICENSE`](./LICENSE).

---

Built by [Boyd Roberts](https://github.com/coleyrockin)
