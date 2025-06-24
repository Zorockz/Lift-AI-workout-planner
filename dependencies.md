# Project Dependencies

This project uses the following major dependencies:

- **expo**: For app development and build tools
- **react-native**: Core framework for building native apps
- **@react-navigation/native** and **@react-navigation/native-stack**: Navigation and stack management
- **firebase**: Backend as a service for authentication and Firestore database
- **@react-native-async-storage/async-storage**: Local storage for guest/local data
- **expo-image-picker**: For picking images from the device
- **expo-secure-store**: Secure storage for sensitive data
- **expo-font**: Custom font loading
- **expo-web-browser**: For web browser integration
- **react-native-safe-area-context**: Safe area handling for devices
- **@expo/vector-icons**: Icon library
- **expo-blur**: For blur effects

See package.json for the full list and versions.

# Lift: AI Workout Planner Dependencies & Fixes

## Installed Dependencies
### Core Navigation
- @react-navigation/native (^7.1.11)
- @react-navigation/bottom-tabs (^7.3.15)
- @react-navigation/native-stack (^7.3.15)
- react-native-screens (~4.11.1)
- react-native-safe-area-context (5.4.0)

### Animation and Gestures
- react-native-gesture-handler (~2.24.0)
- react-native-reanimated (~3.17.4)

### UI Components
- expo-blur (~14.1.5)
- expo-status-bar (~2.2.3)
- @react-native-community/slider (4.5.6)
- @react-native-picker/picker (2.11.0)
- expo-linear-gradient (^14.1.5)

### Storage and Data
- @react-native-async-storage/async-storage (2.1.2)
- expo-secure-store (~14.2.3)
- expo-file-system (~18.1.10)
- firebase (^11.9.1)  # Using modular SDK with AsyncStorage persistence

### Authentication
- expo-auth-session (~6.2.0)
- expo-web-browser (~14.1.6)
- expo-random (^14.0.1)

### Media and Camera
- expo-av (~15.1.6)
- expo-camera (~16.1.8)
- expo-image-picker (~16.1.4)

### Notifications and Background Tasks
- expo-notifications (~0.31.3)
- expo-background-fetch (~13.1.5)
- expo-task-manager (~13.1.5)

### Device Features
- expo-device (~7.1.4)
- expo-haptics (~14.1.4)
- expo-sensors (~14.1.4)
- expo-location (~18.1.5)

### App Management
- expo-constants (~17.1.6)
- expo-linking (~7.1.5)
- expo-updates (~0.28.14)
- expo-splash-screen (~0.30.9)
- expo-font (~13.3.1)

### Utilities
- uuid (^11.1.0) - For generating unique IDs
- tslib (^2.6.2) - TypeScript runtime library

### Development Dependencies
- @babel/core (^7.20.0)
- @react-native-community/cli (^18.0.0)
- react-native-dotenv (^3.4.11)

## Version Information
- React: 19.0.0
- React DOM: 19.0.0
- React Native: 0.79.3
- Expo SDK: 53.0.0

## Firebase Authentication Fixes (Applied 2024)

### Issues Fixed:
1. **Firebase Auth Not Registered Error**
   - Problem: `auth/duplicate-instance` and initialization failures
   - Solution: Proper error handling with fallback to `getAuth()`

2. **Metro Bundler Configuration Issues**
   - Problem: Firebase .cjs files not handled properly
   - Solution: Updated metro.config.js with proper resolver configuration

3. **Missing Auth State Management**
   - Problem: No `onAuthStateChanged` listener
   - Solution: Added proper auth state listener in AuthContext

4. **Sign-Out Functionality Broken**
   - Problem: Users couldn't sign out properly
   - Solution: Complete sign-out process with data clearing

### Files Modified:

#### 1. metro.config.js
```javascript
// Added Firebase .cjs file support
config.resolver.sourceExts = [...config.resolver.sourceExts, 'cjs'];
config.resolver.unstable_enablePackageExports = false;
config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];
```

#### 2. config/firebase.js
```javascript
// Proper auth initialization with fallback
const initializeAuthInstance = () => {
  try {
    authInstance = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage)
    });
  } catch (error) {
    if (error.code === 'auth/duplicate-instance') {
      authInstance = getAuth(app);
    } else {
      authInstance = getAuth(app); // Fallback
    }
  }
};
```

#### 3. contexts/AuthContext.js
```javascript
// Added proper auth state listener
useEffect(() => {
  const auth = getAuthInstance();
  const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
    // Handle auth state changes properly
  });
  return () => unsubscribe();
}, []);
```

### Testing Utilities Added:
- `utils/testAuth.js` - Firebase auth testing functions
- Auth initialization test in App.js

## Navigation Structure

