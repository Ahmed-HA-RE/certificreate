import { describe, expect, it } from 'vitest';
import { PLACEHOLDER_CERTIFICATE, TEMPLATE_OPTIONS } from '@/lib/certificate';
import {
  certificateDataSchema,
  exportRequestSchema,
  MAX_COURSE_TITLE_LENGTH,
  MAX_INSTRUCTOR_NAME_LENGTH,
  MAX_RECIPIENT_NAME_LENGTH,
  validateCertificateForm,
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

  it('strips unknown keys', () => {
    const certificate = { ...PLACEHOLDER_CERTIFICATE, extra: 'value' };
    expect(certificateDataSchema.parse(certificate)).toEqual(
      PLACEHOLDER_CERTIFICATE,
    );
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

  it('strips unknown keys', () => {
    const certificate = { ...PLACEHOLDER_CERTIFICATE, extra: 'value' };
    expect(exportRequestSchema.parse(certificate)).toEqual(
      PLACEHOLDER_CERTIFICATE,
    );
  });
});

describe('exportRequestSchema logo', () => {
  it('accepts no logo, a null logo, or a PNG logo', () => {
    for (const logoDataUrl of [undefined, null, 'data:image/png;base64,iVBORw0KGgo=']) {
      const request = { ...PLACEHOLDER_CERTIFICATE, logoDataUrl };
      expect(exportRequestSchema.safeParse(request).success).toBe(true);
    }
  });

  it('rejects an SVG logo', () => {
    const request = {
      ...PLACEHOLDER_CERTIFICATE,
      logoDataUrl: 'data:image/svg+xml;base64,PHN2Zy8+',
    };
    expect(exportRequestSchema.safeParse(request).success).toBe(false);
  });
});

describe('validateCertificateForm', () => {
  it('accepts a complete certificate', () => {
    expect(validateCertificateForm(PLACEHOLDER_CERTIFICATE)).toEqual({});
  });

  it('requires every detail field', () => {
    expect(
      validateCertificateForm({
        ...PLACEHOLDER_CERTIFICATE,
        recipientName: '',
        courseTitle: '',
        date: '',
        instructorName: '',
      })
    ).toEqual({
      recipientName: "Enter the recipient's name.",
      courseTitle: 'Enter the course or achievement.',
      date: 'Choose or type a date.',
      instructorName: "Enter the instructor's name.",
    });
  });

  it('treats whitespace alone as empty', () => {
    expect(
      validateCertificateForm({ ...PLACEHOLDER_CERTIFICATE, courseTitle: '   ' })
    ).toEqual({ courseTitle: 'Enter the course or achievement.' });
  });

  it('accepts text exactly at each limit', () => {
    expect(
      validateCertificateForm({
        ...PLACEHOLDER_CERTIFICATE,
        recipientName: 'a'.repeat(MAX_RECIPIENT_NAME_LENGTH),
        courseTitle: 'a'.repeat(MAX_COURSE_TITLE_LENGTH),
        instructorName: 'a'.repeat(MAX_INSTRUCTOR_NAME_LENGTH),
      })
    ).toEqual({});
  });

  it('rejects text one character over each limit', () => {
    expect(
      validateCertificateForm({
        ...PLACEHOLDER_CERTIFICATE,
        recipientName: 'a'.repeat(MAX_RECIPIENT_NAME_LENGTH + 1),
        courseTitle: 'a'.repeat(MAX_COURSE_TITLE_LENGTH + 1),
        instructorName: 'a'.repeat(MAX_INSTRUCTOR_NAME_LENGTH + 1),
      })
    ).toEqual({
      recipientName: 'Recipient name must be 20 characters or fewer.',
      courseTitle: 'Course must be 40 characters or fewer.',
      instructorName: 'Instructor name must be 20 characters or fewer.',
    });
  });

  it('measures the limit without surrounding spaces', () => {
    const name = ` ${'a'.repeat(MAX_RECIPIENT_NAME_LENGTH)} `;
    expect(
      validateCertificateForm({ ...PLACEHOLDER_CERTIFICATE, recipientName: name })
    ).toEqual({});
  });

  it('reports only the fields that are wrong', () => {
    expect(
      validateCertificateForm({
        ...PLACEHOLDER_CERTIFICATE,
        date: '',
        instructorName: 'a'.repeat(MAX_INSTRUCTOR_NAME_LENGTH + 1),
      })
    ).toEqual({
      date: 'Choose or type a date.',
      instructorName: 'Instructor name must be 20 characters or fewer.',
    });
  });
});

describe('certificateDataSchema limits', () => {
  it('accepts text exactly at each limit', () => {
    const certificate = {
      ...PLACEHOLDER_CERTIFICATE,
      recipientName: 'a'.repeat(MAX_RECIPIENT_NAME_LENGTH),
      courseTitle: 'a'.repeat(MAX_COURSE_TITLE_LENGTH),
      instructorName: 'a'.repeat(MAX_INSTRUCTOR_NAME_LENGTH),
    };
    expect(certificateDataSchema.safeParse(certificate).success).toBe(true);
  });

  it('rejects each field one character over its limit', () => {
    for (const [field, max] of [
      ['recipientName', MAX_RECIPIENT_NAME_LENGTH],
      ['courseTitle', MAX_COURSE_TITLE_LENGTH],
      ['instructorName', MAX_INSTRUCTOR_NAME_LENGTH],
    ] as const) {
      const certificate = { ...PLACEHOLDER_CERTIFICATE, [field]: 'a'.repeat(max + 1) };
      expect(certificateDataSchema.safeParse(certificate).success).toBe(false);
    }
  });
});
