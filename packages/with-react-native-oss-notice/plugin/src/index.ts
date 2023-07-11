import type { ConfigPlugin } from 'expo/config-plugins';
import { createRunOncePlugin, withPlugins } from 'expo/config-plugins';

import { withAndroidNotice } from './android/withAndroidNotice';
import { withIosNotice } from './ios/withIosNotice';

const pak = require('with-react-native-oss-notice/package.json');

const withReactNativeOSSNotice: ConfigPlugin = (config) => {
  return withPlugins(config, [withAndroidNotice, withIosNotice]);
}

export default createRunOncePlugin(withReactNativeOSSNotice, pak.name, pak.version);
