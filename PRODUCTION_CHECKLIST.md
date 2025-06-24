# Production Deployment Checklist

## Pre-Deployment Checklist

### ✅ Code Quality
- [x] Remove all `console.log` statements
- [x] Set development flags to `false`
- [x] Remove debug/test code
- [x] Clean up unused imports and dependencies
- [x] Run linting and fix all issues
- [x] Run tests and ensure all pass

### ✅ Configuration
- [x] Update app version and build numbers
- [x] Configure production Firebase project
- [x] Set up production Google OAuth credentials
- [x] Update app.json with production settings
- [x] Configure error reporting (Sentry)
- [x] Set up analytics tracking

### ✅ Security
- [x] Review Firebase security rules
- [x] Ensure sensitive data is encrypted
- [x] Validate all user inputs
- [x] Test authentication flows
- [x] Verify API endpoints are secure
- [x] Check for hardcoded secrets

### ✅ Performance
- [x] Optimize bundle size
- [x] Enable Hermes engine
- [x] Compress images and assets
- [x] Implement lazy loading
- [x] Test on low-end devices
- [x] Monitor memory usage

### ✅ Testing
- [x] Test on physical devices (iOS and Android)
- [x] Test all user flows
- [x] Test offline functionality
- [x] Test error scenarios
- [x] Test authentication edge cases
- [x] Performance testing

### ✅ Legal & Compliance
- [x] Privacy Policy (docs/privacy.html)
- [x] Terms of Service (docs/terms.html)
- [x] GDPR compliance (if applicable)
- [x] App Store guidelines compliance
- [x] Google Play Store guidelines compliance

## Build & Deploy

### Android
```bash
# 1. Build APK for testing
npm run build:android

# 2. Build AAB for Google Play Store
expo build:android --type app-bundle

# 3. Test the build
# Install on physical device and test all features

# 4. Upload to Google Play Console
# - Create release
# - Upload AAB file
# - Fill in release notes
# - Submit for review
```

### iOS
```bash
# 1. Build for testing
npm run build:ios

# 2. Build for App Store
expo build:ios --type archive

# 3. Test the build
# Install on physical device and test all features

# 4. Upload to App Store Connect
# - Create new version
# - Upload IPA file
# - Fill in release notes
# - Submit for review
```

## Post-Deployment

### Monitoring
- [ ] Set up crash reporting
- [ ] Monitor app performance
- [ ] Track user engagement
- [ ] Monitor Firebase usage
- [ ] Set up alerts for errors

### Support
- [ ] Prepare support documentation
- [ ] Set up customer support channels
- [ ] Create FAQ section
- [ ] Prepare troubleshooting guides

### Marketing
- [ ] App store optimization (ASO)
- [ ] Screenshots and videos
- [ ] App description
- [ ] Keywords optimization
- [ ] Social media presence

## Environment Variables

### Development
```bash
NODE_ENV=development
EXPO_PUBLIC_FIREBASE_API_KEY=your_dev_api_key
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_dev_project_id
```

### Production
```bash
NODE_ENV=production
EXPO_PUBLIC_FIREBASE_API_KEY=your_prod_api_key
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_prod_project_id
```

## Firebase Production Setup

### 1. Create Production Project
- Create new Firebase project for production
- Enable Authentication (Google Sign-In)
- Enable Firestore Database
- Set up security rules

### 2. Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Public plans can be read by anyone
    match /publicPlans/{planId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### 3. Authentication
- Configure Google Sign-In
- Set up OAuth consent screen
- Add authorized domains
- Configure redirect URIs

## App Store Requirements

### Google Play Store
- [ ] Privacy Policy URL
- [ ] App content rating
- [ ] Target audience
- [ ] Content descriptors
- [ ] App signing
- [ ] Play App Signing

### Apple App Store
- [ ] Privacy Policy URL
- [ ] App content rating
- [ ] Age rating
- [ ] App Store Connect setup
- [ ] App signing certificates
- [ ] Provisioning profiles

## Performance Benchmarks

### Target Metrics
- App launch time: < 3 seconds
- Screen transitions: < 500ms
- Memory usage: < 100MB
- Battery usage: Minimal impact
- Network requests: Optimized

### Testing Devices
- iPhone SE (2020) - Low-end iOS
- iPhone 15 Pro - High-end iOS
- Samsung Galaxy A12 - Low-end Android
- Samsung Galaxy S23 - High-end Android

## Rollback Plan

### If Issues Arise
1. **Immediate Actions**
   - Disable new features if possible
   - Monitor error rates
   - Check user feedback

2. **Rollback Steps**
   - Revert to previous version
   - Update app store listings
   - Communicate with users

3. **Post-Rollback**
   - Investigate root cause
   - Fix issues in development
   - Plan new release

## Success Metrics

### Key Performance Indicators (KPIs)
- App store rating: > 4.0
- Crash rate: < 1%
- User retention: > 30% (7-day)
- Session duration: > 5 minutes
- Feature adoption: > 60%

### Monitoring Tools
- Firebase Analytics
- Firebase Crashlytics
- App Store Connect Analytics
- Google Play Console Analytics
- Custom error tracking

## Final Checklist

### Before Going Live
- [ ] All tests pass
- [ ] No console errors
- [ ] Performance is acceptable
- [ ] Security is verified
- [ ] Legal documents are ready
- [ ] Support is prepared
- [ ] Marketing materials are ready
- [ ] Rollback plan is in place

### Launch Day
- [ ] Monitor app store submissions
- [ ] Watch for immediate issues
- [ ] Monitor user feedback
- [ ] Be ready to respond to support requests
- [ ] Track key metrics

### Post-Launch (First Week)
- [ ] Monitor crash reports
- [ ] Track user engagement
- [ ] Respond to user feedback
- [ ] Monitor performance metrics
- [ ] Plan first update if needed 