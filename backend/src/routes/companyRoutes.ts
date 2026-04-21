import express from 'express';
import { getCompany, updateCompany } from '../controllers/companyController.js';

const router = express.Router();

router.route('/')
  .get(getCompany)
  .put(updateCompany);

export default router;
