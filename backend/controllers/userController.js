import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import GuestList from '../models/GuestList.js';
import ProductRequest from '../models/ProductRequest.js';

/**
 * Check if user owns an order
 * @param {Object} order - Order document
 * @param {string} userId - User ID
 * @returns {boolean}
 */
const isOrderOwner = (order, userId) => 
  order.userId.toString() === userId.toString();

/**
 * Check if user owns a guest
 * @param {Object} guest - GuestList document
 * @param {string} userId - User ID
 * @returns {boolean}
 */
const isGuestOwner = (guest, userId) => 
  guest.userId.toString() === userId.toString();

/**
 * Valid guest statuses
 */
const VALID_GUEST_STATUSES = ['invited', 'confirmed', 'declined', 'attended'];

/**
 * @desc    Get all vendors
 * @route   GET /api/user/vendors
 * @access  Private/User
 */
const getVendors = asyncHandler(async (req, res) => {
  const vendors = await User.find({ role: 'vendor' })
    .select('-password')
    .sort({ name: 1 });

  res.json({
    success: true,
    count: vendors.length,
    vendors,
  });
});

/**
 * @desc    Get all products (for users to browse)
 * @route   GET /api/user/products
 * @access  Private/User
 */
const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find()
    .populate('vendorId', 'name email')
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    count: products.length,
    products,
  });
});

/**
 * @desc    Add items to cart (staging for checkout)
 * @route   POST /api/user/cart
 * @access  Private/User
 */
const addToCart = asyncHandler(async (req, res) => {
  const { items } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    res.status(400);
    throw new Error('Please provide items array');
  }

  res.status(200).json({
    success: true,
    message: 'Items staged for checkout',
    cartItems: items,
    itemCount: items.length,
  });
});

/**
 * @desc    Create order
 * @route   POST /api/user/order
 * @access  Private/User
 */
const createOrder = asyncHandler(async (req, res) => {
  const { items } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    res.status(400);
    throw new Error('Please provide at least one item');
  }

  let totalAmount = 0;
  const populatedItems = [];

  // Validate each item and calculate total
  for (const item of items) {
    if (!item.productId || !item.quantity || item.quantity < 1) {
      res.status(400);
      throw new Error('Each item must have productId and quantity (minimum 1)');
    }

    const product = await Product.findById(item.productId);
    if (!product) {
      res.status(404);
      throw new Error(`Product not found: ${item.productId}`);
    }

    totalAmount += product.price * item.quantity;
    populatedItems.push({
      productId: product._id,
      quantity: item.quantity,
    });
  }

  const order = await Order.create({
    userId: req.user._id,
    items: populatedItems,
    totalAmount,
    status: 'completed',
  });

  res.status(201).json({
    success: true,
    message: 'Order created successfully',
    order,
  });
});

/**
 * @desc    Get all user orders with total spent
 * @route   GET /api/user/orders
 * @access  Private/User
 */
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ userId: req.user._id })
    .populate('items.productId', 'name price')
    .sort({ createdAt: -1 });

  const totalSpent = orders.reduce((acc, order) => acc + order.totalAmount, 0);

  res.json({
    success: true,
    count: orders.length,
    totalSpent,
    orders,
  });
});

/**
 * @desc    Cancel order
 * @route   PUT /api/user/order/:id/cancel
 * @access  Private/User
 */
const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  // Verify ownership
  if (!isOrderOwner(order, req.user._id)) {
    res.status(401);
    throw new Error('Not authorized to cancel this order');
  }

  // Check if already cancelled
  if (order.status === 'cancelled') {
    res.status(400);
    throw new Error('Order is already cancelled');
  }

  order.status = 'cancelled';
  await order.save();

  res.json({
    success: true,
    message: 'Order cancelled successfully',
    order,
  });
});

/**
 * @desc    Get order status
 * @route   GET /api/user/order/:id
 * @access  Private/User
 */
const getOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  // Verify ownership
  if (!isOrderOwner(order, req.user._id)) {
    res.status(401);
    throw new Error('Not authorized to view this order');
  }

  res.json({
    success: true,
    orderId: order._id,
    status: order.status,
    totalAmount: order.totalAmount,
    items: order.items,
    createdAt: order.createdAt,
  });
});

// ==================== GUEST LIST FUNCTIONS ====================

/**
 * @desc    Get all guests for user
 * @route   GET /api/user/guests
 * @access  Private/User
 */
const getGuestList = asyncHandler(async (req, res) => {
  const guests = await GuestList.find({ userId: req.user._id })
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    count: guests.length,
    guests,
  });
});

