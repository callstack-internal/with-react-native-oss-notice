export const GENERATE_LICENSE_PLIST_BUILD_PHASE_COMMENT = 'Generate licenses with LicensePlist';
export const SETTINGS_BUNDLE_ROOT_PLIST_CONTENT = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>StringsTable</key>
  <string>Root</string>
  <key>PreferenceSpecifiers</key>
  <array>
    <dict>
      <key>Type</key>
      <string>PSChildPaneSpecifier</string>
      <key>Title</key>
      <string>Licenses</string>
      <key>File</key>
      <string>com.mono0926.LicensePlist</string>
    </dict>
    <dict>
      <key>Type</key>
      <string>PSChildPaneSpecifier</string>
      <key>Title</key>
      <string>Licenses NPM</string>
      <key>File</key>
      <string>com.k-tomoyasu.react-native-oss-license</string>
    </dict>
  </array>
</dict>
</plist>`;
