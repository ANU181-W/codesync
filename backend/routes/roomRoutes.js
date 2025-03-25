import express from 'express';
import {
  createRoom,
  joinRoom,
  getRoomById,
  updateCode
} from '../controllers/roomController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, createRoom);

router.route('/:id')
  .get(protect, getRoomById);

router.route('/:id/join')
  .post(protect, joinRoom);

router.route('/:id/code')
  .put(protect, updateCode);

export default router;