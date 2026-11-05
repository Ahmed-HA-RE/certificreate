import { useId, useRef, type ChangeEvent } from 'react';
import { toast } from 'sonner';
import { LogoMark } from '@/components/home/logo-mark';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { checkLogoFile, DEFAULT_BRAND_COLOR } from '@/lib/brand-settings';
import { logoDataUrlSchema } from '@/lib/brand-settings-schema';
import type { BrandSettings, LogoFileError } from '@/types/brand-settings';

const LOGO_ERRORS: Record<LogoFileError, string> = {
  type: 'Use a PNG or JPEG image.',
  size: 'Choose an image of 1 MB or less.',
  read: "Couldn't read this image. Try another file.",
};

/** The file as a data URL, once it is known to decode as an image. */
async function readLogo(file: File) {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
  // Saved settings that fail the schema load as defaults, so never store one.
  if (!logoDataUrlSchema.safeParse(dataUrl).success) {
    throw new Error('Not a PNG or JPEG data URL.');
  }
  const image = new Image();
  image.src = dataUrl;
  await image.decode();
  return dataUrl;
}

interface BrandSettingsPanelProps {
  settings: BrandSettings;
  saveFailed: boolean;
  onLogoChange: (logoDataUrl: string | null) => void;
  onBrandColorChange: (color: string | undefined) => void;
}

export function BrandSettingsPanel({
  settings,
  saveFailed,
  onLogoChange,
  onBrandColorChange,
}: BrandSettingsPanelProps) {
  const idPrefix = useId();
  const logoTitleId = `${idPrefix}-logo`;
  const logoHintId = `${idPrefix}-logo-hint`;
  const colorId = `${idPrefix}-color`;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadButtonRef = useRef<HTMLButtonElement>(null);
  const colorInputRef = useRef<HTMLInputElement>(null);
  // Bumped on every pick and removal, so a slow read never overwrites a newer choice.
  const logoPickRef = useRef(0);
  const logo = settings.logoDataUrl;
  const brandColor = settings.colors.primary;

  const handleLogoFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    // Cleared so picking the same file again still fires a change.
    event.target.value = '';
    if (!file) return;

    const pick = ++logoPickRef.current;
    const error = checkLogoFile(file);
    if (error) {
      toast.error(LOGO_ERRORS[error]);
      return;
    }
    readLogo(file).then(
      (dataUrl) => {
        if (pick === logoPickRef.current) onLogoChange(dataUrl);
      },
      () => {
        if (pick === logoPickRef.current) toast.error(LOGO_ERRORS.read);
      }
    );
  };

  // Remove disables itself, so hand focus back to the upload button.
  const handleRemoveLogo = () => {
    logoPickRef.current++;
    onLogoChange(null);
    uploadButtonRef.current?.focus();
  };

  // Reset disables itself, so hand focus to the color input instead of dropping it.
  const handleReset = () => {
    onBrandColorChange(undefined);
    colorInputRef.current?.focus();
  };

  return (
    <div className='grid gap-6 p-6'>
      <p className='text-xs text-faint'>
        Applied to every template and saved in this browser.
      </p>

      <div className='grid gap-2'>
        <span id={logoTitleId} className='text-xs font-semibold text-muted-foreground'>
          Logo
        </span>
        <div className='flex h-28 items-center justify-center rounded-sm border border-border bg-white p-3'>
          {logo ? (
            // A data URL already in memory; next/image adds nothing for it.
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logo} alt='Current logo' className='max-h-full max-w-full object-contain' />
          ) : (
            <>
              <LogoMark />
              <span className='sr-only'>Placeholder badge</span>
            </>
          )}
        </div>
        <input
          ref={fileInputRef}
          type='file'
          accept='image/png,image/jpeg'
          tabIndex={-1}
          aria-hidden='true'
          className='hidden'
          onChange={handleLogoFile}
        />
        <div className='grid grid-cols-2 gap-2'>
          <Button
            ref={uploadButtonRef}
            variant='outline'
            aria-describedby={`${logoTitleId} ${logoHintId}`}
            onClick={() => fileInputRef.current?.click()}
          >
            {logo ? 'Replace logo' : 'Upload logo'}
          </Button>
          <Button
            variant='outline'
            disabled={!logo}
            aria-label='Remove logo'
            onClick={handleRemoveLogo}
          >
            Remove
          </Button>
        </div>
        <p id={logoHintId} className='text-xs text-faint'>
          PNG or JPEG, up to 1 MB.
        </p>
      </div>

      <div className='grid gap-2'>
        <Label htmlFor={colorId} className='text-xs font-semibold text-muted-foreground'>
          Brand color
        </Label>
        <div className='flex items-center gap-3'>
          <input
            ref={colorInputRef}
            id={colorId}
            type='color'
            value={brandColor ?? DEFAULT_BRAND_COLOR}
            onChange={(event) => onBrandColorChange(event.target.value)}
            className='h-10 w-14 flex-none cursor-pointer rounded-sm border border-border bg-background p-1'
          />
          <span className='text-xs text-muted-foreground'>
            {brandColor ?? 'Navy (default)'}
          </span>
          <Button
            variant='outline'
            size='sm'
            disabled={!brandColor}
            aria-label='Reset brand color'
            onClick={handleReset}
            className='ml-auto'
          >
            Reset
          </Button>
        </div>
      </div>

      <p role='status' className='text-sm text-destructive empty:hidden'>
        {saveFailed ? "Couldn't save brand settings in this browser." : null}
      </p>
    </div>
  );
}
