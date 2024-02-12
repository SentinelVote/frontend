# SentinelVote Frontend (Voter/Admin)

## How to start the application?

1. Clone the repo:
   ```bash
   git clone [ssh / http]
   ```

2. Ensure you have the correct node version installed, [see the nvm section below.](#nvm)

3. Install dependencies:
   ```bash
   npm install
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [localhost:3000](http://localhost:3000) with your browser to see the result.

## Good to know

### Environment variables

There are two environment variable files committed to the repo:
- `.env.development` for when you run `npm run dev`
- `.env.production` for when you run `npm run start` or deploy to Vercel

If an environment variable doesn't work on `.env.development`,
you can override them by creating a `.env.local` file.

Do not commit `.env.local` to the repo.

### Browser support

Use Chromium-based browsers, i.e. Chrome, Edge, Opera, Brave, etc.

### `nvm`

This project uses [nvm](https://github.com/nvm-sh/nvm) to manage node versions.
If you have nvm installed,
you can run `nvm use` to use the correct node version:
- node v18.17.0 (needed for Next.js v14)
  - This is based on the `.nvmrc` file.
