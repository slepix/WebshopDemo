export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api-frontend.lke518509.akamai-apl.net/api';

export const config = {
  api: {
    url: API_URL,
    timeout: 8000, // 8 seconds
  },
} as const;
