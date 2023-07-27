import type { ExpoConfig } from 'expo/config';
import { withAndroidManifest } from 'expo/config-plugins';

import { prepareListActivity } from '../../../plugin-utils/build/android';

/**
 * This helper adds custom activity to the app in `android/app/src/main/AndroidManifest.xml`
 */
export function addListActivity(config: ExpoConfig): ExpoConfig {
  return withAndroidManifest(config, (exportedConfig) => {
    exportedConfig.modResults.manifest.application?.[0].activity?.push(prepareListActivity());
    return exportedConfig;
  });
}
