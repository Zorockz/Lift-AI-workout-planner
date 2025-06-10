import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import Button from '../../components/Button';
import ProgressBar from '../../components/ProgressBar';
import { commonStyles } from '../../utils/styles';
import { useOnboarding } from '../../OnboardingContext';

const WelcomeScreen = ({ navigation }) => {
  const { onboarding } = useOnboarding();

  return (
    <ScrollView 
      style={commonStyles.container}
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <ProgressBar currentStep={1} totalSteps={15} />
      <View style={[commonStyles.content, { justifyContent: 'center' }]}>
        <Text style={commonStyles.title}>Welcome to FitBuddy</Text>
        <Text style={commonStyles.subtitle}>Your AI Fitness Companion</Text>
        <Button 
          title="Get Started"
          onPress={() => navigation.navigate('GenderSelection')}
          style={commonStyles.button}
        />
      </View>
    </ScrollView>
  );
};

export default WelcomeScreen; 