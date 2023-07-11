import { Linking } from 'react-native';

export const WithReactNativeOSSNotice = {
  launchLicenseListScreen: (_licenseHeaderText: string) => {
    /**
     * On iOS, the licenses list is inside dedicated section in the app's settings
     */
    Linking.openSettings();
  }
};
