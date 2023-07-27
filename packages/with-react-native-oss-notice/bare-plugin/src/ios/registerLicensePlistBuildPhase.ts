import fs from 'fs';

import { registerLicensePlistBuildPhaseUtil } from '../../../plugin-utils/build/ios';

import { getApplicationNativeTarget, getIOSPbxProj } from './utils';

export function registerLicensePlistBuildPhase(iosProjectPath: string) {
  const projectTargetId = getApplicationNativeTarget(iosProjectPath)?.uuid;

  if (!projectTargetId) {
    throw new Error('Cannot locate iOS application native target');
  }

  const { pbxproj, pbxprojPath } = getIOSPbxProj(iosProjectPath);
  const modifiedPbxproj = registerLicensePlistBuildPhaseUtil(projectTargetId, pbxproj);

  fs.writeFileSync(pbxprojPath, modifiedPbxproj.writeSync());
}
