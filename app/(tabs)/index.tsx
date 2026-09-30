import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Platform,
  Animated,
  Dimensions,
} from 'react-native';
import {
  Shield,
  Siren,
  MapPin,
  Users,
  Radio,
  BookOpen,
  ChevronRight,
  Zap,
  Heart,
} from 'lucide-react-native';
import { Link, router } from 'expo-router';
import * as Location from 'expo-location';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { reverseGeocode } from '@/lib/tomtom';

const { width } = Dimensions.get('window');

// ─── Types ───────────────────────────────────────────────────────────────────
type QuickAction = {
  id: string;
  icon: typeof Shield;
  label: string;
  sub: string;
  href: string;
  accent: string;
  bg: string;
};

// ─── Quick-action data ────────────────────────────────────────────────────────
const QUICK_ACTIONS: QuickAction[] = [
  {
    id: 'sos',
    icon: Siren,
    label: 'SOS Alert',
    sub: 'Emergency help instantly',
    href: '/sos',
    accent: '#E53935',
    bg: '#FFEBEE',
  },
  {
    id: 'map',
    icon: MapPin,
    label: 'Safe Map',
    sub: 'Navigate with safety scores',
    href: '/(tabs)/map',
    accent: '#00897B',
    bg: '#E0F2F1',
  },
  {
    id: 'guardians',
    icon: Users,
    label: 'Guardians',
    sub: 'Your trusted network',
    href: '/(tabs)/guardians',
    accent: '#1565C0',
    bg: '#E3F2FD',
  },
  {
    id: 'radar',
    icon: Radio,
    label: 'Threat Radar',
    sub: 'Live safety alerts near you',
    href: '/(tabs)/alerts',
    accent: '#E65100',
    bg: '#FFF3E0',
  },
];

// ─── Safety Tips ─────────────────────────────────────────────────────────────
const TIPS = [
  'Share your live location with a guardian when travelling at night.',
  'Save local police station number: tap Settings → Emergency Contacts.',
  'Walk on well-lit streets and avoid isolated shortcuts.',
  'Trust your instincts — if something feels wrong, act immediately.',
];

// ─── Pulse animation hook ─────────────────────────────────────────────────────
function usePulse() {
  const anim = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 1.08, duration: 900, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 1,    duration: 900, useNativeDriver: true }),
      ])
    ).start();
  }, []);
  return anim;
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? Colors.dark : Colors.light;
  const pulse = usePulse();
  const [locationStr, setLocationStr] = useState('Fetching location…');
  const [tipIndex, setTipIndex] = useState(0);

  // ── Real GPS location (reverse-geocoded via TomTom) ───────────────────────
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationStr('Location permission denied');
        return;
      }
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      // Use TomTom Reverse Geocode API
      const label = await reverseGeocode(loc.coords.latitude, loc.coords.longitude);
      setLocationStr(label || 'Current location');
    })();
  }, []);

  // ── Rotate tip every 8 s ───────────────────────────────────────────────────
  useEffect(() => {
    const iv = setInterval(() => setTipIndex(i => (i + 1) % TIPS.length), 8000);
    return () => clearInterval(iv);
  }, []);

  const styles = makeStyles(theme);

  return (
    <View style={styles.root}>
      <StatusBar
        barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={Colors.brand.primary}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* ── Hero banner ── */}
        <View style={styles.hero}>
          <View style={styles.heroLeft}>
            <Text style={styles.greeting}>Good day 👋</Text>
            <Text style={styles.heroTitle}>Stay Safe,{'\n'}Stay Confident</Text>
            <View style={styles.locationRow}>
              <MapPin size={13} color="rgba(255,255,255,0.8)" />
              <Text style={styles.locationText} numberOfLines={1}>
                {locationStr}
              </Text>
            </View>
          </View>

          {/* SOS shortcut button */}
          <Link href="/sos" asChild>
            <TouchableOpacity activeOpacity={0.85}>
              <Animated.View style={[styles.sosPill, { transform: [{ scale: pulse }] }]}>
                <Siren size={22} color="#E53935" />
                <Text style={styles.sosPillText}>SOS</Text>
              </Animated.View>
            </TouchableOpacity>
          </Link>
        </View>

        {/* ── Status strip ── */}
        <View style={[styles.statusStrip, { backgroundColor: theme.surface }]}>
          <View style={styles.statusItem}>
            <View style={[styles.statusDot, { backgroundColor: Colors.brand.success }]} />
            <Text style={[styles.statusLabel, { color: theme.textSecond }]}>Safe</Text>
          </View>
          <View style={styles.statusDivider} />
          <View style={styles.statusItem}>
            <Heart size={14} color={Colors.brand.primary} fill={Colors.brand.primary} />
            <Text style={[styles.statusLabel, { color: theme.textSecond }]}>3 Guardians</Text>
          </View>
          <View style={styles.statusDivider} />
          <View style={styles.statusItem}>
            <Zap size={14} color={Colors.brand.warning} />
            <Text style={[styles.statusLabel, { color: theme.textSecond }]}>1 Alert Nearby</Text>
          </View>
        </View>

        {/* ── Quick Actions ── */}
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          {QUICK_ACTIONS.map(action => (
            <Link href={action.href as any} asChild key={action.id}>
              <TouchableOpacity
                style={[styles.actionCard, { backgroundColor: theme.surface }, Colors.shadow.sm]}
                activeOpacity={0.75}
              >
                <View style={[styles.actionIconWrap, { backgroundColor: action.bg }]}>
                  <action.icon size={26} color={action.accent} />
                </View>
                <Text style={[styles.actionLabel, { color: theme.text }]}>{action.label}</Text>
                <Text style={[styles.actionSub, { color: theme.textSecond }]} numberOfLines={2}>
                  {action.sub}
                </Text>
              </TouchableOpacity>
            </Link>
          ))}
        </View>

        {/* ── Safety Tip ── */}
        <View style={[styles.tipCard, { backgroundColor: theme.surface }, Colors.shadow.sm]}>
          <View style={styles.tipHeader}>
            <BookOpen size={18} color={Colors.brand.secondary} />
            <Text style={[styles.tipTitle, { color: Colors.brand.secondary }]}>Safety Tip</Text>
            <View style={styles.tipDots}>
              {TIPS.map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.tipDot,
                    { backgroundColor: i === tipIndex ? Colors.brand.secondary : '#C5CAE9' },
                  ]}
                />
              ))}
            </View>
          </View>
          <Text style={[styles.tipBody, { color: theme.textSecond }]}>{TIPS[tipIndex]}</Text>
        </View>

        {/* ── Route safety shortcut ── */}
        <TouchableOpacity
          style={[styles.routeCard, { backgroundColor: Colors.brand.accent }]}
          activeOpacity={0.85}
          onPress={() => router.push('/(tabs)/map' as any)}
        >
          <View>
            <Text style={styles.routeTitle}>Plan a Safe Route</Text>
            <Text style={styles.routeSub}>AI-scored paths based on real data</Text>
          </View>
          <ChevronRight size={24} color="#fff" />
        </TouchableOpacity>

        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
}

