import { useState, useEffect, useCallback } from 'react';
import purchasesService, { PRODUCT_IDENTIFIERS } from '../services/purchasesService';

export const usePurchases = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [customerInfo, setCustomerInfo] = useState(null);
  const [hasPremium, setHasPremium] = useState(false);
  const [error, setError] = useState(null);

  // Initialize RevenueCat on mount
  useEffect(() => {
    initializePurchases();
  }, []);

  const initializePurchases = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      await purchasesService.initialize();
      await refreshCustomerInfo();
      await loadProducts();
    } catch (err) {
      setError(err.message);
      console.error('Failed to initialize purchases:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshCustomerInfo = useCallback(async () => {
    try {
      const info = await purchasesService.getCustomerInfo();
      setCustomerInfo(info);
      setHasPremium(await purchasesService.hasActivePremium());
    } catch (err) {
      console.error('Failed to refresh customer info:', err);
    }
  }, []);

  const loadProducts = useCallback(async () => {
    try {
      const availableProducts = await purchasesService.getProducts();
      setProducts(availableProducts);
    } catch (err) {
      console.error('Failed to load products:', err);
    }
  }, []);

  const purchaseProduct = useCallback(async (productId) => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await purchasesService.purchaseProduct(productId);
      await refreshCustomerInfo();
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [refreshCustomerInfo]);

  const restorePurchases = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await purchasesService.restorePurchases();
      await refreshCustomerInfo();
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [refreshCustomerInfo]);

  const setUserID = useCallback(async (userID) => {
    try {
      await purchasesService.setUserID(userID);
      await refreshCustomerInfo();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [refreshCustomerInfo]);

  const logOut = useCallback(async () => {
    try {
      const result = await purchasesService.logOut();
      setCustomerInfo(null);
      setHasPremium(false);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  // Present RevenueCat UI paywall
  const presentPaywall = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await purchasesService.presentPaywall();
      
      // Refresh customer info after paywall interaction
      if (result.success) {
        await refreshCustomerInfo();
      }
      
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [refreshCustomerInfo]);

  // Present RevenueCat UI paywall with specific offering
  const presentPaywallWithOffering = useCallback(async (offering) => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await purchasesService.presentPaywallWithOffering(offering);
      
      // Refresh customer info after paywall interaction
      if (result.success) {
        await refreshCustomerInfo();
      }
      
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [refreshCustomerInfo]);

  // Present RevenueCat UI paywall only if needed
  const presentPaywallIfNeeded = useCallback(async (requiredEntitlementIdentifier = 'pro') => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await purchasesService.presentPaywallIfNeeded(requiredEntitlementIdentifier);
      
      // Refresh customer info after paywall interaction
      if (result.success) {
        await refreshCustomerInfo();
      }
      
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [refreshCustomerInfo]);

  // Present RevenueCat UI paywall if needed with specific offering
  const presentPaywallIfNeededWithOffering = useCallback(async (offering, requiredEntitlementIdentifier = 'pro') => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await purchasesService.presentPaywallIfNeededWithOffering(offering, requiredEntitlementIdentifier);
      
      // Refresh customer info after paywall interaction
      if (result.success) {
        await refreshCustomerInfo();
      }
      
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [refreshCustomerInfo]);

  // Get offerings from RevenueCat
  const getOfferings = useCallback(async () => {
    try {
      const offerings = await purchasesService.getOfferings();
      return offerings;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // State
    isLoading,
    products,
    customerInfo,
    hasPremium,
    error,
    
    // Actions
    purchaseProduct,
    restorePurchases,
    setUserID,
    logOut,
    presentPaywall,
    presentPaywallWithOffering,
    presentPaywallIfNeeded,
    presentPaywallIfNeededWithOffering,
    getOfferings,
    refreshCustomerInfo,
    loadProducts,
    clearError,
    
    // Constants
    PRODUCT_IDENTIFIERS,
  };
}; 