import Purchases from 'react-native-purchases';
import RevenueCatUI, { PAYWALL_RESULT } from 'react-native-purchases-ui';
import { Platform } from 'react-native';
import { REV_CAT_IOS } from '@env';

// Product identifiers - Define your subscription tiers
export const PRODUCT_IDENTIFIERS = {
  PREMIUM_MONTHLY: 'premium_monthly',
  PREMIUM_YEARLY: 'premium_yearly',
};

class PurchasesService {
  constructor() {
    this.isInitialized = false;
  }

  /**
   * Initialize RevenueCat with your API key
   */
  async initialize() {
    try {
      if (this.isInitialized) {
        return;
      }

      if (!REV_CAT_IOS || REV_CAT_IOS === 'your_actual_ios_api_key_here') {
        return;
      }

      await Purchases.configure({ apiKey: REV_CAT_IOS });
      this.isInitialized = true;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get customer info including active subscriptions
   */
  async getCustomerInfo() {
    try {
      await this.ensureInitialized();
      const customerInfo = await Purchases.getCustomerInfo();
      return customerInfo;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get available products
   */
  async getProducts() {
    try {
      await this.ensureInitialized();
      const productIds = Object.values(PRODUCT_IDENTIFIERS);
      const products = await Purchases.getProducts(productIds);
      return products;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Purchase a product
   */
  async purchaseProduct(productId) {
    try {
      await this.ensureInitialized();
      const { customerInfo, productIdentifier } = await Purchases.purchaseProduct(productId);
      return { customerInfo, productIdentifier };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Restore purchases
   */
  async restorePurchases() {
    try {
      await this.ensureInitialized();
      const customerInfo = await Purchases.restorePurchases();
      return customerInfo;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Check if user has active premium subscription
   */
  async hasActivePremium() {
    try {
      const customerInfo = await this.getCustomerInfo();
      const entitlements = customerInfo.entitlements.active;
      
      // Check if user has any active premium entitlement
      return Object.keys(entitlements).length > 0;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get user's active entitlements
   */
  async getActiveEntitlements() {
    try {
      const customerInfo = await this.getCustomerInfo();
      return customerInfo.entitlements.active;
    } catch (error) {
      return {};
    }
  }

  /**
   * Ensure RevenueCat is initialized before making API calls
   */
  async ensureInitialized() {
    if (!this.isInitialized) {
      await this.initialize();
    }
  }

  /**
   * Set user ID for RevenueCat (useful for server-side receipt validation)
   */
  async setUserID(userID) {
    try {
      await this.ensureInitialized();
      await Purchases.logIn(userID);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Log out user from RevenueCat
   */
  async logOut() {
    try {
      await this.ensureInitialized();
      const customerInfo = await Purchases.logOut();
      return customerInfo;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Present RevenueCat UI paywall using presentPaywall
   */
  async presentPaywall() {
    try {
      await this.ensureInitialized();
      
      // Present paywall for current offering
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
      throw error;
    }
  }

  /**
   * Present RevenueCat UI paywall with specific offering
   */
  async presentPaywallWithOffering(offering) {
    try {
      await this.ensureInitialized();
      
      const paywallResult = await RevenueCatUI.presentPaywall({
        offering: offering
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
      throw error;
    }
  }

  /**
   * Present RevenueCat UI paywall only if needed (user doesn't have entitlement)
   */
  async presentPaywallIfNeeded(requiredEntitlementIdentifier = 'pro') {
    try {
      await this.ensureInitialized();
      
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
      throw error;
    }
  }

  /**
   * Present RevenueCat UI paywall if needed with specific offering
   */
  async presentPaywallIfNeededWithOffering(offering, requiredEntitlementIdentifier = 'pro') {
    try {
      await this.ensureInitialized();
      
      const paywallResult = await RevenueCatUI.presentPaywallIfNeeded({
        offering: offering,
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
      throw error;
    }
  }

  /**
   * Get current offerings from RevenueCat
   */
  async getOfferings() {
    try {
      await this.ensureInitialized();
      const offerings = await Purchases.getOfferings();
      return offerings;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Refresh customer info after paywall interaction
   */
  async refreshCustomerInfo() {
    try {
      const customerInfo = await this.getCustomerInfo();
      return customerInfo;
    } catch (error) {
      throw error;
    }
  }
}

// Export a singleton instance
const purchasesService = new PurchasesService();
export default purchasesService; 