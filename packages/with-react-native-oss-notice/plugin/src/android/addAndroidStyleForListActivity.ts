import type { ExpoConfig } from 'expo/config';
import { withAndroidStyles } from 'expo/config-plugins';

import { addAndroidStyleForListActivityUtil } from '../../../plugin-utils/build/android';

/**
 * This helper adds custom style for license list activity in `android/app/src/main/res/values/styles.xml`
 */
export function addAndroidStyleForListActivity(config: ExpoConfig): ExpoConfig {
  return withAndroidStyles(config, (exportedConfig) => {
    if (!!exportedConfig.modResults.resources.style) {
      exportedConfig.modResults.resources.style = addAndroidStyleForListActivityUtil(
        exportedConfig.modResults.resources.style
      );
    }

    return exportedConfig;
  });
}
