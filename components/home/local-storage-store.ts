import { useSyncExternalStore } from 'react';

interface LocalStorageStoreOptions<T> {
  key: string;
  /** Turns the stored string (or `null` when nothing is stored) into a value; never throws. */
  parse: (raw: string | null) => T;
  serialize: (value: T) => string;
  /** What the server and the hydration render see, before local storage is read. */
  fallback: T;
}

interface LocalStorageState<T> {
  value: T;
  /** The last write to local storage failed; the value still applies this session. */
  saveFailed: boolean;
  /** False on the server and during hydration, while `value` is still the fallback. */
  loaded: boolean;
}

export type LocalStorageUpdate<T> = (next: T | ((current: T) => T)) => void;

/**
 * One value kept in local storage and shared by every component that reads it.
 * State lives in this closure, so each store has exactly one copy and reference.
 */
export function createLocalStorageStore<T>({
  key,
  parse,
  serialize,
  fallback,
}: LocalStorageStoreOptions<T>) {
  const serverState: LocalStorageState<T> = {
    value: fallback,
    saveFailed: false,
    loaded: false,
  };
  let state: LocalStorageState<T> | undefined;
  const listeners = new Set<() => void>();

  function getSnapshot() {
    if (!state) {
      let raw: string | null = null;
      try {
        raw = localStorage.getItem(key);
      } catch {
        // Blocked storage reads as nothing stored.
      }
      state = { value: parse(raw), saveFailed: false, loaded: true };
    }
    return state;
  }

  const getServerSnapshot = () => serverState;

  function subscribe(listener: () => void) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }

  const update: LocalStorageUpdate<T> = (next) => {
    const value =
      typeof next === 'function'
        ? (next as (current: T) => T)(getSnapshot().value)
        : next;
    let saveFailed = false;
    try {
      localStorage.setItem(key, serialize(value));
    } catch {
      saveFailed = true;
    }
    state = { value, saveFailed, loaded: true };
    listeners.forEach((listener) => listener());
  };

  function useStore() {
    return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  }

  return { useStore, update };
}
