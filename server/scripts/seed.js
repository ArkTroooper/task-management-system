/* eslint-disable no-console */
require('dotenv').config();

const mongoose = require('mongoose');

const connectDB = require('../config/db');

const User = require('../models/User');
const Project = require('../models/Project');
const Task = require('../models/Task');

const seed = async () => {
  const shouldWipe = process.argv.includes('--wipe');

  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not set. Create server/.env first.');
  }

  await connectDB();

  console.log('✅ Connected. Seeding database...');

  if (shouldWipe) {
    console.log('🧹 Wiping existing data...');
    await Promise.all([
      Task.deleteMany({}),
      Project.deleteMany({}),
      User.deleteMany({})
    ]);
  }

  // ---- Create user ----
  const devEmail = 'dev@example.com';

  let user = await User.findOne({ email: devEmail });
  if (!user) {
    console.log('👤 Creating dev user...');
    user = await User.create({
      username: 'dev',
      email: devEmail,
      password: 'Password123!' // assumes your User model hashes this in a pre-save hook
    });
  } else {
    console.log('👤 Dev user already exists.');
  }

  // ---- Create project ----
  let project = await Project.findOne({ title: 'Demo Project', owner: user._id });
  if (!project) {
    console.log('📁 Creating demo project...');
    project = await Project.create({
      title: 'Demo Project',
      description: 'Seeded project for local development',
      owner: user._id
      // members will auto-add owner via your pre('save') hook
    });
  } else {
    console.log('📁 Demo project already exists.');
  }

  // ---- Create tasks ----
  const existingTaskCount = await Task.countDocuments({ project: project._id });

  if (existingTaskCount === 0) {
    console.log('🧩 Creating demo tasks...');
    await Task.insertMany([
      {
        title: 'Welcome task',
        description: 'This task was created by the seed script.',
        status: 'todo',
        priority: 'medium',
        project: project._id,
        createdBy: user._id,
        order: 0
      },
      {
        title: 'Drag me to In Progress',
        description: 'Try moving this task in the UI.',
        status: 'todo',
        priority: 'low',
        project: project._id,
        createdBy: user._id,
        order: 1
      },
      {
        title: 'Socket.io real-time test',
        description: 'Open two tabs and move tasks to verify real-time updates.',
        status: 'inprogress',
        priority: 'high',
        project: project._id,
        createdBy: user._id,
        order: 0
      },
      {
        title: 'Done example',
        description: 'This is a completed task.',
        status: 'done',
        priority: 'medium',
        project: project._id,
        createdBy: user._id,
        order: 0
      }
    ]);
  } else {
    console.log(`🧩 Tasks already exist for this project (${existingTaskCount}). Skipping task insert.`);
  }

  console.log('✅ Seed complete.');
  console.log(`Dev login: ${devEmail} / Password123!`);
};

seed()
  .catch((err) => {
    console.error('❌ Seed failed:', err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.connection.close();
    console.log('🔌 MongoDB connection closed.');
  });