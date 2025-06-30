# Lifts AI - Workout Planner

A comprehensive React Native workout planning app that uses AI to create personalized fitness routines.

## Features

- 🤖 AI-powered workout generation
- 📱 Cross-platform (iOS, Web)
- 🔐 Secure authentication with Firebase
- 📊 Progress tracking
- 🎯 Personalized goals
- 🏋️ Multiple workout types (Strength, Cardio, Flexibility)

## Tech Stack

- **Frontend**: React Native 0.79.4, Expo SDK 53
- **Authentication**: Firebase Auth
- **Navigation**: React Navigation 7
- **State Management**: React Context API
- **Styling**: React Native StyleSheet

## Project Structure

```
Lifts AI/
├── components/          # Reusable UI components
├── contexts/           # React Context providers
├── hooks/              # Custom React hooks
├── screens/            # App screens
│   └── onboarding/     # Onboarding flow screens
├── services/           # API and service functions
├── utils/              # Utility functions and constants
├── config/             # Configuration files
└── assets/             # Images and static assets
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Lifts-AI
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   OPENAI_KEY=your_openai_api_key
   ```

4. **Configure Firebase**
   - Follow the [Firebase Setup Guide](FIREBASE_SETUP_GUIDE.md)
   - Add your Firebase configuration files

5. **Start the development server**
   ```bash
   npm start
   ```

6. **Run on device/simulator**
   ```bash
   # iOS
   npm run ios
   
   # Android
   npm run android
   ```

## 🔧 Development

### Available Scripts

- `npm start` - Start Expo development server
- `npm run ios` - Run on iOS simulator
- `npm run android` - Run on Android emulator
- `npm run web` - Run on web browser
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run format` - Format code with Prettier
- `npm run test` - Run tests
- `npm run build:android` - Build Android APK
- `npm run build:ios` - Build iOS app

### Code Quality

This project follows strict code quality standards:

- **ESLint** for code linting
- **Prettier** for code formatting
- **React Native best practices**
- **Clean architecture principles**
- **Comprehensive error handling**

### Recent Improvements

✅ **Code Cleanup & Refactoring (Latest)**
- Removed unused screens and components
- Cleaned up debugging code and console statements
- Improved error handling throughout the app
- Added proper logging utility
- Centralized constants and configuration
- Removed unused dependencies
- Enhanced code organization and maintainability

✅ **Authentication System**
- Firebase Authentication integration
- Email/password sign up and sign in
- Guest mode support
- Secure token management
- Email verification flow

✅ **Onboarding Flow**
- 13-step comprehensive onboarding
- User preference collection
- Goal setting and experience level
- Equipment and location preferences
- Target muscle selection
- Workout schedule planning

✅ **Workout Management**
- AI-powered workout generation
- Personalized exercise recommendations
- Progress tracking and completion
- Offline workout support
- Cloud synchronization

## 🔐 Authentication

The app supports multiple authentication methods:

- **Email/Password**: Traditional sign up and sign in
- **Guest Mode**: Use app without account creation
- **Firebase Integration**: Secure cloud authentication

See [Authentication Guide](AUTHENTICATION_GUIDE.md) for detailed setup instructions.

## 🗄️ Database Schema

### Users Collection
```javascript
users/{userId}/
├── profile/           # User profile information
├── logs/              # Workout completion logs
└── preferences/       # User preferences and settings
```

### Workout Plans
- Stored locally with AsyncStorage
- Cloud sync for authenticated users
- Offline-first architecture

## 🎨 UI/UX Design

- **Modern Design**: Clean, minimalist interface
- **Accessibility**: WCAG compliant components
- **Responsive**: Works on all screen sizes
- **Dark/Light Mode**: Theme support (planned)
- **Animations**: Smooth transitions and micro-interactions

## 📊 Performance

- **Bundle Size**: Optimized for fast loading
- **Memory Usage**: Efficient state management
- **Offline Support**: Full functionality without internet
- **Caching**: Smart data caching strategies

## 🧪 Testing

- **Unit Tests**: Component and utility testing
- **Integration Tests**: API and service testing
- **E2E Tests**: Full user flow testing (planned)

## 🚀 Deployment

### Android
1. Build APK: `npm run build:android`
2. Upload to Google Play Console

### iOS
1. Build app: `npm run build:ios`
2. Upload to App Store Connect

### Web
1. Build web version: `npm run web`
2. Deploy to hosting service

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Run tests: `npm test`
5. Commit changes: `git commit -m 'Add feature'`
6. Push to branch: `git push origin feature-name`
7. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- OpenAI for AI workout generation
- Firebase for backend services
- Expo for the development platform
- React Native community for excellent tools and libraries

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the setup guides

---

**Built with ❤️ using React Native and Expo** 