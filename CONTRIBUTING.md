# Contributing to Task Management System

Thank you for your interest in contributing to the Task Management System! This document provides guidelines and instructions for contributing.

## Development Setup

### Prerequisites
- Node.js v16 or higher
- PostgreSQL v12 or higher (or Docker)
- Git

### Initial Setup

1. **Fork and clone the repository**
   ```bash
   git clone <your-fork-url>
   cd task-management-system
   ```

2. **Start the database**
   ```bash
   docker-compose up -d
   ```

3. **Setup the backend**
   ```bash
   cd server
   npm install
   cp .env.example .env
   # Edit .env with your configuration
   npm run dev
   ```

4. **Setup the frontend** (in a new terminal)
   ```bash
   cd client
   npm install
   npm run dev
   ```

5. **Run the setup check**
   ```bash
   ./check-setup.sh
   ```

## Project Structure

```
task-management-system/
├── client/           # Vue.js frontend
├── server/          # Node.js backend
├── database/        # Database scripts
└── docker-compose.yml
```

## Code Style

### Backend (JavaScript/Node.js)
- Use 2 spaces for indentation
- Use camelCase for variables and functions
- Use PascalCase for class names
- Always use semicolons
- Add JSDoc comments for functions

### Frontend (Vue.js)
- Follow Vue.js official style guide
- Use Composition API with `<script setup>`
- Use PascalCase for component names
- Use kebab-case for component file names
- Keep components focused and small

### General
- Write descriptive commit messages
- Keep PRs focused on a single feature/fix
- Add comments for complex logic
- Update documentation when needed

## Making Changes

### Creating a Feature Branch
```bash
git checkout -b feature/your-feature-name
```

### Commit Messages
Follow the conventional commits format:
- `feat: add new feature`
- `fix: fix bug in component`
- `docs: update documentation`
- `style: formatting changes`
- `refactor: code refactoring`
- `test: add tests`
- `chore: update dependencies`

### Before Submitting
1. Test your changes locally
2. Ensure no console errors
3. Check that all features still work
4. Update documentation if needed
5. Run linting (if configured)

## API Development

### Adding New Endpoints

1. **Create/update controller** in `server/src/controllers/`
2. **Add route** in `server/src/routes/`
3. **Add validation** using express-validator
4. **Apply rate limiting** if needed
5. **Update API documentation** in README

Example:
```javascript
// Controller
const myController = {
  async myEndpoint(req, res) {
    try {
      // Your logic
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

// Route
router.get('/my-endpoint',
  authMiddleware,
  operationsLimiter,
  myController.myEndpoint
);
```

## Database Changes

### Adding New Tables

1. **Create model** in `server/src/models/`
2. **Add associations** in model file
3. **Update** `server/src/models/index.js`
4. **Update** `database/init.sql` for production

### Migrations
We use Sequelize's sync feature for development. For production:
1. Create proper migration files
2. Test migrations
3. Document any manual steps needed

## WebSocket Development

### Adding New Events

1. **Update** `server/src/socket/index.js` for server-side handlers
2. **Update** `client/src/services/socket.js` for client-side methods
3. **Document** the event in README

Example:
```javascript
// Server
socket.on('new:event', (data) => {
  // Handle event
  socket.to(`room:${data.roomId}`).emit('new:event', data);
});

// Client
emitNewEvent(roomId, data) {
  if (this.socket) {
    this.socket.emit('new:event', { roomId, ...data });
  }
}
```

## Security Guidelines

1. **Never commit sensitive data** (passwords, API keys, tokens)
2. **Always validate user input** on both client and server
3. **Use parameterized queries** (Sequelize ORM)
4. **Apply rate limiting** to all API endpoints
5. **Hash passwords** with bcrypt (cost factor 10+)
6. **Use HTTPS** in production
7. **Sanitize output** to prevent XSS
8. **Check dependencies** for vulnerabilities regularly

## Testing

### Manual Testing Checklist
- [ ] User registration works
- [ ] User login works
- [ ] Creating projects works
- [ ] Creating tasks works
- [ ] Drag-and-drop works
- [ ] Real-time updates work
- [ ] Logout works
- [ ] Error handling works
- [ ] Responsive design works

### Future Automated Testing
- Unit tests for controllers
- Integration tests for API endpoints
- E2E tests for critical user flows
- Socket.io event tests

## Pull Request Process

1. **Update documentation** if you're changing functionality
2. **Add tests** if implementing new features (when test infrastructure exists)
3. **Ensure code quality** - no console.log statements in production code
4. **Create a PR** with a clear description of changes
5. **Link related issues** in the PR description
6. **Request review** from maintainers
7. **Address feedback** promptly

## Questions or Issues?

- Open an issue for bugs or feature requests
- Use discussions for questions
- Check existing issues before creating new ones

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

Thank you for contributing! 🎉