/**
 * @desc    Add guest to list
 * @route   POST /api/user/guest
 * @access  Private/User
 */
const addGuest = asyncHandler(async (req, res) => {
  const { name, email, phone, eventName, status, notes } = req.body;

  // Input validation
  if (!name || !email || !eventName) {
    res.status(400);
    throw new Error('Please provide name, email, and event name');
  }

  // Validate status if provided
  if (status && !VALID_GUEST_STATUSES.includes(status)) {
    res.status(400);
    throw new Error(`Status must be one of: ${VALID_GUEST_STATUSES.join(', ')}`);
  }

  const guest = await GuestList.create({
    userId: req.user._id,
    name,
    email,
    phone: phone || '',
    eventName,
    status: status || 'invited',
    notes: notes || '',
  });

  res.status(201).json({
    success: true,
    message: 'Guest added successfully',
    guest,
  });
});

/**
 * @desc    Update guest
 * @route   PUT /api/user/guest/:id
 * @access  Private/User
 */
const updateGuest = asyncHandler(async (req, res) => {
  const { name, email, phone, eventName, status, notes } = req.body;
  const guest = await GuestList.findById(req.params.id);

  if (!guest) {
    res.status(404);
    throw new Error('Guest not found');
  }

  // Verify ownership
  if (!isGuestOwner(guest, req.user._id)) {
    res.status(401);
    throw new Error('Not authorized to update this guest');
  }

  // Validate status if provided
  if (status && !VALID_GUEST_STATUSES.includes(status)) {
    res.status(400);
    throw new Error(`Status must be one of: ${VALID_GUEST_STATUSES.join(', ')}`);
  }

  // Update fields
  if (name) guest.name = name;
  if (email) guest.email = email;
  if (phone !== undefined) guest.phone = phone;
  if (eventName) guest.eventName = eventName;
  if (status) guest.status = status;
  if (notes !== undefined) guest.notes = notes;

  await guest.save();

  res.json({
    success: true,
    message: 'Guest updated successfully',
    guest,
  });
});

/**
 * @desc    Delete guest
 * @route   DELETE /api/user/guest/:id
 * @access  Private/User
 */
const deleteGuest = asyncHandler(async (req, res) => {
  const guest = await GuestList.findById(req.params.id);

  if (!guest) {
    res.status(404);
    throw new Error('Guest not found');
  }

  // Verify ownership
  if (!isGuestOwner(guest, req.user._id)) {
    res.status(401);
    throw new Error('Not authorized to delete this guest');
  }

  await GuestList.deleteOne({ _id: guest._id });

  res.json({
    success: true,
    message: 'Guest removed successfully',
  });
});

// ==================== PRODUCT REQUEST FUNCTIONS ====================

/**
 * @desc    Request a product from vendor
 * @route   POST /api/user/product-request
 * @access  Private/User
 */
const requestProduct = asyncHandler(async (req, res) => {
  const { vendorId, productName, description, expectedPrice, quantity } = req.body;

  // Input validation
  if (!vendorId || !productName || !description) {
    res.status(400);
    throw new Error('Please provide vendorId, productName, and description');
  }

  // Validate quantity
  if (quantity && (quantity < 1 || !Number.isInteger(quantity))) {
    res.status(400);
    throw new Error('Quantity must be a positive integer');
  }

  // Verify vendor exists
  const vendor = await User.findOne({ _id: vendorId, role: 'vendor' });
  if (!vendor) {
    res.status(404);
    throw new Error('Vendor not found');
  }

  const productRequest = await ProductRequest.create({
    userId: req.user._id,
    vendorId,
    productName,
    description,
    expectedPrice: expectedPrice || 0,
    quantity: quantity || 1,
    status: 'pending',
  });

  res.status(201).json({
    success: true,
    message: 'Product request sent successfully',
    productRequest,
  });
});

/**
 * @desc    Get user's product requests
 * @route   GET /api/user/product-requests
 * @access  Private/User
 */
const getUserProductRequests = asyncHandler(async (req, res) => {
  const requests = await ProductRequest.find({ userId: req.user._id })
    .populate('vendorId', 'name email')
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    count: requests.length,
    requests,
  });
});

export { 
  getVendors,
  getProducts,
  addToCart, 
  createOrder, 
  getOrders, 
  cancelOrder, 
  getOrderStatus,
  getGuestList,
  addGuest,
  updateGuest,
  deleteGuest,
  requestProduct,
  getUserProductRequests
};
