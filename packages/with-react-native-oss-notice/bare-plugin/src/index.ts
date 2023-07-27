import { androidCommand } from './android/androidCommand';
import { iosCommand } from './ios/iosCommand';

function withReactNativeOSSNotice(androidProjectPath: string, iosProjectPath: string) {
  androidCommand(androidProjectPath);
  iosCommand(iosProjectPath);
}

export default withReactNativeOSSNotice;
