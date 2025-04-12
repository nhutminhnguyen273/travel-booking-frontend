const isProduction = process.env.NODE_ENV === 'production';

export const API_URL = isProduction 
  ? 'https://your-production-api-url.com' 
  : 'http://localhost:5000';

export const STRIPE_PUBLIC_KEY = process.env.REACT_APP_STRIPE_PUBLIC_KEY || ''; 