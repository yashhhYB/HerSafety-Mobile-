import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  TextInput,
  StatusBar,
  FlatList,
  Keyboard,
  Animated,
} from 'react-native';
import { WebView } from 'react-native-webview';
import * as Location from 'expo-location';
import {
  ShieldCheck,
  AlertTriangle,
  Search,
  Crosshair,
  ChevronDown,
  Navigation2,
  MapPin,
  X,
  Zap,
} from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import {
  API_KEY,
  reverseGeocode,
  searchPlaces,
  calculateRoute,
  type SearchResult,
  type LatLng,
} from '@/lib/tomtom';

// ─── Threat zone definitions (offset from user) ───────────────────────────────
type ThreatLevel = 'low' | 'medium' | 'high';
type Threat = {
  id: string;
  lat: number;
  lon: number;
  title: string;
  description: string;
  level: ThreatLevel;
  radius: number;
};

function generateThreats(lat: number, lon: number): Threat[] {
  return [
    { id: 't1', lat: lat + 0.004, lon: lon - 0.003, title: 'Poor Lighting',        description: 'Street lights out on 3 blocks — avoid after dark.', level: 'low',    radius: 150 },
    { id: 't2', lat: lat - 0.006, lon: lon + 0.005, title: 'Suspicious Activity',  description: 'Reported at bus stop 12 mins ago.', level: 'high',   radius: 200 },
    { id: 't3', lat: lat + 0.007, lon: lon + 0.004, title: 'Isolated Area',        description: 'No foot traffic past 10 PM. Use alternate route.', level: 'medium', radius: 100 },
  ];
}

const LEVEL_COLOR: Record<ThreatLevel, string> = {
  low:    Colors.brand.warning,
  medium: '#FF6D00',
  high:   Colors.brand.primary,
};

