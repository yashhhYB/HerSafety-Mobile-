import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, Image } from 'react-native';
import { Users, Phone, Bell, ShieldPlus, ChevronRight } from 'lucide-react-native';
import { router } from 'expo-router';

export default function GuardianGridScreen() {
  const guardians = [
    { id: '1', name: 'Mom', phone: '+1 234 567 890', status: 'Active' },
    { id: '2', name: 'Sarah (Roommate)', phone: '+1 987 654 321', status: 'Active' },
    { id: '3', name: 'Dad', phone: '+1 555 123 456', status: 'Pending' },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ChevronRight size={24} color="#2c3e50" style={{ transform: [{ rotate: '180deg' }] }} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Guardian Grid</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.banner}>
        <Users size={32} color="#3498db" />
        <Text style={styles.bannerTitle}>Your Trusted Network</Text>
        <Text style={styles.bannerText}>
          These contacts will automatically receive your live location and audio recordings if you trigger an SOS.
        </Text>
      </View>

      <View style={styles.listContainer}>
        <Text style={styles.sectionTitle}>My Guardians ({guardians.length}/5)</Text>
        
        {guardians.map((guardian) => (
          <View key={guardian.id} style={styles.guardianCard}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{guardian.name.charAt(0)}</Text>
            </View>
            <View style={styles.guardianInfo}>
              <Text style={styles.guardianName}>{guardian.name}</Text>
              <Text style={styles.guardianPhone}>{guardian.phone}</Text>
            </View>
            <View style={[
              styles.statusBadge, 
              guardian.status === 'Active' ? styles.statusActive : styles.statusPending
            ]}>
              <Text style={[
                styles.statusText,
                guardian.status === 'Active' ? styles.statusTextActive : styles.statusTextPending
              ]}>
                {guardian.status}
              </Text>
            </View>
          </View>
        ))}

        <TouchableOpacity style={styles.addGuardianBtn}>
          <ShieldPlus size={24} color="#3498db" />
          <Text style={styles.addGuardianText}>Add New Guardian</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.settingsCard}>
        <View style={styles.settingItem}>
          <View style={styles.settingIcon}>
            <Phone size={20} color="#ff9f43" />
          </View>
          <View style={styles.settingText}>
            <Text style={styles.settingTitle}>Auto-Call Police</Text>
            <Text style={styles.settingDesc}>Dial 911 when SOS activated</Text>
          </View>
          {/* Mock Toggle */}
          <View style={styles.toggleOff}>
            <View style={styles.toggleKnobOff} />
          </View>
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingIcon}>
            <Bell size={20} color="#ff4757" />
          </View>
          <View style={styles.settingText}>
            <Text style={styles.settingTitle}>Bypass Silent Mode</Text>
            <Text style={styles.settingDesc}>Force guardians' phones to ring</Text>
          </View>
          {/* Mock Toggle On */}
          <View style={styles.toggleOn}>
            <View style={styles.toggleKnobOn} />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#2c3e50',
  },
  banner: {
    backgroundColor: 'rgba(52, 152, 219, 0.1)',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 32,
  },
  bannerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#3498db',
    marginTop: 12,
    marginBottom: 8,
  },
  bannerText: {
    textAlign: 'center',
    color: '#2c3e50',
    fontSize: 14,
    lineHeight: 20,
  },
  listContainer: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 16,
  },
  guardianCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#e3e8ee',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2c3e50',
  },
  guardianInfo: {
    flex: 1,
  },
  guardianName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 4,
  },
  guardianPhone: {
    fontSize: 13,
    color: '#7f8c8d',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusActive: {
    backgroundColor: 'rgba(39, 174, 96, 0.1)',
  },
  statusPending: {
    backgroundColor: 'rgba(241, 196, 15, 0.1)',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },
  statusTextActive: {
    color: '#27ae60',
  },
  statusTextPending: {
    color: '#f39c12',
  },
  addGuardianBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#3498db',
    borderStyle: 'dashed',
    borderRadius: 16,
    padding: 16,
    marginTop: 8,
  },
  addGuardianText: {
    marginLeft: 12,
    fontSize: 16,
    fontWeight: '600',
    color: '#3498db',
  },
  settingsCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 12,
    elevation: 3,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 4,
  },
  settingDesc: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  toggleOff: {
    width: 48,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#e3e8ee',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleKnobOff: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  toggleOn: {
    width: 48,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#3498db',
    justifyContent: 'center',
    paddingHorizontal: 2,
    alignItems: 'flex-end',
  },
  toggleKnobOn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  }
});
