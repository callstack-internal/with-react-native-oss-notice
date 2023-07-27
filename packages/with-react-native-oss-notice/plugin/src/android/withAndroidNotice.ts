import path from 'path';

import { type ConfigPlugin, withAndroidManifest } from 'expo/config-plugins';

import { generateAboutLibrariesNPMOutput, scanDependencies } from '../../../plugin-utils/build/common';

import { addAndroidStyleForListActivity } from './addAndroidStyleForListActivity';
import { addListActivity } from './addListActivity';
import { applyAndConfigureAboutLibrariesPlugin } from './applyAndConfigureAboutLibrariesPlugin';
import { declareAboutLibrariesPlugin } from './declareAboutLibrariesPlugin';

export const withAndroidNotice: ConfigPlugin = (config) => {
  withAndroidManifest(config, async (exportedConfig) => {
    const licenses = scanDependencies(path.join(exportedConfig.modRequest.projectRoot, 'package.json'));

    generateAboutLibrariesNPMOutput(licenses, exportedConfig.modRequest.platformProjectRoot);
    return exportedConfig;
  });
  config = declareAboutLibrariesPlugin(config);
  config = applyAndConfigureAboutLibrariesPlugin(config);
  config = addAndroidStyleForListActivity(config);
  config = addListActivity(config);
  return config;
};
