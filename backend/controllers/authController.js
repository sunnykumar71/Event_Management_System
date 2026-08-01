import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

/**
 * Generate JWT Token
 * @param {string} id - User ID
 * @returns {string} JWT token
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

/**
 * Format user response (exclude password)
 * @param {Object} user - User document
 * @returns {Object} Formatted user object
 */
const formatUserResponse = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  token: generateToken(user._id),
});

const ensureDatabaseReady = () => {
  if (mongoose.connection.readyState !== 1) {
    const err = new Error('Database not connected. Please try again in a moment.');
    err.statusCode = 503;
    throw err;
  }
};

/**
 * @desc    Authenticate user & get token (Universal)
 * @route   POST /api/auth/login
 * @access  Public
 */
const authUser = asyncHandler(async (req, res) => {
  ensureDatabaseReady();
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Please provide email and password');
  }

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json(formatUserResponse(user));
  } else {
    console.log(`Login failure for ${email}`);
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

/**
 * @desc    Admin Login
 * @route   POST /api/auth/admin/login
 * @access  Public
 */
const authAdmin = asyncHandler(async (req, res) => {
  ensureDatabaseReady();
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Please provide email and password');
  }

  const user = await User.findOne({ email });

  if (user && user.role === 'admin' && (await user.matchPassword(password))) {
    res.json(formatUserResponse(user));
  } else {
    console.log(`Admin login failure for ${email}`);
    res.status(401);
    throw new Error('Invalid admin credentials');
  }
});

/**
 * @desc    Vendor Login
 * @route   POST /api/auth/vendor/login
 * @access  Public
 */
const authVendor = asyncHandler(async (req, res) => {
  ensureDatabaseReady();
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Please provide email and password');
  }

  const user = await User.findOne({ email });

  if (user && user.role === 'vendor' && (await user.matchPassword(password))) {
    res.json(formatUserResponse(user));
  } else {
    console.log(`Vendor login failure for ${email}`);
    res.status(401);
    throw new Error('Invalid vendor credentials');
  }
});

/**
 * @desc    User Login (Regular users only)
 * @route   POST /api/auth/user/login
 * @access  Public
 */
const authUserOnly = asyncHandler(async (req, res) => {
  ensureDatabaseReady();
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Please provide email and password');
  }

  const user = await User.findOne({ email });

  if (user && user.role === 'user' && (await user.matchPassword(password))) {
    res.json(formatUserResponse(user));
  } else {
    console.log(`User login failure for ${email}`);
    res.status(401);
    throw new Error('Invalid user credentials');
  }
});

/**
 * @desc    Register a new user (Universal - with role selection)
 * @route   POST /api/auth/register
 * @access  Public
 */
const registerUser = asyncHandler(async (req, res) => {
  ensureDatabaseReady();
  const { name, email, password, role } = req.body;

  // Input validation
  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please provide name, email, and password');
  }

  // Password strength check
  if (password.length < 6) {
    res.status(400);
    throw new Error('Password must be at least 6 characters');
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  // Validate role
  const validRoles = ['admin', 'vendor', 'user'];
  const userRole = validRoles.includes(role) ? role : 'user';

  const user = await User.create({
    name,
    email,
    password,
    role: userRole,
  });

  if (user) {
    res.status(201).json(formatUserResponse(user));
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

/**
 * @desc    Register a new admin
 * @route   POST /api/auth/admin/register
 * @access  Public
 */
const registerAdmin = asyncHandler(async (req, res) => {
  ensureDatabaseReady();
  const { name, email, password } = req.body;

  // Input validation
  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please provide name, email, and password');
  }

  if (password.length < 6) {
    res.status(400);
    throw new Error('Password must be at least 6 characters');
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
    role: 'admin',
  });

  if (user) {
    res.status(201).json(formatUserResponse(user));
  } else {
    res.status(400);
    throw new Error('Invalid admin data');
  }
});

/**
 * @desc    Register a new vendor
 * @route   POST /api/auth/vendor/register
 * @access  Public
 */
const registerVendor = asyncHandler(async (req, res) => {
  ensureDatabaseReady();
  const { name, email, password } = req.body;

  // Input validation
  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please provide name, email, and password');
  }

  if (password.length < 6) {
    res.status(400);
    throw new Error('Password must be at least 6 characters');
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
    role: 'vendor',
  });

  if (user) {
    res.status(201).json(formatUserResponse(user));
  } else {
    res.status(400);
    throw new Error('Invalid vendor data');
  }
});

/**
 * @desc    Register a new regular user
 * @route   POST /api/auth/user/register
 * @access  Public
 */
const registerRegularUser = asyncHandler(async (req, res) => {
  ensureDatabaseReady();
  const { name, email, password } = req.body;

  // Input validation
  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please provide name, email, and password');
  }

  if (password.length < 6) {
    res.status(400);
    throw new Error('Password must be at least 6 characters');
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
    role: 'user',
  });

  if (user) {
    res.status(201).json(formatUserResponse(user));
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

export { 
  authUser, 
  authAdmin,
  authVendor,
  authUserOnly,
  registerUser,
  registerAdmin,
  registerVendor,
  registerRegularUser
};
