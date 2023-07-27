import path from 'path';

import { type ConfigPlugin, withXcodeProject } from 'expo/config-plugins';

import { generateLicensePlistNPMOutput, scanDependencies } from '../../../plugin-utils/build/common';

import { addSettingsBundle } from './addSettingsBundle';
import { registerLicensePlistBuildPhase } from './registerLicensePlistBuildPhase';

export const withIosNotice: ConfigPlugin = (config) => {
  withXcodeProject(config, async (exportedConfig) => {
    const licenses = scanDependencies(path.join(exportedConfig.modRequest.projectRoot, 'package.json'));

    generateLicensePlistNPMOutput(licenses, exportedConfig.modRequest.platformProjectRoot);
    return exportedConfig;
  });
  config = addSettingsBundle(config);
  config = registerLicensePlistBuildPhase(config);
  return config;
};
