# Security Best Practices Report

## Executive Summary

This review covers the current JATE PWA codebase after the portfolio polish pass. The project is a JavaScript/Webpack frontend served by an Express/Helmet backend. No critical or high-severity application vulnerabilities were found in the reviewed code.

The app already has several good security defaults: CodeMirror is bundled locally, there are no remote scripts in the HTML template, Express disables `X-Powered-By`, Helmet is enabled with a CSP, custom 404 and 500 handlers exist, production dependency audits are clean, and the app does not use auth cookies, sessions, user uploads, database queries, redirects, CORS, or outbound server-side HTTP calls.

Remaining findings are hardening items. They are worth fixing for a portfolio-quality project, but none appear immediately exploitable in the current app.

## Scope And Guidance

Stack identified:

- Frontend: JavaScript, Webpack, CodeMirror, Workbox service worker.
- Backend: Node.js, Express, Helmet.

Guidance used:

- `javascript-express-web-server-security.md`
- `javascript-general-web-frontend-security.md`

Verification commands run:

- `npm run build`: passed.
- Root `npm audit`: 0 vulnerabilities.
- Client `npm audit --omit=dev`: 0 vulnerabilities.
- Client full `npm audit`: 4 moderate dev/build-time vulnerabilities remain via `webpack-pwa-manifest` transitive icon tooling.

## Critical Findings

None.

## High Findings

None.

## Medium Findings

### 1. Global body parsers are enabled on a static app without an explicit request body policy

- Rule ID: `EXPRESS-DOS-001`, `EXPRESS-INPUT-001`
- Severity: Medium
- Location: `server/server.js`, global middleware, lines 24-25
- Evidence:

```js
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
```

- Impact: The server parses request bodies for every request even though this app currently has no API routes. Express defaults do include body size limits, but leaving parsers global and implicit increases unnecessary request-processing surface and makes the accepted body policy less obvious to reviewers.
- Fix: Remove both parsers until an API route needs them. If API routes are added later, scope parsers to those routes and set explicit limits, such as `express.json({ limit: '10kb' })` and `express.urlencoded({ extended: false, limit: '10kb', parameterLimit: 50 })`.
- Mitigation: Keep the current custom 404 and error handlers. Add reverse-proxy request size limits in production if this is deployed publicly.
- False positive notes: This is lower risk than in an API app because no current route consumes `req.body`.

## Low Findings

### 2. CSP allows inline styles because CSS is injected by the Webpack runtime

- Rule ID: `JS-CSP-001`, `JS-CSP-002`, `EXPRESS-HEADERS-001`
- Severity: Low
- Location: `server/server.js`, Helmet CSP config, line 16
- Evidence:

```js
'style-src': ["'self'", "'unsafe-inline'"],
```

- Impact: `style-src 'unsafe-inline'` weakens CSP defense-in-depth for style injection. This does not allow inline scripts and is not an immediate XSS finding, but a stricter CSP is cleaner for a security-forward portfolio app.
- Fix: Extract bundled CSS into a same-origin CSS file instead of using runtime-injected `<style>` tags, then remove `'unsafe-inline'` from `style-src`.
- Mitigation: Keep `script-src 'self'` and avoid inline scripts or remote scripts.
- False positive notes: This setting is currently needed because the app uses `style-loader`.

### 3. Fallback UI uses `innerHTML` with a trusted message today, but it is a future DOM XSS sink

- Rule ID: `JS-XSS-001`
- Severity: Low
- Location: `client/src/js/index.js`, `showEditorFallback`, lines 14-20
- Evidence:

```js
const showEditorFallback = (message) => {
  main.innerHTML = `
    <section class="editor-error" role="status" aria-live="polite">
      <p>Unable to load the editor.</p>
      <p>${message}</p>
    </section>
  `;
};
```

- Impact: The current call site passes a hard-coded trusted string, so this is not currently exploitable. If future code passes an error message, URL value, storage value, or API response into `message`, this becomes a DOM XSS sink.
- Fix: Build the fallback with `document.createElement` and assign user-visible strings with `textContent`.
- Mitigation: Keep CSP active. Do not pass raw errors or user-controlled strings into this helper.
- False positive notes: Current usage is trusted and static.

### 4. Client full dev audit still reports moderate transitive build-tool vulnerabilities

- Rule ID: `JS-SUPPLY-001`, `EXPRESS-DEPS-001`
- Severity: Low
- Location: `client/package.json`, dev dependency `webpack-pwa-manifest`, line 33
- Evidence:

```json
"webpack-pwa-manifest": "^4.3.0"
```

- Impact: `npm audit` for all client dependencies reports 4 moderate vulnerabilities through `webpack-pwa-manifest` transitive icon-generation tooling (`@jimp/core`, `file-type`, and `phin`). This affects the development/build toolchain rather than shipped production runtime code. Client production audit with `--omit=dev` is clean.
- Fix: Replace `webpack-pwa-manifest` with a maintained manifest/icon workflow, or check whether a newer compatible plugin release removes the vulnerable transitive chain. Avoid `npm audit fix --force` unless you are ready to test breaking Webpack/PWA build changes.
- Mitigation: Keep lockfiles committed, run production audits in CI, and treat build agents as non-secret environments.
- False positive notes: The built app does not ship these packages to browsers.

## Positive Security Observations

- `server/server.js` disables `X-Powered-By` at line 8.
- `server/server.js` enables Helmet and CSP at lines 10-21.
- `server/server.js` has custom 404 and 500 handlers at lines 29-36.
- `client/index.html` has no remote script or stylesheet includes.
- `client/src/js/editor.js` stores editor text in local browser storage, but not auth tokens or secrets.
- `client/src/js/database.js` uses a fixed local IndexedDB key only for one local draft; it is not a public resource ID.
- Repo and client production dependency audits are clean.

## Recommended Fix Order

1. Remove or explicitly scope/limit Express body parsers.
2. Replace the fallback `innerHTML` helper with DOM APIs and `textContent`.
3. Extract CSS so CSP can remove `style-src 'unsafe-inline'`.
4. Replace or modernize the PWA manifest/icon build tool to remove dev audit noise.
