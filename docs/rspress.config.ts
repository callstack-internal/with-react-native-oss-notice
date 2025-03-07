import * as path from 'node:path';

import { pluginCallstackTheme } from '@callstack/rspress-theme/plugin';
import { defineConfig } from 'rspress/config';

export default defineConfig({
  root: path.join(__dirname, 'docs'),
  title: 'React Native OSS Notice',
  description: 'React Native OSS Notice Documentation',
  logoText: 'React Native OSS Notice',
  icon: '/img/notice.png',
  logo: '/img/notice.png',
  themeConfig: {
    socialLinks: [
      {
        icon: 'github',
        mode: 'link',
        content: 'https://github.com/callstackincubator/with-react-native-oss-notice',
      },
    ],
  },
  base: '/with-react-native-oss-notice/',
  plugins: [pluginCallstackTheme()],
});
