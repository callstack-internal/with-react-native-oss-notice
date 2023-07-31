import fs from 'fs';
import path from 'path';

import { applyAndConfigureAboutLibrariesPluginUtil } from '../../../plugin-utils/build/android';

import { modifyFileContent } from './utils';

export function applyAndConfigureAboutLibrariesPlugin(androidProjectPath: string) {
  if (fs.existsSync(path.join(androidProjectPath, 'app', 'build.gradle.kts'))) {
    console.warn('Gradle Kotlin scripts are not supported yet');
  } else if (fs.existsSync(path.join(androidProjectPath, 'app', 'build.gradle'))) {
    modifyFileContent(path.join(androidProjectPath, 'app', 'build.gradle'), applyAndConfigureAboutLibrariesPluginUtil);
  } else {
    console.warn('Cannot find app/build.gradle file');
  }
}
