import express from 'express';
import {
  getProblems,
  getProblemById,
  createProblem,
  updateProblem,
  deleteProblem
} from '../controllers/problemController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getProblems)
  .post(protect, admin, createProblem);

router.route('/:id')
  .get(getProblemById)
  .put(protect, admin, updateProblem)
  .delete(protect, admin, deleteProblem);

export default router;