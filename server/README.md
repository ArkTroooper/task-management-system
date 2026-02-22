# Task Management System - Backend Server

A complete Node.js backend with Express, MongoDB, Socket.io for real-time features, and JWT authentication.

## 🚀 Features

- **RESTful API** with Express.js
- **MongoDB** database with Mongoose ODM
- **JWT Authentication** for secure access
- **Real-time Updates** with Socket.io
- **Password Hashing** with bcrypt
- **Input Validation** with express-validator
- **CORS** enabled for frontend integration
- **Error Handling** middleware
- **Request Logging** with morgan
- **Environment Configuration** with dotenv

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn

## 🛠️ Installation

1. **Navigate to the server directory**
   ```bash
   cd server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

4. **Configure your .env file**
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/taskmanagement
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   JWT_EXPIRE=24h
   CLIENT_URL=http://localhost:5173
   ```

## 🗄️ MongoDB Setup

### Local MongoDB

1. Install MongoDB on your machine
2. Start MongoDB service
3. Use the connection string: `mongodb://localhost:27017/taskmanagement`

### MongoDB Atlas (Cloud)

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (free tier available)
3. Create a database user
4. Whitelist your IP address (or use 0.0.0.0/0 for development)
5. Get your connection string:
   ```
   mongodb+srv://<username>:<password>@cluster.mongodb.net/taskmanagement
   ```
6. Update `MONGODB_URI` in your `.env` file

## 🚀 Running the Server

### Development Mode (with auto-restart)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:5000` (or your configured PORT)

## 🌱 Database Seeding

Seeding bootstraps the database with a dev user, a demo project, and sample tasks.

### Prerequisites

Ensure `server/.env` contains a valid `MONGODB_URI`:
```env
MONGODB_URI=mongodb://localhost:27017/taskmanagement
# or MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/taskmanagement
```

MongoDB collections are created automatically on first write — no manual setup needed.

### Local MongoDB quick-start

