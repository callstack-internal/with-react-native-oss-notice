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
      console.warn('Gradle Kotlin scripts are not supported yet');
    }

    return exportedConfig;
  });
}
