/**
 * TomTom API helper — HerSafety
 * API Key: t26S6pRzhclrTAbF3S6kpHkYOdK4CM5i
 *
 * Docs: https://developer.tomtom.com/
 */

const API_KEY = 't26S6pRzhclrTAbF3S6kpHkYOdK4CM5i';

const BASE = {
  search:  'https://api.tomtom.com/search/2',
  routing: 'https://api.tomtom.com/routing/1',
  traffic: 'https://api.tomtom.com/traffic/services/4',
};

// ─── Types ────────────────────────────────────────────────────────────────────

export type LatLng = { lat: number; lon: number };

export type TomTomAddress = {
  freeformAddress: string;
  municipality?: string;
  countrySubdivision?: string;
  country?: string;
  streetName?: string;
  municipalitySubdivision?: string;
};

export type SearchResult = {
  id: string;
  type: string;
  poi?: { name: string; categories?: string[] };
  address: TomTomAddress;
  position: LatLng;
  dist?: number; // metres from query origin
};

export type RoutePoint = { lat: number; lon: number };

export type Route = {
  summary: {
    lengthInMeters: number;
    travelTimeInSeconds: number;
    trafficDelayInSeconds: number;
  };
  legs: Array<{
    points: RoutePoint[];
  }>;
};

// ─── Reverse Geocode ─────────────────────────────────────────────────────────

/**
 * Convert lat/lon → human-readable address using TomTom Reverse Geocode API.
 */
export async function reverseGeocode(lat: number, lon: number): Promise<string> {
  try {
    const url = `${BASE.search}/reverseGeocode/${lat},${lon}.json?key=${API_KEY}&returnSpeedLimit=false&returnRoadUse=false`;
    const res = await fetch(url);
    const data = await res.json();
    const addr: TomTomAddress = data.addresses?.[0]?.address;
    if (!addr) return `${lat.toFixed(4)}, ${lon.toFixed(4)}`;

    const parts = [
      addr.municipalitySubdivision,
      addr.municipality,
      addr.countrySubdivision,
    ].filter(Boolean);
    return parts.join(', ') || addr.freeformAddress || `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
  } catch (e) {
    return `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
  }
}

// ─── Fuzzy / POI Search ───────────────────────────────────────────────────────

/**
 * Search for places, addresses, or POIs near a given coordinate.
 */
export async function searchPlaces(
  query: string,
  near?: LatLng,
  limit = 5
): Promise<SearchResult[]> {
  try {
    const encoded = encodeURIComponent(query);
    let url = `${BASE.search}/search/${encoded}.json?key=${API_KEY}&limit=${limit}&language=en-US`;
    if (near) url += `&lat=${near.lat}&lon=${near.lon}&radius=50000`;
    const res = await fetch(url);
    const data = await res.json();
    return data.results ?? [];
  } catch {
    return [];
  }
}

// ─── Route Calculation ────────────────────────────────────────────────────────

/**
 * Calculate a walking / driving route between two points.
 * Returns an array of lat/lon points for rendering on the map.
 */
export async function calculateRoute(
  origin: LatLng,
  destination: LatLng,
  travelMode: 'pedestrian' | 'car' = 'pedestrian'
): Promise<{ points: RoutePoint[]; summary: Route['summary'] | null }> {
  try {
    const url =
      `${BASE.routing}/calculateRoute/${origin.lat},${origin.lon}:${destination.lat},${destination.lon}/json` +
      `?key=${API_KEY}&travelMode=${travelMode}&routeType=shortest&traffic=true`;
    const res = await fetch(url);
    const data = await res.json();
    const route: Route = data.routes?.[0];
    if (!route) return { points: [], summary: null };

    const points = route.legs.flatMap(leg => leg.points);
    return { points, summary: route.summary };
  } catch {
    return { points: [], summary: null };
  }
}

// ─── Traffic Incidents (near a bounding box) ──────────────────────────────────

/**
 * Fetch traffic incidents near a coordinate.
 * Returns array of incidents with geometry for map display.
 */
export async function getTrafficIncidents(
  center: LatLng,
  radiusKm = 2
): Promise<any[]> {
  try {
    const deg = radiusKm / 111; // rough lat/lon degree offset
    const bbox = `${center.lon - deg},${center.lat - deg},${center.lon + deg},${center.lat + deg}`;
    const url =
      `${BASE.traffic}/incidentDetails/s3/${bbox}/10/-1/json` +
      `?key=${API_KEY}&language=en-US&expandCluster=true`;
    const res = await fetch(url);
    const data = await res.json();
    return data.incidents ?? [];
  } catch {
    return [];
  }
}

// ─── Safety Score (derived from route + traffic) ──────────────────────────────

/**
 * Derive a rough safety score (0-100) based on traffic delay ratio.
 * In production this would combine crime data, lighting layers, etc.
 */
export function deriveSafetyScore(travelTimeSecs: number, trafficDelaySecs: number): number {
  if (travelTimeSecs === 0) return 85;
  const delayRatio = trafficDelaySecs / travelTimeSecs;
  const score = Math.round(Math.max(50, Math.min(99, 95 - delayRatio * 40)));
  return score;
}

export { API_KEY };
