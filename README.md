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

## License

Private - All rights reserved 