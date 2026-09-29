import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Platform, ScrollView } from 'react-native';
import { Target, ChevronRight, AlertTriangle, ShieldAlert, Navigation } from 'lucide-react-native';
import { router } from 'expo-router';

export default function RadarScreen() {
  const pulseAnim1 = useRef(new Animated.Value(0)).current;
  const pulseAnim2 = useRef(new Animated.Value(0)).current;
  const pulseAnim3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const createPulse = (anim: Animated.Value, delay: number) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, {
            toValue: 1,
            duration: 3000,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    createPulse(pulseAnim1, 0);
    createPulse(pulseAnim2, 1000);
    createPulse(pulseAnim3, 2000);
  }, []);

  const alerts = [
    { id: 1, type: 'Poor Lighting', distance: '0.2 mi away', time: 'Reported 5m ago', color: '#f39c12', icon: AlertTriangle },
    { id: 2, type: 'Suspicious Activity', distance: '0.5 mi away', time: 'Reported 12m ago', color: '#e74c3c', icon: ShieldAlert },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ChevronRight size={24} color="#2c3e50" style={{ transform: [{ rotate: '180deg' }] }} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Live Threat Radar</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.radarContainer}>
        {/* Animated Radar Rings */}
        {[pulseAnim1, pulseAnim2, pulseAnim3].map((anim, index) => (
          <Animated.View
            key={index}
            style={[
              styles.radarRing,
              {
                transform: [
                  {
                    scale: anim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.5, 3],
                    }),
                  },
                ],
                opacity: anim.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: [0.8, 0.3, 0],
                }),
              },
            ]}
          />
        ))}
        
        <View style={styles.radarCenter}>
          <Target size={32} color="#fff" />
        </View>

        {/* Mock Threat Blip */}
        <View style={[styles.threatBlip, { top: '30%', left: '20%', backgroundColor: '#e74c3c' }]} />
        <View style={[styles.threatBlip, { top: '65%', left: '75%', backgroundColor: '#f39c12' }]} />
      </View>

      <View style={styles.bottomSheet}>
        <View style={styles.sheetHeader}>
          <Text style={styles.sheetTitle}>Nearby Alerts</Text>
          <View style={styles.liveBadge}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>LIVE</Text>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.alertsList}>
          {alerts.map((alert) => (
            <View key={alert.id} style={styles.alertCard}>
              <View style={[styles.alertIconBox, { backgroundColor: alert.color + '20' }]}>
                <alert.icon size={24} color={alert.color} />
              </View>
              <View style={styles.alertInfo}>
                <Text style={styles.alertType}>{alert.type}</Text>
                <View style={styles.alertMetaRow}>
                  <Navigation size={12} color="#7f8c8d" />
                  <Text style={styles.alertMetaText}>{alert.distance}</Text>
                  <Text style={styles.alertMetaText}>•</Text>
                  <Text style={styles.alertMetaText}>{alert.time}</Text>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e272e', // Dark theme for radar
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    marginBottom: 24,
    zIndex: 10,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#fff',
  },
  radarContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  radarCenter: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#0fb9b1',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
    shadowColor: '#0fb9b1',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 15,
  },
  radarRing: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#0fb9b1',
    backgroundColor: 'rgba(15, 185, 177, 0.1)',
  },
  threatBlip: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#fff',
    zIndex: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  bottomSheet: {
    backgroundColor: '#fff',
    height: '40%',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sheetTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#2c3e50',
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(231, 76, 60, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#e74c3c',
    marginRight: 6,
  },
  liveText: {
    color: '#e74c3c',
    fontSize: 12,
    fontWeight: '800',
  },
  alertsList: {
    gap: 16,
  },
  alertCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e3e8ee',
  },
  alertIconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  alertInfo: {
    flex: 1,
  },
  alertType: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 4,
  },
  alertMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  alertMetaText: {
    fontSize: 12,
    color: '#7f8c8d',
  }
});
