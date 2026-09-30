import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  StatusBar,
  Switch,
  Alert,
  Linking,
} from 'react-native';
import {
  User,
  Shield,
  Bell,
  Lock,
  CircleHelp,
  ChevronRight,
  LogOut,
  ExternalLink,
  Star,
  MapPin,
  Phone,
} from 'lucide-react-native';
import { router } from 'expo-router';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

// ─── Mock profile ─────────────────────────────────────────────────────────────
const PROFILE = {
  name: 'Sarah Connor',
  email: 'sarah@example.com',
  phone: '+91 98765 43210',
  city: 'New Delhi, India',
  avatarColor: '#E91E63',
  initials: 'SC',
  isPro: false,
};

// ─── Row component ────────────────────────────────────────────────────────────
function SettingRow({
  icon,
  iconBg,
  label,
  sub,
  onPress,
  theme,
  trailing,
}: {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  sub?: string;
  onPress?: () => void;
  theme: typeof Colors.light;
  trailing?: React.ReactNode;
}) {
  return (
    <TouchableOpacity
      style={styles.row}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={[styles.rowIcon, { backgroundColor: iconBg }]}>{icon}</View>
      <View style={styles.rowText}>
        <Text style={[styles.rowLabel, { color: theme.text }]}>{label}</Text>
        {sub ? (
          <Text style={[styles.rowSub, { color: theme.textSecond }]}>{sub}</Text>
        ) : null}
      </View>
      {trailing ?? <ChevronRight size={18} color={theme.textDisabled} />}
    </TouchableOpacity>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────
export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? Colors.dark : Colors.light;
  const [notifications, setNotifications] = useState(true);
  const [locationSharing, setLocationSharing] = useState(true);

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log Out', style: 'destructive', onPress: () => {} },
    ]);
  };

  const handleRateApp = () => {
    Linking.openURL('https://apps.apple.com'); // placeholder
  };

  return (
    <View style={[styles.root, { backgroundColor: theme.bg }]}>
      <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* ── Header ── */}
        <View style={[styles.header, { backgroundColor: Colors.brand.secondary }]}>
          <View style={[styles.avatar, { backgroundColor: PROFILE.avatarColor }]}>
            <Text style={styles.avatarText}>{PROFILE.initials}</Text>
          </View>
          <Text style={styles.profileName}>{PROFILE.name}</Text>
          <Text style={styles.profileEmail}>{PROFILE.email}</Text>

          <View style={styles.profileMeta}>
            <View style={styles.metaItem}>
              <Phone size={13} color="rgba(255,255,255,0.7)" />
              <Text style={styles.metaText}>{PROFILE.phone}</Text>
            </View>
            <View style={styles.metaSep} />
            <View style={styles.metaItem}>
              <MapPin size={13} color="rgba(255,255,255,0.7)" />
              <Text style={styles.metaText}>{PROFILE.city}</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.editBtn}
            activeOpacity={0.8}
          >
            <Text style={styles.editBtnText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* ── Pro banner ── */}
        {!PROFILE.isPro && (
          <TouchableOpacity
            style={[styles.proBanner, Colors.shadow.md]}
            onPress={() => router.push('/paywall')}
            activeOpacity={0.85}
          >
            <Star size={22} color="#FFD700" fill="#FFD700" />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.proTitle}>Upgrade to HerShield Pro</Text>
              <Text style={styles.proSub}>AI routing, live radar & unlimited guardians</Text>
            </View>
            <ChevronRight size={20} color="#fff" />
          </TouchableOpacity>
        )}

        {/* ── Preferences ── */}
        <Text style={[styles.sectionTitle, { color: theme.textSecond }]}>PREFERENCES</Text>
        <View style={[styles.section, { backgroundColor: theme.surface }, Colors.shadow.sm]}>
          <SettingRow
            icon={<Bell size={18} color="#1565C0" />}
            iconBg="#E3F2FD"
            label="Push Notifications"
            theme={theme}
            trailing={
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: '#E0E0E0', true: Colors.brand.primary + '60' }}
                thumbColor={notifications ? Colors.brand.primary : '#f4f3f4'}
                ios_backgroundColor="#E0E0E0"
              />
            }
          />
          <View style={[styles.divider, { backgroundColor: theme.border }]} />
          <SettingRow
            icon={<MapPin size={18} color="#00897B" />}
            iconBg="#E0F2F1"
            label="Share Location with Guardians"
            theme={theme}
            trailing={
              <Switch
                value={locationSharing}
                onValueChange={setLocationSharing}
                trackColor={{ false: '#E0E0E0', true: Colors.brand.primary + '60' }}
                thumbColor={locationSharing ? Colors.brand.primary : '#f4f3f4'}
                ios_backgroundColor="#E0E0E0"
              />
            }
          />
          <View style={[styles.divider, { backgroundColor: theme.border }]} />
          <SettingRow
            icon={<Lock size={18} color="#6A1B9A" />}
            iconBg="#F3E5F5"
            label="Privacy & Security"
            sub="Manage data sharing and permissions"
            theme={theme}
          />
        </View>

        {/* ── Support ── */}
        <Text style={[styles.sectionTitle, { color: theme.textSecond, marginTop: 24 }]}>SUPPORT</Text>
        <View style={[styles.section, { backgroundColor: theme.surface }, Colors.shadow.sm]}>
          <SettingRow
            icon={<CircleHelp size={18} color="#F57F17" />}
            iconBg="#FFF8E1"
            label="Help Center & FAQ"
            theme={theme}
          />
          <View style={[styles.divider, { backgroundColor: theme.border }]} />
          <SettingRow
            icon={<Star size={18} color="#FB8C00" />}
            iconBg="#FFF3E0"
            label="Rate HerSafety"
            sub="Support us on the App Store"
            onPress={handleRateApp}
            theme={theme}
            trailing={<ExternalLink size={16} color={theme.textDisabled} />}
          />
          <View style={[styles.divider, { backgroundColor: theme.border }]} />
          <SettingRow
            icon={<Shield size={18} color={Colors.brand.secondary} />}
            iconBg={Colors.brand.secondary + '15'}
            label="Terms & Privacy Policy"
            theme={theme}
          />
        </View>

        {/* ── App info ── */}
        <Text style={[styles.appInfo, { color: theme.textDisabled }]}>
          HerSafety v1.0.0 • Made with ❤️ for women's safety
        </Text>

        {/* ── Logout ── */}
        <TouchableOpacity
          style={[styles.logoutBtn, { borderColor: Colors.brand.primary }]}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <LogOut size={18} color={Colors.brand.primary} />
          <Text style={[styles.logoutText, { color: Colors.brand.primary }]}>Log Out</Text>
        </TouchableOpacity>

        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { paddingBottom: 24 },

  header: {
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 60 : 44,
    paddingBottom: 32,
    paddingHorizontal: 20,
  },
  avatar: {
    width: 80, height: 80, borderRadius: 40,
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 12,
    borderWidth: 3, borderColor: 'rgba(255,255,255,0.4)',
  },
  avatarText: { color: '#fff', fontSize: 28, fontWeight: '800' },
  profileName: { fontSize: 22, fontWeight: '800', color: '#fff', marginBottom: 4 },
  profileEmail: { fontSize: 14, color: 'rgba(255,255,255,0.75)', marginBottom: 12 },
  profileMeta: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 12, color: 'rgba(255,255,255,0.75)' },
  metaSep: { width: 1, height: 14, backgroundColor: 'rgba(255,255,255,0.3)' },
  editBtn: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: Colors.radius.full,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  editBtnText: { color: '#fff', fontWeight: '600', fontSize: 14 },

  proBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF6D00',
    margin: 16,
    marginTop: -1,
    padding: 18,
    borderRadius: Colors.radius.md,
  },
  proTitle: { color: '#fff', fontSize: 15, fontWeight: '800', marginBottom: 2 },
  proSub: { color: 'rgba(255,255,255,0.8)', fontSize: 12 },

  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 8,
  },
  section: { marginHorizontal: 16, borderRadius: Colors.radius.md, overflow: 'hidden' },
  divider: { height: 1, marginLeft: 64 },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 12,
  },
  rowIcon: {
    width: 36, height: 36, borderRadius: 10,
    justifyContent: 'center', alignItems: 'center',
  },
  rowText: { flex: 1 },
  rowLabel: { fontSize: 15, fontWeight: '600' },
  rowSub: { fontSize: 12, marginTop: 1 },

  appInfo: {
    textAlign: 'center',
    fontSize: 12,
    marginTop: 24,
    marginBottom: 16,
  },

  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    padding: 14,
    borderRadius: Colors.radius.md,
    borderWidth: 1.5,
    gap: 8,
  },
  logoutText: { fontSize: 15, fontWeight: '700' },
});
