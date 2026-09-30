import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  StatusBar,
  Animated,
  RefreshControl,
} from 'react-native';
import {
  AlertTriangle,
  ShieldAlert,
  Lightbulb,
  UserX,
  Construction,
  ChevronRight,
  Bell,
  MapPin,
  Clock,
  Filter,
} from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import * as Location from 'expo-location';
import { reverseGeocode } from '@/lib/tomtom';

// ─── Types ────────────────────────────────────────────────────────────────────
type AlertLevel = 'high' | 'medium' | 'low';
type AlertCategory = 'safety' | 'lighting' | 'suspicious' | 'infrastructure';

type SafetyAlert = {
  id: string;
  title: string;
  description: string;
  level: AlertLevel;
  category: AlertCategory;
  distanceKm: number;
  minsAgo: number;
  icon: typeof AlertTriangle;
};

// ─── Data ─────────────────────────────────────────────────────────────────────
const MOCK_ALERTS: SafetyAlert[] = [
  {
    id: 'a1',
    title: 'Suspicious Activity',
    description: 'Reported suspicious individual following pedestrians near the market area.',
    level: 'high',
    category: 'suspicious',
    distanceKm: 0.3,
    minsAgo: 8,
    icon: ShieldAlert,
  },
  {
    id: 'a2',
    title: 'Poor Street Lighting',
    description: 'Street lights out on 3 consecutive blocks. Avoid after dark or travel in groups.',
    level: 'medium',
    category: 'lighting',
    distanceKm: 0.7,
    minsAgo: 22,
    icon: Lightbulb,
  },
  {
    id: 'a3',
    title: 'Harassment Reported',
    description: 'Multiple women reported verbal harassment near the bus stop.',
    level: 'high',
    category: 'safety',
    distanceKm: 1.1,
    minsAgo: 45,
    icon: UserX,
  },
  {
    id: 'a4',
    title: 'Road Construction',
    description: 'Blocked footpath forces pedestrians onto the road. Exercise caution.',
    level: 'low',
    category: 'infrastructure',
    distanceKm: 1.8,
    minsAgo: 120,
    icon: Construction,
  },
  {
    id: 'a5',
    title: 'Unlit Underpass',
    description: 'Underpass on Ring Road has been dark for 2 days. Police notified.',
    level: 'medium',
    category: 'lighting',
    distanceKm: 2.4,
    minsAgo: 210,
    icon: Lightbulb,
  },
];

const LEVEL_COLORS: Record<AlertLevel, string> = {
  high:   Colors.brand.primary,
  medium: Colors.brand.warning,
  low:    Colors.brand.success,
};

const FILTERS = ['All', 'High', 'Medium', 'Low'] as const;
type Filter = typeof FILTERS[number];

// ─── Pulsing live dot ─────────────────────────────────────────────────────────
function LiveDot() {
  const anim = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 0.3, duration: 600, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 1,   duration: 600, useNativeDriver: true }),
      ])
    ).start();
  }, []);
  return <Animated.View style={[styles.liveDot, { opacity: anim }]} />;
}

// ─── Alert card ───────────────────────────────────────────────────────────────
function AlertCard({ alert, theme }: { alert: SafetyAlert; theme: typeof Colors.light }) {
  const [expanded, setExpanded] = useState(false);
  const accent = LEVEL_COLORS[alert.level];

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: theme.surface }, Colors.shadow.sm]}
      activeOpacity={0.85}
      onPress={() => setExpanded(e => !e)}
    >
      <View style={styles.cardTop}>
        {/* Level stripe */}
        <View style={[styles.levelStripe, { backgroundColor: accent }]} />
        {/* Icon */}
        <View style={[styles.cardIconWrap, { backgroundColor: accent + '20' }]}>
          <alert.icon size={20} color={accent} />
        </View>
        {/* Text */}
        <View style={styles.cardBody}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>{alert.title}</Text>
          <View style={styles.cardMeta}>
            <MapPin size={11} color={theme.textSecond} />
            <Text style={[styles.cardMetaText, { color: theme.textSecond }]}>
              {alert.distanceKm < 1
                ? `${Math.round(alert.distanceKm * 1000)} m away`
                : `${alert.distanceKm.toFixed(1)} km away`}
            </Text>
            <Clock size={11} color={theme.textSecond} />
            <Text style={[styles.cardMetaText, { color: theme.textSecond }]}>
              {alert.minsAgo < 60 ? `${alert.minsAgo}m ago` : `${Math.round(alert.minsAgo / 60)}h ago`}
            </Text>
          </View>
        </View>
        {/* Level badge */}
        <View style={[styles.levelBadge, { backgroundColor: accent + '18' }]}>
          <Text style={[styles.levelText, { color: accent }]}>
            {alert.level.toUpperCase()}
          </Text>
        </View>
      </View>

      {expanded && (
        <Text style={[styles.cardDesc, { color: theme.textSecond }]}>{alert.description}</Text>
      )}
    </TouchableOpacity>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────
