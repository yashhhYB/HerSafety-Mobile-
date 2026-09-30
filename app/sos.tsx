import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
  Platform,
  StatusBar,
  Alert,
  Linking,
  ScrollView,
} from 'react-native';
import { Siren, X, Phone, MapPin, Mic, Users } from 'lucide-react-native';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import * as Location from 'expo-location';
import Colors from '@/constants/Colors';
import { reverseGeocode } from '@/lib/tomtom';

// ─── Pulse ring ────────────────────────────────────────────────────────────────
function PulseRing({
  anim,
  size,
  color,
  delay = 0,
}: {
  anim: Animated.Value;
  size: number;
  color: string;
  delay?: number;
}) {
  return (
    <Animated.View
      style={{
        position: 'absolute',
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: 2,
        borderColor: color,
        opacity: anim.interpolate({ inputRange: [0, 0.6, 1], outputRange: [0.8, 0.3, 0] }),
        transform: [
          {
            scale: anim.interpolate({ inputRange: [0, 1], outputRange: [0.8, 2.2] }),
          },
        ],
      }}
    />
  );
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function SOSScreen() {
  const [isActive, setIsActive] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [locationStr, setLocationStr] = useState<string | null>(null);

  // Animated values
  const pulse1 = useRef(new Animated.Value(0)).current;
  const pulse2 = useRef(new Animated.Value(0)).current;
  const pulse3 = useRef(new Animated.Value(0)).current;
  const btnScale = useRef(new Animated.Value(1)).current;

  // ── Idle pulse (always running) ─────────────────────────────────────────────
  useEffect(() => {
    const makePulse = (anim: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, { toValue: 1, duration: 2000, useNativeDriver: true }),
          Animated.timing(anim, { toValue: 0, duration: 0,    useNativeDriver: true }),
        ])
      ).start();

    makePulse(pulse1, 0);
    makePulse(pulse2, 700);
    makePulse(pulse3, 1400);
  }, []);

  // ── Button scale animation ──────────────────────────────────────────────────
  const animatePressIn = () => {
    Animated.spring(btnScale, { toValue: 0.93, useNativeDriver: true, speed: 30 }).start();
  };
  const animatePressOut = () => {
    Animated.spring(btnScale, { toValue: 1, useNativeDriver: true, speed: 20 }).start();
  };

  // ── Countdown + haptics ─────────────────────────────────────────────────────
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && countdown > 0) {
      interval = setInterval(() => {
        setCountdown(c => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          return c - 1;
        });
      }, 1000);
    } else if (isActive && countdown === 0) {
      triggerSOS();
    }
    return () => clearInterval(interval);
  }, [isActive, countdown]);

  // ── Get location (TomTom Reverse Geocode) ────────────────────────────────────
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;
      const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      const label = await reverseGeocode(pos.coords.latitude, pos.coords.longitude);
      setLocationStr(label);
    })();
  }, []);

  // ── SOS trigger ──────────────────────────────────────────────────────────────
  const triggerSOS = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    setIsActive(false);
    setCountdown(5);

    Alert.alert(
      '🚨 SOS SENT',
      `Your location has been shared with 3 guardians.\n\nLocation: ${locationStr ?? 'Fetching…'}`,
      [{ text: 'OK' }]
    );
  };

  const handleSOSPress = () => {
    if (!isActive) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      setIsActive(true);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setIsActive(false);
      setCountdown(5);
    }
  };

  const RING_COLOR = isActive ? '#FF1744' : Colors.brand.primary;

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#B71C1C" />

      {/* ── Close button ── */}
      <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
        <X size={22} color="#fff" />
      </TouchableOpacity>

      {/* ── Scrollable content ── */}
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Status label */}
        <View style={[styles.statusBadge, { backgroundColor: isActive ? '#FF1744' : '#fff2' }]}>
          <View style={[styles.statusDot, { backgroundColor: isActive ? '#fff' : '#FF8A80' }]} />
          <Text style={styles.statusLabel}>
            {isActive ? `SENDING IN ${countdown}s` : 'STANDBY'}
          </Text>
        </View>

        <Text style={styles.title}>Emergency SOS</Text>
        <Text style={styles.subtitle}>
          {isActive
            ? 'Tap to CANCEL before the alert is sent to your guardians.'
            : 'Hold to activate. Your location will be sent to 3 trusted contacts.'}
        </Text>

        {/* ── SOS Button ── */}
        <View style={styles.buttonWrap}>
          <PulseRing anim={pulse1} size={180} color={RING_COLOR} delay={0} />
          <PulseRing anim={pulse2} size={180} color={RING_COLOR} delay={700} />
          <PulseRing anim={pulse3} size={180} color={RING_COLOR} delay={1400} />

          <Animated.View style={{ transform: [{ scale: btnScale }] }}>
            <TouchableOpacity
              style={[styles.sosBtn, isActive && styles.sosBtnActive]}
              onPress={handleSOSPress}
              onPressIn={animatePressIn}
              onPressOut={animatePressOut}
              activeOpacity={1}
            >
              <Siren size={56} color="#fff" />
              <Text style={styles.sosBtnText}>{isActive ? 'CANCEL' : 'SOS'}</Text>
              {isActive && (
                <Text style={styles.countdownText}>{countdown}</Text>
              )}
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* ── Location chip ── */}
        {locationStr && (
          <View style={styles.locationChip}>
            <MapPin size={13} color="rgba(255,255,255,0.7)" />
            <Text style={styles.locationChipText} numberOfLines={1}>
              {locationStr}
            </Text>
          </View>
        )}

        {/* ── Info cards ── */}
        <View style={styles.infoSection}>
          <InfoCard
            icon={<Users size={20} color={Colors.brand.secondary} />}
            bg={Colors.brand.secondary + '18'}
            title="3 Guardians Alerted"
            body="Mom, Sarah (Roommate), and Dad will receive your location instantly."
          />
          <InfoCard
            icon={<Mic size={20} color="#6A1B9A" />}
            bg="#F3E5F5"
            title="Audio Recording"
            body="A 60-second ambient recording will be captured and sent securely."
          />
          <InfoCard
            icon={<Phone size={20} color={Colors.brand.success} />}
            bg="#E8F5E9"
            title="Emergency Line"
            body="Tap below to directly call the police emergency line."
          />
        </View>

        {/* ── Direct police call ── */}
        <TouchableOpacity
          style={styles.callPoliceBtn}
          activeOpacity={0.8}
          onPress={() => Linking.openURL('tel:112')}
        >
          <Phone size={20} color="#fff" />
          <Text style={styles.callPoliceBtnText}>Call Police (112)</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

