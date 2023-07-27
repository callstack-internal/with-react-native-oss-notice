import type { ExpoConfig } from 'expo/config';
import { withAndroidStyles } from 'expo/config-plugins';

import { prepareListActivityStyle } from '../../../plugin-utils/build/android';

/**
 * This helper adds custom style for license list activity in `android/app/src/main/res/values/styles.xml`
 */
export function addAndroidStyleForListActivity(config: ExpoConfig): ExpoConfig {
  return withAndroidStyles(config, (exportedConfig) => {
    exportedConfig.modResults.resources.style?.push(prepareListActivityStyle());
    return exportedConfig;
  });
}
