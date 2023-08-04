import { arrayIncludesObject } from './common';

export function declareAboutLibrariesPluginUtil(androidBuildGradleContent: string) {
  if (!androidBuildGradleContent.match(PLUGIN_CLASSPATH)?.length) {
    // Add Gradle Plugin Portal repository if it's not included
    if (!androidBuildGradleContent.match(GRADLE_PLUGIN_PORTAL_URL)?.length) {
      androidBuildGradleContent = androidBuildGradleContent.replace(
        /repositories\s?{/,
        `repositories {\n        maven { url = uri("${GRADLE_PLUGIN_PORTAL_URL}") }`,
      );
      console.log('Gradle Plugin Portal repository - ADDED');
    } else {
      console.log('Gradle Plugin Portal repository already added - SKIP');
    }

    // Declare the AboutLibraries plugin
    androidBuildGradleContent = androidBuildGradleContent.replace(
      /dependencies\s?{/,
      `dependencies {\n        classpath '${PLUGIN_CLASSPATH}:${PLUGIN_VERSION}'`,
    );
    console.log('About Libraries Gradle Plugin repository - ADDED');
  } else {
    console.log('About Libraries Gradle Plugin already added - SKIP');
  }

  return androidBuildGradleContent;
}

export function applyAndConfigureAboutLibrariesPluginUtil(androidAppBuildGradleContent: string) {
  // Apply plugin
  const applyPluginBlockRegex = new RegExp(`apply\\s+plugin:\\s+['"]${PLUGIN_APPLY_BLOCK_IDENTIFIER}['"]`);

  if (!androidAppBuildGradleContent.match(applyPluginBlockRegex)?.length) {
    androidAppBuildGradleContent += `\n${PLUGIN_APPLY_BLOCK}`;
    console.log('About Libraries Gradle Plugin - APPLIED');
  } else {
    console.log('About Libraries Gradle Plugin already applied - SKIP');
  }

  // Configure plugin
  const pluginConfigRegex = /aboutLibraries {/;

  if (!androidAppBuildGradleContent.match(pluginConfigRegex)?.length) {
    androidAppBuildGradleContent += '\n\naboutLibraries {\n    configPath = "config"\n    prettyPrint = true\n}';
    console.log('About Libraries Gradle Plugin - CONFIGURED');
  } else {
    console.log('About Libraries Gradle Plugin already configured - SKIP');
  }

  return androidAppBuildGradleContent;
}

export function addAndroidStyleForListActivityUtil<T>(styles: T[]): T[] {
  const listActivityStyle = prepareListActivityStyle();

  if (!arrayIncludesObject(styles, listActivityStyle)) {
    styles?.push(listActivityStyle as T);
    console.log('OSSLicenseListTheme style - ADDED');
  } else {
    console.log('OSSLicenseListTheme style already added - SKIP');
  }

  return styles;
}

export function addListActivityUtil<T>(activities: T[]): T[] {
  const listActivity = prepareListActivity();

  if (!arrayIncludesObject(activities, listActivity)) {
    activities?.push(listActivity as T);
    console.log('About Libraries activity - ADDED');
  } else {
    console.log('About Libraries activity already added - SKIP');
  }

  return activities;
}

/**
 * This will evaluate to:
 *
 * <activity
 *   android:name="com.mikepenz.aboutlibraries.ui.LibsActivity"
 *   android:exported="false"
 *   android:launchMode="singleTask"
 *   android:theme="@style/OSSLicenseListTheme"
 * />
 */
function prepareListActivity() {
  return {
    $: {
      'android:name': PLUGIN_ACTIVITY,
      'android:exported': 'false',
      'android:launchMode': 'singleTask',
      'android:theme': '@style/OSSLicenseListTheme',
    },
  } as const;
}

/**
 * This will evaluate to:
 *
 * <style name="OSSLicenseListTheme" parent="Theme.MaterialComponents.Light.NoActionBar">
 *   <item name="android:statusBarColor">#F3EFEE</item>
 *   <item name="android:windowBackground">#F3EFEE</item>
 *   <item name="android:forceDarkAllowed">false</item>
 * </style>
 */
function prepareListActivityStyle() {
  return {
    $: {
      name: 'OSSLicenseListTheme',
      parent: 'Theme.MaterialComponents.Light.NoActionBar',
    },
    item: [
      {
        $: {
          name: 'android:statusBarColor',
        },
        _: '#F3EFEE',
      } as const,
      {
        $: {
          name: 'android:windowBackground',
        },
        _: '#F3EFEE',
      } as const,
      {
        $: {
          name: 'android:forceDarkAllowed',
        },
        _: 'false',
      } as const,
    ],
  };
}

const GRADLE_PLUGIN_PORTAL_URL = 'https://plugins.gradle.org/m2';
const PLUGIN_ACTIVITY = 'com.mikepenz.aboutlibraries.ui.LibsActivity';
const PLUGIN_APPLY_BLOCK = "apply plugin: 'com.mikepenz.aboutlibraries.plugin'";
const PLUGIN_APPLY_BLOCK_IDENTIFIER = 'com.mikepenz.aboutlibraries.plugin';
const PLUGIN_CLASSPATH = 'com.mikepenz.aboutlibraries.plugin:aboutlibraries-plugin';
const PLUGIN_VERSION = '10.8.3';
