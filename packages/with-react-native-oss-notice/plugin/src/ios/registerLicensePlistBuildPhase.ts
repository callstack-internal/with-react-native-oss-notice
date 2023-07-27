import type { ExpoConfig } from 'expo/config';
import { IOSConfig, withXcodeProject } from 'expo/config-plugins';

import { registerLicensePlistBuildPhaseUtil } from '../../../plugin-utils/build/ios';

export function registerLicensePlistBuildPhase(config: ExpoConfig): ExpoConfig {
  return withXcodeProject(config, (exportedConfig) => {
    const projectName = IOSConfig.XcodeUtils.getProjectName(exportedConfig.modRequest.projectRoot);
    const projectTargetId = IOSConfig.XcodeUtils.getApplicationNativeTarget({
      project: exportedConfig.modResults,
      projectName,
    }).uuid;

    exportedConfig.modResults = registerLicensePlistBuildPhaseUtil(projectTargetId, exportedConfig.modResults);

    return exportedConfig;
  });
}
