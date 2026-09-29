import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Platform } from 'react-native';
import { Shield, MapPin, AlertTriangle, BookOpen, Users } from 'lucide-react-native';
import { Link } from 'expo-router';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

export default function HomeScreen() {
  const features = [
    {
      icon: Shield,
      title: "SOS Help",
      description: "Instant emergency assistance",
      href: "/sos",
      gradient: ['#ff6b6b', '#ff4757'],
      color: '#ff4757'
    },
    {
      icon: MapPin,
      title: "SafeRoute",
      description: "Navigate safely to destination",
      href: "/safe-route",
      gradient: ['#1dd1a1', '#10ac84'],
      color: '#1dd1a1'
    },
    {
      icon: AlertTriangle,
      title: "Report",
      description: "Report safety concerns",
      href: "/report",
      gradient: ['#feca57', '#ff9f43'],
      color: '#ff9f43'
    },
    {
      icon: BookOpen,
      title: "Learn",
      description: "Safety tips & resources",
      href: "/learn",
      gradient: ['#5f27cd', '#341f97'],
      color: '#5f27cd'
    },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header section */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Shield size={36} color="#fff" />
        </View>
        <Text style={styles.title}>Welcome to HerSafety</Text>
        <Text style={styles.subtitle}>You are not alone. We're here to keep you safe.</Text>
      </View>

      {/* Feature Grid */}
      <View style={styles.grid}>
        {features.map((feature, index) => (
          <Link href={feature.href as any} asChild key={index}>
            <TouchableOpacity style={styles.card} activeOpacity={0.8}>
              <View style={[styles.iconBox, { backgroundColor: feature.color }]}>
                <feature.icon size={28} color="#fff" />
              </View>
              <Text style={styles.cardTitle}>{feature.title}</Text>
              <Text style={styles.cardDesc}>{feature.description}</Text>
            </TouchableOpacity>
          </Link>
        ))}
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        
        <Link href="/guardian" asChild>
          <TouchableOpacity style={styles.actionButton}>
            <Shield size={20} color="#2c3e50" style={styles.actionIcon} />
            <Text style={styles.actionText}>Smart Guardian Mode</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/radar" asChild>
          <TouchableOpacity style={styles.actionButton}>
            <AlertTriangle size={20} color="#2c3e50" style={styles.actionIcon} />
            <Text style={styles.actionText}>Live Threat Radar</Text>
          </TouchableOpacity>
        </Link>
        
        <Link href="/guardian-grid" asChild>
          <TouchableOpacity style={styles.actionButton}>
            <Users size={20} color="#2c3e50" style={styles.actionIcon} />
            <Text style={styles.actionText}>Guardian Grid Network</Text>
          </TouchableOpacity>
        </Link>
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
    padding: 16,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#3498db',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#2c3e50',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  iconBox: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 4,
    textAlign: 'center',
  },
  cardDesc: {
    fontSize: 12,
    color: '#95a5a6',
    textAlign: 'center',
    lineHeight: 16,
  },
  quickActions: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 16,
    textAlign: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#e8ecef',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  actionIcon: {
    marginRight: 12,
  },
  actionText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2c3e50',
  }
});
