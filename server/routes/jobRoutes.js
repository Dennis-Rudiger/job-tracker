import { Router } from 'express';
import { body } from 'express-validator';
import { createJob, deleteJob, getJob, listJobs, updateJob, exportJobsCsv } from '../controllers/jobController.js';

const router = Router();

router.get('/', listJobs);
router.get('/export.csv', exportJobsCsv);
router.get('/:id', getJob);
router.post(
  '/',
  [
    body('company').notEmpty().withMessage('Company is required'),
    body('position').notEmpty().withMessage('Position is required'),
    body('status').optional().isIn(['applied', 'interview', 'offer', 'rejected']).withMessage('Invalid status'),
  ],
  createJob
);
router.patch(
  '/:id',
  [
    body('status').optional().isIn(['applied', 'interview', 'offer', 'rejected']).withMessage('Invalid status'),
  ],
  updateJob
);
router.delete('/:id', deleteJob);

export default router;
