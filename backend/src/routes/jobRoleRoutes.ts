import express from 'express';
import { getJobRoles, createJobRole, deleteJobRole, updateJobRole } from '../controllers/jobRoleController.js';

const router = express.Router();

router.get('/', getJobRoles);
router.post('/', createJobRole);
router.put('/:id', updateJobRole);
router.delete('/:id', deleteJobRole);

export default router;
