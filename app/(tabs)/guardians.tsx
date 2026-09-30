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
  Users,
  Phone,
  Plus,
  ShieldPlus,
  Trash2,
  Bell,
  CheckCircle,
  Clock,
  ChevronRight,
} from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

// ─── Types ────────────────────────────────────────────────────────────────────
type GuardianStatus = 'active' | 'pending';

type Guardian = {
  id: string;
  name: string;
  phone: string;
  initials: string;
  avatarColor: string;
  status: GuardianStatus;
};

// ─── Mock data ────────────────────────────────────────────────────────────────
const INITIAL_GUARDIANS: Guardian[] = [
  {
    id: 'g1',
    name: 'Mom',
    phone: '+91 98765 43210',
    initials: 'M',
    avatarColor: '#E91E63',
    status: 'active',
  },
  {
    id: 'g2',
    name: 'Sarah (Roommate)',
    phone: '+91 87654 32109',
    initials: 'S',
    avatarColor: '#9C27B0',
    status: 'active',
  },
  {
    id: 'g3',
    name: 'Dad',
    phone: '+91 76543 21098',
    initials: 'D',
    avatarColor: '#2196F3',
    status: 'pending',
  },
];

const AVATAR_COLORS = [
  '#E91E63', '#9C27B0', '#2196F3',
  '#009688', '#FF5722', '#795548',
];

// ─── Guardian card ────────────────────────────────────────────────────────────
function GuardianCard({
  guardian,
  theme,
  onCall,
  onRemove,
}: {
  guardian: Guardian;
  theme: typeof Colors.light;
  onCall: (g: Guardian) => void;
  onRemove: (id: string) => void;
}) {
  const isActive = guardian.status === 'active';

  return (
    <View style={[styles.card, { backgroundColor: theme.surface }, Colors.shadow.sm]}>
      {/* Avatar */}
      <View style={[styles.avatar, { backgroundColor: guardian.avatarColor }]}>
        <Text style={styles.avatarText}>{guardian.initials}</Text>
      </View>

      {/* Info */}
      <View style={styles.cardInfo}>
        <Text style={[styles.cardName, { color: theme.text }]}>{guardian.name}</Text>
        <Text style={[styles.cardPhone, { color: theme.textSecond }]}>{guardian.phone}</Text>
        <View style={[styles.statusRow]}>
          {isActive ? (
            <CheckCircle size={12} color={Colors.brand.success} />
          ) : (
            <Clock size={12} color={Colors.brand.warning} />
          )}
          <Text
            style={[
              styles.statusText,
              { color: isActive ? Colors.brand.success : Colors.brand.warning },
            ]}
          >
            {isActive ? 'Active' : 'Invite Pending'}
          </Text>
        </View>
      </View>

      {/* Actions */}
      <View style={styles.cardActions}>
        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: Colors.brand.accent + '18' }]}
          onPress={() => onCall(guardian)}
        >
          <Phone size={16} color={Colors.brand.accent} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: Colors.brand.primary + '15' }]}
          onPress={() => onRemove(guardian.id)}
        >
          <Trash2 size={16} color={Colors.brand.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────
export default function GuardiansScreen() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? Colors.dark : Colors.light;

  const [guardians, setGuardians] = useState<Guardian[]>(INITIAL_GUARDIANS);
  const [autoCall911, setAutoCall911] = useState(false);
  const [bypassSilent, setBypassSilent] = useState(true);
  const [shareLocation, setShareLocation] = useState(true);

  const handleCall = (g: Guardian) => {
    Alert.alert(
      `Call ${g.name}?`,
      g.phone,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Call',
          onPress: () => Linking.openURL(`tel:${g.phone.replace(/\s/g, '')}`),
        },
      ]
    );
  };

  const handleRemove = (id: string) => {
    Alert.alert(
      'Remove Guardian?',
      'They will no longer receive your SOS alerts.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => setGuardians(prev => prev.filter(g => g.id !== id)),
        },
      ]
    );
  };

  const handleAdd = () => {
    if (guardians.length >= 5) {
      Alert.alert('Limit Reached', 'You can add up to 5 guardians.');
      return;
    }
    // In a real app, open contact picker. Here we add a mock guardian.
    const idx = guardians.length;
    const names = ['Priya', 'Ananya', 'Neha'];
    const name = names[idx % names.length];
    setGuardians(prev => [
      ...prev,
      {
        id: `g${Date.now()}`,
        name,
        phone: `+91 ${Math.floor(Math.random() * 90000 + 10000)} ${Math.floor(Math.random() * 90000 + 10000)}`,
        initials: name[0],
        avatarColor: AVATAR_COLORS[idx % AVATAR_COLORS.length],
        status: 'pending',
      },
    ]);
  };

  return (
    <View style={[styles.root, { backgroundColor: theme.bg }]}>
      <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* ── Header ── */}
        <View style={[styles.header, { backgroundColor: theme.surface }]}>
          <View style={styles.headerIcon}>
            <Users size={26} color={Colors.brand.secondary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.headerTitle, { color: theme.text }]}>Guardian Grid</Text>
            <Text style={[styles.headerSub, { color: theme.textSecond }]}>
              {guardians.filter(g => g.status === 'active').length} of {guardians.length} active
            </Text>
          </View>
          <TouchableOpacity
            style={styles.addFab}
            onPress={handleAdd}
            activeOpacity={0.8}
          >
            <Plus size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* ── Info banner ── */}
        <View style={[styles.infoBanner, { backgroundColor: Colors.brand.secondary + '10' }]}>
          <ShieldPlus size={20} color={Colors.brand.secondary} />
          <Text style={[styles.infoText, { color: Colors.brand.secondary }]}>
            Your guardians receive your real-time location and an audio stream the moment you trigger SOS.
          </Text>
        </View>

        {/* ── Guardian list ── */}
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          My Guardians ({guardians.length}/5)
        </Text>

        {guardians.map(g => (
          <GuardianCard
            key={g.id}
            guardian={g}
            theme={theme}
            onCall={handleCall}
            onRemove={handleRemove}
          />
        ))}

        {/* Add button */}
        <TouchableOpacity
          style={[styles.addBtn, { borderColor: Colors.brand.secondary }]}
          onPress={handleAdd}
          activeOpacity={0.8}
        >
          <Plus size={20} color={Colors.brand.secondary} />
          <Text style={[styles.addBtnText, { color: Colors.brand.secondary }]}>
            Add Guardian
          </Text>
        </TouchableOpacity>

        {/* ── SOS Settings ── */}
        <Text style={[styles.sectionTitle, { color: theme.text, marginTop: 28 }]}>
          SOS Behaviour
        </Text>

        <View style={[styles.settingsCard, { backgroundColor: theme.surface }, Colors.shadow.sm]}>
          <SettingRow
            icon={<Phone size={18} color="#FF6D00" />}
            iconBg="#FFF3E0"
            title="Auto-Call Police"
            sub="Dial emergency services on SOS"
            value={autoCall911}
            onChange={setAutoCall911}
            theme={theme}
          />
          <View style={[styles.divider, { backgroundColor: theme.border }]} />
          <SettingRow
            icon={<Bell size={18} color={Colors.brand.primary} />}
            iconBg="#FFEBEE"
            title="Bypass Silent Mode"
            sub="Force guardians' phones to ring"
            value={bypassSilent}
            onChange={setBypassSilent}
            theme={theme}
          />
          <View style={[styles.divider, { backgroundColor: theme.border }]} />
          <SettingRow
            icon={<ChevronRight size={18} color={Colors.brand.accent} />}
            iconBg="#E0F2F1"
            title="Share Live Location"
            sub="Continuous location until you cancel"
            value={shareLocation}
            onChange={setShareLocation}
            theme={theme}
          />
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

