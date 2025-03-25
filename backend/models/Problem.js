import mongoose from 'mongoose';

const problemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: true
  },
  acceptance: {
    type: Number,
    default: 0
  },
  description: {
    type: String,
    required: true
  },
  examples: [{
    input: String,
    output: String,
    explanation: String
  }],
  constraints: [String],
  starterCode: {
    type: String,
    required: true
  },
  testCases: [String],
  solution: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

const Problem = mongoose.model('Problem', problemSchema);

export default Problem;