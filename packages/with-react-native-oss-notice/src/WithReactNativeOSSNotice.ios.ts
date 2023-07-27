import NativeWithReactNativeOSSNotice from './NativeWithReactNativeOSSNotice';

export const WithReactNativeOSSNotice = {
  launchLicenseListScreen: (licenseHeaderText?: string) => {
    /**
     * On iOS, the licenses list is displayed as a custom table view controller
     */
    NativeWithReactNativeOSSNotice.launchLicenseListScreen(licenseHeaderText ?? 'OSS Licenses');
  },
};
