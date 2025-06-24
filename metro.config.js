const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Add the module alias for normalize-colors
config.resolver.extraNodeModules = {
  '@react-native/normalize-colors': path.resolve(__dirname, 'node_modules/react-native/Libraries/StyleSheet/normalizeColor.js'),
};

// Handle Firebase .cjs files properly
config.resolver.sourceExts = [...config.resolver.sourceExts, 'cjs'];

// Configure resolver to handle Firebase modules
config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];

// Disable package exports for better Firebase compatibility
config.resolver.unstable_enablePackageExports = false;

// Production optimizations
if (process.env.NODE_ENV === 'production') {
  // Enable minification
  config.transformer.minifierConfig = {
    keep_fnames: true,
    mangle: {
      keep_fnames: true,
    },
  };
  
  // Optimize bundle
  config.transformer.optimizeDeps = true;
}

// Handle Firebase and other problematic packages
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

// Add custom resolver for problematic packages
config.resolver.alias = {
  ...config.resolver.alias,
  // Add any package aliases here if needed
};

module.exports = config; 