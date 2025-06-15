import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { OnboardingProvider } from './OnboardingContext';
import { WorkoutProvider } from './contexts/WorkoutContext';
import ErrorBoundary from './components/ErrorBoundary';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { View, ActivityIndicator } from 'react-native';

// Onboarding Screens
import WelcomeScreen from './screens/onboarding/WelcomeScreen';
import GenderSelectionScreen from './screens/onboarding/GenderSelectionScreen';
import GoalSelectionScreen from './screens/onboarding/GoalSelectionScreen';
import ExperienceLevelScreen from './screens/onboarding/ExperienceLevelScreen';
import StrengthTrainingHistoryScreen from './screens/onboarding/StrengthTrainingHistoryScreen';
import EquipmentInputScreen from './screens/onboarding/EquipmentInputScreen';
import ScheduleInputScreen from './screens/onboarding/ScheduleInputScreen';
import OnboardingSummary from './screens/onboarding/OnboardingSummary';
import PlanGenerationScreen from './screens/onboarding/PlanGenerationScreen';
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

const Stack = createNativeStackNavigator();
const RootStack = createNativeStackNavigator();

// Loading screen component
const LoadingScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <ActivityIndicator size="large" color="#2075FF" />
  </View>
);

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
    <Stack.Screen name="PlanGeneration" component={PlanGenerationScreen} />
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
    <Stack.Screen name="Profile" component={ProfileScreen} />
    <Stack.Screen name="FullPlan" component={FullPlanScreen} />
  </Stack.Navigator>
);

function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        <RootStack.Screen name="Loading" component={LoadingScreen} />
      </RootStack.Navigator>
    );
  }

  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <RootStack.Screen name="Main" component={MainNavigator} />
      ) : (
        <RootStack.Screen name="Onboarding" component={OnboardingNavigator} />
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