'use client';

import { useEffect } from 'react';
import { initScrollTracking, initSessionDuration } from '@/lib/analytics-client';

export default function AnalyticsProvider() {
  useEffect(() => {
    const cleanup = initScrollTracking();
    initSessionDuration();
    return cleanup;
  }, []);

  return null;
}
