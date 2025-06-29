# RevenueCat UI Paywall Implementation Guide

This guide covers the complete implementation of RevenueCat UI paywalls in your React Native app, including all available methods and best practices.

## Overview

RevenueCat UI provides several ways to present paywalls:

1. **RevenueCatUI.presentPaywall()** - Present the default paywall
2. **RevenueCatUI.presentPaywallIfNeeded()** - Present paywall only if user doesn't have entitlement
3. **RevenueCatUI.Paywall** - Custom paywall component with full control

## Installation

```bash
npm install react-native-purchases-ui --legacy-peer-deps
```

## Available Methods

### 1. Basic Paywall Presentation

```javascript
import RevenueCatUI, { PAYWALL_RESULT } from 'react-native-purchases-ui';

async function presentPaywall() {
  try {
    const paywallResult = await RevenueCatUI.presentPaywall();
    
    switch (paywallResult) {
      case PAYWALL_RESULT.PURCHASED:
      case PAYWALL_RESULT.RESTORED:
        console.log('Purchase successful!');
        return true;
      case PAYWALL_RESULT.CANCELLED:
        console.log('User cancelled');
        return false;
      case PAYWALL_RESULT.ERROR:
        console.log('An error occurred');
        return false;
      case PAYWALL_RESULT.NOT_PRESENTED:
        console.log('Paywall could not be presented');
        return false;
      default:
        return false;
    }
  } catch (error) {
    console.error('Paywall error:', error);
    return false;
  }
}
```

### 2. Paywall with Specific Offering

```javascript
async function presentPaywallWithOffering(offering) {
  try {
    const paywallResult = await RevenueCatUI.presentPaywall({
      offering: offering
    });
    
    // Handle result same as above
    return paywallResult === PAYWALL_RESULT.PURCHASED || 
           paywallResult === PAYWALL_RESULT.RESTORED;
  } catch (error) {
    console.error('Paywall with offering error:', error);
    return false;
  }
}
```

### 3. Conditional Paywall (If Needed)

```javascript
async function presentPaywallIfNeeded(requiredEntitlementIdentifier = 'pro') {
  try {
    const paywallResult = await RevenueCatUI.presentPaywallIfNeeded({
      requiredEntitlementIdentifier: requiredEntitlementIdentifier
    });
    
    // If NOT_PRESENTED, user already has the entitlement
    if (paywallResult === PAYWALL_RESULT.NOT_PRESENTED) {
      console.log('User already has premium access');
      return { success: true, alreadyPremium: true };
    }
    
    return { 
      success: paywallResult === PAYWALL_RESULT.PURCHASED || 
               paywallResult === PAYWALL_RESULT.RESTORED,
      result: paywallResult 
    };
  } catch (error) {
    console.error('Paywall if needed error:', error);
    return { success: false, error };
  }
}
```

### 4. Conditional Paywall with Specific Offering

```javascript
async function presentPaywallIfNeededWithOffering(offering, requiredEntitlementIdentifier = 'pro') {
  try {
    const paywallResult = await RevenueCatUI.presentPaywallIfNeeded({
      offering: offering,
      requiredEntitlementIdentifier: requiredEntitlementIdentifier
    });
    
    // Handle result same as conditional paywall
    return { 
      success: paywallResult === PAYWALL_RESULT.PURCHASED || 
               paywallResult === PAYWALL_RESULT.RESTORED,
      result: paywallResult 
    };
  } catch (error) {
    console.error('Paywall if needed with offering error:', error);
    return { success: false, error };
  }
}
```

## Custom Paywall Component

For maximum flexibility, you can use the `RevenueCatUI.Paywall` component directly:

```javascript
import React, { useState } from 'react';
import { View, Modal, Alert } from 'react-native';
import RevenueCatUI from 'react-native-purchases-ui';

const CustomPaywall = ({ visible, onClose, offering }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handlePurchaseStarted = () => {
    console.log('Purchase started');
    setIsLoading(true);
  };

  const handlePurchaseCompleted = () => {
    console.log('Purchase completed');
    setIsLoading(false);
    Alert.alert('Success', 'Thank you for subscribing!');
    onClose();
  };

  const handlePurchaseError = (error) => {
    console.log('Purchase error:', error);
    setIsLoading(false);
    Alert.alert('Error', 'Purchase failed. Please try again.');
  };

  const handlePurchaseCancelled = () => {
    console.log('Purchase cancelled');
    setIsLoading(false);
  };

  const handleRestoreStarted = () => {
    console.log('Restore started');
    setIsLoading(true);
  };

  const handleRestoreCompleted = () => {
    console.log('Restore completed');
    setIsLoading(false);
    Alert.alert('Success', 'Purchases restored!');
    onClose();
  };

  const handleRestoreError = (error) => {
    console.log('Restore error:', error);
    setIsLoading(false);
    Alert.alert('Error', 'Restore failed. Please try again.');
  };

  const handleDismiss = () => {
    console.log('Paywall dismissed');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide">
      <View style={{ flex: 1 }}>
        <RevenueCatUI.Paywall
          offering={offering}
          requiredEntitlementIdentifier="pro"
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
```

## Available Paywall Results

- **PAYWALL_RESULT.PURCHASED** - User completed a purchase
- **PAYWALL_RESULT.RESTORED** - User restored purchases
- **PAYWALL_RESULT.CANCELLED** - User cancelled the paywall
- **PAYWALL_RESULT.ERROR** - An error occurred
- **PAYWALL_RESULT.NOT_PRESENTED** - Paywall couldn't be shown

## Available Event Listeners

