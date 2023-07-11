import type { ConfigPlugin } from 'expo/config-plugins';

import { invokeCommand } from "../utils";
import { addSettingsBundle } from './addSettingsBundle';
import { registerLicensePlistBuildPhase } from './registerLicensePlistBuildPhase';

export const withIosNotice: ConfigPlugin = (config) => {
  invokeCommand('npx react-native-oss-license --format settings-bundle --only-direct-dependency --output-path=ios/Settings.bundle');

  config = addSettingsBundle(config);
  config = registerLicensePlistBuildPhase(config);
  return config;
}
