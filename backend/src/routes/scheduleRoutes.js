import express from 'express';
import { createSchedule } from '../controllers/scheduleController.js';

const router = express.Router();

router.post('/schedule', createSchedule);

export default router; 