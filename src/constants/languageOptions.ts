export const LANGUAGES = [
  {
    name: "JavaScript",
    value: "javascript",
    template: `function solution(nums) {
    // Your code here
    return [];
}`,
  },
  {
    name: "TypeScript",
    value: "typescript",
    template: `function solution(nums: number[]): number[] {
    // Your code here
    return [];
}`,
  },
  {
    name: "Python",
    value: "python",
    template: `def solution(nums):
    # Your code here
    pass`,
  },
  {
    name: "Java",
    value: "java",
    template: `class Solution {
    public int[] solution(int[] nums) {
        // Your code here
        return new int[]{};
    }
}`,
  },
  {
    name: "C++",
    value: "cpp",
    template: `class Solution {
public:
    vector<int> solution(vector<int>& nums) {
        // Your code here
        return {};
    }
};`,
  },
];

export const getLanguageName = (value: string): string => {
  return LANGUAGES.find((lang) => lang.value === value)?.name || value;
};

export const getLanguageTemplate = (value: string): string => {
  return LANGUAGES.find((lang) => lang.value === value)?.template || "";
};
