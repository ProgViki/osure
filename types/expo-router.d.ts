import { LinkProps } from 'expo-router';

declare global {
  namespace ReactNavigation {
    interface RootParamList {
      '(tabs)': undefined;
      Camera: undefined;
      // Add other screens here
    }
  }
}

export {};