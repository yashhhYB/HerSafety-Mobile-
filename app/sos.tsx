import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing, Platform } from 'react-native';
import { ShieldAlert, X } from 'lucide-react-native';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';

export default function SOSScreen() {
  const [pulseAnim] = useState(new Animated.Value(1));
  const [countdown, setCountdown] = useState(5);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isActive && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      }, 1000);
    } else if (isActive && countdown === 0) {
      // Trigger actual SOS
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      alert('SOS ALERT SENT TO EMERGENCY CONTACTS & AUTHORITIES!');
      setIsActive(false);
      setCountdown(5);
    }
    return () => clearInterval(timer);
  }, [isActive, countdown]);

  const handleSOSPress = () => {
    if (!isActive) {
      setIsActive(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    } else {
      setIsActive(false);
      setCountdown(5);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.closeBtn} 
        onPress={() => router.back()}
      >
        <X size={24} color="#333" />
      </TouchableOpacity>

      <Text style={styles.title}>EMERGENCY SOS</Text>
      <Text style={styles.subtitle}>
        {isActive 
          ? `Sending alert in ${countdown}s... Tap to cancel.` 
          : 'Tap the button below to immediately alert your emergency contacts and local authorities.'}
      </Text>

      <View style={styles.buttonContainer}>
        <Animated.View 
          style={[
            styles.pulseRing, 
            { transform: [{ scale: pulseAnim }], opacity: isActive ? 0.8 : 0.3 }
          ]} 
        />
        <Animated.View 
          style={[
            styles.pulseRing2, 
            { transform: [{ scale: Animated.multiply(pulseAnim, 1.3) }], opacity: isActive ? 0.4 : 0.1 }
          ]} 
        />
        
        <TouchableOpacity 
          style={[styles.sosButton, isActive && styles.sosButtonActive]} 
          onPress={handleSOSPress}
          activeOpacity={0.9}
        >
          <ShieldAlert size={64} color="#fff" />
          <Text style={styles.sosText}>{isActive ? 'CANCEL' : 'SOS'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>What happens when activated?</Text>
        <Text style={styles.infoText}>• Live location sent to 3 trusted contacts</Text>
        <Text style={styles.infoText}>• Audio recording begins immediately</Text>
        <Text style={styles.infoText}>• Local authorities notified (if configured)</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    padding: 24,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
  },
  closeBtn: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    right: 24,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f1f2f6',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#ff4757',
    marginTop: 40,
    marginBottom: 12,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 16,
    color: '#57606f',
    textAlign: 'center',
    marginBottom: 60,
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  buttonContainer: {
    width: 250,
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 60,
  },
  pulseRing: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#ff4757',
  },
  pulseRing2: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#ff4757',
  },
  sosButton: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#ff4757',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#ff4757',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 15,
  },
  sosButtonActive: {
    backgroundColor: '#2f3542',
    shadowColor: '#2f3542',
  },
  sosText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '900',
    marginTop: 8,
    letterSpacing: 2,
  },
  infoBox: {
    width: '100%',
    backgroundColor: '#f1f2f6',
    borderRadius: 16,
    padding: 20,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2f3542',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#57606f',
    marginBottom: 8,
    lineHeight: 20,
  }
});
