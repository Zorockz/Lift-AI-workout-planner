# Lift AI: Workout Planner

A React Native fitness app with AI-powered workout planning and Google/Apple Sign-In.

## 🚨 Recent Issues & Fixes

### Problem 1: Blank Screen Issue ✅ FIXED
**Issue**: App showed blank screen when running with `npx expo start --dev-client`
**Root Cause**: App uses native modules (Firebase, Apple Sign-In, etc.) that require a development build, not Expo Go
**Solution**: Created a proper development build using EAS Build

**Steps taken:**
1. Installed EAS CLI: `npm install -g eas-cli`
2. Created development build: `EXPO_NO_CAPABILITY_SYNC=1 eas build --platform ios --profile development`
3. App now works properly with all native functionality

### Problem 2: Authentication Not Working ⚠️ PARTIALLY FIXED
**Issue**: Both Google and Apple Sign-In failing after development build
**Root Causes Identified:**
- Incorrect redirect URI configuration for development builds
- Missing nonce parameter in Apple Sign-In
- Wrong Firebase credential provider for Google Auth

**Fixes Applied:**
1. **Updated `services/authService.js`:**
   - Fixed Google Auth to use `GoogleAuthProvider` instead of `OAuthProvider`
   - Added proper nonce handling for Apple Sign-In
   - Updated redirect URI to use app scheme (`liftaiworkoutplanner://`)
   - Added better error handling and logging
   - Fixed platform-specific client ID handling

2. **Updated `app.json`:**
   - Removed outdated `authSession` proxy configuration
   - Added proper URL scheme for authentication redirects
   - Updated `CFBundleURLTypes` to handle app-specific schemes

**Still Need To Do:**
- [ ] Create new development build with authentication fixes
- [ ] Test Google Sign-In on device
- [ ] Test Apple Sign-In on device
- [ ] Verify Firebase authentication flow

## Features

- 🔐 **Secure Authentication**: Google & Apple Sign-In with Firebase
- 🤖 **AI Workout Planning**: Personalized workout plans using OpenAI
- 📱 **Cross-Platform**: iOS, Android, and Web support
- 🎯 **Goal Tracking**: Progress monitoring and achievement tracking
- 💪 **Exercise Library**: Comprehensive exercise database

## Quick Start

### Prerequisites
```bash
# Install Node.js with NVM (recommended)
export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Install EAS CLI for building
npm install -g eas-cli
```

### Development Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure Firebase**
   - Add your Firebase config to `config/firebase.js`
   - Enable Google & Apple Sign-In in Firebase Console

3. **Set up environment variables**
   ```bash
   # Create .env file
   OPENAI_KEY=your_openai_api_key
   ```

4. **Run the app**
   ```bash
   # For development (requires development build)
   npx expo start --dev-client --host lan
   
   # Note: This app requires a development build, not Expo Go
   ```

### Building for Device

**Create Development Build:**
```bash
# iOS Development Build
EXPO_NO_CAPABILITY_SYNC=1 eas build --platform ios --profile development

# Android Development Build  
EXPO_NO_CAPABILITY_SYNC=1 eas build --platform android --profile development
```

**Production Builds:**
```bash
# iOS Production
eas build --platform ios --profile production

# Android Production
eas build --platform android --profile production
```

## Project Structure

```
├── App.js                 # Main app component & navigation
├── AppEntry.js            # App entry point for Expo
├── config/
│   └── firebase.js        # Firebase & app configuration
├── contexts/
│   ├── AuthContext.js     # Authentication state management
│   ├── OnboardingContext.js # Onboarding flow state
│   └── WorkoutContext.js  # Workout data management
├── services/
│   ├── authService.js     # Google & Apple authentication ⚠️ Recently Fixed
│   └── appService.js      # User & OpenAI services
├── screens/               # App screens
│   ├── onboarding/        # Onboarding flow screens
│   ├── HomeScreen.js      # Main dashboard
│   ├── ProfileScreen.js   # User profile
│   ├── WorkoutSessionScreen.js # Active workout
│   └── ...
├── components/            # Reusable UI components
├── utils/
│   ├── styles.js          # Styles & constants
│   ├── planGenerator.js   # Workout plan generation
│   └── exerciseDatabase.js # Exercise data
├── assets/               # Images & icons
├── eas.json              # EAS Build configuration
└── app.json              # Expo app configuration ⚠️ Recently Updated
```

