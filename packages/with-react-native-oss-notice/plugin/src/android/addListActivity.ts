import type { ExpoConfig } from 'expo/config';
import { withAndroidManifest } from 'expo/config-plugins';

import { addListActivityUtil } from '../../../plugin-utils/build/android';

/**
 * This helper adds custom activity to the app in `android/app/src/main/AndroidManifest.xml`
 */
export function addListActivity(config: ExpoConfig): ExpoConfig {
  return withAndroidManifest(config, (exportedConfig) => {
    if (exportedConfig.modResults.manifest.application?.[0].activity) {
      exportedConfig.modResults.manifest.application[0].activity = addListActivityUtil(
        exportedConfig.modResults.manifest.application[0].activity,
      );
    }

    return exportedConfig;
  });
}