When using `RevenueCatUI.Paywall` component:

- **onPurchaseStarted** - Called when purchase begins
- **onPurchaseCompleted** - Called when purchase succeeds
- **onPurchaseError** - Called when purchase fails
- **onPurchaseCancelled** - Called when purchase is cancelled
- **onRestoreStarted** - Called when restore begins
- **onRestoreCompleted** - Called when restore succeeds
- **onRestoreError** - Called when restore fails
- **onDismiss** - Called when paywall is dismissed

## Integration with Your App

### Using the Service Layer

```javascript
// services/purchasesService.js
import RevenueCatUI, { PAYWALL_RESULT } from 'react-native-purchases-ui';

class PurchasesService {
  async presentPaywall() {
    try {
      const paywallResult = await RevenueCatUI.presentPaywall();
      
      switch (paywallResult) {
        case PAYWALL_RESULT.NOT_PRESENTED:
        case PAYWALL_RESULT.ERROR:
        case PAYWALL_RESULT.CANCELLED:
          return { success: false, result: paywallResult };
        case PAYWALL_RESULT.PURCHASED:
        case PAYWALL_RESULT.RESTORED:
          return { success: true, result: paywallResult };
        default:
          return { success: false, result: paywallResult };
      }
    } catch (error) {
      console.error('Failed to present paywall:', error);
      throw error;
    }
  }

  async presentPaywallIfNeeded(requiredEntitlementIdentifier = 'pro') {
    try {
      const paywallResult = await RevenueCatUI.presentPaywallIfNeeded({
        requiredEntitlementIdentifier: requiredEntitlementIdentifier
      });
      
      switch (paywallResult) {
        case PAYWALL_RESULT.NOT_PRESENTED:
        case PAYWALL_RESULT.ERROR:
        case PAYWALL_RESULT.CANCELLED:
          return { success: false, result: paywallResult };
        case PAYWALL_RESULT.PURCHASED:
        case PAYWALL_RESULT.RESTORED:
          return { success: true, result: paywallResult };
        default:
          return { success: false, result: paywallResult };
      }
    } catch (error) {
      console.error('Failed to present paywall if needed:', error);
      throw error;
    }
  }
}
```

### Using the Hook

```javascript
// hooks/usePurchases.js
export const usePurchases = () => {
  const presentPaywall = useCallback(async () => {
    try {
      const result = await purchasesService.presentPaywall();
      
      if (result.success) {
        await refreshCustomerInfo();
      }
      
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [refreshCustomerInfo]);

  const presentPaywallIfNeeded = useCallback(async (requiredEntitlementIdentifier = 'pro') => {
    try {
      const result = await purchasesService.presentPaywallIfNeeded(requiredEntitlementIdentifier);
      
      if (result.success) {
        await refreshCustomerInfo();
      }
      
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [refreshCustomerInfo]);

  return {
    presentPaywall,
    presentPaywallIfNeeded,
    // ... other methods
  };
};
```

### Using in Components

```javascript
// components/PremiumFeatureGate.js
const PremiumFeatureGate = ({ children, featureName }) => {
  const { hasPremium, presentPaywall } = usePurchases();

  if (hasPremium) {
    return children;
  }

  const handleUpgrade = async () => {
    try {
      const result = await presentPaywall();
      
      if (result.success) {
        console.log('Premium upgrade successful');
      } else {
        switch (result.result) {
          case 'CANCELLED':
            console.log('User cancelled paywall');
            break;
          case 'ERROR':
            Alert.alert('Error', 'Failed to load paywall. Please try again.');
            break;
          case 'NOT_PRESENTED':
            Alert.alert('Error', 'Paywall could not be presented. Please try again.');
            break;
        }
      }
    } catch (error) {
      console.error('Failed to present paywall:', error);
      Alert.alert('Error', 'Failed to load paywall. Please check your connection and try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Premium Feature</Text>
      <Text style={styles.description}>
        {featureName} is available exclusively to premium subscribers.
      </Text>
      <TouchableOpacity style={styles.upgradeButton} onPress={handleUpgrade}>
        <Text style={styles.upgradeButtonText}>Upgrade to Premium</Text>
      </TouchableOpacity>
    </View>
  );
};
```

## Best Practices

### 1. Error Handling
Always handle all possible paywall results and provide appropriate user feedback.

### 2. Loading States
Show loading indicators during purchase/restore operations.

### 3. User Feedback
Provide clear success and error messages to users.

### 4. Conditional Presentation
Use `presentPaywallIfNeeded` to avoid showing paywalls to users who already have access.

### 5. Testing
Test all paywall flows thoroughly in sandbox environment before production.

### 6. Analytics
Track paywall interactions for optimization.

## Troubleshooting

### Common Issues

1. **Paywall not showing**
   - Check RevenueCat configuration
   - Verify offerings are properly set up
   - Ensure API key is correct

2. **Purchase errors**
   - Verify App Store Connect configuration
   - Check sandbox test accounts
   - Review RevenueCat dashboard for errors

3. **Restore not working**
   - Ensure user is signed in to App Store
   - Verify previous purchases exist
   - Check network connectivity

### Debug Mode

Enable debug logging:

```javascript
import Purchases from 'react-native-purchases';

// Enable debug logging
Purchases.setLogLevel(Purchases.LOG_LEVEL.DEBUG);
```

## Next Steps

1. Configure your RevenueCat dashboard with offerings
2. Set up products in App Store Connect
3. Test all paywall flows in sandbox
4. Implement analytics tracking
5. Deploy to production

This implementation provides a complete, production-ready solution for RevenueCat UI paywalls in your React Native app. 