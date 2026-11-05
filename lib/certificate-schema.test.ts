import { describe, expect, it } from 'vitest';
import { PLACEHOLDER_CERTIFICATE, TEMPLATE_OPTIONS } from '@/lib/certificate';
import { certificateDataSchema } from '@/lib/certificate-schema';

describe('certificateDataSchema', () => {
  it('accepts every registered template', () => {
    for (const { id } of TEMPLATE_OPTIONS) {
      const certificate = { ...PLACEHOLDER_CERTIFICATE, templateId: id };
      expect(certificateDataSchema.safeParse(certificate).success).toBe(true);
    }
  });

  it('rejects an unregistered template', () => {
    const certificate = { ...PLACEHOLDER_CERTIFICATE, templateId: 'template-99' };
    expect(certificateDataSchema.safeParse(certificate).success).toBe(false);
  });

  it('rejects unknown keys', () => {
    const certificate = { ...PLACEHOLDER_CERTIFICATE, extra: 'value' };
    expect(certificateDataSchema.safeParse(certificate).success).toBe(false);
  });
});
