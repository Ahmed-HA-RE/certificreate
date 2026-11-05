'use client';

import { useSyncExternalStore } from 'react';
import { Certificate } from '@/components/home/certificate';
import type { ExportRequest } from '@/types/certificate';

declare global {
  interface Window {
    /** Injected by the export pipeline (`lib/export.ts`) before the page loads. */
    __CERTIFICATE__?: ExportRequest;
  }
}

// The injected data never changes after load, so there is nothing to subscribe to.
const subscribe = () => () => {};
const getSnapshot = () => window.__CERTIFICATE__ ?? null;
const getServerSnapshot = () => null;

export function CertificateRender() {
  const data = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  if (!data) return null;

  return (
    <div data-render-ready=''>
      <Certificate data={data} colors={data.colors} />
    </div>
  );
}
