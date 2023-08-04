import path from 'path';

import { addAndroidStyleForListActivityUtil } from '../../../plugin-utils/build/android';

import { modifyXMLFileContent } from './utils';

export async function addAndroidStyleForListActivity(androidProjectPath: string) {
  const stylesPath = path.join(androidProjectPath, 'app', 'src', 'main', 'res', 'values', 'styles.xml');

  await modifyXMLFileContent(stylesPath, (stylesObj) => {
    if (stylesObj.resources.style) {
      stylesObj.resources.style = addAndroidStyleForListActivityUtil(stylesObj.resources.style);
    }

    return stylesObj;
  });
}
