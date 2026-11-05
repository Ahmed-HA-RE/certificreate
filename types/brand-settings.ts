export interface BrandColors {
  /** `#rrggbb`; replaces `--color-cert-navy` on the certificate. */
  primary?: string;
}

/** Why a picked logo file was refused; `read` covers files that fail to load. */
export type LogoFileError = 'type' | 'size' | 'read';

export interface BrandSettings {
  /** Uploaded PNG or JPEG (at most 1 MB) as a data URL; `null` keeps the placeholder mark. */
  logoDataUrl: string | null;
  colors: BrandColors;
}
