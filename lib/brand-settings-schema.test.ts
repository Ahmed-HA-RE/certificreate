import { describe, expect, it } from 'vitest';
import { brandColorsSchema } from '@/lib/brand-settings-schema';

describe('brandColorsSchema', () => {
  it('accepts no override or a #rrggbb color', () => {
    expect(brandColorsSchema.safeParse({}).success).toBe(true);
    expect(brandColorsSchema.safeParse({ primary: '#a1b2c3' }).success).toBe(
      true,
    );
  });

  it('rejects anything that is not #rrggbb', () => {
    for (const primary of ['red', '#abc', '#12345', 'url(x)', '#a1b2c3;']) {
      expect(brandColorsSchema.safeParse({ primary }).success).toBe(false);
    }
  });

  it('rejects unknown keys', () => {
    expect(brandColorsSchema.safeParse({ accent: '#a1b2c3' }).success).toBe(
      false,
    );
  });
});
