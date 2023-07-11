import type { ExpoConfig } from 'expo/config';
import { withAppBuildGradle } from 'expo/config-plugins';
import { PLUGIN_APPLY_BLOCK, PLUGIN_APPLY_BLOCK_IDENTIFIER } from './aboutLibrariesConstants';

/**
 * This helper applies and configures AboutLibraries inside `android/app/build.gradle`
 * 
 * It's not the best approach, as it's done with regex, but it's the best that can be done right now
 */
export function applyAndConfigureAboutLibrariesPlugin(config: ExpoConfig): ExpoConfig {
  return withAppBuildGradle(config, (exportedConfig) => {
    if (exportedConfig.modResults.language === 'groovy') {
      // Apply plugin
      const applyPluginBlockRegex = new RegExp(`apply\\s+plugin:\\s+['"]${PLUGIN_APPLY_BLOCK_IDENTIFIER}['"]`)

      if (!exportedConfig.modResults.contents.match(applyPluginBlockRegex)?.length) {
        exportedConfig.modResults.contents += `\n${PLUGIN_APPLY_BLOCK}`
      }

      // Configure plugin
      const pluginConfigRegex = /aboutLibraries {/

      if (!exportedConfig.modResults.contents.match(pluginConfigRegex)?.length) {
        exportedConfig.modResults.contents += `\n\naboutLibraries {\n    configPath = "config"\n}`
      }
    } else {
      // TODO: declare plugin when Expo will support Gradle Kotlin scripts
      console.warn('[<rootProject>/app/build.gradle] Gradle scripts in Kotlin are not supported yet')
    }
    return exportedConfig
  });
}
