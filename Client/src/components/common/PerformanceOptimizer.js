import React, { Suspense, memo, useMemo, useCallback } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Loader2, AlertCircle } from 'lucide-react';

// Enhanced Performance Wrapper
export const PerformanceOptimizer = memo(({ children, fallback, errorFallback }) => {
  return (
    <ErrorBoundary
      FallbackComponent={errorFallback || ErrorFallback}
      onError={(error, errorInfo) => {
        console.error('Component Error:', error, errorInfo);
        // Send to monitoring service
      }}
    >
      <Suspense fallback={fallback || <DefaultFallback />}>
        {children}
      </Suspense>
    </ErrorBoundary>
  );
});

// Intelligent Loading States
export const DefaultFallback = () => (
  <div className="flex items-center justify-center min-h-[200px]">
    <div className="text-center">
      <Loader2 className="w-8 h-8 animate-spin text-primary-600 mx-auto mb-2" />
      <p className="text-sm text-gray-600 dark:text-gray-400">Loading amazing content...</p>
    </div>
  </div>
);

export const ErrorFallback = ({ error, resetErrorBoundary }) => (
  <div className="flex items-center justify-center min-h-[200px]">
    <div className="text-center p-6 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
      <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
        Oops! Something went wrong
      </h3>
      <p className="text-sm text-red-600 dark:text-red-300 mb-4">
        {error.message || 'An unexpected error occurred'}
      </p>
      <button
        onClick={resetErrorBoundary}
        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
      >
        Try Again
      </button>
    </div>
  </div>
);

// Virtualized List for Large Data
export const VirtualizedList = memo(({ items, renderItem, itemHeight = 100 }) => {
  const [visibleRange, setVisibleRange] = React.useState({ start: 0, end: 10 });
  
  const visibleItems = useMemo(() => 
    items.slice(visibleRange.start, visibleRange.end),
    [items, visibleRange]
  );

  return (
    <div className="virtualized-list">
      {visibleItems.map((item, index) => (
        <div key={item.id || index} style={{ height: itemHeight }}>
          {renderItem(item, visibleRange.start + index)}
        </div>
      ))}
    </div>
  );
});

// Image Optimization Hook
export const useOptimizedImage = (src, options = {}) => {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);
  const [optimizedSrc, setOptimizedSrc] = React.useState('');

  React.useEffect(() => {
    if (!src) return;

    const img = new Image();
    img.onload = () => {
      setOptimizedSrc(src);
      setLoading(false);
    };
    img.onerror = () => {
      setError(true);
      setLoading(false);
    };
    img.src = src;
  }, [src]);

  return { src: optimizedSrc, loading, error };
};

// Intersection Observer Hook for Lazy Loading
export const useIntersectionObserver = (callback, options = {}) => {
  const targetRef = React.useRef(null);

  React.useEffect(() => {
    const target = targetRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(callback, {
      threshold: 0.1,
      rootMargin: '50px',
      ...options
    });

    observer.observe(target);

    return () => {
      if (target) observer.unobserve(target);
    };
  }, [callback, options]);

  return targetRef;
};

export default PerformanceOptimizer;
