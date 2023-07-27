import path from 'path';

import { applyAndConfigureAboutLibrariesPluginUtil } from '../../../plugin-utils/build/android';

import { modifyFileContent } from './utils';

export function applyAndConfigureAboutLibrariesPlugin(androidProjectPath: string) {
  modifyFileContent(path.join(androidProjectPath, 'app', 'build.gradle'), applyAndConfigureAboutLibrariesPluginUtil);
}
