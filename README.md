# Lift AI - Workout Planner

A modern, AI-powered fitness app built with React Native and Expo that creates personalized workout plans based on user preferences and goals.

## 🚀 Features

- **AI-Powered Workout Generation**: Personalized workout plans based on goals, experience, and equipment
- **Comprehensive Onboarding**: 13-step onboarding process to gather user preferences
- **Multiple Workout Types**: Strength, cardio, flexibility, HIIT, and more
- **Progress Tracking**: Track workouts, streaks, and progress over time
- **Offline Support**: Works without internet connection
- **Firebase Integration**: Cloud sync for workout data and user profiles
- **Modern UI/UX**: Clean, intuitive interface with smooth animations

## 🛠 Tech Stack

- **Frontend**: React Native 0.79.4, Expo SDK 53
- **Navigation**: React Navigation 7
- **State Management**: React Context API
- **Backend**: Firebase (Auth, Firestore, Storage)
- **Styling**: React Native StyleSheet
- **Icons**: Expo Vector Icons
- **Storage**: AsyncStorage for local data persistence

## 📱 Screenshots

[Add screenshots here]

## 🏗 Project Structure

```
Lift AI/
├── components/          # Reusable UI components
├── contexts/           # React Context providers
├── screens/            # Screen components
│   └── onboarding/     # Onboarding flow screens
├── services/           # API and service functions
├── utils/              # Utility functions and constants
├── config/             # Configuration files
├── hooks/              # Custom React hooks
└── assets/             # Images and static assets
```

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm >= 8.0.0
- Expo CLI
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd lift-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your Firebase and API keys
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Run on device/simulator**
   ```bash
   # iOS
   npm run ios
   
   # Android
   npm run android
   
   # Web
   npm run web
   ```

## 🔧 Development Scripts

```bash
# Development
npm start              # Start Expo development server
npm run ios           # Run on iOS simulator
npm run android       # Run on Android emulator
npm run web           # Run on web browser

# Building
npm run build:android # Build Android APK
npm run build:ios     # Build iOS app

# Code Quality
npm run lint          # Run ESLint
npm run lint:fix      # Fix ESLint issues
npm run format        # Format code with Prettier
npm run format:check  # Check code formatting

# Testing
npm test              # Run tests
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Run tests with coverage

# Utilities
npm run clean         # Clear cache and restart
npm run doctor        # Check for common issues
npm run analyze       # Analyze bundle size
```

## 🔥 Firebase Setup

1. **Create a Firebase project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Enable Authentication and Firestore

2. **Configure Firebase**
   - Download `google-services.json` (Android) and `GoogleService-Info.plist` (iOS)
   - Place them in the project root
   - Update Firebase configuration in `config/firebase.js`

3. **Set up Firestore rules**
   - Copy `firestore.rules` to your Firebase project
   - Deploy the rules

## 📱 App Architecture

### State Management
- **AuthContext**: Handles user authentication and session management
- **OnboardingContext**: Manages onboarding flow and user preferences
- **WorkoutContext**: Manages workout plans and exercise data

### Navigation Structure
```
App
├── AuthStack (Unauthenticated)
│   ├── Welcome
│   ├── SignIn
│   └── CreateAccount
├── OnboardingStack
│   ├── GenderSelection
│   ├── GoalSelection
│   ├── ExperienceLevel
│   ├── EquipmentInput
│   ├── ScheduleInput
│   ├── ExerciseLocation
│   ├── TargetMuscles
│   ├── HeightInput
│   ├── WeightInput
│   ├── GoalWeightInput
│   ├── AccountCreation
│   ├── OnboardingSummary
│   └── PlanPreview
└── MainStack (Authenticated)
    ├── Home
    ├── Profile
    ├── WorkoutSession
    ├── FullPlan
    ├── CardioScreen
    └── FlexibilityScreen
```

## 🎨 UI/UX Design

The app follows modern design principles with:
- **Clean, minimalist interface**
- **Consistent color scheme** (primary: #007AFF)
- **Smooth animations and transitions**
- **Accessible design patterns**
- **Responsive layout for different screen sizes**

## 🔒 Security

- **Firebase Authentication** for secure user management
- **Firestore Security Rules** for data protection
- **Input validation** on all user inputs
- **Secure storage** for sensitive data
- **Error handling** without exposing sensitive information

## 📊 Performance

- **Lazy loading** for workout generation
- **Optimized images** and assets
- **Efficient state management**
- **Minimal bundle size**
- **Offline-first architecture**

## 🧪 Testing

The app includes comprehensive testing:
- **Unit tests** for utility functions
- **Component tests** for UI components
- **Integration tests** for user flows
- **E2E tests** for critical paths

Run tests with:
```bash
npm test
```

## 📦 Deployment

### Android
1. Build the app: `npm run build:android`
2. Upload to Google Play Console
3. Configure release signing

### iOS
1. Build the app: `npm run build:ios`
2. Upload to App Store Connect
3. Configure certificates and provisioning profiles

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@liftai.com or create an issue in this repository.

## 🔄 Changelog

### v1.0.0 (Current)
- Initial release
- Complete onboarding flow
- AI-powered workout generation
- Firebase integration
- Offline support
- Modern UI/UX design

## 🙏 Acknowledgments

- React Native community
- Expo team
- Firebase team
- All contributors and beta testers 