## Authentication

The app supports both Google and Apple Sign-In:

- **Google Sign-In**: Uses Expo Auth Session with Firebase (`GoogleAuthProvider`)
- **Apple Sign-In**: Native iOS integration with Firebase (`OAuthProvider`)
- **Guest Mode**: Continue without authentication

### Authentication Configuration

**Recent Changes Made:**
- Fixed redirect URI to use app scheme: `liftaiworkoutplanner://`
- Updated Firebase providers for better compatibility
- Added proper nonce handling for Apple Sign-In
- Improved error handling and logging

**URL Schemes Configured:**
- Google: `com.googleusercontent.apps.455544394958-5t0jo86dpiu6kruh6lrg4jbcl0vk7dnu`
- App: `liftaiworkoutplanner`

## Technologies

- **React Native** with Expo
- **Firebase** Authentication & Firestore
- **OpenAI API** for workout planning
- **AsyncStorage** for local data persistence
- **EAS Build** for native development builds

## Troubleshooting

### Common Issues

1. **Blank Screen**
   - ✅ **Fixed**: Use development build instead of Expo Go
   - This app requires native modules, use EAS Build

2. **Authentication Failing**
   - ⚠️ **In Progress**: Need to test new authentication fixes
   - Check console logs for specific error messages
   - Ensure Firebase project has Google/Apple Sign-In enabled

3. **Build Errors**
   - Use `EXPO_NO_CAPABILITY_SYNC=1` flag to disable capability syncing
   - Check Apple Developer Console for provisioning profile issues

### Development Commands

```bash
# Start development server
export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" && npx expo start --dev-client --host lan

# Clean and restart
npx expo r -c

# View build logs
eas build:list

# Install development build on device
# Scan QR code from build completion or visit EAS build URL
```

## Next Steps

### Immediate Actions Needed:
1. **Create New Development Build** with authentication fixes
   ```bash
   EXPO_NO_CAPABILITY_SYNC=1 eas build --platform ios --profile development
   ```

2. **Test Authentication** on physical device
   - Test Google Sign-In flow
   - Test Apple Sign-In flow
   - Verify Firebase user creation

3. **Validate Core Features**
   - Onboarding flow completion
   - Workout plan generation
   - Data persistence

### Future Improvements:
- [ ] Add Android authentication testing
- [ ] Implement proper error boundaries
- [ ] Add authentication unit tests
- [ ] Set up CI/CD pipeline
- [ ] Add monitoring and crash reporting

## Dependencies

- expo: 53.0.13
- react: 19.0.0
- react-native: 0.79.4
- firebase: ^11.9.1
- expo-auth-session: ~6.2.0
- expo-apple-authentication: ^7.2.4
- expo-dev-client: ~5.2.1
- react-native-purchases: ^8.11.6
- @react-navigation/native: ^7.1.11
- @react-navigation/bottom-tabs: ^7.3.15
- @react-navigation/native-stack: ^7.3.15
- @react-native-async-storage/async-storage: 2.1.2
- @react-native-community/slider: 4.5.6
- @react-native-picker/picker: 2.11.1
- expo-camera: ~16.1.9
- expo-image-picker: ~16.1.4
- expo-location: ~18.1.5
- expo-notifications: ~0.31.3
- expo-sensors: ~14.1.4
- expo-haptics: ~14.1.4
- expo-linear-gradient: ^14.1.5
- expo-blur: ~14.1.5
- expo-font: ~13.3.1
- expo-status-bar: ~2.2.3
- expo-splash-screen: ~0.30.9
- expo-updates: ~0.28.15
- expo-web-browser: ~14.2.0
- expo-constants: ~17.1.6
- expo-file-system: ~18.1.10
- expo-secure-store: ~14.2.3
- expo-background-fetch: ~13.1.5
- expo-task-manager: ~13.1.5
- expo-random: ^14.0.1
- expo-crypto: ^14.1.5
- expo-linking: ~7.1.5
- react-native-gesture-handler: ~2.24.0
- react-native-reanimated: ~3.17.4
- react-native-safe-area-context: 5.4.0
- react-native-screens: ~4.11.1
- uuid: ^11.1.0
- tslib: ^2.6.2

**Development Tools Installed:**
- `eas-cli`: Global installation for building native apps

## License

Private - All rights reserved 