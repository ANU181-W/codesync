import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  runTests,
  submitSolution,
  getSubmissionHistory,
} from "../controllers/submissionController.js";

const router = express.Router();

router.post("/test", protect, runTests);
router.post("/", protect, submitSolution);
router.get("/history/:problemId", protect, getSubmissionHistory);

export default router;
