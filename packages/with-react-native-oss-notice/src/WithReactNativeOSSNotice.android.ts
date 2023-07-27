import NativeWithReactNativeOSSNotice from './NativeWithReactNativeOSSNotice';

export const WithReactNativeOSSNotice = {
  launchLicenseListScreen: (licenseHeaderText?: string) => {
    /**
     * On Android, the licenses list is displayed as a custom activity
     */
    NativeWithReactNativeOSSNotice.launchLicenseListScreen(licenseHeaderText ?? 'OSS Licenses');
  },
};
