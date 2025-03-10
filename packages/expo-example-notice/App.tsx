import { StatusBar } from 'expo-status-bar';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
// eslint-disable-next-line import/no-extraneous-dependencies
import { ReactNativeLegal } from 'react-native-legal';

const BUTTON_BACKGROUND_COLOR = '#8232ff';
const BUTTON_FONT_COLOR = '#FFF';
const BUTTON_RIPPLE_COLOR = '#8232ffba';

export default function App() {
  function launchNotice() {
    ReactNativeLegal.launchLicenseListScreen('OSS Notice');
  }

  return (
    <View style={styles.container}>
      <Pressable
        accessibilityRole="button"
        android_ripple={{
          color: BUTTON_RIPPLE_COLOR,
          foreground: true,
        }}
        onPress={launchNotice}
        style={({ pressed }) => [styles.button, pressed && styles.pressed]}
      >
        <Text style={styles.label}>Tap to see list of OSS libraries</Text>
      </Pressable>
      <StatusBar style="dark" />
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: BUTTON_BACKGROUND_COLOR,
    borderRadius: 20,
    overflow: 'hidden',
    padding: 20,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    color: BUTTON_FONT_COLOR,
    fontSize: 20,
  },
  pressed: {
    opacity: Platform.select({
      android: 1,
      default: 0.4,
    }),
  },
});
