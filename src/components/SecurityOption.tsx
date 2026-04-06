import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

interface SecurityOptionProps {
  title: string;
  subtitle: string;
  onPress: () => void;
}

export default function SecurityOption({
  title,
  subtitle,
  onPress,
}: SecurityOptionProps) {
  return (
    <Pressable style={styles.optionButton} onPress={onPress}>
      <Text style={styles.optionTitle}>{title}</Text>
      <Text style={styles.optionSubtitle}>{subtitle}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  optionButton: {
    backgroundColor: '#1f1f1f',
    padding: 20,
    borderRadius: 12,
    marginVertical: 10,
    width: '100%',
  },
  optionTitle: {
    color: '#f7931a',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  optionSubtitle: {
    color: '#aaaaaa',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 4,
  },
});