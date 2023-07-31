import type { ExpoConfig } from 'expo/config';
import { withAppBuildGradle } from 'expo/config-plugins';

import { applyAndConfigureAboutLibrariesPluginUtil } from '../../../plugin-utils/build/android';

/**
 * This helper applies and configures AboutLibraries inside `android/app/build.gradle`
 * 
 * It's not the best approach, as it's done with regex, but it's the best that can be done right now
 */
export function applyAndConfigureAboutLibrariesPlugin(config: ExpoConfig): ExpoConfig {
  return withAppBuildGradle(config, (exportedConfig) => {
    if (exportedConfig.modResults.language === 'groovy') {
      exportedConfig.modResults.contents = applyAndConfigureAboutLibrariesPluginUtil(
        exportedConfig.modResults.contents
      );
    } else {
      console.warn('Gradle Kotlin scripts are not supported yet');
    }

    return exportedConfig;
  });
}
