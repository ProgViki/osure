import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateEmail,
  updatePassword,
  AuthError,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithCredential
} from 'firebase/auth';
import { auth } from '@/firebaseConfig';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import * as Facebook from 'expo-auth-session/providers/facebook';
import { ResponseType } from 'expo-auth-session';
import * as AppleAuthentication from 'expo-apple-authentication';
import { Platform } from 'react-native';

WebBrowser.maybeCompleteAuthSession();

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserEmail: (email: string) => Promise<void>;
  updateUserPassword: (password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithFacebook: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Google Sign-In with Expo
  const [googleRequest, googleResponse, googlePromptAsync] = Google.useAuthRequest({
    clientId: process.env.EXPO_PUBLIC_GOOGLE_EXPO_CLIENT_ID,
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  });

  // Facebook Sign-In with Expo
  const [facebookRequest, facebookResponse, facebookPromptAsync] = Facebook.useAuthRequest({
    clientId: process.env.EXPO_PUBLIC_FACEBOOK_APP_ID,
    scopes: ['public_profile', 'email'],
    responseType: ResponseType.Token,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Handle Google Sign-In response
  useEffect(() => {
    const handleGoogleResponse = async () => {
      if (googleResponse?.type === 'success' && googleResponse.authentication?.idToken) {
        await handleGoogleToken(googleResponse.authentication.idToken);
      } else if (googleResponse?.type === 'error') {
        setError(googleResponse.error?.message || 'Google sign-in failed');
      }
    };

    handleGoogleResponse();
  }, [googleResponse]);

  // Handle Facebook Sign-In response
  useEffect(() => {
    const handleFacebookResponse = async () => {
      if (facebookResponse?.type === 'success' && facebookResponse.authentication?.accessToken) {
        await handleFacebookToken(facebookResponse.authentication.accessToken);
      } else if (facebookResponse?.type === 'error') {
        setError(facebookResponse.error?.message || 'Facebook sign-in failed');
      }
    };

    handleFacebookResponse();
  }, [facebookResponse]);

  const clearError = () => setError(null);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      clearError();
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      const error = err as AuthError;
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      setLoading(true);
      clearError();
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (err) {
      const error = err as AuthError;
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      clearError();
      await signOut(auth);
    } catch (err) {
      const error = err as AuthError;
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setLoading(true);
      clearError();
      await sendPasswordResetEmail(auth, email);
    } catch (err) {
      const error = err as AuthError;
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateUserEmail = async (email: string) => {
    if (!user) throw new Error('No user logged in');
    
    try {
      setLoading(true);
      clearError();
      await updateEmail(user, email);
    } catch (err) {
      const error = err as AuthError;
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateUserPassword = async (password: string) => {
    if (!user) throw new Error('No user logged in');
    
    try {
      setLoading(true);
      clearError();
      await updatePassword(user, password);
    } catch (err) {
      const error = err as AuthError;
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      clearError();
      
      if (!googleRequest) {
        throw new Error('Google auth request not ready');
      }
      
      await googlePromptAsync();
    } catch (err: any) {
      console.error('Google Sign-In Error:', err);
      setError(err.message || 'Failed to start Google sign-in');
      setLoading(false);
    }
  };

  const handleGoogleToken = async (idToken: string) => {
    try {
      setLoading(true);
      const credential = GoogleAuthProvider.credential(idToken);
      await signInWithCredential(auth, credential);
    } catch (err: any) {
      console.error('Firebase Google Sign-In Error:', err);
      setError(err.message || 'Failed to authenticate with Google');
    } finally {
      setLoading(false);
    }
  };

  const signInWithFacebook = async () => {
    try {
      setLoading(true);
      clearError();
      
      if (!facebookRequest) {
        throw new Error('Facebook auth request not ready');
      }
      
      await facebookPromptAsync();
    } catch (err: any) {
      console.error('Facebook Sign-In Error:', err);
      setError(err.message || 'Failed to start Facebook sign-in');
      setLoading(false);
    }
  };

  const handleFacebookToken = async (accessToken: string) => {
    try {
      setLoading(true);
      const credential = FacebookAuthProvider.credential(accessToken);
      await signInWithCredential(auth, credential);
    } catch (err: any) {
      console.error('Firebase Facebook Sign-In Error:', err);
      setError(err.message || 'Failed to authenticate with Facebook');
    } finally {
      setLoading(false);
    }
  };

  const signInWithApple = async () => {
    if (Platform.OS !== 'ios') {
      setError('Apple Sign In is only available on iOS');
      return;
    }

    try {
      setLoading(true);
      clearError();

      // Perform Apple authentication
      const appleAuth = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      // Note: For Firebase Apple Sign-In, you need additional setup
      // This is a simplified version - you'll need to configure Apple in Firebase Console
      // and set up the Firebase Admin SDK or use a cloud function to handle the token
      
      setError('Apple Sign-In requires additional Firebase configuration');
      console.warn('Apple Sign-In requires additional setup. See Firebase documentation.');
      
    } catch (err: any) {
      console.error('Apple Sign-In Error:', err);
      if (err.code === 'ERR_REQUEST_CANCELED') {
        setError('Apple Sign In cancelled');
      } else {
        setError(err.message || 'Apple sign in failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signUp,
    logout,
    resetPassword,
    updateUserEmail,
    updateUserPassword,
    signInWithGoogle,
    signInWithFacebook,
    signInWithApple,
    error,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};