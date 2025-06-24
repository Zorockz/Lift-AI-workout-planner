# Lift AI: Workout Planner

A comprehensive fitness app built with React Native and Expo that provides personalized workout plans, exercise tracking, and progress monitoring.

## Features

- 🤖 **AI-Powered Workout Plans**: Personalized workout plans based on your goals, experience level, and available equipment
- 🏋️ **Exercise Database**: Comprehensive database with 5-10 exercises per category (strength, cardio, maintain)
- 📊 **Progress Tracking**: Track your workouts, sets, reps, and progress over time
- 🔐 **Secure Authentication**: Google Sign-In with Firebase Authentication
- 📱 **Cross-Platform**: Works on iOS, Android, and Web
- 🏠 **Location Flexibility**: Workout plans for both gym and home environments
- 📈 **Progress Analytics**: Visual progress tracking and streak counting

## Tech Stack

- **Frontend**: React Native 0.79.3, Expo SDK 53
- **Backend**: Firebase (Authentication, Firestore)
- **Navigation**: React Navigation 7
- **State Management**: React Context API
- **Storage**: AsyncStorage, Firebase Firestore
- **UI Components**: Custom components with Expo Vector Icons

## Prerequisites

- Node.js >= 18.0.0
- npm >= 8.0.0
- Expo CLI
- Firebase project setup
- Google Cloud Console project for OAuth

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Zorockz/Lift-AI-workout-planner.git
   cd Lift-AI-workout-planner
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication (Google Sign-In)
   - Enable Firestore Database
   - Update `config/firebase.js` with your Firebase config

4. **Set up Google OAuth**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create OAuth 2.0 credentials
   - Update `app.json` with your client IDs

5. **Start development server**
   ```bash
   npm start
   ```

## Development

### Available Scripts

- `npm start` - Start Expo development server
- `npm run android` - Run on Android device/emulator
- `npm run ios` - Run on iOS device/simulator
- `npm run web` - Run on web browser
- `npm run clean` - Clear cache and restart
- `npm run lint` - Run ESLint
- `npm test` - Run tests

### Project Structure

```
Lift AI/
├── components/          # Reusable UI components
├── contexts/           # React Context providers
├── screens/            # App screens
│   └── onboarding/     # Onboarding flow screens
├── utils/              # Utility functions and data
├── config/             # Configuration files
├── services/           # API and external services
├── assets/             # Images, fonts, and static assets
└── docs/               # Documentation and legal files
```

## Production Deployment

### 1. Pre-deployment Checklist

- [ ] Remove all `console.log` statements
- [ ] Set development flags to `false`
- [ ] Update app version and build numbers
- [ ] Configure error reporting (Sentry)
- [ ] Test on physical devices
- [ ] Verify all permissions are properly configured

### 2. Build for Production

#### Android
```bash
# Build APK
npm run build:android

# Or build AAB for Google Play Store
expo build:android --type app-bundle
```

#### iOS
```bash
# Build for iOS
npm run build:ios

# Or build for App Store
expo build:ios --type archive
```

### 3. Publish to Stores

#### Google Play Store
1. Create a Google Play Console account
2. Upload your AAB file
3. Fill in store listing information
4. Submit for review

#### Apple App Store
1. Create an Apple Developer account
2. Upload your IPA file via Xcode or App Store Connect
3. Fill in store listing information
4. Submit for review

### 4. Environment Configuration

The app uses different configurations for development and production:

- **Development**: Debug logging enabled, development Firebase project
- **Production**: Debug logging disabled, production Firebase project

## Firebase Setup

### 1. Authentication
- Enable Google Sign-In
- Configure OAuth consent screen
- Add authorized domains

### 2. Firestore Database
- Set up security rules
- Create indexes for queries
- Configure backup and retention policies

### 3. Security Rules
```javascript
// Example Firestore security rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Error Handling

The app includes comprehensive error handling:

- **Error Boundary**: Catches and displays React errors
- **Firebase Error Handling**: Graceful fallbacks for auth and database errors
- **Network Error Handling**: Offline support and retry mechanisms
- **User Feedback**: Clear error messages and recovery options

## Performance Optimization

- **Lazy Loading**: Screens and components loaded on demand
- **Image Optimization**: Compressed assets and lazy loading
- **Memory Management**: Proper cleanup of listeners and subscriptions
- **Bundle Optimization**: Tree shaking and code splitting

## Security

- **Authentication**: Secure Google OAuth implementation
- **Data Encryption**: Sensitive data stored in SecureStore
- **Input Validation**: All user inputs validated and sanitized
- **API Security**: Firebase security rules and authentication

## Testing

### Manual Testing Checklist

- [ ] Authentication flow (sign in/out)
- [ ] Onboarding process
- [ ] Workout plan generation
- [ ] Exercise tracking
- [ ] Progress saving
- [ ] Offline functionality
- [ ] Error handling
- [ ] Performance on low-end devices

### Automated Testing

```bash
# Run tests
npm test

# Run linting
npm run lint
```

## Troubleshooting

### Common Issues

1. **Firebase Auth Errors**
   - Check Firebase configuration
   - Verify OAuth credentials
   - Clear app cache

2. **Build Errors**
   - Update Expo SDK
   - Clear node_modules and reinstall
   - Check platform-specific requirements

3. **Performance Issues**
   - Enable Hermes engine
   - Optimize images and assets
   - Review bundle size

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support and questions:
- Create an issue on GitHub
- Check the [documentation](docs/)
- Review [troubleshooting guide](docs/troubleshooting.md)

## Changelog

### Version 1.0.0 (Current)
- Initial production release
- Complete workout planning system
- Google authentication
- Cross-platform support
- Comprehensive exercise database 