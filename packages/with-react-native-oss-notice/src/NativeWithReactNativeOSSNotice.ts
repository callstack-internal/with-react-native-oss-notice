import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  launchLicenseListScreen(licenseHeaderText: string): void;
}

export default TurboModuleRegistry.getEnforcing<Spec>('WithReactNativeOSSNoticeModule');
