'use strict';

require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Project = require('../models/Project');
const Task = require('../models/Task');

const WIPE = process.argv.includes('--wipe');

const DEV_USER = {
  username: 'devuser',
  email: 'dev@example.com',
  password: 'Password123!'
};

const DEMO_PROJECT_TITLE = 'Demo Project';

const SEED_TASKS = [
  { title: 'Set up project repository', description: 'Initialize git repo and add README', status: 'done', priority: 'high', order: 0 },
  { title: 'Design database schema', description: 'Define Mongoose models for User, Project, Task', status: 'done', priority: 'high', order: 1 },
  { title: 'Implement authentication', description: 'JWT login and registration endpoints', status: 'inprogress', priority: 'high', order: 0 },
  { title: 'Build task board UI', description: 'Kanban board with drag-and-drop support', status: 'todo', priority: 'medium', order: 0 },
  { title: 'Write API documentation', description: 'Document all REST endpoints in README', status: 'todo', priority: 'low', order: 1 }
];

async function seed() {
  await connectDB();

  if (WIPE) {
    console.log('Wiping existing data...');
    await Promise.all([
      User.deleteMany({}),
      Project.deleteMany({}),
      Task.deleteMany({})
    ]);
    console.log('Collections wiped.');
  }

  // Try to sync indexes (non-fatal)
  try {
    await Task.syncIndexes();
  } catch (err) {
    console.warn('Task.syncIndexes() failed (non-fatal):', err.message);
  }

  // Find or create dev user
  let user = await User.findOne({ email: DEV_USER.email });
  if (!user) {
    user = await User.create(DEV_USER);
    console.log(`Created user: ${user.email}`);
  } else {
    console.log(`User already exists: ${user.email}`);
  }

  // Find or create demo project
  let project = await Project.findOne({ title: DEMO_PROJECT_TITLE, owner: user._id });
  if (!project) {
    project = await Project.create({ title: DEMO_PROJECT_TITLE, description: 'A demo project for local development', owner: user._id });
    console.log(`Created project: ${project.title}`);
  } else {
    console.log(`Project already exists: ${project.title}`);
  }

  // Find or create tasks
  for (const taskData of SEED_TASKS) {
    const existing = await Task.findOne({ title: taskData.title, project: project._id });
    if (!existing) {
      await Task.create({ ...taskData, project: project._id, createdBy: user._id, assignedTo: user._id });
      console.log(`Created task: ${taskData.title}`);
    } else {
      console.log(`Task already exists: ${taskData.title}`);
    }
  }

  console.log('\nSeeding complete.');
}

seed()
  .catch((err) => {
    console.error('Seed failed:', err);
    process.exitCode = 1;
  })
  .finally(() => mongoose.connection.close());