export default function AlertsScreen() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? Colors.dark : Colors.light;
  const [filter, setFilter] = useState<Filter>('All');
  const [refreshing, setRefreshing] = useState(false);
  const [locationStr, setLocationStr] = useState('');

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;
      const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      // TomTom Reverse Geocode
      const label = await reverseGeocode(pos.coords.latitude, pos.coords.longitude);
      setLocationStr(label);
    })();
  }, []);

  const filtered = MOCK_ALERTS.filter(a => {
    if (filter === 'All') return true;
    return a.level === filter.toLowerCase();
  });

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1400);
  };

  return (
    <View style={[styles.root, { backgroundColor: theme.bg }]}>
      <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />

      {/* ── Header ── */}
      <View style={[styles.header, { backgroundColor: theme.surface }]}>
        <View style={styles.headerLeft}>
          <View style={styles.liveRow}>
            <LiveDot />
            <Text style={styles.liveLabel}>LIVE</Text>
          </View>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Safety Alerts</Text>
          {locationStr ? (
            <View style={styles.locationRow}>
              <MapPin size={12} color={theme.textSecond} />
              <Text style={[styles.locationText, { color: theme.textSecond }]}>{locationStr}</Text>
            </View>
          ) : null}
        </View>
        <View style={[styles.bellBadge, Colors.shadow.sm]}>
          <Bell size={20} color={Colors.brand.primary} />
          <View style={styles.bellCount}>
            <Text style={styles.bellCountText}>{MOCK_ALERTS.filter(a => a.level === 'high').length}</Text>
          </View>
        </View>
      </View>

      {/* ── Filter chips ── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
      >
        {FILTERS.map(f => {
          const active = filter === f;
          const accent =
            f === 'High'   ? Colors.brand.primary :
            f === 'Medium' ? Colors.brand.warning  :
            f === 'Low'    ? Colors.brand.success  :
            Colors.brand.secondary;
          return (
            <TouchableOpacity
              key={f}
              style={[
                styles.filterChip,
                active
                  ? { backgroundColor: accent }
                  : { backgroundColor: theme.surface, borderColor: theme.border, borderWidth: 1 },
              ]}
              onPress={() => setFilter(f)}
              activeOpacity={0.8}
            >
              <Text style={[styles.filterLabel, { color: active ? '#fff' : theme.textSecond }]}>
                {f}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* ── Alerts list ── */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.brand.primary} />
        }
      >
        <Text style={[styles.resultCount, { color: theme.textSecond }]}>
          {filtered.length} alert{filtered.length !== 1 ? 's' : ''} in your area
        </Text>
        {filtered.map(alert => (
          <AlertCard key={alert.id} alert={alert} theme={theme} />
        ))}
        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1 },

  header: {
    paddingTop: Platform.OS === 'ios' ? 56 : 36,
    paddingBottom: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    ...Colors.shadow.sm,
  },
  headerLeft: { flex: 1 },
  liveRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  liveDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.brand.primary },
  liveLabel: { fontSize: 11, fontWeight: '800', color: Colors.brand.primary, letterSpacing: 1 },
  headerTitle: { fontSize: 24, fontWeight: '800', marginBottom: 4 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  locationText: { fontSize: 12 },

  bellBadge: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center',
  },
  bellCount: {
    position: 'absolute', top: 6, right: 6,
    width: 16, height: 16, borderRadius: 8,
    backgroundColor: Colors.brand.primary,
    justifyContent: 'center', alignItems: 'center',
  },
  bellCountText: { color: '#fff', fontSize: 9, fontWeight: '800' },

  filterRow: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: Colors.radius.full,
  },
  filterLabel: { fontSize: 13, fontWeight: '600' },

  list: { paddingHorizontal: 16, paddingTop: 4 },
  resultCount: { fontSize: 12, marginBottom: 10 },

  card: {
    borderRadius: Colors.radius.md,
    marginBottom: 12,
    overflow: 'hidden',
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 10,
  },
  levelStripe: { width: 4, height: '100%', position: 'absolute', left: 0, top: 0, bottom: 0 },
  cardIconWrap: {
    width: 40, height: 40, borderRadius: 20,
    justifyContent: 'center', alignItems: 'center',
    marginLeft: 8,
  },
  cardBody: { flex: 1 },
  cardTitle: { fontSize: 15, fontWeight: '700', marginBottom: 4 },
  cardMeta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  cardMetaText: { fontSize: 11 },
  levelBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: Colors.radius.sm },
  levelText: { fontSize: 10, fontWeight: '800' },
  cardDesc: { fontSize: 13, lineHeight: 18, paddingHorizontal: 22, paddingBottom: 14 },
});
