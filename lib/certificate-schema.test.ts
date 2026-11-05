import { describe, expect, it } from 'vitest';
import { PLACEHOLDER_CERTIFICATE, TEMPLATE_OPTIONS } from '@/lib/certificate';
import {
  certificateDataSchema,
  exportRequestSchema,
} from '@/lib/certificate-schema';

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

describe('exportRequestSchema', () => {
  it('accepts the certificate with or without brand colors', () => {
    expect(exportRequestSchema.safeParse(PLACEHOLDER_CERTIFICATE).success).toBe(
      true,
    );
    const branded = { ...PLACEHOLDER_CERTIFICATE, colors: { primary: '#7a1f3d' } };
    expect(exportRequestSchema.safeParse(branded).success).toBe(true);
  });

  it('rejects a color that is not #rrggbb', () => {
    const branded = { ...PLACEHOLDER_CERTIFICATE, colors: { primary: 'url(x)' } };
    expect(exportRequestSchema.safeParse(branded).success).toBe(false);
  });

  it('still rejects unknown keys', () => {
    const certificate = { ...PLACEHOLDER_CERTIFICATE, extra: 'value' };
    expect(exportRequestSchema.safeParse(certificate).success).toBe(false);
  });
});
