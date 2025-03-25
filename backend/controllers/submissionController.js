import User from "../models/User.js";
import Problem from "../models/Problem.js";

// Helper function to simulate code execution
const executeCode = (code, testCase) => {
  // In production, this should use a proper code execution service
  const passed = Math.random() > 0.2;
  return {
    passed,
    executionTime: `${Math.floor(Math.random() * 100)}ms`,
    memoryUsed: `${Math.floor(Math.random() * 20)}MB`,
    input: testCase,
    expectedOutput: "Expected output",
    actualOutput: passed ? "Expected output" : "Wrong output",
  };
};

// @desc    Run test cases
// @route   POST /api/submissions/test
// @access  Private
export const runTests = async (req, res) => {
  try {
    const { problemId, code, language } = req.body;
    const problem = await Problem.findById(problemId);

    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    // Run all test cases
    const results = problem.testCases.map((testCase) =>
      executeCode(code, testCase)
    );

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Submit solution
// @route   POST /api/submissions
// @access  Private
export const submitSolution = async (req, res) => {
  try {
    const { problemId, code, language } = req.body;
    const user = await User.findById(req.user._id);
    const problem = await Problem.findById(problemId);

    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    // Run all test cases
    const results = problem.testCases.map((testCase) =>
      executeCode(code, testCase)
    );
    const allPassed = results.every((r) => r.passed);

    // Create submission record
    const submission = {
      problemId,
      status: allPassed ? "Accepted" : "Wrong Answer",
      runtime: Math.floor(Math.random() * 100),
      memory: Math.floor(Math.random() * 20),
      language,
      code,
    };

    // Update user's submission history
    user.submissions.push(submission);

    // Update solved/attempted counts
    if (
      allPassed &&
      !user.submissions.some(
        (s) => s.problemId.toString() === problemId && s.status === "Accepted"
      )
    ) {
      user.solved += 1;
    }
    if (!user.submissions.some((s) => s.problemId.toString() === problemId)) {
      user.attempted += 1;
    }

    await user.save();

    res.json({
      status: submission.status,
      stats: {
        runtime: `${submission.runtime}ms`,
        memory: `${submission.memory}MB`,
        runtimePercentile: Math.floor(Math.random() * 100),
        memoryPercentile: Math.floor(Math.random() * 100),
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get submission history
// @route   GET /api/submissions/history/:problemId
// @access  Private
export const getSubmissionHistory = async (req, res) => {
  try {
    const { problemId } = req.params;
    const user = await User.findById(req.user._id);

    const submissions = user.submissions
      .filter((s) => s.problemId.toString() === problemId)
      .sort((a, b) => b.timestamp - a.timestamp);

    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
