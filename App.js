import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { OnboardingProvider } from './contexts/OnboardingContext';
import { WorkoutProvider } from './contexts/WorkoutContext';
import ErrorBoundary from './components/ErrorBoundary';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { View, ActivityIndicator, Text, Platform } from 'react-native';
import React from 'react';
import Purchases from 'react-native-purchases';
import { REV_CAT_IOS } from '@env';

// Onboarding Screens
import WelcomeScreen from './screens/onboarding/WelcomeScreen';
import GenderSelectionScreen from './screens/onboarding/GenderSelectionScreen';
import GoalSelectionScreen from './screens/onboarding/GoalSelectionScreen';
import ExperienceLevelScreen from './screens/onboarding/ExperienceLevelScreen';
import StrengthTrainingHistoryScreen from './screens/onboarding/StrengthTrainingHistoryScreen';
import EquipmentInputScreen from './screens/onboarding/EquipmentInputScreen';
import ScheduleInputScreen from './screens/onboarding/ScheduleInputScreen';
import OnboardingSummary from './screens/onboarding/OnboardingSummary';
import PlanPreviewScreen from './screens/onboarding/PlanPreviewScreen';
import ExerciseLocationScreen from './screens/onboarding/ExerciseLocationScreen';
import TargetMusclesScreen from './screens/onboarding/TargetMusclesScreen';
import HeightInputScreen from './screens/onboarding/HeightInputScreen';
import WeightInputScreen from './screens/onboarding/WeightInputScreen';
import GoalWeightInputScreen from './screens/onboarding/GoalWeightInputScreen';

// Main App Screens
import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen';
import FullPlanScreen from './screens/FullPlanScreen';
import WorkoutSessionScreen from './screens/WorkoutSessionScreen';
import CardioScreen from './screens/CardioScreen';
import FlexibilityScreen from './screens/FlexibilityScreen';

// Placeholder PastWorkoutsScreen
const PastWorkoutsScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
    <Text style={{ fontSize: 22, color: '#1B365D', fontWeight: 'bold' }}>Past Workouts</Text>
    <Text style={{ color: '#666', marginTop: 12 }}>This is where your workout history will appear.</Text>
  </View>
);

const Stack = createNativeStackNavigator();
const RootStack = createNativeStackNavigator();

// Onboarding navigator
const OnboardingNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Welcome" component={WelcomeScreen} />
    <Stack.Screen name="GenderSelection" component={GenderSelectionScreen} />
    <Stack.Screen name="GoalSelection" component={GoalSelectionScreen} />
    <Stack.Screen name="ExperienceLevel" component={ExperienceLevelScreen} />
    <Stack.Screen name="StrengthTrainingHistory" component={StrengthTrainingHistoryScreen} />
    <Stack.Screen name="EquipmentInput" component={EquipmentInputScreen} />
    <Stack.Screen name="ScheduleInput" component={ScheduleInputScreen} />
    <Stack.Screen name="OnboardingSummary" component={OnboardingSummary} />
    <Stack.Screen name="PlanPreview" component={PlanPreviewScreen} />
    <Stack.Screen name="ExerciseLocation" component={ExerciseLocationScreen} />
    <Stack.Screen name="TargetMuscles" component={TargetMusclesScreen} />
    <Stack.Screen name="HeightInput" component={HeightInputScreen} />
    <Stack.Screen name="WeightInput" component={WeightInputScreen} />
    <Stack.Screen name="GoalWeightInput" component={GoalWeightInputScreen} />
  </Stack.Navigator>
);

// Main app navigator
const MainNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen 
      name="Profile" 
      component={ProfileScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen 
      name="FullPlan" 
      component={FullPlanScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen 
      name="WorkoutSession" 
      component={WorkoutSessionScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen name="CardioScreen" component={CardioScreen} />
    <Stack.Screen name="FlexibilityScreen" component={FlexibilityScreen} />
    <Stack.Screen name="PastWorkouts" component={PastWorkoutsScreen} options={{ title: 'Past Workouts' }} />
  </Stack.Navigator>
);

// RevenueCat initialization using env variable for iOS
if (Platform.OS === 'ios') {
  Purchases.configure({ apiKey: REV_CAT_IOS });
} else if (Platform.OS === 'android') {
  Purchases.configure({ apiKey: 'REVENUECAT_ANDROID_API_KEY' });
}

function AppNavigator() {
  const { isOnboardingComplete, loading, user, isGuest } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Determine which navigator to show
  const shouldShowOnboarding = !isOnboardingComplete;
  
  // Additional safeguard: if user is not signed in and not guest, show onboarding
  if (!user && !isGuest && !isOnboardingComplete) {
    return (
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        <RootStack.Screen 
          name="Onboarding" 
          component={OnboardingNavigator}
          options={{ gestureEnabled: false }}
        />
      </RootStack.Navigator>
    );
  }

  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      {shouldShowOnboarding ? (
        <RootStack.Screen 
          name="Onboarding" 
          component={OnboardingNavigator}
          options={{ gestureEnabled: false }}
        />
      ) : (
        <RootStack.Screen 
          name="Main" 
          component={MainNavigator}
          options={{ gestureEnabled: false }}
        />
      )}
    </RootStack.Navigator>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <NavigationContainer>
          <AuthProvider>
            <OnboardingProvider>
              <WorkoutProvider>
                <StatusBar style="auto" />
                <AppNavigator />
              </WorkoutProvider>
            </OnboardingProvider>
          </AuthProvider>
        </NavigationContainer>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
} 