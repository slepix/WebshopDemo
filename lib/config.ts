export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const config = {
  api: {
    url: API_URL,
    timeout: 8000, // 8 seconds
  },
} as const;