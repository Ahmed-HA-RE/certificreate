import { useSyncExternalStore } from 'react';
import {
  BRAND_SETTINGS_STORAGE_KEY,
  DEFAULT_BRAND_SETTINGS,
  parseBrandSettings,
  serializeBrandSettings,
} from '@/lib/brand-settings';
import type { BrandSettings } from '@/types/brand-settings';

interface BrandSettingsState {
  settings: BrandSettings;
  /** The last write to local storage failed; the settings still apply this session. */
  saveFailed: boolean;
}

const SERVER_STATE: BrandSettingsState = {
  settings: DEFAULT_BRAND_SETTINGS,
  saveFailed: false,
};

// One module-level copy, so every caller sees the same settings and reference.
let state: BrandSettingsState | undefined;
const listeners = new Set<() => void>();

function getSnapshot() {
  if (!state) {
    let raw: string | null = null;
    try {
      raw = localStorage.getItem(BRAND_SETTINGS_STORAGE_KEY);
    } catch {
      // Blocked storage reads as nothing stored.
    }
    state = { settings: parseBrandSettings(raw), saveFailed: false };
  }
  return state;
}

const getServerSnapshot = () => SERVER_STATE;

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function updateBrandSettings(settings: BrandSettings) {
  let saveFailed = false;
  try {
    localStorage.setItem(
      BRAND_SETTINGS_STORAGE_KEY,
      serializeBrandSettings(settings)
    );
  } catch {
    saveFailed = true;
  }
  state = { settings, saveFailed };
  listeners.forEach((listener) => listener());
}

/** Brand settings from local storage; the defaults until the client reads them. */
export function useBrandSettings() {
  const { settings, saveFailed } = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );
  return { settings, saveFailed, updateBrandSettings };
}
