# All American Plumbing website

## Run locally

**Prerequisite:** Node.js

1. Install dependencies with `npm install`.
2. Start the local development server with `npm run dev`.
3. Open the local URL printed in the terminal.

On Windows, if the project folder name contains `&`, run scripts through
PowerShell instead: `npm --script-shell=powershell.exe run dev`.

## Build and host

Run `npm run build` to create the production site in `dist/`. Upload the
contents of that folder to any static web host. The build uses relative asset
paths, and images and fonts are bundled locally, so it can be served from a
domain root or a subdirectory without external image or font services.

On Windows, if the project folder name contains `&`, build with
`npm --script-shell=powershell.exe run build`.

The included `netlify.toml` is optional and only provides Netlify-specific
build, redirect, and response-header settings.
