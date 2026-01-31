// types/google-signin.d.ts
declare module '@react-native-google-signin/google-signin' {
  export interface User {
    idToken: string | null;
    user: {
      email: string;
      familyName: string | null;
      givenName: string | null;
      id: string;
      name: string | null;
      photo: string | null;
    };
  }

  export interface SignInResponse {
    idToken: string | null;
    user: User['user'];
  }

  export const GoogleSignin: {
    configure(config: any): void;
    hasPlayServices(params?: any): Promise<boolean>;
    signIn(): Promise<SignInResponse>;
    signOut(): Promise<void>;
    isSignedIn(): Promise<boolean>;
    getCurrentUser(): Promise<User | null>;
    getTokens(): Promise<{ idToken: string; accessToken: string }>;
  };

  export const statusCodes: {
    SIGN_IN_CANCELLED: string;
    IN_PROGRESS: string;
    PLAY_SERVICES_NOT_AVAILABLE: string;
    SIGN_IN_REQUIRED: string;
  };
}