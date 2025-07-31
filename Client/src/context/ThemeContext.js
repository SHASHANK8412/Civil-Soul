import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';

// Theme presets
const THEME_PRESETS = {
  light: {
    name: 'Light',
    primary: '#2563eb',
    secondary: '#64748b',
    accent: '#10b981',
    background: '#ffffff',
    surface: '#f8fafc',
    text: '#0f172a',
    textSecondary: '#64748b',
    border: '#e2e8f0',
    shadow: 'rgba(0, 0, 0, 0.1)',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  dark: {
    name: 'Dark',
    primary: '#3b82f6',
    secondary: '#94a3b8',
    accent: '#34d399',
    background: '#0f172a',
    surface: '#1e293b',
    text: '#f1f5f9',
    textSecondary: '#94a3b8',
    border: '#334155',
    shadow: 'rgba(0, 0, 0, 0.3)',
    gradient: 'linear-gradient(135deg, #4c1d95 0%, #1e40af 100%)'
  },
  nature: {
    name: 'Nature',
    primary: '#059669',
    secondary: '#6b7280',
    accent: '#f59e0b',
    background: '#f7fdf7',
    surface: '#ecfdf5',
    text: '#064e3b',
    textSecondary: '#374151',
    border: '#d1fae5',
    shadow: 'rgba(5, 150, 105, 0.1)',
    gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
  },
  ocean: {
    name: 'Ocean',
    primary: '#0ea5e9',
    secondary: '#64748b',
    accent: '#06b6d4',
    background: '#f0f9ff',
    surface: '#e0f2fe',
    text: '#0c4a6e',
    textSecondary: '#475569',
    border: '#bae6fd',
    shadow: 'rgba(14, 165, 233, 0.1)',
    gradient: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)'
  },
  sunset: {
    name: 'Sunset',
    primary: '#ea580c',
    secondary: '#78716c',
    accent: '#dc2626',
    background: '#fffbeb',
    surface: '#fef3c7',
    text: '#7c2d12',
    textSecondary: '#57534e',
    border: '#fed7aa',
    shadow: 'rgba(234, 88, 12, 0.1)',
    gradient: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)'
  },
  lavender: {
    name: 'Lavender',
    primary: '#8b5cf6',
    secondary: '#6b7280',
    accent: '#ec4899',
    background: '#faf5ff',
    surface: '#f3e8ff',
    text: '#581c87',
    textSecondary: '#4b5563',
    border: '#ddd6fe',
    shadow: 'rgba(139, 92, 246, 0.1)',
    gradient: 'linear-gradient(135deg, #a855f7 0%, #8b5cf6 100%)'
  }
};

