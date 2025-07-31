import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';
import { 
  Bell, 
  Heart, 
  MessageCircle, 
  Award, 
  AlertTriangle, 
  CheckCircle, 
  Info,
  Gift,
  Calendar,
  Users
} from 'lucide-react';

// Notification types with icons and colors
const NOTIFICATION_TYPES = {
  SUCCESS: { icon: CheckCircle, color: 'green', bgColor: 'bg-green-50', textColor: 'text-green-800' },
  ERROR: { icon: AlertTriangle, color: 'red', bgColor: 'bg-red-50', textColor: 'text-red-800' },
  WARNING: { icon: AlertTriangle, color: 'yellow', bgColor: 'bg-yellow-50', textColor: 'text-yellow-800' },
  INFO: { icon: Info, color: 'blue', bgColor: 'bg-blue-50', textColor: 'text-blue-800' },
  CERTIFICATE: { icon: Award, color: 'purple', bgColor: 'bg-purple-50', textColor: 'text-purple-800' },
  VOLUNTEER: { icon: Heart, color: 'pink', bgColor: 'bg-pink-50', textColor: 'text-pink-800' },
  MESSAGE: { icon: MessageCircle, color: 'indigo', bgColor: 'bg-indigo-50', textColor: 'text-indigo-800' },
  EVENT: { icon: Calendar, color: 'teal', bgColor: 'bg-teal-50', textColor: 'text-teal-800' },
  ACHIEVEMENT: { icon: Gift, color: 'orange', bgColor: 'bg-orange-50', textColor: 'text-orange-800' },
  SOCIAL: { icon: Users, color: 'gray', bgColor: 'bg-gray-50', textColor: 'text-gray-800' }
};

// Notification Context
const NotificationContext = createContext();

// Actions
const NOTIFICATION_ACTIONS = {
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  MARK_AS_READ: 'MARK_AS_READ',
  MARK_ALL_AS_READ: 'MARK_ALL_AS_READ',
  REMOVE_NOTIFICATION: 'REMOVE_NOTIFICATION',
  CLEAR_ALL: 'CLEAR_ALL',
  SET_NOTIFICATIONS: 'SET_NOTIFICATIONS',
  UPDATE_SETTINGS: 'UPDATE_SETTINGS',
  SET_SOCKET_CONNECTED: 'SET_SOCKET_CONNECTED'
};

// Initial state
const initialState = {
  notifications: [],
  unreadCount: 0,
  settings: {
    showDesktopNotifications: true,
    showToastNotifications: true,
    soundEnabled: true,
    emailNotifications: true,
    pushNotifications: true,
    categories: {
      certificates: true,
      volunteers: true,
      messages: true,
      events: true,
      achievements: true,
      system: true
    }
  },
  socketConnected: false
};

// Reducer
const notificationReducer = (state, action) => {
  switch (action.type) {
    case NOTIFICATION_ACTIONS.ADD_NOTIFICATION:
      const newNotification = {
        ...action.payload,
        id: action.payload.id || generateNotificationId(),
        timestamp: action.payload.timestamp || Date.now(),
        read: false
      };
      return {
        ...state,
        notifications: [newNotification, ...state.notifications],
        unreadCount: state.unreadCount + 1
      };

    case NOTIFICATION_ACTIONS.MARK_AS_READ:
      return {
        ...state,
        notifications: state.notifications.map(notif =>
          notif.id === action.payload ? { ...notif, read: true } : notif
        ),
        unreadCount: Math.max(0, state.unreadCount - 1)
      };

    case NOTIFICATION_ACTIONS.MARK_ALL_AS_READ:
      return {
        ...state,
        notifications: state.notifications.map(notif => ({ ...notif, read: true })),
        unreadCount: 0
      };

    case NOTIFICATION_ACTIONS.REMOVE_NOTIFICATION:
      const removedNotification = state.notifications.find(n => n.id === action.payload);
      return {
        ...state,
        notifications: state.notifications.filter(notif => notif.id !== action.payload),
        unreadCount: removedNotification && !removedNotification.read 
          ? Math.max(0, state.unreadCount - 1) 
          : state.unreadCount
      };

    case NOTIFICATION_ACTIONS.CLEAR_ALL:
      return {
        ...state,
        notifications: [],
        unreadCount: 0
      };

    case NOTIFICATION_ACTIONS.SET_NOTIFICATIONS:
      const unreadNotifications = action.payload.filter(notif => !notif.read);
      return {
        ...state,
        notifications: action.payload,
        unreadCount: unreadNotifications.length
      };

    case NOTIFICATION_ACTIONS.UPDATE_SETTINGS:
      return {
        ...state,
        settings: { ...state.settings, ...action.payload }
      };

    case NOTIFICATION_ACTIONS.SET_SOCKET_CONNECTED:
      return {
        ...state,
        socketConnected: action.payload
      };

    default:
      return state;
  }
};

