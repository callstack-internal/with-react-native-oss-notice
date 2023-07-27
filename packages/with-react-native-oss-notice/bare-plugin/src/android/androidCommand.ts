import path from 'path';

import { generateAboutLibrariesNPMOutput, scanDependencies } from '../../../plugin-utils/build/common';

import { addAndroidStyleForListActivity } from './addAndroidStyleForListActivity';
import { addListActivity } from './addListActivity';
import { applyAndConfigureAboutLibrariesPlugin } from './applyAndConfigureAboutLibrariesPlugin';
import { declareAboutLibrariesPlugin } from './declareAboutLibrariesPlugin';

export function androidCommand(androidProjectPath: string) {
  const licenses = scanDependencies(path.join(path.resolve(androidProjectPath, '..'), 'package.json'));

  generateAboutLibrariesNPMOutput(licenses, androidProjectPath);

  declareAboutLibrariesPlugin(androidProjectPath);
  applyAndConfigureAboutLibrariesPlugin(androidProjectPath);
  addAndroidStyleForListActivity(androidProjectPath);
  addListActivity(androidProjectPath);
}
