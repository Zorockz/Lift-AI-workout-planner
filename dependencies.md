# FitnessPal Dependencies

## Core Dependencies
- ✅ @react-navigation/native
- ✅ @react-navigation/bottom-tabs
- ✅ @react-navigation/native-stack
- ✅ react-native-screens
- ✅ react-native-safe-area-context
- ✅ react-native-gesture-handler
- ✅ react-native-reanimated
- ✅ expo-status-bar
- ✅ expo-blur
- ✅ @react-native-async-storage/async-storage
- ✅ @react-native-community/slider
- ✅ @react-native-picker/picker
- ✅ @expo/vector-icons

## Development Dependencies
- ✅ react-native-dotenv

## Required Dependencies (Not Yet Installed)
- expo-linear-gradient (for gradient backgrounds)
- expo-image-picker (for profile image uploads)
- expo-notifications (for workout reminders)
- expo-calendar (for workout scheduling)
- expo-haptics (for haptic feedback)
- expo-sharing (for sharing workout plans)
- expo-file-system (for saving workout data)
- expo-secure-store (for secure storage of sensitive data)
- expo-device (for device-specific features)
- expo-constants (for app configuration)
- expo-linking (for deep linking)
- expo-updates (for OTA updates)
- expo-splash-screen (for splash screen management)
- expo-font (for custom fonts)
- expo-av (for audio/video features)
- expo-camera (for exercise form checking)
- expo-sensors (for workout tracking)
- expo-location (for outdoor workout tracking)
- expo-background-fetch (for background tasks)
- expo-task-manager (for background tasks)

## Optional Dependencies (Consider Adding)
- react-native-chart-kit (for progress visualization)
- react-native-svg (for custom graphics)
- react-native-maps (for outdoor workout tracking)
- react-native-calendars (for workout scheduling)
- react-native-modal (for custom modals)
- react-native-animatable (for additional animations)
- react-native-sound (for audio feedback)
- react-native-video (for exercise tutorials)
- react-native-camera (for exercise form checking)
- react-native-fitness (for health data integration)
- react-native-health (for health data integration)
- react-native-google-signin (for Google authentication)
- react-native-facebook-login (for Facebook authentication)
- react-native-apple-authentication (for Apple authentication)

## Version Information
Current React version: 19.0.0
Current React DOM version: 19.0.0
Current React Native version: (from Expo SDK)

## Installation Commands
```bash
# Core Navigation
expo install @react-navigation/native @react-navigation/bottom-tabs @react-navigation/native-stack react-native-screens react-native-safe-area-context

# Animation and Gestures
expo install react-native-gesture-handler react-native-reanimated

# UI Components
expo install expo-blur expo-status-bar @react-native-community/slider @react-native-picker/picker

# Storage
expo install @react-native-async-storage/async-storage expo-secure-store expo-file-system

# Media
expo install expo-image-picker expo-av expo-camera

# Notifications and Background Tasks
expo install expo-notifications expo-background-fetch expo-task-manager

# Device Features
expo install expo-device expo-haptics expo-sensors expo-location

# App Management
expo install expo-constants expo-linking expo-updates expo-splash-screen expo-font

# Development
npm install --save-dev react-native-dotenv
```

## Notes
- All Expo packages should be installed using `expo install` to ensure version compatibility
- Third-party packages should be installed using `npm install` or `yarn add`
- Always check for version conflicts, especially with React and React Native versions
- Keep the babel.config.js updated when adding new packages that require babel configuration 