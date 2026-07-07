# OC React

React frontend for the OC project — a weather dashboard built with Rsbuild, Ant Design, and TypeScript.

## Prerequisites

- [Node.js](https://nodejs.org/) >= 18
- [pnpm](https://pnpm.io/) >= 8

## Setup

```bash
pnpm install
```

## Development

Start the dev server on port 5001:

```bash
pnpm run dev
```

The app proxies API calls to the Bootstrapper API at `https://localhost:7100` (configured in `.env`).

## Commands

| Command            | Description                  |
| ------------------ | ---------------------------- |
| `pnpm run dev`     | Start dev server (port 5001) |
| `pnpm run build`   | Production build             |
| `pnpm run preview` | Preview production build     |
| `pnpm run lint`    | Run ESLint                   |
| `pnpm run format`  | Format with Prettier         |

## Tech Stack

- **Framework:** React 19
- **Build:** Rsbuild + Rspack
- **UI:** Ant Design 6 + Tailwind CSS 4
- **Routing:** react-router-dom 7
- **Data Fetching:** TanStack React Query 5 + Axios
- **Notifications:** Sonner
- **Language:** TypeScript 6

## Environment Variables

All public vars are prefixed with `PUBLIC_`:

| Var                   | Default                  | Description          |
| --------------------- | ------------------------ | -------------------- |
| `PUBLIC_ENVIRONMENT`  | `development`            | Environment name     |
| `PUBLIC_API_URL`      | `https://localhost:7100` | Backend API base URL |
| `PUBLIC_ENABLE_DEBUG` | `false`                  | Enable debug logging |
