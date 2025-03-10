import path from 'path';

import { type ConfigPlugin, withAndroidManifest } from 'expo/config-plugins';

import { generateAboutLibrariesNPMOutput, scanDependencies } from '../../../plugin-utils/build/common';

import { addListActivity } from './addListActivity';
import { applyAndConfigureAboutLibrariesPlugin } from './applyAndConfigureAboutLibrariesPlugin';
import { declareAboutLibrariesPlugin } from './declareAboutLibrariesPlugin';

/**
 * Implementation of config plugin for Android setup
 *
 * It scans the NPM dependencies, generates AboutLibraries-compatible metadata,
 * installs & configures AboutLibraries Gradle plugin and adds Android Activity with a list of dependencies and their licenses
 */
export const withAndroidLegal: ConfigPlugin = (config) => {
  withAndroidManifest(config, async (exportedConfig) => {
    const licenses = scanDependencies(path.join(exportedConfig.modRequest.projectRoot, 'package.json'));

    generateAboutLibrariesNPMOutput(licenses, exportedConfig.modRequest.platformProjectRoot);
    return exportedConfig;
  });
  config = declareAboutLibrariesPlugin(config);
  config = applyAndConfigureAboutLibrariesPlugin(config);
  config = addListActivity(config);
  return config;
};
