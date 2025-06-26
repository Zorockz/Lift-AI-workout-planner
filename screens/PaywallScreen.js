import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, Platform } from 'react-native';
import Purchases from 'react-native-purchases';

const PaywallScreen = () => {
  const [loading, setLoading] = useState(false);
  const [offerings, setOfferings] = useState(null);

  React.useEffect(() => {
    // Fetch offerings from RevenueCat
    const fetchOfferings = async () => {
      setLoading(true);
      try {
        const offeringsResult = await Purchases.getOfferings();
        setOfferings(offeringsResult.current);
      } catch (error) {
        Alert.alert('Error', 'Failed to load subscription options.');
      } finally {
        setLoading(false);
      }
    };
    fetchOfferings();
  }, []);

  const handlePurchase = async (packageToBuy) => {
    setLoading(true);
    try {
      const purchaseResult = await Purchases.purchasePackage(packageToBuy);
      if (purchaseResult.customerInfo && purchaseResult.customerInfo.activeSubscriptions.length > 0) {
        Alert.alert('Success', 'Thank you for subscribing!');
        // TODO: Navigate away or unlock premium features
      }
    } catch (e) {
      if (!e.userCancelled) {
        Alert.alert('Error', 'Purchase failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Unlock Premium</Text>
      <Text style={styles.subtitle}>Get unlimited access to all features, personalized plans, and more!</Text>
      {loading && <ActivityIndicator size="large" color="#2075FF" style={{ marginVertical: 24 }} />}
      {!loading && offerings && offerings.availablePackages.length > 0 ? (
        offerings.availablePackages.map((pkg) => (
          <TouchableOpacity
            key={pkg.identifier}
            style={styles.packageButton}
            onPress={() => handlePurchase(pkg)}
          >
            <Text style={styles.packageTitle}>{pkg.product.title}</Text>
            <Text style={styles.packagePrice}>{pkg.product.price_string}</Text>
            <Text style={styles.packageDesc}>{pkg.product.description}</Text>
          </TouchableOpacity>
        ))
      ) : !loading ? (
        <Text style={styles.noPackages}>No subscription options available.</Text>
      ) : null}
      <Text style={styles.terms}>
        Payment will be charged to your account at confirmation of purchase. Subscription automatically renews unless auto-renew is turned off at least 24-hours before the end of the current period.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2075FF',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#333',
    marginBottom: 24,
    textAlign: 'center',
  },
  packageButton: {
    backgroundColor: '#2075FF',
    borderRadius: 16,
    padding: 20,
    marginVertical: 10,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#2075FF',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  packageTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  packagePrice: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 2,
  },
  packageDesc: {
    fontSize: 14,
    color: '#E3F2FD',
    textAlign: 'center',
  },
  noPackages: {
    color: '#888',
    fontSize: 16,
    marginVertical: 24,
    textAlign: 'center',
  },
  terms: {
    fontSize: 12,
    color: '#888',
    marginTop: 32,
    textAlign: 'center',
  },
});

export default PaywallScreen; 