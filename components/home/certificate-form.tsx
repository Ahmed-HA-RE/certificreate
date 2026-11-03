import { useId } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { BORDER_OPTIONS } from '@/lib/certificate';
import type { BorderVariant, CertificateData } from '@/types/certificate';

type DetailField = Exclude<keyof CertificateData, 'templateId' | 'border'>;

interface FieldConfig {
  name: DetailField;
  label: string;
  type: 'text' | 'date';
}

const FIELDS: FieldConfig[] = [
  { name: 'recipientName', label: 'Recipient name', type: 'text' },
  { name: 'courseTitle', label: 'Course or achievement', type: 'text' },
  { name: 'date', label: 'Date', type: 'date' },
  { name: 'instructorName', label: 'Instructor', type: 'text' },
];

const SWATCH_CLASS: Record<BorderVariant, string> = {
  blue: 'bg-cert-navy',
  gold: 'bg-cert-gold',
};

export type CertificateFieldChange = <K extends keyof CertificateData>(
  name: K,
  value: CertificateData[K]
) => void;

interface CertificateFormProps {
  data: CertificateData;
  onChange: CertificateFieldChange;
}

export function CertificateForm({ data, onChange }: CertificateFormProps) {
  const idPrefix = useId();
  const borderTitleId = `${idPrefix}-border`;

  const handleBorderChange = (value: string) => {
    const option = BORDER_OPTIONS.find((border) => border.value === value);
    if (option) onChange('border', option.value);
  };

  return (
    <div className='grid gap-6 p-6'>
      {FIELDS.map(({ name, label, type }) => {
        const id = `${idPrefix}-${name}`;
        return (
          <div key={name} className='grid gap-2'>
            <Label htmlFor={id} className='text-xs font-semibold text-muted'>
              {label}
            </Label>
            <Input
              id={id}
              type={type}
              value={data[name]}
              onChange={(event) => onChange(name, event.target.value)}
              className='h-10 rounded-sm px-3'
            />
          </div>
        );
      })}

      <div className='grid gap-2'>
        <span id={borderTitleId} className='text-xs font-semibold text-muted'>
          Border
        </span>
        <RadioGroup
          aria-labelledby={borderTitleId}
          value={data.border}
          onValueChange={handleBorderChange}
          className='grid-cols-1 sm:grid-cols-2'
        >
          {BORDER_OPTIONS.map(({ value, label, note }) => (
            <Label
              key={value}
              className='cursor-pointer rounded-sm border border-border bg-bg px-3 py-2.5 font-normal text-muted has-data-checked:border-accent has-data-checked:text-text has-data-checked:ring-3 has-data-checked:ring-accent-soft'
            >
              <RadioGroupItem value={value} />
              <span
                aria-hidden='true'
                className={`size-[18px] flex-none rounded-full ${SWATCH_CLASS[value]}`}
              />
              {label}
              <small className='ml-auto text-[11px] text-faint'>{note}</small>
            </Label>
          ))}
        </RadioGroup>
      </div>
    </div>
  );
}