// Font options
const FONT_OPTIONS = {
  system: {
    name: 'System',
    family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  inter: {
    name: 'Inter',
    family: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif'
  },
  poppins: {
    name: 'Poppins',
    family: '"Poppins", -apple-system, BlinkMacSystemFont, sans-serif'
  },
  roboto: {
    name: 'Roboto',
    family: '"Roboto", -apple-system, BlinkMacSystemFont, sans-serif'
  }
};

// Animation preferences
const ANIMATION_PRESETS = {
  none: { name: 'None', duration: '0s', easing: 'linear' },
  subtle: { name: 'Subtle', duration: '0.15s', easing: 'ease-out' },
  normal: { name: 'Normal', duration: '0.3s', easing: 'ease-in-out' },
  playful: { name: 'Playful', duration: '0.5s', easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)' }
};

// Theme Context
const ThemeContext = createContext();

// Theme actions
const THEME_ACTIONS = {
  SET_THEME: 'SET_THEME',
  SET_CUSTOM_COLORS: 'SET_CUSTOM_COLORS',
  SET_FONT: 'SET_FONT',
  SET_FONT_SIZE: 'SET_FONT_SIZE',
  SET_ANIMATION: 'SET_ANIMATION',
  SET_REDUCED_MOTION: 'SET_REDUCED_MOTION',
  SET_HIGH_CONTRAST: 'SET_HIGH_CONTRAST',
  TOGGLE_DARK_MODE: 'TOGGLE_DARK_MODE',
  RESET_THEME: 'RESET_THEME'
};

// Initial state
const initialState = {
  currentTheme: 'light',
  customColors: {},
  font: 'system',
  fontSize: 'normal', // small, normal, large, extra-large
  animation: 'normal',
  reducedMotion: false,
  highContrast: false,
  autoTheme: true, // Auto switch based on system preference
  customThemes: {}
};

// Theme reducer
const themeReducer = (state, action) => {
  switch (action.type) {
    case THEME_ACTIONS.SET_THEME:
      return { ...state, currentTheme: action.payload };
    
    case THEME_ACTIONS.SET_CUSTOM_COLORS:
      return { ...state, customColors: { ...state.customColors, ...action.payload } };
    
    case THEME_ACTIONS.SET_FONT:
      return { ...state, font: action.payload };
    
    case THEME_ACTIONS.SET_FONT_SIZE:
      return { ...state, fontSize: action.payload };
    
    case THEME_ACTIONS.SET_ANIMATION:
      return { ...state, animation: action.payload };
    
    case THEME_ACTIONS.SET_REDUCED_MOTION:
      return { ...state, reducedMotion: action.payload };
    
    case THEME_ACTIONS.SET_HIGH_CONTRAST:
      return { ...state, highContrast: action.payload };
    
    case THEME_ACTIONS.TOGGLE_DARK_MODE:
      return { 
        ...state, 
        currentTheme: state.currentTheme === 'dark' ? 'light' : 'dark',
        autoTheme: false
      };
    
    case THEME_ACTIONS.RESET_THEME:
      return { ...initialState };
    
    default:
      return state;
  }
};

// Theme Provider
export const ThemeProvider = ({ children }) => {
  const [state, dispatch] = useReducer(themeReducer, initialState);

  // Load saved theme preferences
  useEffect(() => {
    const savedTheme = localStorage.getItem('themePreferences');
    if (savedTheme) {
      try {
        const preferences = JSON.parse(savedTheme);
        Object.entries(preferences).forEach(([key, value]) => {
          switch (key) {
            case 'currentTheme':
              dispatch({ type: THEME_ACTIONS.SET_THEME, payload: value });
              break;
            case 'font':
              dispatch({ type: THEME_ACTIONS.SET_FONT, payload: value });
              break;
            case 'fontSize':
              dispatch({ type: THEME_ACTIONS.SET_FONT_SIZE, payload: value });
              break;
            case 'animation':
              dispatch({ type: THEME_ACTIONS.SET_ANIMATION, payload: value });
              break;
            case 'reducedMotion':
              dispatch({ type: THEME_ACTIONS.SET_REDUCED_MOTION, payload: value });
              break;
            case 'highContrast':
              dispatch({ type: THEME_ACTIONS.SET_HIGH_CONTRAST, payload: value });
              break;
          }
        });
      } catch (error) {
        console.error('Failed to load theme preferences:', error);
      }
    }
  }, []);

  // Save theme preferences
  useEffect(() => {
    localStorage.setItem('themePreferences', JSON.stringify(state));
  }, [state]);

  // Auto theme switching based on system preference
  useEffect(() => {
    if (state.autoTheme) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      const handleChange = (e) => {
        dispatch({ 
          type: THEME_ACTIONS.SET_THEME, 
          payload: e.matches ? 'dark' : 'light' 
        });
      };

      // Set initial theme
      handleChange(mediaQuery);

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [state.autoTheme]);

  // Apply theme to document
  useEffect(() => {
    const theme = THEME_PRESETS[state.currentTheme] || THEME_PRESETS.light;
    const font = FONT_OPTIONS[state.font] || FONT_OPTIONS.system;
    const animation = ANIMATION_PRESETS[state.animation] || ANIMATION_PRESETS.normal;

    // Apply CSS variables
    const root = document.documentElement;
    
    // Colors
    root.style.setProperty('--color-primary', theme.primary);
    root.style.setProperty('--color-secondary', theme.secondary);
    root.style.setProperty('--color-accent', theme.accent);
    root.style.setProperty('--color-background', theme.background);
    root.style.setProperty('--color-surface', theme.surface);
    root.style.setProperty('--color-text', theme.text);
    root.style.setProperty('--color-text-secondary', theme.textSecondary);
    root.style.setProperty('--color-border', theme.border);
    root.style.setProperty('--shadow', theme.shadow);
    root.style.setProperty('--gradient', theme.gradient);

    // Typography
    root.style.setProperty('--font-family', font.family);
    
    // Font sizes
    const fontSizes = {
      small: '0.875rem',
      normal: '1rem',
      large: '1.125rem',
      'extra-large': '1.25rem'
    };
    root.style.setProperty('--font-size-base', fontSizes[state.fontSize] || fontSizes.normal);

    // Animations
    root.style.setProperty('--animation-duration', animation.duration);
    root.style.setProperty('--animation-easing', animation.easing);

    // Accessibility
    if (state.reducedMotion) {
      root.style.setProperty('--animation-duration', '0s');
    }

    if (state.highContrast) {
      root.style.setProperty('--color-text', state.currentTheme === 'dark' ? '#ffffff' : '#000000');
      root.style.setProperty('--color-border', state.currentTheme === 'dark' ? '#ffffff' : '#000000');
    }

    // Apply custom colors
    Object.entries(state.customColors).forEach(([property, color]) => {
      root.style.setProperty(`--color-${property}`, color);
    });

    // Update meta theme color
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', theme.primary);
    }

    // Update class for theme-based styling
    document.body.className = document.body.className
      .replace(/theme-\w+/g, '')
      .replace(/font-\w+/g, '')
      .replace(/anim-\w+/g, '');
    
    document.body.classList.add(
      `theme-${state.currentTheme}`,
      `font-${state.font}`,
      `anim-${state.animation}`
    );

    if (state.reducedMotion) {
      document.body.classList.add('reduced-motion');
    }

    if (state.highContrast) {
      document.body.classList.add('high-contrast');
    }

  }, [state]);

  // Theme methods
  const setTheme = useCallback((themeName) => {
    dispatch({ type: THEME_ACTIONS.SET_THEME, payload: themeName });
  }, []);

  const setCustomColors = useCallback((colors) => {
    dispatch({ type: THEME_ACTIONS.SET_CUSTOM_COLORS, payload: colors });
  }, []);

  const setFont = useCallback((fontName) => {
    dispatch({ type: THEME_ACTIONS.SET_FONT, payload: fontName });
  }, []);

  const setFontSize = useCallback((size) => {
    dispatch({ type: THEME_ACTIONS.SET_FONT_SIZE, payload: size });
  }, []);

  const setAnimation = useCallback((animationLevel) => {
    dispatch({ type: THEME_ACTIONS.SET_ANIMATION, payload: animationLevel });
  }, []);

  const toggleReducedMotion = useCallback(() => {
    dispatch({ type: THEME_ACTIONS.SET_REDUCED_MOTION, payload: !state.reducedMotion });
  }, [state.reducedMotion]);

  const toggleHighContrast = useCallback(() => {
    dispatch({ type: THEME_ACTIONS.SET_HIGH_CONTRAST, payload: !state.highContrast });
  }, [state.highContrast]);

  const toggleDarkMode = useCallback(() => {
    dispatch({ type: THEME_ACTIONS.TOGGLE_DARK_MODE });
  }, []);

  const resetTheme = useCallback(() => {
    dispatch({ type: THEME_ACTIONS.RESET_THEME });
  }, []);

  const getCurrentTheme = useCallback(() => {
    return THEME_PRESETS[state.currentTheme] || THEME_PRESETS.light;
  }, [state.currentTheme]);

  const value = {
    ...state,
    setTheme,
    setCustomColors,
    setFont,
    setFontSize,
    setAnimation,
    toggleReducedMotion,
    toggleHighContrast,
    toggleDarkMode,
    resetTheme,
    getCurrentTheme,
    themePresets: THEME_PRESETS,
    fontOptions: FONT_OPTIONS,
    animationPresets: ANIMATION_PRESETS
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook to use theme
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Higher-order component for theme-aware components
export const withTheme = (WrappedComponent) => {
  return React.forwardRef((props, ref) => {
    const theme = useTheme();
    return <WrappedComponent {...props} theme={theme} ref={ref} />;
  });
};

// Hook for responsive theme values
export const useResponsiveTheme = () => {
  const theme = useTheme();
  const [screenSize, setScreenSize] = React.useState('desktop');

  React.useEffect(() => {
    const updateScreenSize = () => {
      if (window.innerWidth < 640) {
        setScreenSize('mobile');
      } else if (window.innerWidth < 1024) {
        setScreenSize('tablet');
      } else {
        setScreenSize('desktop');
      }
    };

    updateScreenSize();
    window.addEventListener('resize', updateScreenSize);
    return () => window.removeEventListener('resize', updateScreenSize);
  }, []);

  return { ...theme, screenSize };
};

export default ThemeProvider;