// ─── TomTom Maps HTML (injected into WebView) ─────────────────────────────────
function buildMapHtml(
  lat: number,
  lon: number,
  threats: Threat[],
  isDark: boolean
): string {
  const threatsJson = JSON.stringify(threats);
  const mapStyle = isDark
    ? 'https://api.tomtom.com/style/1/style/22.2.1-2/basic_night/map.json?key=' + API_KEY
    : 'https://api.tomtom.com/style/1/style/22.2.1-2/basic_main/map.json?key=' + API_KEY;

  return /* html */ `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
  <link rel="stylesheet" href="https://api.tomtom.com/maps-sdk-for-web/cdn/6.x/6.25.0/maps/maps.css" />
  <script src="https://api.tomtom.com/maps-sdk-for-web/cdn/6.x/6.25.0/maps/maps-web.min.js"></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body, #map { width: 100%; height: 100%; overflow: hidden; }
    .tt-copyright { display: none !important; }
  </style>
</head>
<body>
  <div id="map"></div>
  <script>
    var apiKey = '${API_KEY}';
    var userLat = ${lat};
    var userLon = ${lon};
    var threats = ${threatsJson};
    var isDark = ${isDark};
    var routeLayerId = null;
    var routeSourceId = null;

    // ── Init map ──────────────────────────────────────────────────────────────
    var map = tt.map({
      key: apiKey,
      container: 'map',
      center: [userLon, userLat],
      zoom: 15,
      style: isDark
        ? 'https://api.tomtom.com/style/1/style/22.2.1-2/basic_night/map.json?key=' + apiKey
        : 'https://api.tomtom.com/style/1/style/22.2.1-2/basic_main/map.json?key=' + apiKey,
    });

    map.addControl(new tt.NavigationControl({ showCompass: false, showZoom: true }), 'bottom-left');

    // ── User location marker ──────────────────────────────────────────────────
    var userEl = document.createElement('div');
    userEl.style.cssText = 'width:20px;height:20px;border-radius:50%;background:#1565C0;border:3px solid white;box-shadow:0 0 0 4px rgba(21,101,192,0.25);';
    new tt.Marker({ element: userEl, anchor: 'center' })
      .setLngLat([userLon, userLat])
      .addTo(map);

    // ── Threat zone circles + markers ─────────────────────────────────────────
    var levelColors = { low: '${Colors.brand.warning}', medium: '#FF6D00', high: '${Colors.brand.primary}' };

    map.on('load', function() {
      threats.forEach(function(t) {
        var color = levelColors[t.level];

        // Circle fill
        map.addSource('circle-' + t.id, {
          type: 'geojson',
          data: { type: 'Feature', geometry: { type: 'Point', coordinates: [t.lon, t.lat] }, properties: {} }
        });
        map.addLayer({
          id: 'circle-fill-' + t.id,
          type: 'circle',
          source: 'circle-' + t.id,
          paint: {
            'circle-radius': { stops: [[10, t.radius/20], [14, t.radius/5], [16, t.radius/2]] },
            'circle-color': color,
            'circle-opacity': 0.15,
            'circle-stroke-color': color,
            'circle-stroke-width': 1.5,
            'circle-stroke-opacity': 0.6,
          }
        });

        // Marker
        var el = document.createElement('div');
        el.style.cssText =
          'width:26px;height:26px;border-radius:50%;background:' + color +
          ';border:2px solid white;display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 2px 6px rgba(0,0,0,0.3);';
        el.innerHTML = '<span style="color:white;font-size:12px;">⚠</span>';
        el.addEventListener('click', function(e) {
          e.stopPropagation();
          window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'threatTapped', threat: t }));
        });
        new tt.Marker({ element: el, anchor: 'center' })
          .setLngLat([t.lon, t.lat])
          .addTo(map);
      });
    });

    // ── Map tap → close panels ────────────────────────────────────────────────
    map.on('click', function() {
      window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'mapTapped' }));
    });

    // ── External commands from React Native ───────────────────────────────────
    function receiveMessage(msg) {
      try {
        var data = JSON.parse(msg);

        if (data.type === 'flyTo') {
          map.flyTo({ center: [data.lon, data.lat], zoom: data.zoom || 15, speed: 1.4 });
        }

        if (data.type === 'drawRoute') {
          var coords = data.points.map(function(p) { return [p.lon, p.lat]; });

          // Remove old route
          if (routeLayerId && map.getLayer(routeLayerId)) map.removeLayer(routeLayerId);
          if (routeSourceId && map.getSource(routeSourceId)) map.removeSource(routeSourceId);

          routeSourceId = 'route-' + Date.now();
          routeLayerId  = 'route-layer-' + Date.now();

          map.addSource(routeSourceId, {
            type: 'geojson',
            data: { type: 'Feature', geometry: { type: 'LineString', coordinates: coords }, properties: {} }
          });
          map.addLayer({
            id: routeLayerId,
            type: 'line',
            source: routeSourceId,
            paint: {
              'line-color': '${Colors.brand.accent}',
              'line-width': 5,
              'line-opacity': 0.9,
              'line-cap': 'round',
              'line-join': 'round',
            }
          });

          // Fit bounds
          var bounds = coords.reduce(function(b, c) { return b.extend(c); }, new tt.LngLatBounds(coords[0], coords[0]));
          map.fitBounds(bounds, { padding: 80, maxZoom: 16 });
        }

        if (data.type === 'clearRoute') {
          if (routeLayerId && map.getLayer(routeLayerId)) map.removeLayer(routeLayerId);
          if (routeSourceId && map.getSource(routeSourceId)) map.removeSource(routeSourceId);
          routeLayerId = null;
          routeSourceId = null;
        }

        if (data.type === 'addDestMarker') {
          var destEl = document.createElement('div');
          destEl.style.cssText = 'width:22px;height:22px;border-radius:50%;background:${Colors.brand.accent};border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);';
          window._destMarker && window._destMarker.remove();
          window._destMarker = new tt.Marker({ element: destEl, anchor: 'center' })
            .setLngLat([data.lon, data.lat])
            .addTo(map);
        }
      } catch(e) {}
    }

    // Listen for injected JS
    document.addEventListener('message', function(e) { receiveMessage(e.data); });
    window.addEventListener('message', function(e) { receiveMessage(e.data); });
  </script>
</body>
</html>
  `.trim();
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function MapScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? Colors.dark : Colors.light;

  const webRef = useRef<WebView>(null);

  const [userLocation, setUserLocation] = useState<LatLng | null>(null);
  const [threats, setThreats] = useState<Threat[]>([]);
  const [loadingLocation, setLoadingLocation] = useState(true);
  const [mapHtml, setMapHtml] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  const [safetyScore, setSafetyScore] = useState<number | null>(null);
  const [selectedThreat, setSelectedThreat] = useState<Threat | null>(null);
  const [locationLabel, setLocationLabel] = useState('');

  const [routeInfo, setRouteInfo] = useState<{ dist: string; time: string } | null>(null);
  const [destinationName, setDestinationName] = useState<string | null>(null);

  const sheetAnim = useRef(new Animated.Value(0)).current;

  // ── Get initial GPS ─────────────────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') { setLoadingLocation(false); return; }

      const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      const { latitude: lat, longitude: lon } = pos.coords;

      const loc: LatLng = { lat, lon };
      setUserLocation(loc);

      const t = generateThreats(lat, lon);
      setThreats(t);
      setSafetyScore(Math.floor(Math.random() * 15) + 80);

      // Reverse geocode with TomTom
      const label = await reverseGeocode(lat, lon);
      setLocationLabel(label);

      // Build HTML
      setMapHtml(buildMapHtml(lat, lon, t, isDark));
      setLoadingLocation(false);
    })();
  }, []);

  // ── Watch GPS for user dot update ───────────────────────────────────────────
  useEffect(() => {
    let sub: Location.LocationSubscription;
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;
      sub = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.Balanced, distanceInterval: 15 },
        pos => {
          setUserLocation({ lat: pos.coords.latitude, lon: pos.coords.longitude });
        }
      );
    })();
    return () => { if (sub) sub.remove(); };
  }, []);

  // ── Search with TomTom ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!search.trim()) { setSearchResults([]); setShowResults(false); return; }
    const timer = setTimeout(async () => {
      setSearchLoading(true);
      const results = await searchPlaces(search, userLocation ?? undefined, 5);
      setSearchResults(results);
      setShowResults(results.length > 0);
      setSearchLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  // ── Select a search result → fly + draw route ───────────────────────────────
  const handleResultSelect = useCallback(async (result: SearchResult) => {
    Keyboard.dismiss();
    setShowResults(false);
    setSearch(result.address.freeformAddress ?? result.poi?.name ?? '');
    setDestinationName(result.poi?.name ?? result.address.freeformAddress ?? '');

    const destLon = result.position.lon;
    const destLat = result.position.lat;

    // Fly to destination
    sendToMap({ type: 'addDestMarker', lat: destLat, lon: destLon });
    sendToMap({ type: 'flyTo', lat: destLat, lon: destLon, zoom: 14 });

    // Draw route
    if (userLocation) {
      const { points, summary } = await calculateRoute(
        userLocation,
        { lat: destLat, lon: destLon },
        'pedestrian'
      );
      if (points.length > 0) {
        sendToMap({ type: 'drawRoute', points });
        if (summary) {
          const distKm = (summary.lengthInMeters / 1000).toFixed(1);
          const mins = Math.round(summary.travelTimeInSeconds / 60);
          setRouteInfo({ dist: `${distKm} km`, time: `${mins} min walk` });

          // Safety score from route
          const score = Math.max(50, Math.min(99,
            95 - Math.round((summary.trafficDelayInSeconds / Math.max(1, summary.travelTimeInSeconds)) * 40)
          ));
          setSafetyScore(score);
        }
      }
    }
  }, [userLocation]);

  // ── Send message to WebView ──────────────────────────────────────────────────
  const sendToMap = (data: object) => {
    webRef.current?.injectJavaScript(
      `receiveMessage(${JSON.stringify(JSON.stringify(data))}); true;`
    );
  };

  // ── Receive messages from WebView ────────────────────────────────────────────
  const handleWebMessage = (event: any) => {
    try {
      const msg = JSON.parse(event.nativeEvent.data);
      if (msg.type === 'threatTapped') {
        setSelectedThreat(msg.threat as Threat);
        setRouteInfo(null);
      }
      if (msg.type === 'mapTapped') {
        setSelectedThreat(null);
      }
    } catch {}
  };

  // ── Recenter ─────────────────────────────────────────────────────────────────
  const centerOnUser = () => {
    if (userLocation) {
      sendToMap({ type: 'flyTo', lat: userLocation.lat, lon: userLocation.lon, zoom: 15 });
    }
  };

  // ── Clear route ───────────────────────────────────────────────────────────────
  const clearRoute = () => {
    sendToMap({ type: 'clearRoute' });
    setRouteInfo(null);
    setDestinationName(null);
    setSearch('');
  };

  // ── Loading state ─────────────────────────────────────────────────────────────
  if (loadingLocation || !mapHtml) {
    return (
      <View style={[styles.loadingWrap, { backgroundColor: theme.bg }]}>
        <View style={styles.loadingInner}>
          <ActivityIndicator size="large" color={Colors.brand.primary} />
          <Text style={[styles.loadingText, { color: theme.textSecond }]}>
            Loading TomTom Map…
          </Text>
          <Text style={[styles.loadingSubText, { color: theme.textDisabled }]}>
            Fetching your location
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} translucent />

      {/* ── TomTom WebView Map ── */}
      <WebView
        ref={webRef}
        style={StyleSheet.absoluteFillObject}
        source={{ html: mapHtml }}
        originWhitelist={['*']}
        javaScriptEnabled
        domStorageEnabled
        allowsInlineMediaPlayback
        onMessage={handleWebMessage}
        scrollEnabled={false}
        bounces={false}
        overScrollMode="never"
        mixedContentMode="compatibility"
        allowsFullscreenVideo={false}
        // Required to prevent keyboard scroll issues on Android
        keyboardDisplayRequiresUserAction={false}
      />

      {/* ── Search bar ── */}
      <View style={[styles.searchWrap, { backgroundColor: theme.surface }, Colors.shadow.lg]}>
        <Search size={17} color={theme.textSecond} />
        <TextInput
          style={[styles.searchInput, { color: theme.text }]}
          placeholder="Search places, addresses…"
          placeholderTextColor={theme.textDisabled}
          value={search}
          onChangeText={setSearch}
          returnKeyType="search"
        />
        {searchLoading && <ActivityIndicator size="small" color={Colors.brand.primary} />}
        {search.length > 0 && !searchLoading && (
          <TouchableOpacity onPress={() => { setSearch(''); setShowResults(false); clearRoute(); }}>
            <X size={16} color={theme.textSecond} />
          </TouchableOpacity>
        )}
      </View>

      {/* ── Search results dropdown ── */}
      {showResults && (
        <View style={[styles.resultsBox, { backgroundColor: theme.surface }, Colors.shadow.lg]}>
          <FlatList
            data={searchResults}
            keyExtractor={i => i.id}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.resultItem, { borderBottomColor: theme.border }]}
                onPress={() => handleResultSelect(item)}
                activeOpacity={0.7}
              >
                <MapPin size={14} color={Colors.brand.primary} style={{ marginTop: 2 }} />
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={[styles.resultName, { color: theme.text }]} numberOfLines={1}>
                    {item.poi?.name ?? item.address.municipalitySubdivision ?? item.address.municipality}
                  </Text>
                  <Text style={[styles.resultAddr, { color: theme.textSecond }]} numberOfLines={1}>
                    {item.address.freeformAddress}
                  </Text>
                </View>
                {item.dist != null && (
                  <Text style={[styles.resultDist, { color: theme.textDisabled }]}>
                    {item.dist < 1000
                      ? `${Math.round(item.dist)}m`
                      : `${(item.dist / 1000).toFixed(1)}km`}
                  </Text>
                )}
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      {/* ── Safety score chip ── */}
      {safetyScore !== null && (
        <View style={[styles.scoreChip, {
          backgroundColor: safetyScore >= 80
            ? Colors.brand.success
            : safetyScore >= 60 ? Colors.brand.warning : Colors.brand.primary,
        }, Colors.shadow.sm]}>
          <ShieldCheck size={13} color="#fff" />
          <Text style={styles.scoreText}>Safety {safetyScore}/100</Text>
        </View>
      )}

      {/* ── Route info banner ── */}
      {routeInfo && (
        <View style={[styles.routeBanner, { backgroundColor: Colors.brand.secondary }, Colors.shadow.md]}>
          <Navigation2 size={16} color="#fff" />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.routeDest} numberOfLines={1}>{destinationName}</Text>
            <Text style={styles.routeMeta}>{routeInfo.dist} • {routeInfo.time}</Text>
          </View>
          <TouchableOpacity onPress={clearRoute} style={styles.routeClose}>
            <X size={16} color="rgba(255,255,255,0.8)" />
          </TouchableOpacity>
        </View>
      )}

      {/* ── Recenter button ── */}
      <TouchableOpacity
        style={[styles.centerBtn, { backgroundColor: theme.surface }, Colors.shadow.md]}
        onPress={centerOnUser}
        activeOpacity={0.8}
      >
        <Crosshair size={22} color={Colors.brand.primary} />
      </TouchableOpacity>

      {/* ── Bottom sheet ── */}
      <View style={[styles.bottomSheet, { backgroundColor: theme.surface }, Colors.shadow.lg]}>
        <View style={styles.handle} />

        {selectedThreat ? (
          /* Threat detail */
          <View>
            <View style={styles.sheetRow}>
              <View style={[styles.threatBadge, { backgroundColor: LEVEL_COLOR[selectedThreat.level] + '22' }]}>
                <AlertTriangle size={20} color={LEVEL_COLOR[selectedThreat.level]} />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={[styles.threatTitle, { color: theme.text }]}>{selectedThreat.title}</Text>
                <Text style={[styles.threatLevel, { color: LEVEL_COLOR[selectedThreat.level] }]}>
                  {selectedThreat.level.toUpperCase()} RISK • {selectedThreat.radius}m radius
                </Text>
              </View>
              <TouchableOpacity onPress={() => setSelectedThreat(null)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <ChevronDown size={22} color={theme.textSecond} />
              </TouchableOpacity>
            </View>
            <Text style={[styles.threatDesc, { color: theme.textSecond }]}>
              {selectedThreat.description}
            </Text>
          </View>
        ) : (
          /* Default legend */
          <View>
            <View style={styles.legendHeader}>
              <View>
                <Text style={[styles.legendTitle, { color: theme.text }]}>TomTom Safety Map</Text>
                <Text style={[styles.legendSub, { color: theme.textSecond }]}>
                  {locationLabel ? `Near ${locationLabel}` : `${threats.length} threat zones nearby`}
                </Text>
              </View>
              <View style={styles.poweredRow}>
                <Zap size={10} color={theme.textDisabled} />
                <Text style={[styles.poweredText, { color: theme.textDisabled }]}>TomTom</Text>
              </View>
            </View>
            <View style={styles.legendRow}>
              {(['low', 'medium', 'high'] as ThreatLevel[]).map(lvl => (
                <View key={lvl} style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: LEVEL_COLOR[lvl] }]} />
                  <Text style={[styles.legendLabel, { color: theme.textSecond }]}>
                    {lvl === 'low' ? 'Low' : lvl === 'medium' ? 'Medium' : 'High'} Risk
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },

  loadingWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingInner: { alignItems: 'center', gap: 12 },
  loadingText: { fontSize: 16, fontWeight: '700' },
  loadingSubText: { fontSize: 13 },

  // Search
  searchWrap: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 58 : 42,
    left: 14,
    right: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Colors.radius.full,
    paddingHorizontal: 14,
    paddingVertical: 10,
    zIndex: 20,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },

  // Results
  resultsBox: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 114 : 98,
    left: 14,
    right: 14,
    borderRadius: Colors.radius.md,
    zIndex: 19,
    maxHeight: 260,
    overflow: 'hidden',
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  resultName: { fontSize: 14, fontWeight: '600', marginBottom: 2 },
  resultAddr: { fontSize: 12, lineHeight: 16 },
  resultDist: { fontSize: 11, marginLeft: 6, marginTop: 2 },

  // Score chip
  scoreChip: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 114 : 98,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Colors.radius.full,
    zIndex: 15,
    gap: 5,
  },
  scoreText: { color: '#fff', fontSize: 12, fontWeight: '700' },

  // Route banner
  routeBanner: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 114 : 98,
    left: 14,
    right: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Colors.radius.md,
    padding: 12,
    zIndex: 16,
  },
  routeDest: { color: '#fff', fontSize: 13, fontWeight: '700' },
  routeMeta: { color: 'rgba(255,255,255,0.75)', fontSize: 12, marginTop: 1 },
  routeClose: { padding: 4 },

  // Recenter
  centerBtn: {
    position: 'absolute',
    bottom: 200,
    right: 14,
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },

  // Bottom sheet
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: Colors.radius.xl,
    borderTopRightRadius: Colors.radius.xl,
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 36 : 20,
    zIndex: 10,
  },
  handle: {
    width: 40, height: 4, borderRadius: 2,
    backgroundColor: '#E0E0E0',
    alignSelf: 'center',
    marginBottom: 16,
  },

  sheetRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  threatBadge: {
    width: 44, height: 44, borderRadius: 22,
    justifyContent: 'center', alignItems: 'center',
  },
  threatTitle: { fontSize: 16, fontWeight: '700' },
  threatLevel: { fontSize: 12, fontWeight: '700', marginTop: 2 },
  threatDesc: { fontSize: 13, lineHeight: 19 },

  legendHeader: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 12 },
  legendTitle: { fontSize: 17, fontWeight: '800', marginBottom: 2 },
  legendSub: { fontSize: 13 },
  poweredRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  poweredText: { fontSize: 10 },
  legendRow: { flexDirection: 'row', gap: 20 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendLabel: { fontSize: 13, fontWeight: '500' },
});
