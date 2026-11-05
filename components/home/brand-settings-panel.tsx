import { useId, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { DEFAULT_BRAND_COLOR } from '@/lib/brand-settings';
import type { BrandSettings } from '@/types/brand-settings';

interface BrandSettingsPanelProps {
  settings: BrandSettings;
  saveFailed: boolean;
  onBrandColorChange: (color: string | undefined) => void;
}

export function BrandSettingsPanel({
  settings,
  saveFailed,
  onBrandColorChange,
}: BrandSettingsPanelProps) {
  const idPrefix = useId();
  const colorId = `${idPrefix}-color`;
  const colorInputRef = useRef<HTMLInputElement>(null);
  const brandColor = settings.colors.primary;

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
