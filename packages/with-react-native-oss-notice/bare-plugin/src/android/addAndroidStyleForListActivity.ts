import path from 'path';

import { prepareListActivityStyle } from '../../../plugin-utils/build/android';

import { modifyXMLFileContent } from './utils';

export async function addAndroidStyleForListActivity(androidProjectPath: string) {
  const stylesPath = path.join(androidProjectPath, 'app', 'src', 'main', 'res', 'values', 'styles.xml');

  await modifyXMLFileContent(stylesPath, (stylesObj) => {
    stylesObj.resources.style?.push(prepareListActivityStyle());
    return stylesObj;
  });
}