// Provider Component
export const NotificationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(notificationReducer, initialState);
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const [socket, setSocket] = React.useState(null);

  // Initialize socket connection
  useEffect(() => {
    if (isAuthenticated && user) {
      const newSocket = io(process.env.REACT_APP_SERVER_URL || 'http://localhost:5000', {
        auth: {
          token: localStorage.getItem('token')
        }
      });

      newSocket.on('connect', () => {
        dispatch({ type: NOTIFICATION_ACTIONS.SET_SOCKET_CONNECTED, payload: true });
        console.log('Socket connected for notifications');
      });

      newSocket.on('disconnect', () => {
        dispatch({ type: NOTIFICATION_ACTIONS.SET_SOCKET_CONNECTED, payload: false });
      });

      newSocket.on('notification', (notification) => {
        addNotification(notification);
      });

      newSocket.on('bulk_notifications', (notifications) => {
        dispatch({ type: NOTIFICATION_ACTIONS.SET_NOTIFICATIONS, payload: notifications });
      });

      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
      };
    }
  }, [isAuthenticated, user]);

  // Request desktop notification permission
  useEffect(() => {
    if (state.settings.showDesktopNotifications && 'Notification' in window) {
      if (Notification.permission === 'default') {
        Notification.requestPermission();
      }
    }
  }, [state.settings.showDesktopNotifications]);

  // Add notification function
  const addNotification = useCallback((notification) => {
    const { type = 'INFO', title, message, data = {}, priority = 'normal' } = notification;
    
    // Check if this type of notification is enabled
    if (!state.settings.categories[type.toLowerCase()]) {
      return;
    }

    dispatch({
      type: NOTIFICATION_ACTIONS.ADD_NOTIFICATION,
      payload: {
        ...notification,
        type,
        title,
        message,
        data,
        priority,
        id: generateNotificationId()
      }
    });

    // Show toast notification
    if (state.settings.showToastNotifications) {
      const typeConfig = NOTIFICATION_TYPES[type] || NOTIFICATION_TYPES.INFO;
      const IconComponent = typeConfig.icon;

      toast.custom((t) => (
        <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}>
          <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <IconComponent className={`h-6 w-6 text-${typeConfig.color}-400`} />
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {title}
                </p>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {message}
                </p>
              </div>
            </div>
          </div>
          <div className="flex border-l border-gray-200 dark:border-gray-600">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-gray-600 hover:text-gray-500 focus:outline-none"
            >
              ×
            </button>
          </div>
        </div>
      ), {
        duration: priority === 'high' ? 8000 : 4000,
        position: 'top-right'
      });
    }

    // Show desktop notification
    if (state.settings.showDesktopNotifications && 'Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body: message,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: type.toLowerCase()
      });
    }

    // Play sound
    if (state.settings.soundEnabled && priority !== 'low') {
      playNotificationSound(type);
    }
  }, [state.settings]);

  // Mark notification as read
  const markAsRead = useCallback((notificationId) => {
    dispatch({ type: NOTIFICATION_ACTIONS.MARK_AS_READ, payload: notificationId });
    
    // Send to server
    if (socket) {
      socket.emit('mark_notification_read', notificationId);
    }
  }, [socket]);

  // Mark all as read
  const markAllAsRead = useCallback(() => {
    dispatch({ type: NOTIFICATION_ACTIONS.MARK_ALL_AS_READ });
    
    if (socket) {
      socket.emit('mark_all_notifications_read');
    }
  }, [socket]);

  // Remove notification
  const removeNotification = useCallback((notificationId) => {
    dispatch({ type: NOTIFICATION_ACTIONS.REMOVE_NOTIFICATION, payload: notificationId });
    
    if (socket) {
      socket.emit('remove_notification', notificationId);
    }
  }, [socket]);

  // Clear all notifications
  const clearAllNotifications = useCallback(() => {
    dispatch({ type: NOTIFICATION_ACTIONS.CLEAR_ALL });
    
    if (socket) {
      socket.emit('clear_all_notifications');
    }
  }, [socket]);

  // Update settings
  const updateSettings = useCallback((newSettings) => {
    dispatch({ type: NOTIFICATION_ACTIONS.UPDATE_SETTINGS, payload: newSettings });
    
    // Save to localStorage
    localStorage.setItem('notificationSettings', JSON.stringify({
      ...state.settings,
      ...newSettings
    }));

    // Send to server
    if (socket) {
      socket.emit('update_notification_settings', newSettings);
    }
  }, [socket, state.settings]);

  // Predefined notification creators
  const showSuccessNotification = useCallback((title, message, data = {}) => {
    addNotification({ type: 'SUCCESS', title, message, data, priority: 'normal' });
  }, [addNotification]);

  const showErrorNotification = useCallback((title, message, data = {}) => {
    addNotification({ type: 'ERROR', title, message, data, priority: 'high' });
  }, [addNotification]);

  const showInfoNotification = useCallback((title, message, data = {}) => {
    addNotification({ type: 'INFO', title, message, data, priority: 'normal' });
  }, [addNotification]);

  const showWarningNotification = useCallback((title, message, data = {}) => {
    addNotification({ type: 'WARNING', title, message, data, priority: 'normal' });
  }, [addNotification]);

  const showCertificateNotification = useCallback((title, message, data = {}) => {
    addNotification({ type: 'CERTIFICATE', title, message, data, priority: 'high' });
  }, [addNotification]);

  const showVolunteerNotification = useCallback((title, message, data = {}) => {
    addNotification({ type: 'VOLUNTEER', title, message, data, priority: 'normal' });
  }, [addNotification]);

  const value = {
    ...state,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAllNotifications,
    updateSettings,
    showSuccessNotification,
    showErrorNotification,
    showInfoNotification,
    showWarningNotification,
    showCertificateNotification,
    showVolunteerNotification,
    NOTIFICATION_TYPES
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

// Hook to use notifications
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

// Utility functions
function generateNotificationId() {
  return `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function playNotificationSound(type) {
  try {
    const audio = new Audio();
    switch (type) {
      case 'SUCCESS':
        audio.src = '/sounds/success.mp3';
        break;
      case 'ERROR':
        audio.src = '/sounds/error.mp3';
        break;
      case 'CERTIFICATE':
        audio.src = '/sounds/achievement.mp3';
        break;
      default:
        audio.src = '/sounds/notification.mp3';
    }
    audio.volume = 0.3;
    audio.play().catch(() => {
      // Ignore autoplay restrictions
    });
  } catch (error) {
    console.warn('Could not play notification sound:', error);
  }
}

export default NotificationProvider;
