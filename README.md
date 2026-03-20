# Role-Based Access Control App

A full-stack web application where users and tasks are managed through a role-based permission system. The app dynamically adapts the entire interface and API based on who is logged in.

---

## What This App Does

- Users register and log in with a role — either **admin** or **user**
- Every logged-in user can create tasks and toggle their status between pending and completed
- Admins have full control — they can delete any task and remove any user
- Regular users have limited access — they can view and create, but cannot delete
- The UI automatically shows or hides action buttons based on the logged-in user's role
- Authentication is handled via JWT tokens stored in localStorage

---

## Roles & Permissions

| Action | user | admin |
|---|:---:|:---:|
| Register / Login | ✅ | ✅ |
| View tasks | ✅ | ✅ |
| Create task | ✅ | ✅ |
| Toggle task status | ✅ | ✅ |
| Delete task | ❌ | ✅ |
| View users | ✅ | ✅ |
| Delete user | ❌ | ✅ |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React |
| Backend | Node.js + Express |
| Database | MongoDB Atlas |
| Authentication | JWT (JSON Web Tokens) |
| Password Hashing | bcryptjs |
| HTTP Client | Axios |

---

## Project Structure

```
Role-based_Access_control/
├── backend/
│   ├── middleware/
│   │   └── auth.js          # JWT verification + role checking middleware
│   ├── models/
│   │   ├── User.js          # User schema with role field (admin/user)
│   │   └── Task.js          # Task schema with status and createdBy
│   ├── routes/
│   │   ├── auth.js          # Register, login, get current user
│   │   ├── tasks.js         # Task CRUD — delete restricted to admin
│   │   └── users.js         # User list — delete restricted to admin
│   ├── server.js            # Express app entry point
│   ├── .env                 # Environment variables
│   └── package.json
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── Login.js      # Register / Login form with role selection
    │   │   ├── Dashboard.js  # Main layout — navbar, tabs, user info
    │   │   ├── Tasks.js      # Task list with role-based delete button
    │   │   └── Users.js      # User list with role-based delete button
    │   ├── api.js            # Axios instance with JWT interceptor
    │   ├── App.js            # Root component — handles auth state
    │   ├── index.js          # React entry point
    │   └── index.css         # Global styles — glassmorphism dark theme
    ├── .env                  # Environment variables
    └── package.json
```

---

## How Role Middleware Works

```js
// middleware/auth.js

const checkRole = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ error: 'Access denied. Insufficient permissions.' });
  }
  next();
};
```

Applied on protected routes:
```js
router.delete('/:id', auth, checkRole('admin'), async (req, res) => { ... });
```

---

## API Endpoints

| Method | Route | Requires Auth | Required Role |
|--------|-------|:---:|:---:|
| POST | /api/auth/register | No | — |
| POST | /api/auth/login | No | — |
| GET | /api/auth/me | Yes | any |
| GET | /api/tasks | Yes | any |
| POST | /api/tasks | Yes | any |
| PATCH | /api/tasks/:id | Yes | any |
| DELETE | /api/tasks/:id | Yes | admin |
| GET | /api/users | Yes | any |
| DELETE | /api/users/:id | Yes | admin |

---

## Environment Variables

**backend/.env**
```
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_strong_secret_key
FRONTEND_URL=your_frontend_url
NODE_ENV=production
```

**frontend/.env**
```
REACT_APP_API_URL=your_backend_api_url/api
```
