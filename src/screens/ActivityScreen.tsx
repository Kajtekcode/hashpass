// src/screens/ActivityScreen.tsx
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Pressable, 
  ScrollView, 
  SafeAreaView 
} from 'react-native';
import { sessionService } from '../services/bitcoinService';

interface ActivityScreenProps {
  onBack: () => void;
}

export default function ActivityScreen({ onBack }: ActivityScreenProps) {
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = async () => {
    const sessions = await sessionService.getSessions();
    setActivities(sessions);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={onBack} style={styles.backButton}>
            <Text style={styles.backText}>←</Text>
          </Pressable>
          <Text style={styles.title}>Activity</Text>
        </View>

        {activities.length > 0 ? (
          activities.map((item, index) => (
            <View key={index} style={styles.activityCard}>
              <View style={styles.activityIcon}>
                <Text style={styles.activityEmoji}>🔶</Text>
              </View>
              <View style={styles.activityInfo}>
                <Text style={styles.activityName}>{item.site}</Text>
                <Text style={styles.activityTime}>
                  {new Date(item.timestamp).toLocaleString([], { 
                    month: 'short', 
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </Text>
              </View>
              <View style={styles.greenDot} />
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No activity yet</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  scrollContent: { flexGrow: 1, paddingHorizontal: 20, paddingTop: 20 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  backButton: { padding: 8 },
  backText: { fontSize: 24, color: '#ffffff' },
  title: { fontSize: 22, fontWeight: '700', color: '#ffffff', marginLeft: 12 },
  activityCard: {
    flexDirection: 'row',
    backgroundColor: '#161616',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginBottom: 10,
  },
  activityIcon: {
    width: 48,
    height: 48,
    backgroundColor: '#222222',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  activityEmoji: { fontSize: 24 },
  activityInfo: { flex: 1 },
  activityName: { fontSize: 17, fontWeight: '600', color: '#ffffff' },
  activityTime: { fontSize: 14, color: '#aaaaaa' },
  greenDot: { width: 10, height: 10, backgroundColor: '#22c55e', borderRadius: 5 },
  emptyState: { alignItems: 'center', paddingTop: 100 },
  emptyText: { color: '#888888', fontSize: 16 },
});