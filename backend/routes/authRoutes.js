import express from 'express';
import { 
  authUser, 
  authAdmin,
  authVendor,
  authUserOnly,
  registerUser,
  registerAdmin,
  registerVendor,
  registerRegularUser
} from '../controllers/authController.js';

const router = express.Router();

// General routes
router.post('/login', authUser);
router.post('/register', registerUser);

// Admin specific routes
router.post('/admin/login', authAdmin);
router.post('/admin/register', registerAdmin);

// Vendor specific routes
router.post('/vendor/login', authVendor);
router.post('/vendor/register', registerVendor);

// User specific routes
router.post('/user/login', authUserOnly);
router.post('/user/register', registerRegularUser);

export default router;
