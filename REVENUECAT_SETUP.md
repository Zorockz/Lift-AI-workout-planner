# RevenueCat Setup Guide for Lifts AI (iOS Only)

This guide will help you set up RevenueCat for in-app purchases and subscriptions in your Lifts AI React Native app.

## What is RevenueCat?

RevenueCat provides a backend and wrapper around StoreKit (iOS) to make implementing in-app purchases and subscriptions easy. It handles:

- Subscription management
- Receipt validation
- Analytics and insights
- Server-side receipt validation

## Prerequisites

1. **RevenueCat Account**: Sign up at [revenuecat.com](https://www.revenuecat.com)
2. **Apple Developer Account**: For iOS App Store Connect setup
3. **React Native 0.64+**: Your app uses React Native 0.79.4 ✅

## Step 1: RevenueCat Dashboard Setup

### 1.1 Create a New Project
1. Log into your RevenueCat dashboard
2. Click "New Project"
3. Name it "Lifts AI"
4. Select your timezone

### 1.2 Add iOS App
1. **iOS App**:
   - Bundle ID: `com.zorockz.liftsai`
   - App Store Connect App ID: [Get from App Store Connect]

### 1.3 Create Products
Create the following products in RevenueCat:

#### iOS Products (App Store Connect)
- `premium_monthly` - Monthly subscription
- `premium_yearly` - Yearly subscription

### 1.4 Get API Key
1. Go to Project Settings → API Keys
2. Copy the iOS API key
3. Add to your `.env` file as `REV_CAT_IOS=your_api_key_here`

## Step 2: Environment Variable Setup

### 2.1 Create .env File
Create a `.env` file in your project root (same level as `package.json`):

```bash
# .env file
REV_CAT_IOS=your_actual_ios_api_key_here
```

**IMPORTANT**: Replace `your_actual_ios_api_key_here` with your real RevenueCat iOS API key.

### 2.2 Verify Environment Variable
The service will automatically use the `REV_CAT_IOS` environment variable. Make sure it's properly loaded in your app.

### 2.3 Restart Development Server
After creating the `.env` file, restart your development server:
```bash
# Stop your current server (Ctrl+C)
# Then restart
npx expo start
```

## Step 3: App Store Connect Setup (iOS)

### 3.1 Create In-App Purchases
1. Go to App Store Connect → Your App → Features → In-App Purchases
2. Create the following products:

**Monthly Subscription:**
- Product ID: `premium_monthly`
- Type: Auto-Renewable Subscription
- Reference Name: "Lifts AI Premium Monthly"
- Subscription Group: Create new group "Lifts AI Premium"

**Yearly Subscription:**
- Product ID: `premium_yearly`
- Type: Auto-Renewable Subscription
- Reference Name: "Lifts AI Premium Yearly"
- Subscription Group: Same as monthly

### 3.2 Configure Subscription Groups
1. Set up subscription levels and pricing
2. Configure subscription terms and conditions
3. Set up promotional offers if needed

## Step 4: Testing

### 4.1 Sandbox Testing
1. **iOS**: Use sandbox test accounts from App Store Connect
2. Test all purchase flows:
   - Monthly subscription
   - Yearly subscription
   - Restore purchases
   - Subscription cancellation

### 4.2 Test Scenarios
- [ ] New user purchase flow
- [ ] Existing user subscription renewal
- [ ] Subscription cancellation
- [ ] Purchase restoration
- [ ] Network error handling
- [ ] Receipt validation

## Step 5: Production Deployment

### 5.1 Pre-launch Checklist
- [ ] All products configured in App Store Connect
- [ ] RevenueCat API key set in environment variables
- [ ] Subscription terms and privacy policy in place
- [ ] Test purchases working in sandbox
- [ ] Receipt validation working
- [ ] Analytics tracking configured

### 5.2 App Store Review
- Ensure your app complies with App Store Review Guidelines
- Include subscription terms and privacy policy
- Test with real devices before submission

## Troubleshooting

### Common Issues

1. **"Preview API mode" warnings**
   - **Cause**: RevenueCat is not using a real API key
   - **Solution**: 
     - Create a `.env` file in your project root
     - Add `REV_CAT_IOS=your_actual_api_key_here`
     - Restart your development server
     - Verify the API key is correct in RevenueCat dashboard

2. **"API key not found in environment variables" warning**
   - Make sure you've set `REV_CAT_IOS` in your `.env` file
   - Verify the environment variable is being loaded
   - Check that the `.env` file is in the correct location

3. **Products not loading**
   - Verify product IDs match between RevenueCat and App Store Connect
   - Check that products are approved in App Store Connect
   - Ensure you're using the correct API key

4. **Purchase fails**
   - Ensure you're using sandbox accounts for testing
   - Check network connectivity
   - Verify App Store Connect configuration

5. **Restore purchases not working**
   - Make sure user is signed in to their App Store account
   - Verify previous purchases exist

### Debug Mode
Enable debug logging by adding this to your app initialization:

```javascript
import Purchases from 'react-native-purchases';

// Enable debug logging
Purchases.setLogLevel(Purchases.LOG_LEVEL.DEBUG);
```

## Usage Examples

### Check Premium Status
```javascript
import { usePurchases } from '../hooks/usePurchases';

const MyComponent = () => {
  const { hasPremium } = usePurchases();
  
  if (hasPremium) {
    // Show premium features
  } else {
    // Show upgrade prompt
  }
};
```

### Show Native Paywall
```javascript
import { usePurchases } from '../hooks/usePurchases';

const UpgradeButton = () => {
  const { presentPaywall } = usePurchases();
  
  const handleUpgrade = async () => {
    try {
      await presentPaywall();
    } catch (error) {
      console.error('Failed to show paywall:', error);
    }
  };
  
  return (
    <TouchableOpacity onPress={handleUpgrade}>
      <Text>Upgrade to Premium</Text>
    </TouchableOpacity>
  );
};
```

### Gate Premium Features
```javascript
import PremiumFeatureGate from '../components/PremiumFeatureGate';

<PremiumFeatureGate 
  featureName="Advanced Analytics"
>
  <AdvancedAnalyticsComponent />
</PremiumFeatureGate>
```

## Support

- [RevenueCat Documentation](https://docs.revenuecat.com/)
- [RevenueCat Support](https://www.revenuecat.com/support/)
- [React Native Purchases GitHub](https://github.com/RevenueCat/react-native-purchases)

## Next Steps

1. Set up your RevenueCat dashboard
2. Configure products in App Store Connect
3. Set `REV_CAT_IOS` in your `.env` file
4. Test thoroughly in sandbox
5. Deploy to production

Remember to test all purchase flows thoroughly before launching to ensure a smooth user experience! 