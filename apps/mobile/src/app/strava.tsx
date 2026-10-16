import { useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';

export default function StravaScreen() {
  const [note, setNote] = useState<string | null>(null);

  return (
    <Screen title="Strava">
      <ThemedText themeColor="textSecondary">
        A morning run sets today’s cigarette budget. Connecting Strava is not available yet.
      </ThemedText>
      <Pressable
        accessibilityRole="button"
        onPress={() => setNote('Strava is not connected yet.')}
        style={({ pressed }) => [styles.pressable, pressed && styles.pressed]}>
        <ThemedView type="backgroundSelected" style={styles.button}>
          <ThemedText>Connect Strava</ThemedText>
        </ThemedView>
      </Pressable>
      {note ? <ThemedText themeColor="textSecondary">{note}</ThemedText> : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  pressable: {
    alignSelf: 'flex-start',
  },
  pressed: {
    opacity: 0.7,
  },
  button: {
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.four,
    borderRadius: Spacing.three,
  },
});
