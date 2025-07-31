import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

// Analytics Context
const AnalyticsContext = createContext();

// Analytics actions
const ANALYTICS_ACTIONS = {
  TRACK_PAGE_VIEW: 'TRACK_PAGE_VIEW',
  TRACK_EVENT: 'TRACK_EVENT',
  TRACK_USER_ACTION: 'TRACK_USER_ACTION',
  TRACK_PERFORMANCE: 'TRACK_PERFORMANCE',
  SET_USER_PROPERTIES: 'SET_USER_PROPERTIES'
};

// Analytics reducer
const analyticsReducer = (state, action) => {
  switch (action.type) {
    case ANALYTICS_ACTIONS.TRACK_PAGE_VIEW:
      return {
        ...state,
        pageViews: [...state.pageViews, action.payload],
        currentPage: action.payload
      };
    case ANALYTICS_ACTIONS.TRACK_EVENT:
      return {
        ...state,
        events: [...state.events, action.payload]
      };
    case ANALYTICS_ACTIONS.TRACK_USER_ACTION:
      return {
        ...state,
        userActions: [...state.userActions, action.payload]
      };
    case ANALYTICS_ACTIONS.TRACK_PERFORMANCE:
      return {
        ...state,
        performance: { ...state.performance, ...action.payload }
      };
    case ANALYTICS_ACTIONS.SET_USER_PROPERTIES:
      return {
        ...state,
        userProperties: { ...state.userProperties, ...action.payload }
      };
    default:
      return state;
  }
};

// Initial analytics state
const initialState = {
  pageViews: [],
  events: [],
  userActions: [],
  performance: {},
  userProperties: {},
  currentPage: null,
  sessionId: null,
  startTime: Date.now()
};

// Analytics Provider
export const AnalyticsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(analyticsReducer, {
    ...initialState,
    sessionId: generateSessionId()
  });
  const location = useLocation();

  // Track page views automatically
  useEffect(() => {
    const pageView = {
      page: location.pathname,
      search: location.search,
      hash: location.hash,
      timestamp: Date.now(),
      sessionId: state.sessionId,
      referrer: document.referrer,
      userAgent: navigator.userAgent
    };

    dispatch({
      type: ANALYTICS_ACTIONS.TRACK_PAGE_VIEW,
      payload: pageView
    });

    // Send to analytics service
    sendAnalytics('pageview', pageView);
  }, [location, state.sessionId]);

  // Track performance metrics
  useEffect(() => {
    const trackPerformance = () => {
      if ('performance' in window) {
        const navigation = performance.getEntriesByType('navigation')[0];
        const performanceData = {
          loadTime: navigation.loadEventEnd - navigation.loadEventStart,
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
          networkTime: navigation.responseEnd - navigation.requestStart,
          renderTime: navigation.loadEventEnd - navigation.responseEnd,
          timestamp: Date.now()
        };

        dispatch({
          type: ANALYTICS_ACTIONS.TRACK_PERFORMANCE,
          payload: performanceData
        });

        sendAnalytics('performance', performanceData);
      }
    };

    if (document.readyState === 'complete') {
      trackPerformance();
    } else {
      window.addEventListener('load', trackPerformance);
      return () => window.removeEventListener('load', trackPerformance);
    }
  }, []);

  // Analytics methods
  const trackEvent = (eventName, properties = {}) => {
    const event = {
      name: eventName,
      properties,
      timestamp: Date.now(),
      sessionId: state.sessionId,
      page: location.pathname
    };

    dispatch({
      type: ANALYTICS_ACTIONS.TRACK_EVENT,
      payload: event
    });

    sendAnalytics('event', event);
  };

  const trackUserAction = (action, details = {}) => {
    const userAction = {
      action,
      details,
      timestamp: Date.now(),
      sessionId: state.sessionId,
      page: location.pathname
    };

    dispatch({
      type: ANALYTICS_ACTIONS.TRACK_USER_ACTION,
      payload: userAction
    });

    sendAnalytics('user_action', userAction);
  };

  const setUserProperties = (properties) => {
    dispatch({
      type: ANALYTICS_ACTIONS.SET_USER_PROPERTIES,
      payload: properties
    });

    sendAnalytics('user_properties', properties);
  };

  const trackConversion = (conversionType, value = 0) => {
    trackEvent('conversion', {
      type: conversionType,
      value,
      page: location.pathname
    });
  };

  const trackEngagement = (element, action) => {
    trackUserAction('engagement', {
      element,
      action,
      page: location.pathname
    });
  };

  const value = {
    ...state,
    trackEvent,
    trackUserAction,
    setUserProperties,
    trackConversion,
    trackEngagement
  };

  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  );
};

// Hook to use analytics
export const useAnalytics = () => {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
};

// Utility functions
function generateSessionId() {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

async function sendAnalytics(type, data) {
  try {
    // In production, send to your analytics service
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Analytics] ${type}:`, data);
      return;
    }

    // Send to backend analytics endpoint
    await fetch('/api/analytics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type,
        data,
        timestamp: Date.now()
      })
    });
  } catch (error) {
    console.error('Analytics error:', error);
  }
}

// HOC for tracking component interactions
export const withAnalytics = (WrappedComponent, componentName) => {
  return React.forwardRef((props, ref) => {
    const { trackUserAction } = useAnalytics();

    useEffect(() => {
      trackUserAction('component_mount', { component: componentName });
    }, [trackUserAction]);

    return <WrappedComponent {...props} ref={ref} />;
  });
};

// Hook for tracking user interactions
export const useTrackInteraction = () => {
  const { trackUserAction, trackEngagement } = useAnalytics();

  const trackClick = useCallback((elementName, additionalData = {}) => {
    trackEngagement(elementName, 'click');
    trackUserAction('click', { element: elementName, ...additionalData });
  }, [trackUserAction, trackEngagement]);

  const trackHover = useCallback((elementName) => {
    trackEngagement(elementName, 'hover');
  }, [trackEngagement]);

  const trackScroll = useCallback((position) => {
    trackUserAction('scroll', { position });
  }, [trackUserAction]);

  const trackFormSubmit = useCallback((formName, formData = {}) => {
    trackUserAction('form_submit', { form: formName, ...formData });
  }, [trackUserAction]);

  return {
    trackClick,
    trackHover,
    trackScroll,
    trackFormSubmit
  };
};

export default AnalyticsProvider;
