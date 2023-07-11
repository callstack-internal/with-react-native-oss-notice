import type { ExpoConfig } from 'expo/config';
import { withAndroidStyles } from 'expo/config-plugins';

/**
 * This helper adds custom style for license list activity in `android/app/src/main/res/values/styles.xml`
 */
export function addAndroidStyleForListActivity(config: ExpoConfig): ExpoConfig {
  return withAndroidStyles(config, (exportedConfig) => {
    /**
     * This will evaluate to:
     * 
     * <style name="OSSLicenseListTheme" parent="Theme.MaterialComponents.Light.NoActionBar">
     *   <item name="android:statusBarColor">#F3EFEE</item>
     *   <item name="android:windowBackground">#F3EFEE</item>
     *   <item name="android:forceDarkAllowed">false</item>
     * </style>
     */
    exportedConfig.modResults.resources.style?.push({
      $: {
        name: 'OSSLicenseListTheme',
        parent: 'Theme.MaterialComponents.Light.NoActionBar',
      },
      item: [
        {
          $: {
            name: "android:statusBarColor",
          },
          _: "#F3EFEE",
        },
        {
          $: {
            name: "android:windowBackground",
          },
          _: "#F3EFEE",
        },
        {
          $: {
            name: "android:forceDarkAllowed",
          },
          _: "false",
        },
      ],
    })
    return exportedConfig
  });
}
