import NativeReactNativeLegal from './NativeReactNativeLegal';

export const ReactNativeLegal = {
  launchLicenseListScreen: (licenseHeaderText?: string) => {
    /**
     * On Android, the licenses list is displayed as a custom activity
     */
    NativeReactNativeLegal.launchLicenseListScreen(licenseHeaderText ?? 'OSS Licenses');
  },
};
