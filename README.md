# AI PDF Note Taker

This is a Next.js project. The application lets users upload PDFs and  take notes from the pdf using AI .

Live - https://ai-pdf-note-taker-lyart.vercel.app/

## Features

- **PDF Upload & Note Taking:** Users can upload PDFs and add notes.
- **User Authentication:** Managed by [Clerk](https://clerk.dev/).
- **Plan Upgrades:** Upgrade plans synced with Convex to enable premium features.
- **Payment Integration:** PayPal buttons integrated for one-time payment processing.
- **Serverless Backend:** Powered by [Convex](https://convex.dev) for actions and queries.
- **AI Integration:** Uses Gemini and Google Generative AI for advanced functionalities.

## Getting Started

### 1. Clone the repository

```bash
git clone 
cd ai-pdfnote-taker
```

### 2. Install dependencies

Using npm, yarn, or pnpm:

```bash
npm install
# or
yarn install
# or
pnpm install
```


### 4. Run the Development Server

Start the development server with:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the app working.

## Project Structure

- **`app/`** — Contains Next.js pages and layouts.
- **`convex/`** — Contains Convex action files (e.g., `myAction.js` for ingesting text and searching).
- **`configs/`** — Contains configuration for AI integration (e.g., `AIModel.js`).


## Deployment

Deploy your Next.js application on [Vercel](https://vercel.com/new). For Convex deployments, use the Convex CLI:



```bash
npx convex push
```



