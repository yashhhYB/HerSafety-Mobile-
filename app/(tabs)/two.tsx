import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { User, Shield, Bell, Lock, CircleHelp, ChevronRight } from 'lucide-react-native';
import { router } from 'expo-router';

export default function SettingsScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      {/* Profile Card */}
      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <User size={32} color="#fff" />
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>Sarah Connor</Text>
          <Text style={styles.profileEmail}>sarah@example.com</Text>
        </View>
        <TouchableOpacity style={styles.editBtn}>
          <Text style={styles.editBtnText}>Edit</Text>
        </TouchableOpacity>
      </View>

      {/* Subscription Banner */}
      <TouchableOpacity 
        style={styles.proBanner} 
        activeOpacity={0.8}
        onPress={() => router.push('/paywall')}
      >
        <View style={styles.proBannerContent}>
          <Shield size={24} color="#fff" />
          <View style={styles.proBannerText}>
            <Text style={styles.proTitle}>Upgrade to HerShield Pro</Text>
            <Text style={styles.proDesc}>Get AI routing & live radar</Text>
          </View>
        </View>
        <ChevronRight size={20} color="#fff" />
      </TouchableOpacity>

      {/* Settings Options */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        
        <TouchableOpacity style={styles.optionRow}>
          <View style={[styles.iconBox, { backgroundColor: 'rgba(52, 152, 219, 0.1)' }]}>
            <Bell size={20} color="#3498db" />
          </View>
          <Text style={styles.optionText}>Notifications</Text>
          <ChevronRight size={20} color="#bdc3c7" />
        </TouchableOpacity>

        <View style={styles.separator} />

        <TouchableOpacity style={styles.optionRow}>
          <View style={[styles.iconBox, { backgroundColor: 'rgba(46, 204, 113, 0.1)' }]}>
            <Lock size={20} color="#2ecc71" />
          </View>
          <Text style={styles.optionText}>Privacy & Security</Text>
          <ChevronRight size={20} color="#bdc3c7" />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support</Text>
        
        <TouchableOpacity style={styles.optionRow}>
          <View style={[styles.iconBox, { backgroundColor: 'rgba(241, 196, 15, 0.1)' }]}>
            <CircleHelp size={20} color="#f1c40f" />
          </View>
          <Text style={styles.optionText}>Help Center & FAQ</Text>
          <ChevronRight size={20} color="#bdc3c7" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutBtn}>
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
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
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#2c3e50',
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#95a5a6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  editBtn: {
    backgroundColor: '#f1f2f6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  editBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
  },
  proBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ff4757',
    padding: 20,
    borderRadius: 20,
    marginBottom: 32,
    shadowColor: '#ff4757',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  proBannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  proBannerText: {
    marginLeft: 16,
  },
  proTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 4,
  },
  proDesc: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 13,
    fontWeight: '500',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 8,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#95a5a6',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginLeft: 12,
    marginTop: 12,
    marginBottom: 8,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
  },
  separator: {
    height: 1,
    backgroundColor: '#f1f2f6',
    marginLeft: 68,
  },
  logoutBtn: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#ff4757',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  logoutText: {
    color: '#ff4757',
    fontSize: 16,
    fontWeight: '700',
  }
});
