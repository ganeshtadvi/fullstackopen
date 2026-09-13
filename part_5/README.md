# Blog List - Full Stack Open Part 5

This project contains the Blog List frontend exercises 5.1-5.23.

## Frontend

Start the backend first on `http://localhost:8000`, then run:

```bash
npm install
npm run dev
```

The frontend runs on `http://localhost:5173`.

## Unit tests (5.13-5.16)

```bash
npm test
```

## E2E tests (5.17-5.23)

The E2E tests are in the separate `e2e` npm project as required by the exercise.

Install Playwright:

```bash
cd e2e
npm install
npx playwright install
```

Then run:

```bash
npm test
```

The E2E tests expect the Part 4 backend to provide:

- `POST /api/testing/reset`
- `POST /api/users`
- `POST /api/login`
- the normal `/api/blogs` endpoints

The backend should be running on `http://localhost:8000` before starting the E2E tests.
