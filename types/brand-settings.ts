export interface BrandColors {
  /** `#rrggbb`; replaces `--color-cert-navy` on the certificate. */
  primary?: string;
}

export interface BrandSettings {
  /** Uploaded logo; `null` keeps the template's placeholder mark. */
  logoDataUrl: string | null;
  colors: BrandColors;
}
