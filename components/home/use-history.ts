import { createLocalStorageStore } from '@/components/home/local-storage-store';
import {
  addHistoryEntry,
  HISTORY_STORAGE_KEY,
  parseHistory,
  serializeHistory,
} from '@/lib/history';
import type { CertificateData } from '@/types/certificate';
import type { HistoryEntry } from '@/types/history';

const NO_ENTRIES: HistoryEntry[] = [];

const store = createLocalStorageStore<HistoryEntry[]>({
  key: HISTORY_STORAGE_KEY,
  parse: parseHistory,
  serialize: serializeHistory,
  fallback: NO_ENTRIES,
});

/** Saves a downloaded certificate first in the list, replacing any copy of it. */
function addToHistory(data: CertificateData) {
  store.update((entries) =>
    addHistoryEntry(entries, data, {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    }),
  );
}

function clearHistory() {
  store.update(NO_ENTRIES);
}

/** Downloaded certificates from local storage, newest first; empty until the client reads them. */
export function useHistory() {
  const { value, saveFailed } = store.useStore();
  return { entries: value, saveFailed, addToHistory, clearHistory };
}
