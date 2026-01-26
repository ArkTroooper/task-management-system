# Task Management System

A full-stack task management application with real-time updates, drag-and-drop functionality, and user authentication.

## Features

- 🔐 **User Authentication**: Secure registration and login with JWT
- 📊 **Project Boards**: Create and manage multiple project boards
- 🎯 **Drag-and-Drop Tasks**: Interactive task management with drag-and-drop between columns
- ⚡ **Real-time Updates**: Live synchronization using WebSockets
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices
- 🎨 **Modern UI**: Beautiful interface built with Tailwind CSS

## Technology Stack

### Frontend
- **Vue 3** (Composition API)
- **Tailwind CSS** for styling
- **Pinia** for state management
- **Vue Router** for navigation
- **Vuedraggable** for drag-and-drop
- **Axios** for HTTP requests
- **Socket.io-client** for WebSocket communication

### Backend
- **Node.js** with **Express.js**
- **Socket.io** for real-time features
- **JWT** for authentication
- **bcrypt** for password hashing
- **express-validator** for input validation

### Database
- **PostgreSQL** database
- **Sequelize** ORM for database operations

## Project Structure

```
task-management-system/
├── client/                 # Vue.js frontend
│   ├── src/
│   │   ├── components/    # Reusable Vue components
│   │   ├── views/         # Page components
│   │   ├── stores/        # Pinia state management
│   │   ├── services/      # API and socket services
│   │   ├── router/        # Vue Router configuration
│   │   └── assets/        # CSS and static files
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
├── server/                # Node.js backend
│   ├── src/
│   │   ├── routes/        # API routes
│   │   ├── controllers/   # Route controllers
│   │   ├── models/        # Sequelize models
│   │   ├── middleware/    # Authentication middleware
│   │   ├── config/        # Database configuration
│   │   └── socket/        # WebSocket handlers
│   ├── .env.example
│   └── package.json
├── database/              # Database scripts
│   └── init.sql          # Database initialization
└── README.md
```

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **PostgreSQL** (v12 or higher) OR **Docker** and **Docker Compose**

## Quick Start with Docker

The easiest way to get started is using Docker:

```bash
# Start PostgreSQL database
docker-compose up -d

# Wait a few seconds for the database to initialize
sleep 5

# Install and start backend
cd server
npm install
npm run dev

# In a new terminal, install and start frontend
cd client
npm install
npm run dev
```

Visit `http://localhost:5173` to access the application!

## Verify Setup

Run the setup check script to verify everything is configured correctly:

```bash
./check-setup.sh
```

This will check:
- PostgreSQL connection
- Dependencies installation
- Environment configuration

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd task-management-system
```

### 2. Database Setup

Create a PostgreSQL database:

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE task_management;

# Exit psql
\q
```

Run the initialization script:

```bash
psql -U postgres -d task_management -f database/init.sql
```

### 3. Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create .env file from example
cp .env.example .env

# Edit .env file with your database credentials
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=task_management
# DB_USER=postgres
# DB_PASSWORD=your_password
# JWT_SECRET=your_secret_key
# CLIENT_URL=http://localhost:5173

# Start the server
npm run dev
```

The server will run on `http://localhost:3000`

### 4. Frontend Setup

Open a new terminal:

```bash
# Navigate to client directory
cd client

# Install dependencies
npm install

# Create .env file from example (optional)
cp .env.example .env

# Start the development server
npm run dev
```

The client will run on `http://localhost:5173`

## Usage

### Creating an Account

1. Open `http://localhost:5173` in your browser
2. Click on "Register here"
3. Fill in your username, email, and password
4. Click "Register"

### Creating a Project

1. After logging in, you'll see the dashboard
2. Click "+ New Project"
3. Enter project name and description
4. Click "Create"

### Managing Tasks

1. Click on a project to open the board
2. Click "+ New Task" to create a task
3. Fill in task details and select a status (To Do, In Progress, Done)
4. Drag and drop tasks between columns to change their status
5. Click "Edit" on a task to modify it
6. Click "Delete" to remove a task

### Real-time Collaboration

When multiple users are viewing the same project board:
- Task creation, updates, and deletions appear instantly for all users
- Drag-and-drop actions are synchronized in real-time
- Users receive notifications when others join the board

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Projects
- `GET /api/projects` - Get all projects for authenticated user
- `GET /api/projects/:id` - Get a specific project
- `POST /api/projects` - Create a new project
- `PUT /api/projects/:id` - Update a project
- `DELETE /api/projects/:id` - Delete a project

### Tasks
- `GET /api/tasks/project/:id` - Get all tasks for a project
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

## WebSocket Events

### Client → Server
- `join:project` - Join a project room
- `leave:project` - Leave a project room
- `task:created` - Broadcast task creation
- `task:updated` - Broadcast task update
- `task:deleted` - Broadcast task deletion

### Server → Client
- `user:joined` - User joined the project
- `task:created` - New task created
- `task:updated` - Task updated
- `task:deleted` - Task deleted

## Building for Production

### Backend

```bash
cd server
npm start
```

### Frontend

```bash
cd client
npm run build
```

The built files will be in the `client/dist` directory.

## Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- Protected API routes with authentication middleware
- SQL injection prevention through Sequelize ORM
- CORS configuration
- Input validation using express-validator

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development guidelines and how to contribute to the project.

## License

This project is licensed under the MIT License.

## Support

For issues and questions, please open an issue on GitHub.

## Acknowledgments

- Vue.js team for the amazing framework
- Express.js for the robust backend framework
- Socket.io for real-time communication
- Tailwind CSS for the utility-first CSS framework
