import { StatusBar, StyleSheet, Text, View } from 'react-native';
// eslint-disable-next-line import/no-extraneous-dependencies
import { WithReactNativeOSSNotice } from 'with-react-native-oss-notice';

const BACKGROUND_COLOR = '#fff';
const FONT_COLOR = '#000';

export default function App() {
  function launchNotice() {
    WithReactNativeOSSNotice.launchLicenseListScreen('OSS Notice');
  }

  return (
    <View style={styles.container}>
      <Text onPress={launchNotice} style={styles.label}>
        Open up App.tsx to start working on your app!
      </Text>
      <StatusBar barStyle="default" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    color: FONT_COLOR,
  },
});