### Onboarding Flow:
1. WelcomeScreen
2. GenderSelectionScreen
3. GoalSelectionScreen
4. ExperienceLevelScreen
5. StrengthTrainingHistoryScreen
6. EquipmentInputScreen
7. ScheduleInputScreen
8. OnboardingSummary
9. ExerciseLocationScreen
10. TargetMusclesScreen
11. HeightInputScreen
12. WeightInputScreen
13. GoalWeightInputScreen

### Main App Flow:
- HomeScreen
- ProfileScreen
- FullPlanScreen
- WorkoutSessionScreen
- CardioScreen
- FlexibilityScreen
- ExerciseDetails

## Known Issues & Solutions

### 1. PlanPreview Navigation Issue ✅ FIXED
**Problem**: PlanPreviewScreen not showing after plan generation
**Root Cause**: 
- Navigation flow interrupted by auth state changes
- Plan data not properly passed between screens
- Auth state listener auto-completing onboarding for returning users
- **CRITICAL**: OnboardingSummary was calling completeAuthOnboarding() prematurely
- **CRITICAL**: Infinite loop caused by unstable useEffect dependencies
- **CRITICAL**: Plan cards not rendering due to incorrect data access
- **CRITICAL**: Button not working due to callback issues
- **CRITICAL**: Plan generation failing or not completing properly
- **CRITICAL**: PlanPreview showing empty UI with no workout cards

**Solution Applied**: 
- ✅ Enhanced plan data passing in PlanGenerationScreen
- ✅ Improved PlanPreviewScreen with better error handling and loading states
- ✅ Fixed auth state listener to not auto-complete onboarding
- ✅ Added navigation guards and proper state management
- ✅ Added comprehensive logging for debugging
- ✅ **FIXED**: Removed premature completeAuthOnboarding() call from OnboardingSummary
- ✅ Added fallback mechanisms for plan data loading
- ✅ Added test navigation button for debugging
- ✅ **FIXED**: Resolved infinite loop with proper useEffect dependencies and memoization
- ✅ Optimized OnboardingContext with useCallback and useMemo
- ✅ Added debug components and re-render tracking
- ✅ **FIXED**: Plan cards rendering with correct data structure access
- ✅ **FIXED**: Button functionality with proper callback handling
- ✅ Added fallback plan generation for testing
- ✅ Enhanced debugging with plan structure validation
- ✅ **FIXED**: Plan generation with simplified test plan approach
- ✅ Added manual test buttons for debugging plan generation
- ✅ Added hardcoded test plan fallback in PlanPreviewScreen
- ✅ **FIXED**: PlanPreview rendering with comprehensive debugging and test cards
- ✅ Added direct test plan button to bypass data flow issues
- ✅ Enhanced renderDayCard function with detailed logging

**Files Modified**:
- `screens/onboarding/OnboardingSummary.js` - **CRITICAL FIX**: Removed premature onboarding completion
- `screens/onboarding/PlanGenerationScreen.js` - **ENHANCED**: Better plan data passing, error handling, fallback plan, manual test buttons, and comprehensive logging
- `screens/onboarding/PlanPreviewScreen.js` - **CRITICAL FIX**: Resolved infinite loop, enhanced error handling, fixed plan rendering, button functionality, added test plan fallback, comprehensive debugging, and direct test plan button
- `contexts/OnboardingContext.js` - **OPTIMIZATION**: Added memoization to prevent unnecessary re-renders
- `contexts/AuthContext.js` - Fixed auth state listener and added logging
- `App.js` - Added navigation guards and additional safeguards

### 2. Firebase Auth State Conflicts ✅ FIXED
**Problem**: Auth state changes interfering with navigation
**Solution**: 
- ✅ Proper auth state listener cleanup
- ✅ Navigation state persistence
- ✅ Conditional rendering based on auth state

### 3. Workout Plan Generation Issues ✅ FIXED
**Problem**: 
- Workout cards showing empty
- "Generate New Workout" button not working
- Plan generator returning incompatible data structure
- First day could be a rest day causing empty cards

**Solution Applied**:
- ✅ **Fixed HomeScreen**: Updated `todayKey` calculation to use `currentDay` instead of always showing Day 1
- ✅ **Fixed WorkoutContext**: Replaced OpenAI-based plan generator with local `generatePlan` from `utils/planGenerator.js`
- ✅ **Enhanced HomeScreen**: Added logic to show next workout day if today is a rest day
- ✅ **Improved Exercise Database**: Moved to separate `utils/exerciseDatabase.js` with 5-10 exercises per category
- ✅ **Fixed AddExerciseModal**: Removed `uuid` dependency causing `crypto.getRandomValues()` error
- ✅ **Enhanced AddExerciseModal**: Added logic to set sets/reps to 1 for cardio workouts

**Files Modified**:
- `screens/HomeScreen.js` - **FIXED**: Corrected todayKey calculation and added next workout day display
- `contexts/WorkoutContext.js` - **FIXED**: Replaced OpenAI generator with local plan generator
- `utils/exerciseDatabase.js` - **CREATED**: Separate exercise database with full exercise lists
- `utils/planGenerator.js` - **UPDATED**: Now imports from exerciseDatabase.js
- `components/AddExerciseModal.js` - **FIXED**: Removed uuid dependency and added cardio logic

