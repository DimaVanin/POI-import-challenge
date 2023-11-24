import 'dotenv/config';
export * from './logger';

export const PORT = parseInt(process.env.PORT, 10) || 3000;
export const REDIS_URL = process.env.REDIS_URL;
export const MONGODB_URL = process.env.MONGODB_URL;
export const OPEN_CHARGE_MAP_API_KEY = process.env.OPEN_CHARGE_MAP_API_KEY;
