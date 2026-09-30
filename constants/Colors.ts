/**
 * HerSafety — design tokens
 * Brand: Rose-pink primary, dark navy secondary
 */

const brand = {
  primary:   '#E53935',   // vivid red-rose — SOS / primary CTA
  secondary: '#1A237E',   // deep navy blue — trust, authority
  accent:    '#00BFA5',   // teal — safe, navigation
  warning:   '#FFB300',   // amber — warnings
  success:   '#43A047',   // green — confirmed safe
};

const light = {
  // backgrounds
  bg:          '#F5F5F5',
  surface:     '#FFFFFF',
  surfaceCard: '#FFFFFF',
  border:      '#E0E0E0',

  // text
  text:        '#212121',
  textSecond:  '#757575',
  textDisabled:'#BDBDBD',

  // tab bar
  tabBar:       '#FFFFFF',
  tabBarBorder: '#E0E0E0',
  tabActive:    brand.primary,
  tabInactive:  '#9E9E9E',
};

const dark = {
  bg:          '#121212',
  surface:     '#1E1E1E',
  surfaceCard: '#2C2C2C',
  border:      '#383838',

  text:        '#FFFFFF',
  textSecond:  '#B0B0B0',
  textDisabled:'#606060',

  tabBar:       '#1E1E1E',
  tabBarBorder: '#383838',
  tabActive:    '#EF5350',
  tabInactive:  '#757575',
};

export default {
  brand,
  light,
  dark,
  // named shadows (Android elevation / iOS shadow)
  shadow: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 3,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 8,
      elevation: 6,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.18,
      shadowRadius: 16,
      elevation: 12,
    },
  },
  radius: {
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    full: 9999,
  },
};