// ─── Info card sub-component ──────────────────────────────────────────────────
function InfoCard({
  icon,
  bg,
  title,
  body,
}: {
  icon: React.ReactNode;
  bg: string;
  title: string;
  body: string;
}) {
  return (
    <View style={styles.infoCard}>
      <View style={[styles.infoIconWrap, { backgroundColor: bg }]}>{icon}</View>
      <View style={{ flex: 1 }}>
        <Text style={styles.infoTitle}>{title}</Text>
        <Text style={styles.infoBody}>{body}</Text>
      </View>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#B71C1C',
  },
  scroll: {
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 100 : 80,
    paddingBottom: 40,
    paddingHorizontal: 24,
  },

  closeBtn: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 56 : 40,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20,
  },

  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Colors.radius.full,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginBottom: 16,
    gap: 6,
  },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusLabel: { color: '#fff', fontSize: 11, fontWeight: '800', letterSpacing: 1.5 },

  title: {
    fontSize: 30,
    fontWeight: '900',
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.75)',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 40,
    paddingHorizontal: 8,
  },

  buttonWrap: {
    width: 220,
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },

  sosBtn: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: Colors.brand.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.35)',
    shadowColor: Colors.brand.primary,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.6,
    shadowRadius: 24,
    elevation: 20,
  },
  sosBtnActive: {
    backgroundColor: '#212121',
    borderColor: 'rgba(255,255,255,0.2)',
    shadowColor: '#212121',
  },
  sosBtnText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 3,
    marginTop: 6,
  },
  countdownText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '900',
    position: 'absolute',
    bottom: -44,
  },

  locationChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: Colors.radius.full,
    marginBottom: 32,
    maxWidth: '90%',
  },
  locationChipText: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 12,
    fontWeight: '500',
    flex: 1,
  },

  infoSection: {
    width: '100%',
    gap: 10,
    marginBottom: 20,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: Colors.radius.md,
    padding: 14,
    gap: 12,
  },
  infoIconWrap: {
    width: 40, height: 40, borderRadius: 12,
    justifyContent: 'center', alignItems: 'center',
  },
  infoTitle: { color: '#fff', fontSize: 14, fontWeight: '700', marginBottom: 3 },
  infoBody: { color: 'rgba(255,255,255,0.7)', fontSize: 12, lineHeight: 17 },

  callPoliceBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: Colors.radius.md,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.35)',
    width: '100%',
  },
  callPoliceBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
});
