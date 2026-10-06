import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { trackVisitEvent } from '../lib/supabase';

export const usePageTracking = () => {
  const location = useLocation();
  const currentPathRef = useRef<string>(location.pathname);
  const startTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    // Don't track admin console as public visitor page view
    const isPublicPage = !location.pathname.startsWith('/classs');
    currentPathRef.current = location.pathname;
    startTimeRef.current = Date.now();

    const sendDuration = () => {
      if (!isPublicPage) return;
      const durationSeconds = Math.round((Date.now() - startTimeRef.current) / 1000);
      if (durationSeconds >= 1) {
        trackVisitEvent({
          event_type: 'page_vue',
          page_or_step: currentPathRef.current,
          duration_seconds: durationSeconds,
        });
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        sendDuration();
      } else {
        startTimeRef.current = Date.now();
      }
    };

    const handleBeforeUnload = () => {
      sendDuration();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      sendDuration();
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [location.pathname]);
};
