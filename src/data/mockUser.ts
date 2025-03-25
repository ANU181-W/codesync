import { User } from '../types';

export const mockUser: User = {
  id: '1',
  name: 'John Doe',
  solved: 42,
  attempted: 67,
  submissions: [
    {
      id: '1',
      problemId: 'Two Sum',
      status: 'Accepted',
      runtime: 76,
      memory: 42.3,
      language: 'javascript',
      code: '// Solution code',
      timestamp: new Date('2024-03-10T15:30:00')
    }
  ]
};