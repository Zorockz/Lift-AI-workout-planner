// This file is kept for future configuration needs
export const config = {
  // Environment
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV === 'development',
  
  // API Configuration
  apiTimeout: 30000, // 30 seconds
  
  // Firebase Configuration
  firebase: {
    enablePersistence: true,
    enableOffline: true,
    cacheSizeBytes: 50 * 1024 * 1024, // 50MB
  },
  
  // App Configuration
  app: {
    maxWorkoutHistory: 100, // Maximum number of workout logs to keep
    maxOfflineDays: 7, // Maximum days to store offline data
    autoBackup: true, // Enable automatic backup
  },
  
  // Error Reporting
  errorReporting: {
    enabled: true,
    sampleRate: 1.0, // Report 100% of errors in production
  },
  
  // Performance
  performance: {
    enableProfiling: false, // Disable profiling in production
    enableDebugging: false, // Disable debugging in production
  },
}; 