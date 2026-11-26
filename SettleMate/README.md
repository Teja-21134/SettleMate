# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## SettleMate deployment

The app uses a React/Vite frontend and an Express/MongoDB backend. Deploy them as
two Vercel projects from the GitHub repository:

1. **Backend:** set the Root Directory to `settlemate-backend`. Add
   `MONGODB_URI`, `APP_USERNAME`, `APP_PASSWORD`, and `AUTH_TOKEN_SECRET` in
   the Vercel project's Environment Variables. `APP_USERNAME` should match the
   existing MongoDB records (currently `ravi`). Optionally add
   `GUEST_USERNAME` and `GUEST_PASSWORD` for a separate guest account.
2. **Frontend:** set the Root Directory to `SettleMate` and add
   `VITE_API_BASE_URL` with the deployed backend's origin (for example,
   `https://your-backend.vercel.app`, without a trailing slash).
3. Redeploy both projects after changing environment variables.

Use new passwords; the previous frontend-only passwords were part of the
browser code and should not be reused. Passwords must be at least 12
characters. Generate `AUTH_TOKEN_SECRET` with
`node -e "console.log(require('node:crypto').randomBytes(32).toString('base64url'))"`.

For local development, copy `.env.example` to `.env.local` and set
`VITE_API_BASE_URL=http://localhost:5000`. Copy
`../settlemate-backend/.env.example` to `../settlemate-backend/.env`, fill in
the database connection string and unique passwords, and set a random token
secret. Never commit either `.env` file.
