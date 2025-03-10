import * as path from 'node:path';

import { pluginCallstackTheme } from '@callstack/rspress-theme/plugin';
import { defineConfig } from 'rspress/config';

export default defineConfig({
  root: path.join(__dirname, 'docs'),
  title: 'React Native Legal',
  description: 'React Native Legal Documentation',
  logoText: 'React Native Legal',
  icon: '/img/notice.png',
  logo: '/img/notice.png',
  themeConfig: {
    socialLinks: [
      {
        icon: 'github',
        mode: 'link',
        content: 'https://github.com/callstackincubator/react-native-legal',
      },
    ],
    footer: {
      message: `Copyright © ${new Date().getFullYear()} Callstack Open Source`,
    },
  },
  base: '/react-native-legal/',
  plugins: [pluginCallstackTheme()],
});
