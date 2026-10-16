import {
  DEBT_CAP_KM,
  KM_PER_CIGARETTE,
  OVERAGE_PENALTY_KM_PER_CIGARETTE,
} from '@huff/shared';
import { StyleSheet } from 'react-native';

import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';

export default function TodayScreen() {
  return (
    <Screen title="Today">
      <ThemedView type="backgroundElement" style={styles.card}>
        <ThemedText>No run yet</ThemedText>
        <ThemedText type="subtitle">0 cigarettes</ThemedText>
        <ThemedText themeColor="textSecondary">Debt 0 km</ThemedText>
      </ThemedView>
      <ThemedText themeColor="textSecondary">
        {KM_PER_CIGARETTE} km earns 1 cigarette. Each cigarette over budget adds{' '}
        {OVERAGE_PENALTY_KM_PER_CIGARETTE} km of debt, up to {DEBT_CAP_KM} km.
      </ThemedText>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: Spacing.two,
    padding: Spacing.four,
    borderRadius: Spacing.three,
  },
});
