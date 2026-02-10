# Task Management System - Frontend

A modern, real-time task management system built with React, featuring a sleek black and grey UI design. This application provides a Kanban-style board for managing projects and tasks with drag-and-drop functionality.

## Features

- 🎨 **Modern UI**: Sleek black and grey color scheme with smooth animations
- 📋 **Kanban Board**: Drag-and-drop task management across columns (To Do, In Progress, Done)
- 🔐 **Authentication**: Secure login and registration system
- ⚡ **Real-time Updates**: Socket.io integration for live collaboration
- 📱 **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- 🎯 **Task Management**: Create, edit, delete, and organize tasks with priorities
- 📊 **Project Dashboard**: Overview of all projects with task counts
- 🔔 **Priority Indicators**: Visual priority badges (low, medium, high)

## Tech Stack

- **React 19** - UI library
- **Vite** - Fast development environment
- **Tailwind CSS** - Utility-first styling
- **@hello-pangea/dnd** - Drag-and-drop functionality
- **Socket.io-client** - Real-time communication
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Context API** - State management

## Project Structure

\`\`\`
src/
├── components/
│   ├── layout/          # Navbar, Sidebar, Layout
│   ├── auth/            # Login and Register forms
│   ├── board/           # Kanban board components
│   ├── modals/          # Modal dialogs
│   └── common/          # Reusable components
├── pages/               # Page components
├── context/             # Context providers
├── services/            # API services
├── hooks/               # Custom hooks
└── utils/               # Helper functions
\`\`\`

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
\`\`\`bash
git clone https://github.com/ArkTroooper/task-management-system.git
cd task-management-system
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Create environment file:
\`\`\`bash
cp .env.example .env
\`\`\`

4. Configure environment variables in \`.env\`:
\`\`\`env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
VITE_APP_NAME=Task Management System
\`\`\`

### Development

Run the development server:
\`\`\`bash
npm run dev
\`\`\`

The application will be available at \`http://localhost:5173\`

### Build

Create a production build:
\`\`\`bash
npm run build
\`\`\`

Preview the production build:
\`\`\`bash
npm run preview
\`\`\`

### Linting

Run ESLint to check code quality:
\`\`\`bash
npm run lint
\`\`\`

## Backend Integration

This frontend is designed to integrate with a backend API. The API endpoints are configured through environment variables. The application expects the following backend endpoints:

### Authentication
- \`POST /api/auth/login\` - User login
- \`POST /api/auth/register\` - User registration
- \`GET /api/auth/verify\` - Verify token

### Projects
- \`GET /api/projects\` - Get all projects
- \`GET /api/projects/:id\` - Get project by ID
- \`POST /api/projects\` - Create project
- \`PUT /api/projects/:id\` - Update project
- \`DELETE /api/projects/:id\` - Delete project

### Tasks
- \`GET /api/tasks?projectId=:id\` - Get tasks for project
- \`GET /api/tasks/:id\` - Get task by ID
- \`POST /api/tasks\` - Create task
- \`PUT /api/tasks/:id\` - Update task
- \`DELETE /api/tasks/:id\` - Delete task
- \`PATCH /api/tasks/:id/move\` - Move task

### Socket.io Events
- \`task_created\` - New task created
- \`task_updated\` - Task updated
- \`task_deleted\` - Task deleted
- \`task_moved\` - Task moved to different column

## Color Palette

The application uses a custom black and grey color scheme:

- **Background**: \`#0a0a0a\`, \`#121212\`
- **Cards/Panels**: \`#1a1a1a\`, \`#1f1f1f\`
- **Borders**: \`#2a2a2a\`, \`#333333\`
- **Text Primary**: \`#e5e5e5\`, \`#f5f5f5\`
- **Text Secondary**: \`#a0a0a0\`, \`#888888\`
- **Accent**: \`#ffffff\`
- **Hover**: \`#252525\`

## Contributing

1. Fork the repository
2. Create your feature branch (\`git checkout -b feature/AmazingFeature\`)
3. Commit your changes (\`git commit -m 'Add some AmazingFeature'\`)
4. Push to the branch (\`git push origin feature/AmazingFeature\`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Acknowledgments

- Built with ❤️ using React and Vite
- Icons from Heroicons
- Drag-and-drop powered by @hello-pangea/dnd
