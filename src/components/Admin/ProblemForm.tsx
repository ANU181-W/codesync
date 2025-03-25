import React, { useState, useEffect } from "react";
import { Problem } from "../../types";
import { problemsData } from "../../lib/api";

interface ProblemFormProps {
  problem?: Problem | null;
  onClose: () => void;
  onSave: () => void;
}

export function ProblemForm({ problem, onClose, onSave }: ProblemFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    difficulty: "Easy",
    acceptance: 0,
    description: "",
    examples: [{ input: "", output: "", explanation: "" }],
    constraints: [""],
    starterCode: "",
    testCases: [""],
    solution: "",
  });

  useEffect(() => {
    if (problem) {
      setFormData({ ...problem });
    }
  }, [problem]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleExampleChange = (index: number, field: string, value: string) => {
    const updatedExamples = [...formData.examples];
    updatedExamples[index] = { ...updatedExamples[index], [field]: value };
    setFormData((prev) => ({ ...prev, examples: updatedExamples }));
  };

  const addExample = () => {
    setFormData((prev) => ({
      ...prev,
      examples: [...prev.examples, { input: "", output: "", explanation: "" }],
    }));
  };

  const handleConstraintChange = (index: number, value: string) => {
    const updatedConstraints = [...formData.constraints];
    updatedConstraints[index] = value;
    setFormData((prev) => ({ ...prev, constraints: updatedConstraints }));
  };

  const addConstraint = () => {
    setFormData((prev) => ({
      ...prev,
      constraints: [...prev.constraints, ""],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (problem) {
        await problemsData.update(problem._id, formData);
      } else {
        await problemsData.create(formData);
      }

      onSave();
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      {/* Title */}
      <div className="mb-4">
        <label className="block text-sm font-medium">Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          required
        />
      </div>

      {/* Difficulty */}
      <div className="mb-4">
        <label className="block text-sm font-medium">Difficulty</label>
        <select
          name="difficulty"
          value={formData.difficulty}
          onChange={handleChange}
          className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
      </div>

      {/* Acceptance */}
      <div className="mb-4">
        <label className="block text-sm font-medium">Acceptance (%)</label>
        <input
          type="number"
          name="acceptance"
          value={formData.acceptance}
          onChange={handleChange}
          className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          min="0"
          max="100"
        />
      </div>

      {/* Description */}
      <div className="mb-4">
        <label className="block text-sm font-medium">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          rows={4}
          required
        />
      </div>

      {/* Starter Code */}
      <div className="mb-4">
        <label className="block text-sm font-medium">Starter Code</label>
        <textarea
          name="starterCode"
          value={formData.starterCode}
          onChange={handleChange}
          className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          rows={4}
          required
        />
      </div>

      {/* Solution */}
      <div className="mb-4">
        <label className="block text-sm font-medium">Solution</label>
        <textarea
          name="solution"
          value={formData.solution}
          onChange={handleChange}
          className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          rows={4}
          required
        />
      </div>

      {/* Constraints */}
      <h3 className="text-lg font-semibold mb-2">Constraints</h3>
      {formData.constraints.map((constraint, index) => (
        <input
          key={index}
          type="text"
          value={constraint}
          onChange={(e) => handleConstraintChange(index, e.target.value)}
          className="w-full mb-2 p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      ))}
      <button
        type="button"
        onClick={addConstraint}
        className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded mb-4"
      >
        Add Constraint
      </button>

      <div className="flex justify-end mt-6">
        <button
          onClick={onClose}
          type="button"
          className="mr-4 p-2 border rounded hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="p-2 bg-green-500 hover:bg-green-600 text-white rounded"
        >
          Save
        </button>
      </div>
    </form>
  );
}
