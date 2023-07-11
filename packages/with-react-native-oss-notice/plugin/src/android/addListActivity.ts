import type { ExpoConfig } from 'expo/config';
import { withAndroidManifest } from 'expo/config-plugins';

import { PLUGIN_ACTIVITY } from './aboutLibrariesConstants';

/**
 * This helper adds custom activity to the app in `android/app/src/main/AndroidManifest.xml`
 */
export function addListActivity(config: ExpoConfig): ExpoConfig {
  return withAndroidManifest(config, (exportedConfig) => {
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
    exportedConfig.modResults.manifest.application?.[0].activity?.push({
      $: {
        "android:name": PLUGIN_ACTIVITY,
        "android:exported": "false",
        "android:launchMode": "singleTask",
        "android:theme": "@style/OSSLicenseListTheme"
      },
    })
    return exportedConfig
  });
}
