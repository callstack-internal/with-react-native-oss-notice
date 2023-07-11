import type { ConfigPlugin } from 'expo/config-plugins';

import { invokeCommand } from "../utils";
import { declareAboutLibrariesPlugin } from './declareAboutLibrariesPlugin';
import { applyAndConfigureAboutLibrariesPlugin } from './applyAndConfigureAboutLibrariesPlugin';
import { addAndroidStyleForListActivity } from './addAndroidStyleForListActivity';
import { addListActivity } from './addListActivity';

export const withAndroidNotice: ConfigPlugin = (config) => {
  invokeCommand('npx react-native-oss-license --format about-libraries-json --only-direct-dependency --uses-plugin')

  config = declareAboutLibrariesPlugin(config)
  config = applyAndConfigureAboutLibrariesPlugin(config);
  config = addAndroidStyleForListActivity(config);
  config = addListActivity(config);
  return config;
}
