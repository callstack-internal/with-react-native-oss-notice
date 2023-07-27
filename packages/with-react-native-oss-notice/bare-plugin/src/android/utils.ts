import fs from 'fs';

import xml2js from 'xml2js';

export function modifyFileContent(filepath: string, transformFile: (fileContent: string) => string) {
  const content = fs.readFileSync(filepath, { encoding: 'utf-8' });
  const modifiedContent = transformFile(content);

  fs.writeFileSync(filepath, modifiedContent);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function modifyXMLFileContent(filepath: string, transformXMLFile: (xmlObj: any) => any) {
  const content = fs.readFileSync(filepath, { encoding: 'utf-8' });
  const parser = new xml2js.Parser();
  const obj = await parser.parseStringPromise(content);
  const modifiedObj = transformXMLFile(obj);
  const builder = new xml2js.Builder({ headless: true });
  const modifiedContent = builder.buildObject(modifiedObj);

  fs.writeFileSync(filepath, modifiedContent);
}
