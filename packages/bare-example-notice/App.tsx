import { StatusBar, StyleSheet, Text, View } from 'react-native';
import { WithReactNativeOSSNotice } from 'with-react-native-oss-notice';

export default function App() {
  function launchNotice() {
    WithReactNativeOSSNotice.launchLicenseListScreen('OSS Notice');
  }

  return (
    <View style={styles.container}>
      <Text onPress={launchNotice} style={styles.label}>Open up App.tsx to start working on your app!</Text>
      <StatusBar barStyle="default" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    color: '#000',
  },
});