// ─── Setting row sub-component ────────────────────────────────────────────────
function SettingRow({
  icon,
  iconBg,
  title,
  sub,
  value,
  onChange,
  theme,
}: {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  sub: string;
  value: boolean;
  onChange: (v: boolean) => void;
  theme: typeof Colors.light;
}) {
  return (
    <View style={styles.settingRow}>
      <View style={[styles.settingIconWrap, { backgroundColor: iconBg }]}>{icon}</View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.settingTitle, { color: theme.text }]}>{title}</Text>
        <Text style={[styles.settingSub, { color: theme.textSecond }]}>{sub}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: '#E0E0E0', true: Colors.brand.primary + '60' }}
        thumbColor={value ? Colors.brand.primary : '#f4f3f4'}
        ios_backgroundColor="#E0E0E0"
      />
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { paddingBottom: 24 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 56 : 36,
    paddingBottom: 20,
    paddingHorizontal: 20,
    gap: 14,
    ...Colors.shadow.sm,
  },
  headerIcon: {
    width: 48, height: 48, borderRadius: 14,
    backgroundColor: Colors.brand.secondary + '15',
    justifyContent: 'center', alignItems: 'center',
  },
  headerTitle: { fontSize: 22, fontWeight: '800' },
  headerSub: { fontSize: 13, marginTop: 2 },
  addFab: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.brand.primary,
    justifyContent: 'center', alignItems: 'center',
  },

  infoBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    margin: 16,
    padding: 14,
    borderRadius: Colors.radius.md,
  },
  infoText: { flex: 1, fontSize: 13, lineHeight: 18, fontWeight: '500' },

  sectionTitle: { fontSize: 16, fontWeight: '700', marginHorizontal: 16, marginBottom: 10 },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 10,
    borderRadius: Colors.radius.md,
    padding: 14,
    gap: 12,
  },
  avatar: {
    width: 48, height: 48, borderRadius: 24,
    justifyContent: 'center', alignItems: 'center',
  },
  avatarText: { color: '#fff', fontSize: 18, fontWeight: '700' },
  cardInfo: { flex: 1 },
  cardName: { fontSize: 15, fontWeight: '700', marginBottom: 2 },
  cardPhone: { fontSize: 13, marginBottom: 4 },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  statusText: { fontSize: 12, fontWeight: '600' },
  cardActions: { flexDirection: 'row', gap: 8 },
  actionBtn: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },

  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    marginTop: 6,
    padding: 14,
    borderRadius: Colors.radius.md,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    gap: 8,
  },
  addBtnText: { fontSize: 15, fontWeight: '600' },

  settingsCard: {
    marginHorizontal: 16,
    borderRadius: Colors.radius.md,
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 12,
  },
  settingIconWrap: {
    width: 36, height: 36, borderRadius: 10,
    justifyContent: 'center', alignItems: 'center',
  },
  settingTitle: { fontSize: 14, fontWeight: '600', marginBottom: 1 },
  settingSub: { fontSize: 12 },
  divider: { height: 1, marginLeft: 64 },
});