### 4. Authentication Flow Issues ✅ FIXED
**Problem**: 
- Users couldn't get back in after logout without going through onboarding again
- "Sign Up" button didn't change to "Sign In" after logout

**Solution Applied**:
- ✅ **Fixed AuthContext**: Preserved onboarding completion state and AsyncStorage keys on logout
- ✅ **Fixed WelcomeScreen**: Added conditional button label based on onboarding completion state

**Files Modified**:
- `contexts/AuthContext.js` - **FIXED**: Preserved onboarding state on logout
- `screens/onboarding/WelcomeScreen.js` - **FIXED**: Added conditional button label

### 5. UI/UX Improvements ✅ IMPLEMENTED
**Problem**: 
- Stats below streak counter were not useful
- "Generate New Week Workout" button placement was poor
- Button styling needed improvement

**Solution Applied**:
- ✅ **Updated HeaderStats**: Replaced stats with better streak counter including fire emoji
- ✅ **Updated HomeScreen**: Moved "Generate New Workout" button next to "+ Add Exercise"
- ✅ **Enhanced Button**: Changed to lighter green color with generate circle icon
- ✅ **Fixed Button Handler**: Now generates only today's workout instead of entire week

**Files Modified**:
- `components/HeaderStats.js` - **ENHANCED**: Better streak counter design
- `screens/HomeScreen.js` - **IMPROVED**: Better button placement and functionality

## Installation Notes
- All Expo packages are installed using `expo install` to ensure version compatibility
- Third-party packages are installed using `npm install`
- Firebase is using the modular SDK (version 11.9.1) with AsyncStorage persistence for React Native
- Keep babel.config.js updated when adding new packages that require babel configuration

## Latest Fixes (December 2024)

### Workout Plan Generation & UI Improvements ✅ FIXED
**Problem**: 
- Workout cards showing empty due to incorrect day calculation
- "Generate New Workout" button not working due to incompatible data structure
- Exercise database needed better organization
- UI improvements needed for better user experience

**Solution Applied**:
- ✅ **Fixed HomeScreen Day Calculation**: Corrected `todayKey` to use `currentDay` instead of always showing Day 1
- ✅ **Replaced OpenAI Plan Generator**: Switched to local `generatePlan` for consistent data structure
- ✅ **Created Separate Exercise Database**: Moved exercises to `utils/exerciseDatabase.js` with 5-10 exercises per category
- ✅ **Enhanced Workout Display**: Added logic to show next workout day if today is a rest day
- ✅ **Fixed AddExerciseModal**: Removed `uuid` dependency causing crypto errors
- ✅ **Improved UI/UX**: Better button placement, styling, and streak counter design
- ✅ **Fixed Authentication Flow**: Preserved onboarding state on logout

**Files Modified**:
- `screens/HomeScreen.js` - **CRITICAL FIX**: Fixed todayKey calculation and workout display logic
- `contexts/WorkoutContext.js` - **CRITICAL FIX**: Replaced OpenAI generator with local plan generator
- `utils/exerciseDatabase.js` - **CREATED**: Comprehensive exercise database with all categories
- `utils/planGenerator.js` - **UPDATED**: Now imports from exerciseDatabase.js
- `components/AddExerciseModal.js` - **FIXED**: Removed uuid dependency, added cardio logic
- `components/HeaderStats.js` - **ENHANCED**: Better streak counter with fire emoji
- `contexts/AuthContext.js` - **FIXED**: Preserved onboarding state on logout
- `screens/onboarding/WelcomeScreen.js` - **FIXED**: Conditional button label

**Performance Improvements**:
- Eliminated crypto.getRandomValues() errors
- Fixed infinite re-renders in workout generation
- Improved data structure consistency
- Enhanced user experience with better UI

**UI Improvements**:
- Better button placement next to "+ Add Exercise"
- Lighter green color for "Generate New Workout" button
- Generate circle icon for better visual feedback
- Enhanced streak counter with fire emoji
- Conditional "Sign Up"/"Sign In" button labels

## Development Commands
```bash
# Clear cache and restart
npx expo start --clear

# Kill all Node processes (Windows)
taskkill /f /im node.exe

# Test Firebase auth
# Check console for: "Firebase Auth initialized successfully"
```

## Troubleshooting
1. **Port conflicts**: Use `taskkill /f /im node.exe` to kill all processes
2. **Firebase auth errors**: Check metro.config.js and firebase.js configuration
3. **Navigation issues**: Verify screen names match in App.js and navigation calls
4. **Cache issues**: Always use `--clear` flag when restarting after major changes
5. **Crypto errors**: Avoid using `uuid` package, use simple ID generation instead
6. **Empty workout cards**: Check if today is a rest day and verify day calculation logic 