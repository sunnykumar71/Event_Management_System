import asyncHandler from 'express-async-handler';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import ProductRequest from '../models/ProductRequest.js';

/**
 * Check if vendor owns a product
 * @param {Object} product - Product document
 * @param {string} vendorId - Vendor user ID
 * @returns {boolean}
 */
const isProductOwner = (product, vendorId) => 
  product.vendorId.toString() === vendorId.toString();

/**
 * Check if vendor owns a request
 * @param {Object} request - ProductRequest document
 * @param {string} vendorId - Vendor user ID
 * @returns {boolean}
 */
const isRequestOwner = (request, vendorId) => 
  request.vendorId.toString() === vendorId.toString();

/**
 * Format product response
 * @param {Object} product 
 * @returns {Object}
 */
const formatProductResponse = (product) => ({
  _id: product._id,
  name: product.name,
  price: product.price,
  description: product.description,
  vendorId: product.vendorId,
  createdAt: product.createdAt,
  updatedAt: product.updatedAt,
});

/**
 * Valid request statuses for vendor responses
 */
const VALID_REQUEST_STATUSES = ['approved', 'rejected'];

/**
 * @desc    Add product
 * @route   POST /api/vendor/product
 * @access  Private/Vendor
 */
const addProduct = asyncHandler(async (req, res) => {
  const { name, price, description } = req.body;

  // Input validation
  if (!name || !price || !description) {
    res.status(400);
    throw new Error('Please provide name, price, and description');
  }

  // Validate price is a positive number
  if (typeof price !== 'number' || price <= 0) {
    res.status(400);
    throw new Error('Price must be a positive number');
  }

  // Validate name length
  if (name.length < 2) {
    res.status(400);
    throw new Error('Product name must be at least 2 characters');
  }

  const product = await Product.create({
    name,
    price,
    description,
    vendorId: req.user._id,
  });

  res.status(201).json({
    success: true,
    message: 'Product created successfully',
    product: formatProductResponse(product),
  });
});

/**
 * @desc    Get all vendor products
 * @route   GET /api/vendor/products
 * @access  Private/Vendor
 */
const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ vendorId: req.user._id })
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    count: products.length,
    products,
  });
});

/**
 * @desc    Delete product
 * @route   DELETE /api/vendor/product/:id
 * @access  Private/Vendor
 */
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  // Verify ownership
  if (!isProductOwner(product, req.user._id)) {
    res.status(401);
    throw new Error('Not authorized to delete this product');
  }

  await Product.deleteOne({ _id: product._id });
  res.json({
    success: true,
    message: 'Product removed successfully',
  });
});

/**
 * @desc    Get single product by ID
 * @route   GET /api/vendor/product/:id
 * @access  Private/Vendor
 */
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  // Verify ownership
  if (!isProductOwner(product, req.user._id)) {
    res.status(401);
    throw new Error('Not authorized to view this product');
  }

  res.json({
    success: true,
    product,
  });
});

/**
 * @desc    Get vendor transactions (orders with vendor's products)
 * @route   GET /api/vendor/transactions
 * @access  Private/Vendor
 */
const getTransactions = asyncHandler(async (req, res) => {
  // Get vendor's product IDs
  const vendorProductIds = await Product.find({ vendorId: req.user._id }).distinct('_id');

  // Find orders containing vendor's products
  const orders = await Order.find({
    'items.productId': { $in: vendorProductIds }
  })
    .populate('userId', 'name email')
    .populate('items.productId', 'name price')
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    count: orders.length,
    orders,
  });
});

/**
 * @desc    Get product requests from users
 * @route   GET /api/vendor/product-requests
 * @access  Private/Vendor
 */
const getProductRequests = asyncHandler(async (req, res) => {
  const requests = await ProductRequest.find({ vendorId: req.user._id })
    .populate('userId', 'name email')
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    count: requests.length,
    requests,
  });
});

/**
 * @desc    Respond to product request
 * @route   PUT /api/vendor/product-request/:id
 * @access  Private/Vendor
 */
const respondToProductRequest = asyncHandler(async (req, res) => {
  const { status, responseMessage } = req.body;
  const request = await ProductRequest.findById(req.params.id);

  if (!request) {
    res.status(404);
    throw new Error('Product request not found');
  }

  // Verify ownership
  if (!isRequestOwner(request, req.user._id)) {
    res.status(401);
    throw new Error('Not authorized to respond to this request');
  }

  // Validate status
  if (!VALID_REQUEST_STATUSES.includes(status)) {
    res.status(400);
    throw new Error('Status must be approved or rejected');
  }

  request.status = status;
  if (responseMessage) request.responseMessage = responseMessage;
  await request.save();

  res.json({
    success: true,
    message: `Request ${status} successfully`,
    request,
  });
});

export { 
  addProduct, 
  getProducts, 
  deleteProduct, 
  getProductById,
  getTransactions,
  getProductRequests,
  respondToProductRequest
};
