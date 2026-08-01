import express from 'express';
import { 
  addProduct, 
  getProducts, 
  deleteProduct, 
  getProductById,
  getTransactions,
  getProductRequests,
  respondToProductRequest
} from '../controllers/vendorController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(authorizeRoles('vendor'));

router.post('/product', addProduct);
router.get('/products', getProducts);
router.get('/product/:id', getProductById);
router.delete('/product/:id', deleteProduct);

// Transaction/User Request routes
router.get('/transactions', getTransactions);

// Product Request routes
router.get('/product-requests', getProductRequests);
router.put('/product-request/:id', respondToProductRequest);

export default router;
