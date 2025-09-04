// Configuration management for different environments
export interface AppConfig {
  env: 'development' | 'test' | 'production';
  apiUrl: string;
  apiTimeout: number;
  enableAnalytics: boolean;
  enableDebug: boolean;
  contactEmail: string;
  contactPhone: string;
}

const getConfig = (): AppConfig => {
  const env = (process.env.REACT_APP_ENV || 'development') as AppConfig['env'];
  
  return {
    env,
    apiUrl: process.env.REACT_APP_API_URL || 'http://localhost:3001',
    apiTimeout: Number(process.env.REACT_APP_API_TIMEOUT) || 5000,
    enableAnalytics: process.env.REACT_APP_ENABLE_ANALYTICS === 'true',
    enableDebug: process.env.REACT_APP_ENABLE_DEBUG === 'true',
    contactEmail: process.env.REACT_APP_CONTACT_EMAIL || 'info@marpro.com',
    contactPhone: process.env.REACT_APP_CONTACT_PHONE || '+1234567890',
  };
};

export const config = getConfig();

// Helper functions for environment checks
export const isDevelopment = () => config.env === 'development';
export const isTest = () => config.env === 'test';
export const isProduction = () => config.env === 'production';

// Logger utility that respects debug settings
export const logger = {
  log: (...args: any[]) => {
    if (config.enableDebug) {
      console.log('[MARPRO]', ...args);
    }
  },
  error: (...args: any[]) => {
    console.error('[MARPRO ERROR]', ...args);
  },
  warn: (...args: any[]) => {
    if (config.enableDebug) {
      console.warn('[MARPRO WARNING]', ...args);
    }
  },
};
