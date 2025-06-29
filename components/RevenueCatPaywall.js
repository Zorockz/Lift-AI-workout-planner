import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, Modal } from 'react-native';
import { TouchableOpacity } from 'react-native';
import RevenueCatUI, { PAYWALL_RESULT } from 'react-native-purchases-ui';
import { usePurchases } from '../hooks/usePurchases';
import { Ionicons } from '@expo/vector-icons';

const RevenueCatPaywall = ({ 
  visible = false, 
  onClose,
  offering = null,
  requiredEntitlementIdentifier = 'pro'
}) => {
  const { hasPremium, refreshCustomerInfo } = usePurchases();
  const [isLoading, setIsLoading] = useState(false);

  const handlePurchaseStarted = () => {
    setIsLoading(true);
  };

  const handlePurchaseCompleted = () => {
    setIsLoading(false);
    Alert.alert('Success', 'Thank you for subscribing to Premium!');
    refreshCustomerInfo();
    onClose?.();
  };

  const handlePurchaseError = (error) => {
    setIsLoading(false);
    Alert.alert('Purchase Error', 'Something went wrong with your purchase. Please try again.');
  };

  const handlePurchaseCancelled = () => {
    setIsLoading(false);
  };

  const handleRestoreStarted = () => {
    setIsLoading(true);
  };

  const handleRestoreCompleted = () => {
    setIsLoading(false);
    Alert.alert('Success', 'Your purchases have been restored!');
    refreshCustomerInfo();
    onClose?.();
  };

  const handleRestoreError = (error) => {
    setIsLoading(false);
    Alert.alert('Restore Error', 'Failed to restore purchases. Please try again.');
  };

  const handleDismiss = () => {
    onClose?.();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Upgrade to Premium</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        {isLoading && (
          <View style={styles.loadingOverlay}>
            <Text style={styles.loadingText}>Processing...</Text>
          </View>
        )}

        <RevenueCatUI.Paywall
          offering={offering}
          requiredEntitlementIdentifier={requiredEntitlementIdentifier}
          onPurchaseStarted={handlePurchaseStarted}
          onPurchaseCompleted={handlePurchaseCompleted}
          onPurchaseError={handlePurchaseError}
          onPurchaseCancelled={handlePurchaseCancelled}
          onRestoreStarted={handleRestoreStarted}
          onRestoreCompleted={handleRestoreCompleted}
          onRestoreError={handleRestoreError}
          onDismiss={handleDismiss}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default RevenueCatPaywall; 