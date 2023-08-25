import fs from 'fs';

import { registerLicensePlistBuildPhaseUtil } from '../../../plugin-utils/build/ios';

import { getAllApplicationNativeTargets, getIOSPbxProj } from './utils';

/**
 * Registers a shell script that invokes generation of license metadata with LicensePlist
 *
 * It scans available application native targets and for each of them
 * creates and links a shell script build phase responsible for iOS native deps license metadata
 */
export function registerLicensePlistBuildPhase(iosProjectPath: string) {
  const { pbxproj, pbxprojPath } = getIOSPbxProj(iosProjectPath);
  const nativeTargets = getAllApplicationNativeTargets(pbxproj);

  nativeTargets.map((nativeTarget) => {
    registerLicensePlistBuildPhaseUtil(nativeTarget.uuid, pbxproj);
  });

  fs.writeFileSync(pbxprojPath, pbxproj.writeSync());
}
