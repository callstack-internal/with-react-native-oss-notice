import type { ExpoConfig } from 'expo/config';
import { IOSConfig, withXcodeProject } from 'expo/config-plugins';

import { addSettingsBundleUtil } from '../../../plugin-utils/build/ios';

/**
 * This helper configures `Settings.bundle` for the app
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
