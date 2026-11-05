import { describe, expect, it } from 'vitest';
import {
  certificateFileName,
  DEFAULT_TEMPLATE_ID,
  resolveTemplateId,
  TEMPLATE_OPTIONS,
} from '@/lib/certificate';

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
