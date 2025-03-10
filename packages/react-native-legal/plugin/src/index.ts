import type { ConfigPlugin } from 'expo/config-plugins';
import { createRunOncePlugin, withPlugins } from 'expo/config-plugins';

import { withAndroidLegal } from './android/withAndroidLegal';
import { withIosLegal } from './ios/withIosLegal';

// eslint-disable-next-line import/no-extraneous-dependencies
const pak = require('react-native-legal/package.json');

const withReactNativeLegal: ConfigPlugin = (config) => {
  return withPlugins(config, [withAndroidLegal, withIosLegal]);
};

export default createRunOncePlugin(withReactNativeLegal, pak.name, pak.version);
