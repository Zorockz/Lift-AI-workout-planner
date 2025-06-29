import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { usePurchases } from '../hooks/usePurchases';
import { Ionicons } from '@expo/vector-icons';

const PremiumFeatureGate = ({ 
  children, 
  featureName = 'Premium Feature',
  showUpgradePrompt = true,
  onUpgradePress 
}) => {
  const { hasPremium, presentPaywall } = usePurchases();

  // If user has premium, show the feature
  if (hasPremium) {
    return children;
  }

  // If user doesn't have premium and we don't want to show upgrade prompt
  if (!showUpgradePrompt) {
    return null;
  }

  const handleUpgrade = async () => {
    if (onUpgradePress) {
      onUpgradePress();
    } else {
      try {
        const result = await presentPaywall();
        
        if (result.success) {
          // Purchase was successful, no need to show alert
        } else {
          // Handle different paywall results
          switch (result.result) {
            case 'CANCELLED':
              break;
            case 'ERROR':
              Alert.alert('Error', 'Failed to load paywall. Please try again.');
              break;
            case 'NOT_PRESENTED':
              Alert.alert('Error', 'Paywall could not be presented. Please try again.');
              break;
            default:
          }
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to load paywall. Please check your connection and try again.');
      }
    }
  };

  // Show upgrade prompt
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Ionicons name="star" size={48} color="#FFD700" style={styles.icon} />
        <Text style={styles.title}>Premium Feature</Text>
        <Text style={styles.description}>
          {featureName} is available exclusively to premium subscribers.
        </Text>
        <TouchableOpacity
          style={styles.upgradeButton}
          onPress={handleUpgrade}
        >
          <Text style={styles.upgradeButtonText}>Upgrade to Premium</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  content: {
    alignItems: 'center',
    maxWidth: 300,
  },
  icon: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  upgradeButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  upgradeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default PremiumFeatureGate; 