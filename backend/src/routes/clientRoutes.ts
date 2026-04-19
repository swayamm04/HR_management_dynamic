import express from 'express';
import { getClients, createClient } from '../controllers/clientController.js';

const router = express.Router();

router.route('/')
  .get(getClients)
  .post(createClient);

export default router;
