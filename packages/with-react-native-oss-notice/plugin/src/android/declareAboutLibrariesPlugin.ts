import type { ExpoConfig } from 'expo/config';
import { withProjectBuildGradle } from 'expo/config-plugins';

import { declareAboutLibrariesPluginUtil } from '../../../plugin-utils/build/android';

/**
 * Modifies root build.gradle with a declaration for AboutLibraries Gradle plugin
 *
 * NOTE: As of now, it doesn't support build.gradle.kts (Gradle Kotlin Script)
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
