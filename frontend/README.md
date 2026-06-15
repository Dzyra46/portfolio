# Personal Portfolio Frontend

This is the Next.js frontend for the personal portfolio platform. It features a dark-mode-first premium design, server components, and Tailwind CSS.

## Getting Started

### Prerequisites

You need [Bun](https://bun.sh/) installed locally to run this project efficiently.

### Installation

```bash
bun install
```

### Local Development

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Docker

To build the standalone Docker image:

```bash
docker build -t portfolio-frontend .
```

To run the Docker image:

```bash
docker run -p 3000:3000 portfolio-frontend
```

## Structure

- `src/app`: Next.js App Router pages and layouts.
- `src/components/public`: Components used on the public-facing portfolio.
- `src/components/admin`: Components used in the admin dashboard.
- `src/components/ui`: Reusable UI primitives (Buttons, Cards, etc.).
- `src/lib/api`: API client for fetching backend data.
