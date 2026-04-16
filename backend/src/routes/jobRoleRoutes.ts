import express from 'express';
import { getJobRoles, createJobRole, deleteJobRole } from '../controllers/jobRoleController.js';

const router = express.Router();

router.get('/', getJobRoles);
router.post('/', createJobRole);
router.delete('/:id', deleteJobRole);

export default router;
