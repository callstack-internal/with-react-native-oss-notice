import path from 'path';

import { declareAboutLibrariesPluginUtil } from '../../../plugin-utils/build/android';

import { modifyFileContent } from './utils';

export function declareAboutLibrariesPlugin(androidProjectPath: string) {
  modifyFileContent(path.join(androidProjectPath, 'build.gradle'), declareAboutLibrariesPluginUtil);
}
