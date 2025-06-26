import * as AppleAuthentication from 'expo-apple-authentication';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { OAuthProvider, signInWithCredential } from 'firebase/auth';
import { getAuthInstance } from '../config/firebase';
import * as Crypto from 'expo-crypto';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

// Complete the auth session for web
WebBrowser.maybeCompleteAuthSession();

/**
 * Apple Authentication Service
 */
export class AppleAuthService {
  static currentNonce = null;

  static generateNonce(length = 32) {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return result;
  }

  static async sha256(input) {
    try {
      const digest = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        input,
        { encoding: Crypto.CryptoEncoding.HEX }
      );
      return digest;
    } catch (error) {
      console.error('Error generating SHA256 hash:', error.message);
      throw error;
    }
  }

  static async isAvailable() {
    try {
      return await AppleAuthentication.isAvailableAsync();
    } catch (error) {
      console.log('Apple Authentication not available:', error.message);
      return false;
    }
  }

  static getFirebaseAuth() {
    try {
      const auth = getAuthInstance();
      if (!auth) {
        console.log('Firebase Auth instance is null');
        return null;
      }
      return auth;
    } catch (error) {
      console.error('Error getting Firebase Auth instance:', error.message);
      return null;
    }
  }

  static async signIn() {
    try {
      const isAvailable = await this.isAvailable();
      if (!isAvailable) {
        throw new Error('Apple Sign In is not available on this device. Please use Google Sign In instead.');
      }

      const auth = this.getFirebaseAuth();
      if (!auth) {
        throw new Error('Firebase Auth is not available. Please try again.');
      }

      const nonce = this.generateNonce();
      this.currentNonce = nonce;

      const hashedNonce = await this.sha256(nonce);

      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      if (!credential.identityToken) {
        throw new Error('No identity token received from Apple');
      }

      const provider = new OAuthProvider('apple.com');
      
      const firebaseCredential = provider.credential({
        idToken: credential.identityToken,
        rawNonce: nonce,
      });

      const userCredential = await signInWithCredential(auth, firebaseCredential);
      
      this.currentNonce = null;
      
      return {
        success: true,
        user: userCredential.user,
        appleCredential: credential,
      };

    } catch (error) {
      console.error('Apple Sign In Error:', error.message);
      this.currentNonce = null;

      if (error.code === 'ERR_CANCELED') {
        return {
          success: false,
          error: 'User cancelled Apple Sign In',
          code: 'CANCELLED',
        };
      }

      if (error.code === 'ERR_INVALID_RESPONSE') {
        return {
          success: false,
          error: 'Invalid response from Apple',
          code: 'INVALID_RESPONSE',
        };
      }

      if (error.code === 'auth/account-exists-with-different-credential') {
        return {
          success: false,
          error: 'An account already exists with the same email address but different sign-in credentials',
          code: 'ACCOUNT_EXISTS_WITH_DIFFERENT_CREDENTIAL',
        };
      }

      if (error.code === 'auth/invalid-credential') {
        return {
          success: false,
          error: 'Invalid Apple credential',
          code: 'INVALID_CREDENTIAL',
        };
      }

      if (error.code === 'auth/operation-not-allowed') {
        return {
          success: false,
          error: 'Apple Sign In is not enabled in Firebase Console',
          code: 'OPERATION_NOT_ALLOWED',
        };
      }

      return {
        success: false,
        error: error.message || 'Apple Sign In failed',
        code: error.code || 'UNKNOWN_ERROR',
      };
    }
  }

  static getUserInfo(credential) {
    return {
      email: credential.email,
      displayName: credential.fullName?.givenName + ' ' + credential.fullName?.familyName,
      uid: credential.user,
      providerId: 'apple.com',
    };
  }

  static async revokeToken(authorizationCode) {
    try {
      await AppleAuthentication.revokeAsync(authorizationCode);
    } catch (error) {
      console.error('Error revoking Apple token:', error.message);
      throw error;
    }
  }
}

/**
 * Google Authentication Service
 */
export class GoogleAuthService {
  static discovery = {
    authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenEndpoint: 'https://oauth2.googleapis.com/token',
    revocationEndpoint: 'https://oauth2.googleapis.com/revoke',
  };

  static getGoogleClientId() {
    const clientId = Constants.expoConfig?.extra?.googleClientId;
    if (!clientId) {
      throw new Error('Google Client ID not configured in app.json');
    }
    return clientId;
  }

  static getIOSClientId() {
    const iosClientId = Constants.expoConfig?.extra?.iosClientId;
    if (!iosClientId) {
      throw new Error('iOS Google Client ID not configured in app.json');
    }
    return iosClientId;
  }

  static getRedirectUri() {
    const redirectUri = Constants.expoConfig?.extra?.authSession?.redirectUri;
    if (!redirectUri) {
      throw new Error('Redirect URI not configured in app.json');
    }
    return redirectUri;
  }

  static getFirebaseAuth() {
    try {
      const auth = getAuthInstance();
      if (!auth) {
        console.log('Firebase Auth instance is null');
        return null;
      }
      return auth;
    } catch (error) {
      console.error('Error getting Firebase Auth instance:', error.message);
      return null;
    }
  }

