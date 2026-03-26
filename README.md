# Progressive Web Applications — JATE

![Webpack](https://img.shields.io/badge/Webpack-5.x-8DD6F9?style=flat&logo=webpack&logoColor=white)
![PWA](https://img.shields.io/badge/PWA-Installable-5A0FC8?style=flat&logo=googlechrome&logoColor=white)
![IndexedDB](https://img.shields.io/badge/IndexedDB-Storage-FF6F00?style=flat)
![Express.js](https://img.shields.io/badge/Express.js-4.x-000000?style=flat&logo=express&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-17.x-339933?style=flat&logo=node.js&logoColor=white)
![License](https://img.shields.io/badge/License-ISC-blue?style=flat)

## About

JATE (Just Another Text Editor) is a progressive web application that runs in the browser as a single-page app. It features offline functionality through service workers and IndexedDB for persistent data storage. The app can be installed as a standalone desktop application while maintaining full functionality without an internet connection.

## Features

- **PWA Installable** — Install as a native-like desktop application
- **Offline Support** — Service worker caching with Workbox for full offline functionality
- **IndexedDB Storage** — Persistent data storage that works offline
- **Webpack Bundled** — Custom Webpack configuration with asset management
- **Code Editor** — Syntax-highlighted text editor in the browser
- **Auto-Save** — Content automatically saved to IndexedDB on blur
- **Service Worker** — Pre-caching of static assets for instant load times

## Tech Stack

| Category | Technology |
|----------|------------|
| Bundler | Webpack 5 |
| Runtime | Node.js 17.x |
| Server | Express.js 4 |
| Storage | IndexedDB (idb) |
| PWA | Workbox, Service Workers, Web Manifest |
| Editor | CodeMirror |
| Dev Tools | Concurrently 5, Nodemon 2 |

## Getting Started

```bash
# Clone the repository
git clone https://github.com/coleyrockin/Progressive-Web-Applications.git
cd Progressive-Web-Applications

# Install dependencies
npm install

# Build the client
npm run build

# Start the server
npm start
```

## Project Structure

```
Progressive-Web-Applications/
├── assets/images/  # Screenshots and documentation images
├── client/         # Webpack-bundled PWA front end
├── public/         # Static assets
├── server/         # Express.js server
├── server.js       # Server entry point
└── package.json    # Root dependencies and scripts
```

---

Built by [Boyd Roberts](https://github.com/coleyrockin)
