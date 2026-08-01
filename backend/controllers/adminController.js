import asyncHandler from 'express-async-handler';
import Membership from '../models/Membership.js';
import User from '../models/User.js';

/**
 * Validate email format
 * @param {string} email 
 * @returns {boolean}
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Format user response without password
 * @param {Object} user 
 * @returns {Object}
 */
const formatUserResponse = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  createdAt: user.createdAt,
});

/**
 * Check if user exists by email
 * @param {string} email 
 * @returns {Promise<Object|null>}
 */
const checkUserExists = async (email) => await User.findOne({ email });

/**
 * Get vendor with membership info
 * @param {string} vendorId 
 * @returns {Promise<Object|null>}
 */
const getVendorWithMembership = async (vendorId) => {
  const vendor = await User.findOne({ _id: vendorId, role: 'vendor' }).select('-password');
  if (!vendor) return null;
  
  const membership = await Membership.findOne({ vendorId });
  return { ...vendor.toObject(), membership };
};

/**
 * Valid membership durations
 */
const VALID_DURATIONS = ['6 months', '1 year', '2 years'];

/**
 * Calculate extended end date
 * @param {Date} currentEndDate 
 * @param {string} duration 
 * @returns {Date}
 */
const calculateExtendedDate = (currentEndDate, duration) => {
  const end = new Date(currentEndDate);
  switch (duration) {
    case '6 months':
      end.setMonth(end.getMonth() + 6);
      break;
    case '1 year':
      end.setFullYear(end.getFullYear() + 1);
      break;
    case '2 years':
      end.setFullYear(end.getFullYear() + 2);
      break;
    default:
      end.setMonth(end.getMonth() + 6);
  }
  return end;
};

/**
 * @desc    Add membership for vendor
 * @route   POST /api/admin/membership
 * @access  Private/Admin
 */
const addMembership = asyncHandler(async (req, res) => {
  const { vendorId, duration } = req.body;

  // Validate required fields
  if (!vendorId) {
    res.status(400);
    throw new Error('Vendor ID is required');
  }

  // Validate vendor exists and is a vendor
  const vendor = await User.findById(vendorId);
  if (!vendor || vendor.role !== 'vendor') {
    res.status(404);
    throw new Error('Vendor not found');
  }

  // Check for existing membership
  const existingMembership = await Membership.findOne({ vendorId });
  if (existingMembership) {
    res.status(400);
    throw new Error('Vendor already has a membership. Use update endpoint.');
  }

  // Validate and set duration
  const membershipDuration = VALID_DURATIONS.includes(duration) ? duration : '6 months';

  try {
    const membership = await Membership.create({
      vendorId,
      duration: membershipDuration,
    });

    res.status(201).json({
      success: true,
      message: 'Membership created successfully',
      membership,
    });
  } catch (error) {
    console.error('Database Error in addMembership:', error);
    res.status(500);
    throw new Error(`Execution error: ${error.message}`);
  }
});

/**
 * @desc    Update membership using ID
 * @route   PUT /api/admin/membership/:id
 * @access  Private/Admin
 */
const updateMembership = asyncHandler(async (req, res) => {
  const { action, duration } = req.body;
  const membership = await Membership.findById(req.params.id);

  if (!membership) {
    res.status(404);
    throw new Error('Membership not found');
  }

  // Handle cancellation
  if (action === 'cancel') {
    membership.status = 'cancelled';
    await membership.save();
    return res.json({
      success: true,
      message: 'Membership cancelled successfully',
      membership,
    });
  }

  // Handle extension
  const extendDuration = VALID_DURATIONS.includes(duration) ? duration : '6 months';
  membership.endDate = calculateExtendedDate(membership.endDate, extendDuration);
  membership.duration = extendDuration;
  membership.status = 'active'; // Reactivate if cancelled
  await membership.save();

  res.json({
    success: true,
    message: 'Membership extended successfully',
    membership,
  });
});


/**
 * @desc    Get all users
 * @route   GET /api/admin/users
 * @access  Private/Admin
 */
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({ role: 'user' })
    .select('-password')
    .sort({ createdAt: -1 });
  
  res.json({
    success: true,
    count: users.length,
    users,
  });
});

/**
 * @desc    Get all vendors with membership info
 * @route   GET /api/admin/vendors
 * @access  Private/Admin
 */
const getVendors = asyncHandler(async (req, res) => {
  const vendors = await User.aggregate([
    { $match: { role: 'vendor' } },
    { $project: { password: 0 } },
    {
      $lookup: {
        from: 'memberships',
        localField: '_id',
        foreignField: 'vendorId',
        as: 'membership',
      },
    },
    { $sort: { createdAt: -1 } },
  ]);

  res.json({
    success: true,
    count: vendors.length,
    vendors,
  });
});

