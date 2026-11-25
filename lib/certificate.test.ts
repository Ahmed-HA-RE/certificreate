import { describe, expect, it } from 'vitest';
import {
  certificateFileName,
  clearCertificateText,
  DEFAULT_TEMPLATE_ID,
  formatCertificateDate,
  parseTypedDate,
  toFormValues,
  PLACEHOLDER_CERTIFICATE,
  resolveTemplateId,
  TEMPLATE_OPTIONS,
} from '@/lib/certificate';
import type { CertificateData } from '@/types/certificate';

describe('clearCertificateText', () => {
  it('empties the four text fields and keeps the template and border', () => {
    const data: CertificateData = {
      ...PLACEHOLDER_CERTIFICATE,
      templateId: 'template-3',
      border: 'gold',
    };
    expect(clearCertificateText(data)).toEqual({
      recipientName: '',
      courseTitle: '',
      date: '',
      instructorName: '',
      templateId: 'template-3',
      border: 'gold',
    });
  });

  it('does not mutate the input', () => {
    const data = { ...PLACEHOLDER_CERTIFICATE };
    clearCertificateText(data);
    expect(data).toEqual(PLACEHOLDER_CERTIFICATE);
  });
});

describe('certificateFileName', () => {
  it('slugs the recipient name', () => {
    expect(certificateFileName({ recipientName: 'John Smith' }, 'png')).toBe(
      'certificate-john-smith.png',
    );
  });

  it('collapses punctuation and trims separators', () => {
    expect(
      certificateFileName({ recipientName: "  Dr. Jane O'Neil!  " }, 'pdf'),
    ).toBe('certificate-dr-jane-o-neil.pdf');
  });

  it('falls back when the name has no ASCII letters or digits', () => {
    expect(certificateFileName({ recipientName: '' }, 'png')).toBe(
      'certificate.png',
    );
    expect(certificateFileName({ recipientName: 'ريان' }, 'pdf')).toBe(
      'certificate.pdf',
    );
  });
});

describe('resolveTemplateId', () => {
  it('keeps every registered template id', () => {
    for (const { id } of TEMPLATE_OPTIONS) {
      expect(resolveTemplateId(id)).toBe(id);
    }
  });

  it('falls back to the default for an unknown or empty id', () => {
    expect(resolveTemplateId('template-99')).toBe(DEFAULT_TEMPLATE_ID);
    expect(resolveTemplateId('')).toBe(DEFAULT_TEMPLATE_ID);
  });
});

describe('formatCertificateDate', () => {
  it('prints an ISO date in the en-US long form', () => {
    expect(formatCertificateDate('2026-10-12')).toBe('October 12, 2026');
  });

  it('keeps the same day at the edges of the year, whatever the time zone', () => {
    expect(formatCertificateDate('2026-01-01')).toBe('January 1, 2026');
    expect(formatCertificateDate('2026-12-31')).toBe('December 31, 2026');
  });

  it('prints a leap day', () => {
    expect(formatCertificateDate('2028-02-29')).toBe('February 29, 2028');
  });

  it('returns an empty date unchanged', () => {
    expect(formatCertificateDate('')).toBe('');
  });

  it('returns a day that does not exist unchanged', () => {
    expect(formatCertificateDate('2026-02-30')).toBe('2026-02-30');
    expect(formatCertificateDate('2027-02-29')).toBe('2027-02-29');
  });

  it('returns a malformed string unchanged', () => {
    expect(formatCertificateDate('10/12/2026')).toBe('10/12/2026');
    expect(formatCertificateDate('2026-1-5')).toBe('2026-1-5');
  });
});

describe('parseTypedDate', () => {
  it('reads MM/DD/YYYY as an ISO date', () => {
    expect(parseTypedDate('03/05/2026')).toBe('2026-03-05');
  });

  it('reads single-digit months and days, ignoring surrounding spaces', () => {
    expect(parseTypedDate(' 3/5/2026 ')).toBe('2026-03-05');
  });

  it('reads a leap day', () => {
    expect(parseTypedDate('02/29/2028')).toBe('2028-02-29');
  });

  it('rejects days and months that do not exist', () => {
    expect(parseTypedDate('02/30/2026')).toBeNull();
    expect(parseTypedDate('02/29/2027')).toBeNull();
    expect(parseTypedDate('13/01/2026')).toBeNull();
    expect(parseTypedDate('00/10/2026')).toBeNull();
  });

  it('rejects other formats and empty text', () => {
    expect(parseTypedDate('2026-03-05')).toBeNull();
    expect(parseTypedDate('hello')).toBeNull();
    expect(parseTypedDate('')).toBeNull();
  });
});

describe('toFormValues', () => {
  it('keeps only the four details', () => {
    expect(toFormValues(PLACEHOLDER_CERTIFICATE)).toEqual({
      recipientName: 'John Smith',
      courseTitle: 'Advanced React Patterns',
      date: '2026-10-12',
      instructorName: 'Alex Johnson',
    });
  });
});
