import path from 'path';

import { generateLicensePlistNPMOutput, scanDependencies } from '../../../plugin-utils/build/common';

import { addSettingsBundle } from './addSettingsBundle';
import { registerLicensePlistBuildPhase } from './registerLicensePlistBuildPhase';

export function iosCommand(iosProjectPath: string) {
  const licenses = scanDependencies(path.join(path.resolve(iosProjectPath, '..'), 'package.json'));

  generateLicensePlistNPMOutput(licenses, iosProjectPath);

  addSettingsBundle(iosProjectPath);
  registerLicensePlistBuildPhase(iosProjectPath);
}
