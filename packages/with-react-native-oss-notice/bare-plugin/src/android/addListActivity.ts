import path from 'path';

import { prepareListActivity } from '../../../plugin-utils/build/android';

import { modifyXMLFileContent } from './utils';

export async function addListActivity(androidProjectPath: string) {
  const androidManifestPath = path.join(androidProjectPath, 'app', 'src', 'main', 'AndroidManifest.xml');

  await modifyXMLFileContent(androidManifestPath, (manifestObj) => {
    manifestObj.manifest.application?.[0].activity?.push(prepareListActivity());
    return manifestObj;
  });
}
