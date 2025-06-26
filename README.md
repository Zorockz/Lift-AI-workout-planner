# Lift AI: Workout Planner

A React Native fitness app with AI-powered workout planning and Google/Apple Sign-In.

## Features

- 🔐 **Secure Authentication**: Google & Apple Sign-In with Firebase
- 🤖 **AI Workout Planning**: Personalized workout plans using OpenAI
- 📱 **Cross-Platform**: iOS, Android, and Web support
- 🎯 **Goal Tracking**: Progress monitoring and achievement tracking
- 💪 **Exercise Library**: Comprehensive exercise database

## Quick Start

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
   # Development
   expo start
   
   # Build for production
   expo build:ios
   expo build:android
   ```

## Project Structure

```
├── App.js                 # Main app component
├── config/
│   └── firebase.js        # Firebase & app configuration
├── contexts/
│   ├── AuthContext.js     # Authentication state management
│   └── OnboardingContext.js
├── services/
│   ├── authService.js     # Google & Apple authentication
│   └── appService.js      # User & OpenAI services
├── screens/               # App screens
├── components/            # Reusable components
├── utils/
│   ├── styles.js          # Styles & constants
│   ├── planGenerator.js   # Workout plan generation
│   └── exerciseDatabase.js
└── assets/               # Images & icons
```

## Authentication

The app supports both Google and Apple Sign-In:

- **Google Sign-In**: Uses Expo Auth Session with Firebase
- **Apple Sign-In**: Native iOS integration with Firebase
- **Guest Mode**: Continue without authentication

## Technologies

- **React Native** with Expo
- **Firebase** Authentication & Firestore
- **OpenAI API** for workout planning
- **AsyncStorage** for local data persistence

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

## License

Private - All rights reserved 