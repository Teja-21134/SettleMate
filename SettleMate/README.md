# SettleMate

SettleMate is a browser-only demo app published on GitHub Pages. It supports demo login with `guest` / `guest@123`; purchase and customer entries are stored in that browser's local storage.

**Important:** GitHub Pages only hosts static files. This demo does not use a server or shared database, so its entries do not sync between browsers/devices and can be removed by clearing browser storage. Do not enter real or sensitive business/customer information. For multi-device use, the app needs a separately hosted backend and database.

## Publishing

The GitHub Actions workflow builds the Vite frontend from `SettleMate/` and publishes it to GitHub Pages. After a push to `main`, check the Actions tab for the Pages deployment status.
