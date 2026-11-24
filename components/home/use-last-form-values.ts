import { createLocalStorageStore } from '@/components/home/local-storage-store';
import { PLACEHOLDER_CERTIFICATE } from '@/lib/certificate';
import {
  LAST_FORM_VALUES_STORAGE_KEY,
  parseLastFormValues,
} from '@/lib/history';
import type { CertificateData } from '@/types/certificate';

const store = createLocalStorageStore<CertificateData>({
  key: LAST_FORM_VALUES_STORAGE_KEY,
  parse: parseLastFormValues,
  serialize: (data) => JSON.stringify(data),
  fallback: PLACEHOLDER_CERTIFICATE,
});

/**
 * The form values, remembered in local storage. Until `loaded`, `data` is only the
 * placeholder, so callers show a skeleton instead of it. A failed save is ignored:
 * the values still apply this session.
 */
export function useLastFormValues() {
  const { value, loaded } = store.useStore();
  return { data: value, loaded, setData: store.update };
}
