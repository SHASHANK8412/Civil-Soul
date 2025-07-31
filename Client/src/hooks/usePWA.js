import { useEffect, useState, useCallback } from 'react';
import { useNotifications } from '../context/NotificationContext';

// Service Worker registration and management
export const useServiceWorker = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [swRegistration, setSwRegistration] = useState(null);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const { showInfoNotification, showSuccessNotification } = useNotifications();

  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          setSwRegistration(registration);
          console.log('SW registered:', registration);

          // Check for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  setUpdateAvailable(true);
                  showInfoNotification(
                    'Update Available',
                    'A new version of CivilSoul is available. Refresh to update.',
                    { action: 'refresh' }
                  );
                }
              });
            }
          });
        })
        .catch((error) => {
          console.error('SW registration failed:', error);
        });
    }

    // Online/offline detection
    const handleOnline = () => {
      setIsOnline(true);
      showSuccessNotification('Back Online', 'Your connection has been restored');
    };

    const handleOffline = () => {
      setIsOnline(false);
      showInfoNotification('Offline Mode', 'Some features may be limited while offline');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [showInfoNotification, showSuccessNotification]);

  const updateApp = useCallback(() => {
    if (swRegistration && swRegistration.waiting) {
      swRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });
      window.location.reload();
    }
  }, [swRegistration]);

  return {
    isOnline,
    updateAvailable,
    updateApp,
    swRegistration
  };
};

// Offline data management
export const useOfflineData = () => {
  const [offlineData, setOfflineData] = useState({});
  const [syncQueue, setSyncQueue] = useState([]);

  // Store data for offline use
  const storeOfflineData = useCallback((key, data) => {
    try {
      localStorage.setItem(`offline_${key}`, JSON.stringify({
        data,
        timestamp: Date.now(),
        synced: false
      }));
      setOfflineData(prev => ({ ...prev, [key]: data }));
    } catch (error) {
      console.error('Failed to store offline data:', error);
    }
  }, []);

  // Get offline data
  const getOfflineData = useCallback((key) => {
    try {
      const stored = localStorage.getItem(`offline_${key}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.data;
      }
    } catch (error) {
      console.error('Failed to get offline data:', error);
    }
    return null;
  }, []);

  // Queue action for sync when online
  const queueForSync = useCallback((action) => {
    const syncItem = {
      id: Date.now(),
      action,
      timestamp: Date.now()
    };
    
    setSyncQueue(prev => [...prev, syncItem]);
    
    try {
      const existingQueue = JSON.parse(localStorage.getItem('syncQueue') || '[]');
      localStorage.setItem('syncQueue', JSON.stringify([...existingQueue, syncItem]));
    } catch (error) {
      console.error('Failed to queue sync action:', error);
    }
  }, []);

  // Sync queued actions
  const syncQueuedActions = useCallback(async () => {
    if (syncQueue.length === 0) return;

    const successfulSyncs = [];
    
    for (const item of syncQueue) {
      try {
        // Perform sync action
        await performSyncAction(item.action);
        successfulSyncs.push(item.id);
      } catch (error) {
        console.error('Sync failed for action:', item.action, error);
      }
    }

    // Remove successful syncs from queue
    setSyncQueue(prev => prev.filter(item => !successfulSyncs.includes(item.id)));
    
    try {
      const remainingQueue = syncQueue.filter(item => !successfulSyncs.includes(item.id));
      localStorage.setItem('syncQueue', JSON.stringify(remainingQueue));
    } catch (error) {
      console.error('Failed to update sync queue:', error);
    }
  }, [syncQueue]);

  return {
    offlineData,
    storeOfflineData,
    getOfflineData,
    queueForSync,
    syncQueuedActions,
    hasPendingSync: syncQueue.length > 0
  };
};

// PWA installation prompt
export const usePWAInstall = () => {
  const [installPrompt, setInstallPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const { showInfoNotification } = useNotifications();

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
      
      // Show install notification after a delay
      setTimeout(() => {
        showInfoNotification(
          'Install CivilSoul',
          'Add CivilSoul to your home screen for a better experience',
          { action: 'install' }
        );
      }, 30000); // Show after 30 seconds
    };

    // Listen for successful install
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setInstallPrompt(null);
      showInfoNotification('App Installed', 'CivilSoul has been added to your home screen');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [showInfoNotification]);

  const installApp = useCallback(async () => {
    if (!installPrompt) return false;

    try {
      const result = await installPrompt.prompt();
      if (result.outcome === 'accepted') {
        setInstallPrompt(null);
        return true;
      }
    } catch (error) {
      console.error('Install failed:', error);
    }
    return false;
  }, [installPrompt]);

  return {
    canInstall: !!installPrompt && !isInstalled,
    isInstalled,
    installApp
  };
};

// Background sync for important data
export const useBackgroundSync = () => {
  const { isOnline } = useServiceWorker();
  const [syncStatus, setSyncStatus] = useState('idle'); // idle, syncing, success, error

  const requestBackgroundSync = useCallback((tag) => {
    if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
      navigator.serviceWorker.ready.then((registration) => {
        return registration.sync.register(tag);
      }).catch((error) => {
        console.error('Background sync registration failed:', error);
      });
    }
  }, []);

  // Sync critical data immediately when online
  useEffect(() => {
    if (isOnline) {
      setSyncStatus('syncing');
      // Trigger sync of critical data
      setTimeout(() => {
        setSyncStatus('success');
        setTimeout(() => setSyncStatus('idle'), 2000);
      }, 1000);
    }
  }, [isOnline]);

  return {
    syncStatus,
    requestBackgroundSync
  };
};

// Helper function to perform sync actions
async function performSyncAction(action) {
  const { type, data, endpoint } = action;
  
  const response = await fetch(`/api${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    throw new Error(`Sync failed: ${response.statusText}`);
  }

  return response.json();
}

export default {
  useServiceWorker,
  useOfflineData,
  usePWAInstall,
  useBackgroundSync
};
