import express from 'express';
import { getUsers, createUser, deleteUser, updateUser } from '../controllers/userController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// All user routes protected and only for Administrators
router.use(protect);
router.use(authorize('Administrator'));

router.get('/', getUsers);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;
