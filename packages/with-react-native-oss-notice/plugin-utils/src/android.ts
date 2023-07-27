export function declareAboutLibrariesPluginUtil(androidBuildGradleContent: string) {
  if (!androidBuildGradleContent.match(PLUGIN_CLASSPATH)?.length) {
    // Add Gradle Plugin Portal repository if it's not included
    if (!androidBuildGradleContent.match(GRADLE_PLUGIN_PORTAL_URL)?.length) {
      androidBuildGradleContent = androidBuildGradleContent.replace(
        /repositories\s?{/,
        `repositories {\n        maven { url = uri("${GRADLE_PLUGIN_PORTAL_URL}") }`
      );
    }

    // Declare the AboutLibraries plugin
    androidBuildGradleContent = androidBuildGradleContent.replace(
      /dependencies\s?{/,
      `dependencies {\n        classpath '${PLUGIN_CLASSPATH}:${PLUGIN_VERSION}'`
    );        
  }

  return androidBuildGradleContent;
}

export function applyAndConfigureAboutLibrariesPluginUtil(androidAppBuildGradleContent: string) {
  // Apply plugin
  const applyPluginBlockRegex = new RegExp(`apply\\s+plugin:\\s+['"]${PLUGIN_APPLY_BLOCK_IDENTIFIER}['"]`);

  if (!androidAppBuildGradleContent.match(applyPluginBlockRegex)?.length) {
    androidAppBuildGradleContent += `\n${PLUGIN_APPLY_BLOCK}`;
  }

  // Configure plugin
  const pluginConfigRegex = /aboutLibraries {/;

  if (!androidAppBuildGradleContent.match(pluginConfigRegex)?.length) {
    androidAppBuildGradleContent += '\n\naboutLibraries {\n    configPath = "config"\n    prettyPrint = true\n}';
  }

  return androidAppBuildGradleContent;
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
export function prepareListActivity() {
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
export function prepareListActivityStyle() {
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
const PLUGIN_APPLY_BLOCK = 'apply plugin: \'com.mikepenz.aboutlibraries.plugin\'';
const PLUGIN_APPLY_BLOCK_IDENTIFIER = 'com.mikepenz.aboutlibraries.plugin';
const PLUGIN_CLASSPATH = 'com.mikepenz.aboutlibraries.plugin:aboutlibraries-plugin';
const PLUGIN_VERSION = '10.8.3';
