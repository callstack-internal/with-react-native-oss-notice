import fs from 'fs';

import { addSettingsBundleUtil } from '../../../plugin-utils/build/ios';

import { getApplicationNativeTarget, getIOSPbxProj, getIOSProjectName } from './utils';

export function addSettingsBundle(iosProjectPath: string) {
  addSettingsBundleUtil(
    iosProjectPath,
    ({ settingsBundleFilename }) => {
      const projectName = getIOSProjectName(iosProjectPath);
      const projectTargetId = getApplicationNativeTarget(iosProjectPath)?.uuid;

      if (!projectTargetId) {
        throw new Error('Cannot locate iOS application native target');
      }

      const { pbxproj, pbxprojPath } = getIOSPbxProj(iosProjectPath);

      const settingsBundleFile = pbxproj.addFile(
        settingsBundleFilename,
        pbxproj.findPBXGroupKey({ name: projectName })
      );

      if (!settingsBundleFile) {
        throw new Error('Could not add Settings.bundle file reference to xcode project');
      }

      settingsBundleFile.target = projectTargetId;
      settingsBundleFile.uuid = pbxproj.generateUuid();

      pbxproj.addToPbxBuildFileSection(settingsBundleFile);
      pbxproj.addToPbxResourcesBuildPhase(settingsBundleFile);

      fs.writeFileSync(pbxprojPath, pbxproj.writeSync());
    },
  );
}
