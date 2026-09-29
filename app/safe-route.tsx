import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Platform, ActivityIndicator } from 'react-native';
import { MapPin, Navigation, AlertTriangle, ShieldCheck, Sparkles, ChevronRight } from 'lucide-react-native';
import { router } from 'expo-router';
import { analyzeRouteSafety } from '../lib/aws-bedrock';

export default function SafeRouteScreen() {
  const [analyzing, setAnalyzing] = useState(true);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const scanAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start scanning animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(scanAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        })
      ])
    ).start();

    // Trigger AI analysis (Mock AWS Bedrock)
    analyzeRouteSafety({ route: 'home' }, 'night', 'walking alone').then(res => {
      setAnalyzing(false);
      setAnalysisResult(res);
      scanAnim.stopAnimation();
    });
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ChevronRight size={24} color="#2c3e50" style={{ transform: [{ rotate: '180deg' }] }} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>SafeRoute</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.mapPlaceholder}>
        <View style={styles.mapGrid} />
        
        <View style={[styles.mockPin, { top: '30%', left: '20%' }]}>
          <MapPin size={24} color="#3498db" />
        </View>
        <View style={[styles.mockRoute, { top: '40%', left: '30%', width: 100 }]} />
        <View style={[styles.mockPin, { top: '50%', left: '60%' }]}>
          <MapPin size={24} color="#1dd1a1" />
        </View>

        {analyzing ? (
          <Animated.View 
            style={[
              styles.scannerLine, 
              { 
                transform: [{ 
                  translateY: scanAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-100, 300]
                  })
                }]
              }
            ]} 
          />
        ) : (
          <View style={styles.aiBadge}>
            <ShieldCheck size={16} color="#fff" />
            <Text style={styles.aiBadgeText}>AI Score: {analysisResult?.score}/100</Text>
          </View>
        )}
      </View>

      <View style={styles.bottomSheet}>
        {analyzing ? (
          <View style={styles.analyzingContainer}>
            <Sparkles size={32} color="#3498db" style={{ marginBottom: 16 }} />
            <Text style={styles.sheetTitle}>AWS Bedrock Analyzing...</Text>
            <Text style={styles.sheetSubtitle}>Checking lighting, crime data, and foot traffic.</Text>
            <ActivityIndicator size="large" color="#3498db" />
          </View>
        ) : (
          <View>
            <Text style={styles.sheetTitle}>Route Analyzed</Text>
            <View style={styles.insightBox}>
              <Text style={styles.insightTitle}>AI Insights:</Text>
              {analysisResult?.insights.map((insight: string, idx: number) => (
                <Text key={idx} style={styles.insightText}>• {insight}</Text>
              ))}
              {analysisResult?.alerts.map((alert: string, idx: number) => (
                <Text key={`alert-${idx}`} style={[styles.insightText, { color: '#e74c3c' }]}>⚠️ {alert}</Text>
              ))}
            </View>
            
            <View style={styles.actionRow}>
              <TouchableOpacity style={styles.actionBtn}>
                <AlertTriangle size={20} color="#ff9f43" />
                <Text style={styles.actionBtnText}>Report</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={[styles.actionBtn, styles.primaryBtn]}>
                <Navigation size={20} color="#fff" />
                <Text style={[styles.actionBtnText, { color: '#fff' }]}>Start Live Tracking</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f2f6',
  },
  header: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
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
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#2c3e50',
    backgroundColor: 'rgba(255,255,255,0.8)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: 'hidden',
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
  scannerLine: {
    position: 'absolute',
    width: '200%',
    height: 4,
    backgroundColor: '#3498db',
    shadowColor: '#3498db',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 10,
    transform: [{ rotate: '15deg' }]
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
    top: '20%',
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
    minHeight: '40%',
  },
  analyzingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  sheetTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#2c3e50',
    marginBottom: 8,
    textAlign: 'center',
  },
  sheetSubtitle: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 24,
    textAlign: 'center',
  },
  insightBox: {
    backgroundColor: 'rgba(52, 152, 219, 0.1)',
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
  },
  insightTitle: {
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 8,
  },
  insightText: {
    color: '#34495e',
    marginBottom: 4,
    fontSize: 13,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  actionBtn: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e8ecef',
    flexDirection: 'row',
  },
  primaryBtn: {
    backgroundColor: '#3498db',
    borderColor: '#3498db',
    flex: 2,
  },
  actionBtnText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '700',
    color: '#2c3e50',
  }
});
