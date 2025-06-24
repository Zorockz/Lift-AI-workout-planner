module.exports = {
  root: true,
  extends: [
    '@react-native',
    '@react-native/eslint-config',
  ],
  rules: {
    // Production-specific rules
    'no-console': 'error', // No console.log in production
    'no-debugger': 'error', // No debugger statements
    'no-alert': 'error', // No alert statements (use proper error handling)
    
    // Code quality
    'prefer-const': 'error',
    'no-var': 'error',
    'no-unused-vars': 'error',
    'no-undef': 'error',
    
    // React specific
    'react/prop-types': 'off', // Disable prop-types for React Native
    'react/react-in-jsx-scope': 'off', // Not needed in React Native
    'react/jsx-uses-react': 'off', // Not needed in React Native
    
    // React Native specific
    'react-native/no-unused-styles': 'error',
    'react-native/split-platform-components': 'error',
    'react-native/no-inline-styles': 'warn',
    'react-native/no-color-literals': 'warn',
    
    // Import rules
    'import/no-unresolved': 'off', // Disable for React Native
    'import/extensions': 'off', // Disable for React Native
    
    // General
    'semi': ['error', 'always'],
    'quotes': ['error', 'single'],
    'indent': ['error', 2],
    'comma-dangle': ['error', 'always-multiline'],
  },
  env: {
    'react-native/react-native': true,
    'es6': true,
    'node': true,
  },
  plugins: [
    'react',
    'react-native',
  ],
  settings: {
    'react': {
      'version': 'detect',
    },
  },
}; 