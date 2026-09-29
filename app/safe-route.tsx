import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform } from 'react-native';
import { MapPin, Navigation, AlertTriangle, ShieldCheck } from 'lucide-react-native';
import { router } from 'expo-router';

export default function SafeRouteScreen() {
  return (
    <View style={styles.container}>
      {/* Placeholder for actual react-native-maps */}
      <View style={styles.mapPlaceholder}>
        <View style={styles.mapGrid} />
        
        {/* Mock Map Elements */}
        <View style={[styles.mockPin, { top: '30%', left: '20%' }]}>
          <MapPin size={24} color="#3498db" />
        </View>
        <View style={[styles.mockRoute, { top: '40%', left: '30%', width: 100 }]} />
        <View style={[styles.mockPin, { top: '50%', left: '60%' }]}>
          <MapPin size={24} color="#1dd1a1" />
        </View>

        {/* AI Threat Indicator */}
        <View style={styles.aiBadge}>
          <ShieldCheck size={16} color="#fff" />
          <Text style={styles.aiBadgeText}>AI Safety Score: 92/100</Text>
        </View>
      </View>

      <View style={styles.bottomSheet}>
        <Text style={styles.sheetTitle}>Navigation Active</Text>
        <Text style={styles.sheetSubtitle}>SafeRoute is monitoring your path</Text>
        
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.actionBtn}>
            <AlertTriangle size={24} color="#ff9f43" />
            <Text style={styles.actionBtnText}>Report Issue</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.actionBtn, styles.primaryBtn]}>
            <Navigation size={24} color="#fff" />
            <Text style={[styles.actionBtnText, { color: '#fff' }]}>Share Live Tracking</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f2f6',
  },
  mapPlaceholder: {
    flex: 1,
    backgroundColor: '#e3e8ee',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  mapGrid: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.1,
    borderWidth: 1,
    borderColor: '#2c3e50',
    borderStyle: 'dashed',
  },
  mockPin: {
    position: 'absolute',
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  mockRoute: {
    position: 'absolute',
    height: 4,
    backgroundColor: '#3498db',
    borderRadius: 2,
    transform: [{ rotate: '25deg' }],
  },
  aiBadge: {
    position: 'absolute',
    top: 20,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1dd1a1',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#1dd1a1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  aiBadgeText: {
    color: '#fff',
    fontWeight: '700',
    marginLeft: 8,
    fontSize: 14,
  },
  bottomSheet: {
    backgroundColor: '#fff',
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 20,
  },
  sheetTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#2c3e50',
    marginBottom: 4,
  },
  sheetSubtitle: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 24,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  actionBtn: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e8ecef',
  },
  primaryBtn: {
    backgroundColor: '#3498db',
    borderColor: '#3498db',
  },
  actionBtnText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
  }
});