/**
 * @desc    Create user (by admin)
 * @route   POST /api/admin/user
 * @access  Private/Admin
 */
const createUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Input validation
  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please provide name, email, and password');
  }

  if (!isValidEmail(email)) {
    res.status(400);
    throw new Error('Please provide a valid email');
  }

  if (password.length < 6) {
    res.status(400);
    throw new Error('Password must be at least 6 characters');
  }

  const userExists = await checkUserExists(email);
  if (userExists) {
    res.status(400);
    throw new Error('User already exists with this email');
  }

  const user = await User.create({
    name,
    email,
    password,
    role: 'user',
  });

  res.status(201).json({
    success: true,
    message: 'User created successfully',
    user: formatUserResponse(user),
  });
});

/**
 * @desc    Update user
 * @route   PUT /api/admin/user/:id
 * @access  Private/Admin
 */
const updateUser = asyncHandler(async (req, res) => {
  const { name, email } = req.body;
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  if (user.role !== 'user') {
    res.status(400);
    throw new Error('Can only update users with role "user"');
  }

  // Validate email if provided
  if (email && !isValidEmail(email)) {
    res.status(400);
    throw new Error('Please provide a valid email');
  }

  // Check for email uniqueness if changing email
  if (email && email !== user.email) {
    const emailExists = await checkUserExists(email);
    if (emailExists) {
      res.status(400);
      throw new Error('Email already in use');
    }
    user.email = email;
  }

  if (name) user.name = name;

  await user.save();
  res.json({
    success: true,
    message: 'User updated successfully',
    user: formatUserResponse(user),
  });
});

/**
 * @desc    Delete user
 * @route   DELETE /api/admin/user/:id
 * @access  Private/Admin
 */
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  if (user.role !== 'user') {
    res.status(400);
    throw new Error('Can only delete users with role "user"');
  }

  await User.deleteOne({ _id: user._id });
  res.json({
    success: true,
    message: 'User removed successfully',
  });
});

/**
 * @desc    Create vendor (by admin)
 * @route   POST /api/admin/vendor
 * @access  Private/Admin
 */
const createVendor = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Input validation
  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please provide name, email, and password');
  }

  if (!isValidEmail(email)) {
    res.status(400);
    throw new Error('Please provide a valid email');
  }

  if (password.length < 6) {
    res.status(400);
    throw new Error('Password must be at least 6 characters');
  }

  const userExists = await checkUserExists(email);
  if (userExists) {
    res.status(400);
    throw new Error('Vendor already exists with this email');
  }

  const vendor = await User.create({
    name,
    email,
    password,
    role: 'vendor',
  });

  res.status(201).json({
    success: true,
    message: 'Vendor created successfully',
    vendor: formatUserResponse(vendor),
  });
});

/**
 * @desc    Update vendor
 * @route   PUT /api/admin/vendor/:id
 * @access  Private/Admin
 */
const updateVendor = asyncHandler(async (req, res) => {
  const { name, email } = req.body;
  const vendor = await User.findById(req.params.id);

  if (!vendor) {
    res.status(404);
    throw new Error('Vendor not found');
  }

  if (vendor.role !== 'vendor') {
    res.status(400);
    throw new Error('Can only update users with role "vendor"');
  }

  // Validate email if provided
  if (email && !isValidEmail(email)) {
    res.status(400);
    throw new Error('Please provide a valid email');
  }

  // Check for email uniqueness if changing email
  if (email && email !== vendor.email) {
    const emailExists = await checkUserExists(email);
    if (emailExists) {
      res.status(400);
      throw new Error('Email already in use');
    }
    vendor.email = email;
  }

  if (name) vendor.name = name;

  await vendor.save();
  res.json({
    success: true,
    message: 'Vendor updated successfully',
    vendor: formatUserResponse(vendor),
  });
});

/**
 * @desc    Delete vendor
 * @route   DELETE /api/admin/vendor/:id
 * @access  Private/Admin
 */
const deleteVendor = asyncHandler(async (req, res) => {
  const vendor = await User.findById(req.params.id);

  if (!vendor) {
    res.status(404);
    throw new Error('Vendor not found');
  }

  if (vendor.role !== 'vendor') {
    res.status(400);
    throw new Error('Can only delete users with role "vendor"');
  }

  await User.deleteOne({ _id: vendor._id });
  res.json({
    success: true,
    message: 'Vendor removed successfully',
  });
});

export { 
  addMembership, 
  updateMembership, 
  getUsers, 
  getVendors,
  createUser,
  updateUser,
  deleteUser,
  createVendor,
  updateVendor,
  deleteVendor
};