// ─── Styles (theme-aware) ─────────────────────────────────────────────────────
function makeStyles(theme: typeof Colors.light) {
  return StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: theme.bg,
    },
    scroll: {
      paddingBottom: 16,
    },

    // Hero
    hero: {
      backgroundColor: Colors.brand.primary,
      paddingTop: Platform.OS === 'ios' ? 60 : 40,
      paddingBottom: 28,
      paddingHorizontal: 20,
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
    },
    heroLeft: {
      flex: 1,
      marginRight: 12,
    },
    greeting: {
      fontSize: 14,
      color: 'rgba(255,255,255,0.75)',
      marginBottom: 4,
      fontWeight: '500',
    },
    heroTitle: {
      fontSize: 26,
      fontWeight: '800',
      color: '#fff',
      lineHeight: 32,
      marginBottom: 10,
    },
    locationRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    locationText: {
      fontSize: 13,
      color: 'rgba(255,255,255,0.8)',
      flex: 1,
    },

    // SOS pill
    sosPill: {
      backgroundColor: '#fff',
      borderRadius: 40,
      paddingHorizontal: 16,
      paddingVertical: 10,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      marginTop: Platform.OS === 'ios' ? 14 : 0,
      ...Colors.shadow.md,
    },
    sosPillText: {
      color: '#E53935',
      fontSize: 15,
      fontWeight: '800',
      letterSpacing: 1,
    },

    // Status strip
    statusStrip: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-around',
      marginHorizontal: 16,
      marginTop: -12,
      borderRadius: Colors.radius.md,
      paddingVertical: 14,
      paddingHorizontal: 12,
      ...Colors.shadow.md,
    },
    statusItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    statusDot: {
      width: 10,
      height: 10,
      borderRadius: 5,
    },
    statusLabel: {
      fontSize: 13,
      fontWeight: '600',
    },
    statusDivider: {
      width: 1,
      height: 18,
      backgroundColor: '#E0E0E0',
    },

    // Section title
    sectionTitle: {
      fontSize: 18,
      fontWeight: '700',
      marginTop: 28,
      marginBottom: 14,
      marginHorizontal: 16,
    },

    // Actions grid
    actionsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
      paddingHorizontal: 16,
    },
    actionCard: {
      width: (width - 44) / 2,
      borderRadius: Colors.radius.md,
      padding: 16,
    },
    actionIconWrap: {
      width: 52,
      height: 52,
      borderRadius: 14,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 12,
    },
    actionLabel: {
      fontSize: 15,
      fontWeight: '700',
      marginBottom: 4,
    },
    actionSub: {
      fontSize: 12,
      lineHeight: 16,
    },

    // Safety tip
    tipCard: {
      marginHorizontal: 16,
      marginTop: 20,
      borderRadius: Colors.radius.md,
      padding: 18,
    },
    tipHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginBottom: 10,
    },
    tipTitle: {
      fontSize: 14,
      fontWeight: '700',
      flex: 1,
    },
    tipDots: {
      flexDirection: 'row',
      gap: 4,
    },
    tipDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
    },
    tipBody: {
      fontSize: 14,
      lineHeight: 20,
    },

    // Route card
    routeCard: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginHorizontal: 16,
      marginTop: 16,
      borderRadius: Colors.radius.md,
      padding: 20,
      ...Colors.shadow.md,
    },
    routeTitle: {
      fontSize: 16,
      fontWeight: '800',
      color: '#fff',
      marginBottom: 4,
    },
    routeSub: {
      fontSize: 13,
      color: 'rgba(255,255,255,0.8)',
    },
  });
}
