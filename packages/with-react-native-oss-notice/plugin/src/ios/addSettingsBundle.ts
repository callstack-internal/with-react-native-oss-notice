import type { ExpoConfig } from 'expo/config';
import { IOSConfig, withXcodeProject } from 'expo/config-plugins';

import { addSettingsBundleUtil } from '../../../plugin-utils/build/ios';

/**
 * Creates a Settings.bundle and links it to all application native targets
 */
export function addSettingsBundle(config: ExpoConfig): ExpoConfig {
  return withXcodeProject(config, (exportedConfig) => {
    addSettingsBundleUtil(exportedConfig.modRequest.platformProjectRoot, ({ settingsBundleFilename }) => {
      const projectName = IOSConfig.XcodeUtils.getProjectName(exportedConfig.modRequest.projectRoot);
      const projectTargetId = IOSConfig.XcodeUtils.getApplicationNativeTarget({
        project: exportedConfig.modResults,
        projectName,
      }).uuid;

      exportedConfig.modResults = IOSConfig.XcodeUtils.addResourceFileToGroup({
        filepath: settingsBundleFilename,
        groupName: projectName,
        isBuildFile: true,
        project: exportedConfig.modResults,
        targetUuid: projectTargetId,
      });
    });

    return exportedConfig;
  });
}
