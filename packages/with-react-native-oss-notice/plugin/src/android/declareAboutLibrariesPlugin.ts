import type { ExpoConfig } from 'expo/config';
import { withProjectBuildGradle } from 'expo/config-plugins';

import { GRADLE_PLUGIN_PORTAL_URL, PLUGIN_CLASSPATH, PLUGIN_VERSION } from './aboutLibrariesConstants';

/**
 * This helper adds AboutLibraries inside `android/build.gradle`
 * 
 * It's not the best approach, as it's done with regex, but it's the best that can be done right now
 */
export function declareAboutLibrariesPlugin(config: ExpoConfig): ExpoConfig {
  return withProjectBuildGradle(config, (exportedConfig) => {
    if (exportedConfig.modResults.language === 'groovy') {
      if (!exportedConfig.modResults.contents.match(PLUGIN_CLASSPATH)?.length) {
        // Add Gradle Plugin Portal repository if it's not included
        if (!exportedConfig.modResults.contents.match(GRADLE_PLUGIN_PORTAL_URL)?.length) {
          exportedConfig.modResults.contents = exportedConfig.modResults.contents.replace(
            /repositories\s?{/,
            `repositories {\n    maven { url = uri("${GRADLE_PLUGIN_PORTAL_URL}") }`
          )
        }

        // Declare the AboutLibraries plugin
        exportedConfig.modResults.contents = exportedConfig.modResults.contents.replace(
          /dependencies\s?{/,
          `dependencies {\n    classpath '${PLUGIN_CLASSPATH}:${PLUGIN_VERSION}'`
        )        
      }
    } else {
      // TODO: declare plugin when Expo will support Gradle Kotlin scripts
      console.warn('[<rootProject>/build.gradle] Gradle scripts in Kotlin are not supported yet')
    }
    return exportedConfig
  })
}
