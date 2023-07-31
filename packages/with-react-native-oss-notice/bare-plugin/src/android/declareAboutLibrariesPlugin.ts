import fs from 'fs';
import path from 'path';

import { declareAboutLibrariesPluginUtil } from '../../../plugin-utils/build/android';

import { modifyFileContent } from './utils';

export function declareAboutLibrariesPlugin(androidProjectPath: string) {
  if (fs.existsSync(path.join(androidProjectPath, 'build.gradle.kts'))) {
    console.warn('Gradle Kotlin scripts are not supported yet');
  } else if (fs.existsSync(path.join(androidProjectPath, 'build.gradle'))) {
    modifyFileContent(path.join(androidProjectPath, 'build.gradle'), declareAboutLibrariesPluginUtil);
  } else {
    console.warn('Cannot find build.gradle file');
  }
}
