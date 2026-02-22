# Task Management System

A full-stack task management application with React frontend and Node.js backend.

## 📁 Project Structure

```
task-management-system/
├── client/            # React application with Vite
│   ├── src/          # React components, hooks, services
│   ├── public/       # Static assets
│   └── package.json  # Frontend dependencies
│
└── server/           # Node.js Express backend
    ├── config/       # Database and Socket.io configuration
    ├── controllers/  # Request handlers
    ├── models/       # MongoDB/Mongoose schemas
    ├── routes/       # API route definitions
    ├── middleware/   # Authentication, validation, error handling
    ├── socket/       # Socket.io event handlers
    ├── utils/        # Helper functions
    ├── server.js     # Entry point
    └── README.md     # Detailed backend documentation
```

## 🚀 Quick Start

### Backend Setup

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file (copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```

4. Configure your MongoDB connection in `.env`:
   ```
   MONGODB_URI=mongodb://localhost:27017/taskmanagement
   # Or use MongoDB Atlas:
   # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/taskmanagement
   ```

5. Set a secure JWT secret:
   ```
   JWT_SECRET=your_very_secure_random_secret_here
   ```

6. Start the development server:
   ```bash
   npm run dev
   ```

7. (Optional) Seed the database with sample data:
   ```bash
   # First-time or idempotent seed
   npm run seed

   # Wipe existing data and re-seed from scratch
   npm run seed:wipe
   ```
   After seeding, log in with `dev@example.com` / `Password123!`.

The backend will start on `http://localhost:5000`

### Frontend Setup

1. Navigate to the client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will start on `http://localhost:5173`

## 🛠️ Technology Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **Socket.io** - Real-time communication
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **express-validator** - Input validation
- **CORS** - Cross-origin resource sharing
- **Morgan** - HTTP request logging

### Frontend
- **React** - UI library
- **Vite** - Build tool
- **React Router** - Routing
- **Socket.io Client** - Real-time updates
- **Tailwind CSS** - Styling

## 📚 Documentation

### Backend Documentation
See [server/README.md](server/README.md) for:
- Complete API documentation
- Socket.io events
- Database models
- Setup instructions
- Security features
- Environment variables

### Implementation Notes
See [server/IMPLEMENTATION_NOTES.md](server/IMPLEMENTATION_NOTES.md) for:
- Security considerations
- Production recommendations
- Rate limiting setup
- Testing guidelines
- Deployment checklist

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- CORS protection
- MongoDB injection protection
- Error handling that doesn't leak sensitive information
- Authorization checks on all protected routes

## 🌐 API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - Login user
- `GET /verify` - Verify JWT token

### Users (`/api/users`)
- `GET /profile` - Get current user profile
- `PUT /profile` - Update user profile
- `GET /:id` - Get user by ID
- `DELETE /:id` - Delete user account

### Projects (`/api/projects`)
- `GET /` - Get all projects
- `GET /:id` - Get project by ID
- `POST /` - Create project
- `PUT /:id` - Update project
- `DELETE /:id` - Delete project
- `POST /:id/members` - Add member
- `DELETE /:id/members/:userId` - Remove member

### Tasks (`/api/tasks`)
- `GET /project/:projectId` - Get tasks by project
- `GET /:id` - Get task by ID
- `POST /` - Create task
- `PUT /:id` - Update task
- `DELETE /:id` - Delete task
- `PATCH /:id/move` - Move task
- `PATCH /:id/assign` - Assign task

## 🔌 Real-time Features

Socket.io provides real-time updates for:
- Task creation, updates, and deletion
- Task movement between columns
- Project updates
- User presence (join/leave project rooms)

## 📊 Database Schema

### User
- username (unique)
- email (unique)
- password (hashed)
- avatar
- timestamps

### Project
- title
- description
- owner (User reference)
- members (array of User references)
- timestamps

### Task
- title
- description
- status (todo/inprogress/done)
- priority (low/medium/high)
- project (Project reference)
- assignedTo (User reference)
- dueDate
- order (for column ordering)
- createdBy (User reference)
- timestamps

## 🧪 Testing

### Backend Testing
```bash
cd server
npm test
```

### Manual API Testing
Use Postman, Insomnia, or cURL to test API endpoints. See [server/README.md](server/README.md) for example requests.

## 🚀 Deployment

### Backend Deployment

1. Set up MongoDB Atlas (free tier available)
2. Configure environment variables for production
3. Add rate limiting (see IMPLEMENTATION_NOTES.md)
4. Add helmet.js for security headers
5. Set up SSL/TLS
6. Use PM2 or similar process manager
7. Deploy to Heroku, AWS, DigitalOcean, or similar

### Frontend Deployment

1. Build the production bundle:
   ```bash
   cd client
   npm run build
   ```

2. Deploy the `dist` folder to:
   - Vercel
   - Netlify
   - GitHub Pages
   - AWS S3 + CloudFront
   - Or any static hosting service

## 📝 Environment Variables

### Backend (.env)
```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/taskmanagement
JWT_SECRET=your_secret_key
JWT_EXPIRE=24h
CLIENT_URL=http://localhost:5173
```

### Frontend
Configure API endpoint in the frontend to point to your backend URL.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

ISC

## 👥 Support

For issues or questions:
- Check the backend README.md for detailed documentation
- Review IMPLEMENTATION_NOTES.md for production guidance
- Open an issue in the repository

## 🎯 Features

- ✅ User registration and authentication
- ✅ Project creation and management
- ✅ Task creation with status tracking
- ✅ Drag-and-drop task management (Kanban board)
- ✅ Real-time collaboration
- ✅ Task assignment
- ✅ Due dates
- ✅ Priority levels
- ✅ Project members management
- ✅ Responsive design

## 🔮 Future Enhancements

- Task comments and attachments
- Email notifications
- Advanced search and filtering
- Task dependencies
- Time tracking
- Reports and analytics
- Mobile app
- API rate limiting
- Comprehensive test coverage

---

**Built with ❤️ using modern web technologies**
