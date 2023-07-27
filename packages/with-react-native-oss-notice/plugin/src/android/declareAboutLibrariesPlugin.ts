import type { ExpoConfig } from 'expo/config';
import { withProjectBuildGradle } from 'expo/config-plugins';

import { declareAboutLibrariesPluginUtil } from '../../../plugin-utils/build/android';

/**
 * This helper adds AboutLibraries inside `android/build.gradle`
 * 
 * It's not the best approach, as it's done with regex, but it's the best that can be done right now
 */
export function declareAboutLibrariesPlugin(config: ExpoConfig): ExpoConfig {
  return withProjectBuildGradle(config, (exportedConfig) => {
    if (exportedConfig.modResults.language === 'groovy') {
      exportedConfig.modResults.contents = declareAboutLibrariesPluginUtil(exportedConfig.modResults.contents);
    } else {
      // TODO: declare plugin when Expo will support Gradle Kotlin scripts
      console.warn('[<rootProject>/build.gradle] Gradle scripts in Kotlin are not supported yet');
    }

    return exportedConfig;
  });
}