  static createGoogleAuthRequest() {
    // Use the same client ID for both web and iOS to avoid redirect URI mismatch
    const clientId = this.getGoogleClientId();
    const redirectUri = this.getRedirectUri();

    return new AuthSession.AuthRequest({
      clientId,
      scopes: [
        'openid',
        'profile',
        'email',
      ],
      redirectUri,
      responseType: AuthSession.ResponseType.Code,
      extraParams: {
        access_type: 'offline',
      },
      additionalParameters: {},
    });
  }

  static async signIn() {
    try {
      const auth = this.getFirebaseAuth();
      if (!auth) {
        throw new Error('Firebase Auth is not available. Please try again.');
      }

      const request = this.createGoogleAuthRequest();
      const isExpoGo = Constants.appOwnership === 'expo';
      console.log('Google Auth Request created:', {
        clientId: this.getGoogleClientId(),
        redirectUri: this.getRedirectUri(),
        platform: Platform.OS,
        isExpoGo: isExpoGo
      });

      const result = await request.promptAsync(this.discovery);
      console.log('Google Auth Result:', result);

      if (result.type === 'cancel') {
        return {
          success: false,
          error: 'User cancelled Google Sign In',
          code: 'CANCELLED',
        };
      }

      if (result.type === 'error') {
        console.error('Google Auth Error:', result.error);
        return {
          success: false,
          error: result.error?.message || 'Google Sign In failed',
          code: result.error?.code || 'UNKNOWN_ERROR',
        };
      }

      if (result.type !== 'success') {
        return {
          success: false,
          error: 'Unexpected response from Google Sign In',
          code: 'UNEXPECTED_RESPONSE',
        };
      }

      console.log('Exchanging code for tokens...');
      const tokenResult = await AuthSession.exchangeCodeAsync(
        {
          clientId: this.getGoogleClientId(),
          code: result.params.code,
          redirectUri: this.getRedirectUri(),
          extraParams: {
            code_verifier: request.codeVerifier,
          },
        },
        this.discovery
      );
      console.log('Token exchange successful');

      const provider = new OAuthProvider('google.com');
      
      const firebaseCredential = provider.credential({
        idToken: tokenResult.idToken,
        accessToken: tokenResult.accessToken,
      });

      const userCredential = await signInWithCredential(auth, firebaseCredential);
      
      return {
        success: true,
        user: userCredential.user,
        googleCredential: {
          idToken: tokenResult.idToken,
          accessToken: tokenResult.accessToken,
          refreshToken: tokenResult.refreshToken,
        },
      };

    } catch (error) {
      console.error('Google Sign In Error:', error.message, error);

      if (error.code === 'ERR_CANCELED') {
        return {
          success: false,
          error: 'User cancelled Google Sign In',
          code: 'CANCELLED',
        };
      }

      if (error.code === 'ERR_INVALID_RESPONSE') {
        return {
          success: false,
          error: 'Invalid response from Google',
          code: 'INVALID_RESPONSE',
        };
      }

      if (error.code === 'auth/account-exists-with-different-credential') {
        return {
          success: false,
          error: 'An account already exists with the same email address but different sign-in credentials',
          code: 'ACCOUNT_EXISTS_WITH_DIFFERENT_CREDENTIAL',
        };
      }

      if (error.code === 'auth/invalid-credential') {
        return {
          success: false,
          error: 'Invalid Google credential',
          code: 'INVALID_CREDENTIAL',
        };
      }

      if (error.code === 'auth/operation-not-allowed') {
        return {
          success: false,
          error: 'Google Sign In is not enabled in Firebase Console',
          code: 'OPERATION_NOT_ALLOWED',
        };
      }

      if (error.code === 'auth/popup-closed-by-user') {
        return {
          success: false,
          error: 'Google Sign In popup was closed',
          code: 'POPUP_CLOSED',
        };
      }

      return {
        success: false,
        error: error.message || 'Google Sign In failed',
        code: error.code || 'UNKNOWN_ERROR',
      };
    }
  }

  static getUserInfo(credential) {
    return {
      email: credential.email,
      displayName: credential.displayName,
      photoURL: credential.photoURL,
      uid: credential.uid,
      providerId: credential.providerId,
    };
  }

  static async signOut() {
    try {
      const auth = this.getFirebaseAuth();
      if (auth) {
        await auth.signOut();
      }
    } catch (error) {
      console.error('Error signing out from Google:', error.message);
      throw error;
    }
  }

  static isSignedIn() {
    try {
      const auth = this.getFirebaseAuth();
      return auth ? !!auth.currentUser : false;
    } catch (error) {
      console.error('Error checking sign-in status:', error.message);
      return false;
    }
  }

  static getCurrentUser() {
    try {
      const auth = this.getFirebaseAuth();
      return auth ? auth.currentUser : null;
    } catch (error) {
      console.error('Error getting current user:', error.message);
      return null;
    }
  }
} 