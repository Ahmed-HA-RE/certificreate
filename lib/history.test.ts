import { describe, expect, it } from 'vitest';
import { PLACEHOLDER_CERTIFICATE } from '@/lib/certificate';
import {
  addHistoryEntry,
  parseHistory,
  parseLastFormValues,
  serializeHistory,
  toCertificateData,
} from '@/lib/history';
import type { CertificateData } from '@/types/certificate';
import type { HistoryEntry } from '@/types/history';

const JOHN: CertificateData = {
  recipientName: 'John Smith',
  courseTitle: 'Advanced React Patterns',
  date: '2026-10-12',
  instructorName: 'Alex Johnson',
  templateId: 'template-1',
  border: 'blue',
};

const SARA: CertificateData = {
  ...JOHN,
  recipientName: 'Sara Ali',
  templateId: 'template-2',
  border: 'gold',
};

const JOHN_ENTRY: HistoryEntry = {
  ...JOHN,
  id: 'a1',
  createdAt: '2026-11-24T10:00:00.000Z',
};

const SARA_ENTRY: HistoryEntry = {
  ...SARA,
  id: 'b2',
  createdAt: '2026-11-24T11:00:00.000Z',
};

describe('parseHistory', () => {
  it('returns an empty list when nothing is stored', () => {
    expect(parseHistory(null)).toEqual([]);
  });

  it('returns an empty list for invalid JSON or a non-array', () => {
    for (const raw of ['not json', '{}', '"text"', 'null', '42']) {
      expect(parseHistory(raw)).toEqual([]);
    }
  });

  it('drops invalid entries and keeps valid ones in stored order', () => {
    const raw = JSON.stringify([
      SARA_ENTRY,
      { ...JOHN_ENTRY, id: '' },
      { ...JOHN_ENTRY, createdAt: 'yesterday' },
      { ...JOHN_ENTRY, templateId: 'template-99' },
      'not an entry',
      JOHN_ENTRY,
    ]);
    expect(parseHistory(raw)).toEqual([SARA_ENTRY, JOHN_ENTRY]);
  });

  it('strips unknown keys from a stored entry', () => {
    const raw = JSON.stringify([{ ...JOHN_ENTRY, extra: true }]);
    expect(parseHistory(raw)).toEqual([JOHN_ENTRY]);
  });

  it('round-trips through serializeHistory', () => {
    const entries = [SARA_ENTRY, JOHN_ENTRY];
    expect(parseHistory(serializeHistory(entries))).toEqual(entries);
    expect(parseHistory(serializeHistory([]))).toEqual([]);
  });
});

describe('addHistoryEntry', () => {
  const meta = { id: 'c3', createdAt: '2026-11-24T12:00:00.000Z' };

  it('prepends a new certificate', () => {
    expect(addHistoryEntry([JOHN_ENTRY], SARA, meta)).toEqual([
      { ...SARA, ...meta },
      JOHN_ENTRY,
    ]);
  });

  it('replaces an entry for the same certificate, keeping its id, and moves it to the top', () => {
    expect(addHistoryEntry([SARA_ENTRY, JOHN_ENTRY], JOHN, meta)).toEqual([
      { ...JOHN, id: JOHN_ENTRY.id, createdAt: meta.createdAt },
      SARA_ENTRY,
    ]);
  });

  it('keeps the id when re-saving the entry that is already first', () => {
    const [entry] = addHistoryEntry([JOHN_ENTRY, SARA_ENTRY], JOHN, meta);
    expect(entry.id).toBe(JOHN_ENTRY.id);
    expect(entry.createdAt).toBe(meta.createdAt);
  });

  it('treats a change in any field as a different certificate', () => {
    const goldJohn = { ...JOHN, border: 'gold' as const };
    expect(addHistoryEntry([JOHN_ENTRY], goldJohn, meta)).toEqual([
      { ...goldJohn, ...meta },
      JOHN_ENTRY,
    ]);
  });

  it('stores only the certificate fields from the data', () => {
    expect(addHistoryEntry([], SARA_ENTRY, meta)).toEqual([{ ...SARA, ...meta }]);
  });

  it('does not mutate the input list', () => {
    const entries = [SARA_ENTRY, JOHN_ENTRY];
    addHistoryEntry(entries, JOHN, meta);
    expect(entries).toEqual([SARA_ENTRY, JOHN_ENTRY]);
  });
});

describe('toCertificateData', () => {
  it('strips the entry id and timestamp', () => {
    expect(toCertificateData(JOHN_ENTRY)).toEqual(JOHN);
  });
});

describe('parseLastFormValues', () => {
  it('returns the placeholder when nothing valid is stored', () => {
    for (const raw of [
      null,
      'not json',
      '[]',
      JSON.stringify({ ...JOHN, border: 'red' }),
      JSON.stringify({ ...JOHN, recipientName: 'x'.repeat(21) }),
    ]) {
      expect(parseLastFormValues(raw)).toBe(PLACEHOLDER_CERTIFICATE);
    }
  });

  it('strips unknown keys from stored values', () => {
    expect(parseLastFormValues(JSON.stringify({ ...JOHN, extra: true }))).toEqual(
      JOHN,
    );
  });

  it('keeps valid stored values, including empty fields', () => {
    expect(parseLastFormValues(JSON.stringify(SARA))).toEqual(SARA);
    const empty = { ...SARA, recipientName: '', courseTitle: '', date: '', instructorName: '' };
    expect(parseLastFormValues(JSON.stringify(empty))).toEqual(empty);
  });
});
