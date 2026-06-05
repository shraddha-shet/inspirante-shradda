# inspirante-shradda

A full-stack College Event Registration Portal built for the Inspirante Web Development internship assignment.

## Tech Stack

- **Frontend:** React 19 (Vite), custom CSS — no UI frameworks
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose)
- **Auth:** JSON Web Tokens (JWT)

## Prerequisites

- Node.js v18+
- MongoDB running locally on port 27017

## Setup & Running

### 1. Install backend dependencies

```bash
npm install
```

### 2. Install frontend dependencies

```bash
cd inspirante-shradda
npm install
cd ..
```

### 3. Environment variables

No `.env` file is needed for local development — the MongoDB URI and JWT secret are hardcoded for evaluation convenience. For reference:

```
# .env.example
MONGO_URI=mongodb://127.0.0.1:27017/inspirante-shradda
JWT_SECRET=inspirante_2026_super_secret
PORT=3000
```

### 4. Seed the database

Make sure MongoDB is running, then:

```bash
node seed.js
```

This clears existing data and inserts 1 admin, 11 students, and 5 sample events.

### 5. Start the backend server

```bash
node server.js
# or: npm start
```

Server runs on **http://localhost:3000**

### 6. Start the frontend (new terminal)

```bash
cd inspirante-shradda
npx vite
```

Frontend runs on **http://localhost:5173** by default.

## Sample Credentials

**Admin:** `admin` / `inspirante2026`

**Students (any of these):** e.g. `asha.rao` / `student123`

## API Routes

All routes are prefixed with `/api/`:

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/auth/login` | None | Login |
| GET | `/api/events` | Required | List all events |
| POST | `/api/events` | Admin | Create event |
| GET | `/api/events/:id/registrations` | Admin | View registrations for event |
| POST | `/api/registrations` | Student | Register for event |
| GET | `/api/registrations/me` | Student | My registrations |

## Known Issues / Limitations

- Passwords are stored as plain text (acceptable for this evaluation context; bcrypt would be the production fix)
- No user registration flow — credentials are seeded only
- CSS is optimised for desktop; mobile viewports may need additional media queries
