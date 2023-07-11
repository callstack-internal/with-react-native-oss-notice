import fs from 'fs';
import path from 'path';

import type { ExpoConfig } from 'expo/config';
import { IOSConfig, withXcodeProject } from 'expo/config-plugins';

import { SETTINGS_BUNDLE_ROOT_PLIST_CONTENT } from './licensePlistConstants';

/**
 * This helper configures `Settings.bundle` for the app
 */
export function addSettingsBundle(config: ExpoConfig): ExpoConfig {
  return withXcodeProject(config, (exportedConfig) => {
    const projectName = IOSConfig.XcodeUtils.getProjectName(exportedConfig.modRequest.projectRoot);
    const projectTargetId = IOSConfig.XcodeUtils.getApplicationNativeTarget({
      project: exportedConfig.modResults,
      projectName,
    }).uuid;
    const settingsBundleFilename = 'Settings.bundle'
    const settingsBundleRootPlistFilename = 'Root.plist'
    const settingsBundlePath = path.join(exportedConfig.modRequest.platformProjectRoot, settingsBundleFilename);
    const settingsBundleRootPlistPath = path.join(settingsBundlePath, settingsBundleRootPlistFilename);

    if (!fs.existsSync(settingsBundleRootPlistPath)) {
      // Create `Settings.bundle` directory
      if (!fs.existsSync(settingsBundlePath)) {
        fs.mkdirSync(settingsBundlePath, { recursive: true });
      }

      // Create `Settings.bundle/Root.plist`
      fs.writeFileSync(
        settingsBundleRootPlistPath,
        SETTINGS_BUNDLE_ROOT_PLIST_CONTENT,
      );

      // Link `Settings.bundle` to the resources
      exportedConfig.modResults = IOSConfig.XcodeUtils.addResourceFileToGroup({
        filepath: settingsBundleFilename,
        groupName: projectName,
        isBuildFile: true,
        project: exportedConfig.modResults,
        targetUuid: projectTargetId,
      })
    } else {
      // TODO: handle the case, where `Settings.bundle` is already created
      console.warn('[<rootProject>/ios/Settings.bundle/Root.plist] Settings.bundle/Root.plist is already present')
    }

    return exportedConfig;
  });
}
