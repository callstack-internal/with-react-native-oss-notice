import NativeReactNativeLegal from './NativeReactNativeLegal';

export const ReactNativeLegal = {
  launchLicenseListScreen: (licenseHeaderText?: string) => {
    /**
     * On iOS, the licenses list is displayed as a custom table view controller
     */
    NativeReactNativeLegal.launchLicenseListScreen(licenseHeaderText ?? 'OSS Licenses');
  },
};
