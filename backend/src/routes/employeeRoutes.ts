import express from 'express';
import { getEmployees, createEmployee, migrateEmployeeIds, updateEmployee, deleteEmployee } from '../controllers/employeeController.js';

const router = express.Router();

router.get('/', getEmployees);
router.post('/', createEmployee);
router.post('/migrate', migrateEmployeeIds);
router.put('/:id', updateEmployee);
router.delete('/:id', deleteEmployee);

export default router;