- **Windows**: Install from [mongodb.com/try/download/community](https://www.mongodb.com/try/download/community) and start with `mongod`
- **macOS**: `brew tap mongodb/brew && brew install mongodb-community && brew services start mongodb-community`
- **Linux**: Follow the [official docs](https://www.mongodb.com/docs/manual/administration/install-on-linux/) for your distro, then `sudo systemctl start mongod`

### Running the seed

```bash
# From the server/ directory

# First-time or idempotent (safe to re-run — skips already-existing records)
npm run seed

# Wipe all User/Project/Task data and re-seed from scratch
npm run seed:wipe
```

After seeding, use these credentials with the auth endpoints:
```
Email:    dev@example.com
Password: Password123!
```

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Routes (`/api/auth`)

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123"
}

Response: {
  "success": true,
  "data": {
    "user": { ... },
    "token": "jwt_token"
  },
  "message": "User registered successfully"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response: {
  "success": true,
  "data": {
    "user": { ... },
    "token": "jwt_token"
  },
  "message": "Login successful"
}
```

#### Verify Token
```http
GET /api/auth/verify
Authorization: Bearer <jwt_token>

Response: {
  "success": true,
  "data": {
    "user": { ... }
  },
  "message": "Token is valid"
}
```

### User Routes (`/api/users`) - All Protected

#### Get Profile
```http
GET /api/users/profile
Authorization: Bearer <jwt_token>
```

#### Update Profile
```http
PUT /api/users/profile
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "username": "newusername",
  "email": "newemail@example.com",
  "avatar": "https://example.com/avatar.jpg"
}
```

#### Get User by ID
```http
GET /api/users/:id
Authorization: Bearer <jwt_token>
```

#### Delete Account
```http
DELETE /api/users/:id
Authorization: Bearer <jwt_token>
```

### Project Routes (`/api/projects`) - All Protected

#### Get All Projects
```http
GET /api/projects
Authorization: Bearer <jwt_token>
```

#### Get Project by ID
```http
GET /api/projects/:id
Authorization: Bearer <jwt_token>
```

#### Create Project
```http
POST /api/projects
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "title": "New Project",
  "description": "Project description"
}
```

#### Update Project
```http
PUT /api/projects/:id
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "title": "Updated Title",
  "description": "Updated description"
}
```

#### Delete Project
```http
DELETE /api/projects/:id
Authorization: Bearer <jwt_token>
```

#### Add Member
```http
POST /api/projects/:id/members
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "userId": "user_id_here"
}
```

#### Remove Member
```http
DELETE /api/projects/:id/members/:userId
Authorization: Bearer <jwt_token>
```

### Task Routes (`/api/tasks`) - All Protected

#### Get Tasks by Project
```http
GET /api/tasks/project/:projectId
Authorization: Bearer <jwt_token>
```

#### Get Task by ID
```http
GET /api/tasks/:id
Authorization: Bearer <jwt_token>
```

#### Create Task
```http
POST /api/tasks
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "title": "New Task",
  "description": "Task description",
  "status": "todo",
  "priority": "medium",
  "project": "project_id",
  "assignedTo": "user_id",
  "dueDate": "2024-12-31"
}
```

#### Update Task
```http
PUT /api/tasks/:id
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "title": "Updated Task",
  "status": "inprogress",
  "priority": "high"
}
```

#### Delete Task
```http
DELETE /api/tasks/:id
Authorization: Bearer <jwt_token>
```

#### Move Task
```http
PATCH /api/tasks/:id/move
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "status": "done",
  "order": 0
}
```

#### Assign Task
```http
PATCH /api/tasks/:id/assign
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "userId": "user_id_here"
}
```

## 🔌 Socket.io Events

### Client → Server Events

#### Join Project Room
```javascript
socket.emit('join_project', { projectId: 'project_id' });
```

#### Leave Project Room
```javascript
socket.emit('leave_project', { projectId: 'project_id' });
```

### Server → Client Events

#### Task Created
```javascript
socket.on('task_created', (data) => {
  // data: { task, projectId }
});
```

#### Task Updated
```javascript
socket.on('task_updated', (data) => {
  // data: { task, projectId }
});
```

#### Task Deleted
```javascript
socket.on('task_deleted', (data) => {
  // data: { taskId, projectId }
});
```

#### Task Moved
```javascript
socket.on('task_moved', (data) => {
  // data: { task, projectId }
});
```

#### Project Updated
```javascript
socket.on('project_updated', (data) => {
  // data: { project }
});
```

#### User Joined
```javascript
socket.on('user_joined', (data) => {
  // data: { userId, username, projectId }
});
```

#### User Left
```javascript
socket.on('user_left', (data) => {
  // data: { userId, projectId }
});
```

## 🏗️ Project Structure

```
server/
├── config/
│   ├── db.js                 # MongoDB connection
│   └── socket.js             # Socket.io configuration
├── controllers/
│   ├── auth.controller.js    # Authentication logic
│   ├── user.controller.js    # User CRUD operations
│   ├── project.controller.js # Project CRUD operations
│   └── task.controller.js    # Task CRUD operations
├── models/
│   ├── User.js               # User schema
│   ├── Project.js            # Project schema
│   └── Task.js               # Task schema
├── routes/
│   ├── auth.routes.js        # Auth routes
│   ├── user.routes.js        # User routes
│   ├── project.routes.js     # Project routes
│   └── task.routes.js        # Task routes
├── middleware/
│   ├── auth.middleware.js    # JWT verification
│   ├── validation.middleware.js # Input validation
│   └── error.middleware.js   # Error handling
├── socket/
│   ├── handlers.js           # Socket event handlers
│   └── events.js             # Socket event constants
├── utils/
│   ├── generateToken.js      # JWT token generation
│   └── responseHandler.js    # Standardized API responses
├── scripts/
│   └── seed.js               # Database seed script
├── .env.example              # Example environment variables
├── package.json              # Dependencies
├── server.js                 # Entry point
└── README.md                 # Documentation
```

## 📊 Database Models

### User
- username (String, unique, required)
- email (String, unique, required)
- password (String, hashed, required)
- avatar (String)
- createdAt (Date)
- updatedAt (Date)

### Project
- title (String, required)
- description (String)
- owner (ObjectId → User, required)
- members (Array of ObjectId → User)
- createdAt (Date)
- updatedAt (Date)

### Task
- title (String, required)
- description (String)
- status (String: 'todo', 'inprogress', 'done')
- priority (String: 'low', 'medium', 'high')
- project (ObjectId → Project, required)
- assignedTo (ObjectId → User)
- dueDate (Date)
- order (Number)
- createdBy (ObjectId → User, required)
- createdAt (Date)
- updatedAt (Date)

## 🔒 Security Features

- **Password Hashing**: bcrypt with salt rounds of 10
- **JWT Authentication**: Tokens expire in 24 hours
- **CORS Protection**: Configured for specific origins
- **Input Validation**: All inputs validated with express-validator
- **Error Handling**: Generic error messages to prevent information leakage
- **Authorization**: Route-level and resource-level access control

## 🧪 Testing

Currently, no automated tests are implemented. To test the API:

1. Use tools like Postman or Insomnia
2. Or use cURL commands
3. Or integrate with the React frontend

Example cURL:
```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running (local) or connection string is correct (Atlas)
- Check firewall settings
- Verify database user credentials

### Port Already in Use
```bash
# Find and kill process using port 5000
lsof -ti:5000 | xargs kill -9
```

### JWT Token Issues
- Ensure JWT_SECRET is set in .env
- Check token expiration
- Verify Authorization header format: `Bearer <token>`

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| NODE_ENV | Environment mode | development |
| PORT | Server port | 5000 |
| MONGODB_URI | MongoDB connection string | mongodb://localhost:27017/taskmanagement |
| JWT_SECRET | Secret key for JWT | (required) |
| JWT_EXPIRE | Token expiration time | 24h |
| CLIENT_URL | Frontend URL for CORS | http://localhost:5173 |

## 🤝 Integration with Frontend

The backend is designed to work seamlessly with the React frontend:

1. Set `CLIENT_URL` in `.env` to your frontend URL
2. Frontend should include JWT token in Authorization header
3. Socket.io client should connect with authentication token
4. API endpoints match frontend service layer expectations

## 📄 License

ISC

## 👥 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📧 Support

For issues or questions, please open an issue in the repository.
