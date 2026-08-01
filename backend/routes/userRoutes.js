import express from 'express';
import { 
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
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(authorizeRoles('user'));

router.get('/vendors', getVendors);
router.get('/products', getProducts);
router.post('/cart', addToCart);
router.post('/order', createOrder);
router.get('/orders', getOrders);
router.put('/order/:id/cancel', cancelOrder);
router.get('/order/:id', getOrderStatus);

// Guest List routes
router.get('/guests', getGuestList);
router.post('/guest', addGuest);
router.put('/guest/:id', updateGuest);
router.delete('/guest/:id', deleteGuest);

// Product Request routes
router.post('/product-request', requestProduct);
router.get('/product-requests', getUserProductRequests);

export default router;
