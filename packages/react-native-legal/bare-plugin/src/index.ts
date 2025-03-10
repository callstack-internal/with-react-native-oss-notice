import { androidCommand } from './android/androidCommand';
import { iosCommand } from './ios/iosCommand';

function generateLegal(androidProjectPath: string, iosProjectPath: string) {
  androidCommand(androidProjectPath);
  iosCommand(iosProjectPath);
}

export default generateLegal;
