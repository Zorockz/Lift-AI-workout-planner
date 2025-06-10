const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Add the module alias for normalize-colors
config.resolver.extraNodeModules = {
  '@react-native/normalize-colors': path.resolve(__dirname, 'node_modules/react-native/Libraries/StyleSheet/normalizeColor.js'),
};

module.exports = config; 