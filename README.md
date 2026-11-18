# Logistic Web

React 19 + Vite frontend for the Logistic platform.

## Prerequisites

- Node.js 24 LTS
- Running [Logistic API](https://github.com/erhnglmz/logistic-api) (local or Docker)

## Standalone development

```bash
cp .env.example .env
npm install
npm run dev
```

Open http://localhost:5173 — API base URL defaults to `http://localhost:5111` (`VITE_API_BASE_URL`).

## Full stack (recommended)

Use Docker Compose from the **sibling** `logistic-api` repository:

```bash
# parent directory
git clone https://github.com/erhnglmz/logistic-api.git
git clone https://github.com/erhnglmz/logistic-web.git
cd logistic-api
cp .env.example .env
docker compose up -d --build
```

- Integration profile (`compose.yaml`): production-like nginx build on http://localhost:5173
- Dev profile: `docker compose -f compose.dev.yaml up` for Vite hot reload

## Docker image (built from this repo)

The API repo's `compose.yaml` builds this project using `Dockerfile` in this directory (`../logistic-web` by default).

```bash
docker build --build-arg VITE_API_BASE_URL=http://localhost:5111 -t logistic-web .
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Vite dev server |
| `npm run build` | Typecheck + production bundle |
| `npm run lint` | ESLint |
| `npm run preview` | Preview production build |

## Configuration

| Variable | Default |
|----------|---------|
| `VITE_API_BASE_URL` | `http://localhost:5111` |

Do not commit `.env` — only `.env.example`.