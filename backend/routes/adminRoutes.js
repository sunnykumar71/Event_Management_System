import express from 'express';
import { 
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
} from '../controllers/adminController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';

const router = express.Router();

// All routes require authentication and admin role
router.use(protect);
router.use(authorizeRoles('admin'));

router.post('/membership', addMembership);
router.put('/membership/:id', updateMembership);

// User management routes
router.get('/users', getUsers);
router.post('/user', createUser);
router.put('/user/:id', updateUser);
router.delete('/user/:id', deleteUser);

// Vendor management routes
router.get('/vendors', getVendors);
router.post('/vendor', createVendor);
router.put('/vendor/:id', updateVendor);
router.delete('/vendor/:id', deleteVendor);

export default router;
