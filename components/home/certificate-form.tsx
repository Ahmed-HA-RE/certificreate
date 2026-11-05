import { useId } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { BORDER_OPTIONS, TEMPLATE_OPTIONS } from '@/lib/certificate';
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

const OPTION_CLASS =
  'cursor-pointer rounded-sm border border-border bg-background px-3 py-2.5 font-normal text-muted-foreground has-data-checked:border-primary has-data-checked:text-foreground has-data-checked:ring-3 has-data-checked:ring-primary/18';

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
  const templateTitleId = `${idPrefix}-template`;
  const borderTitleId = `${idPrefix}-border`;

  const handleTemplateChange = (value: string) => {
    const option = TEMPLATE_OPTIONS.find((template) => template.id === value);
    if (option) onChange('templateId', option.id);
  };

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
            <Label htmlFor={id} className='text-xs font-semibold text-muted-foreground'>
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
        <span id={templateTitleId} className='text-xs font-semibold text-muted-foreground'>
          Template
        </span>
        <RadioGroup
          aria-labelledby={templateTitleId}
          value={data.templateId}
          onValueChange={handleTemplateChange}
          className='grid-cols-1 sm:max-[1139px]:grid-cols-3'
        >
          {TEMPLATE_OPTIONS.map(({ id, name }) => (
            <Label key={id} className={OPTION_CLASS}>
              <RadioGroupItem value={id} />
              {name}
            </Label>
          ))}
        </RadioGroup>
      </div>

      <div className='grid gap-2'>
        <span id={borderTitleId} className='text-xs font-semibold text-muted-foreground'>
          Border
        </span>
        <RadioGroup
          aria-labelledby={borderTitleId}
          value={data.border}
          onValueChange={handleBorderChange}
          className='grid-cols-1 sm:grid-cols-2'
        >
          {BORDER_OPTIONS.map(({ value, label, note }) => (
            <Label key={value} className={OPTION_CLASS}>
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
