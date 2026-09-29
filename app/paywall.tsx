import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, ActivityIndicator } from 'react-native';
import { Shield, Check, X, ShieldCheck } from 'lucide-react-native';
import { router } from 'expo-router';
// import Purchases from 'react-native-purchases'; // uncomment when using real RevenueCat

export default function PaywallScreen() {
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual'>('annual');

  const handleSubscribe = async () => {
    setLoading(true);
    // Simulate purchase for the hackathon
    setTimeout(() => {
      setLoading(false);
      alert('Subscription Successful! Welcome to HerShield Pro.');
      router.back();
    }, 1500);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
        <X size={24} color="#333" />
      </TouchableOpacity>

      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Shield size={40} color="#fff" />
        </View>
        <Text style={styles.title}>HerShield Pro</Text>
        <Text style={styles.subtitle}>Unlock ultimate protection & peace of mind.</Text>
      </View>

      <View style={styles.featuresList}>
        <View style={styles.featureItem}>
          <View style={styles.checkIcon}>
            <Check size={16} color="#fff" />
          </View>
          <Text style={styles.featureText}>Unlimited AI Threat Routing (AWS Bedrock)</Text>
        </View>
        <View style={styles.featureItem}>
          <View style={styles.checkIcon}>
            <Check size={16} color="#fff" />
          </View>
          <Text style={styles.featureText}>Live Threat Radar & Alerts</Text>
        </View>
        <View style={styles.featureItem}>
          <View style={styles.checkIcon}>
            <Check size={16} color="#fff" />
          </View>
          <Text style={styles.featureText}>Automated Audio Evidence Recording</Text>
        </View>
        <View style={styles.featureItem}>
          <View style={styles.checkIcon}>
            <Check size={16} color="#fff" />
          </View>
          <Text style={styles.featureText}>Unlimited Guardian Grid Contacts</Text>
        </View>
      </View>

      <View style={styles.plansContainer}>
        <TouchableOpacity 
          style={[styles.planCard, selectedPlan === 'annual' && styles.planCardActive]}
          onPress={() => setSelectedPlan('annual')}
          activeOpacity={0.8}
        >
          {selectedPlan === 'annual' && (
            <View style={styles.planBadge}>
              <Text style={styles.planBadgeText}>SAVE 33%</Text>
            </View>
          )}
          <Text style={styles.planTitle}>Annual</Text>
          <Text style={styles.planPrice}>$39.99<Text style={styles.planPeriod}>/year</Text></Text>
          <Text style={styles.planDesc}>Just $3.33/month</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.planCard, selectedPlan === 'monthly' && styles.planCardActive]}
          onPress={() => setSelectedPlan('monthly')}
          activeOpacity={0.8}
        >
          <Text style={styles.planTitle}>Monthly</Text>
          <Text style={styles.planPrice}>$4.99<Text style={styles.planPeriod}>/mo</Text></Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        style={styles.subscribeBtn} 
        onPress={handleSubscribe}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.subscribeBtnText}>
            Start 7-Day Free Trial
          </Text>
        )}
      </TouchableOpacity>

      <Text style={styles.disclaimer}>
        By subscribing, you agree to our Terms of Service & Privacy Policy. 
        Cancel anytime in your App Store settings.
      </Text>
      
      <View style={styles.peacePrizeFooter}>
        <ShieldCheck size={16} color="#27ae60" />
        <Text style={styles.peacePrizeText}>
          Core SOS features are always free for everyone. Pro subscriptions help fund our mission to protect women everywhere.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 24,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 40,
  },
  closeBtn: {
    alignSelf: 'flex-start',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f1f2f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#3498db',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#2c3e50',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  featuresList: {
    marginBottom: 32,
    backgroundColor: '#f8f9fa',
    padding: 20,
    borderRadius: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#27ae60',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  featureText: {
    fontSize: 15,
    color: '#2c3e50',
    flex: 1,
  },
  plansContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
    marginBottom: 32,
  },
  planCard: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#e8ecef',
    borderRadius: 16,
    padding: 16,
    position: 'relative',
    alignItems: 'center',
  },
  planCardActive: {
    borderColor: '#3498db',
    backgroundColor: 'rgba(52, 152, 219, 0.05)',
  },
  planBadge: {
    position: 'absolute',
    top: -12,
    backgroundColor: '#ff4757',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  planBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '800',
  },
  planTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7f8c8d',
    marginBottom: 8,
    marginTop: 8,
  },
  planPrice: {
    fontSize: 24,
    fontWeight: '800',
    color: '#2c3e50',
    marginBottom: 4,
  },
  planPeriod: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7f8c8d',
  },
  planDesc: {
    fontSize: 12,
    color: '#27ae60',
    fontWeight: '600',
  },
  subscribeBtn: {
    backgroundColor: '#3498db',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#3498db',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  subscribeBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  disclaimer: {
    fontSize: 12,
    color: '#95a5a6',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 18,
  },
  peacePrizeFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(39, 174, 96, 0.1)',
    padding: 16,
    borderRadius: 12,
  },
  peacePrizeText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 12,
    color: '#27ae60',
    fontWeight: '600',
    lineHeight: 16,
  }
});
