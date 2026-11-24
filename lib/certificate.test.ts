import { describe, expect, it } from 'vitest';
import {
  certificateFileName,
  clearCertificateText,
  DEFAULT_TEMPLATE_ID,
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
