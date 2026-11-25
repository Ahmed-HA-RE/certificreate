import type React from 'react';
import { useId, useMemo, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { parseDate } from '@ark-ui/react/date-picker';
import { Button } from '@/components/ui/button';
import {
  DatePicker,
  DatePickerContent,
  DatePickerInput,
  DatePickerNextTrigger,
  DatePickerPrevTrigger,
  DatePickerTable,
  DatePickerTableDays,
  DatePickerTableMonths,
  DatePickerTableYears,
  DatePickerView,
  DatePickerViewControl,
  DatePickerViewTrigger,
  DatePickerWeekDays,
} from '@/components/ui/date-picker';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Skeleton } from '@/components/ui/skeleton';
import {
  BORDER_OPTIONS,
  parseTypedDate,
  TEMPLATE_OPTIONS,
} from '@/lib/certificate';
import type {
  BorderVariant,
  CertificateData,
  CertificateFormField,
  CertificateFormValues,
} from '@/types/certificate';

const TYPED_DATE_ERROR = 'Enter the date as MM/DD/YYYY.';

interface FieldConfig {
  name: CertificateFormField;
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

/**
 * The four details come from the surrounding React Hook Form (`FormProvider`);
 * `data` supplies the template and border, which `onChange` updates.
 */
interface CertificateFormProps {
  data: CertificateData;
  onChange: CertificateFieldChange;
  /** Empties the four text fields; the template and border stay. */
  onClear: () => void;
}

/** The form's shape while saved values load, so the real values never flash in late. */
export function CertificateFormSkeleton() {
  return (
    <div aria-busy='true' className='grid gap-6 p-6'>
      <span className='sr-only'>Loading your saved details…</span>
      {FIELDS.map(({ name, label }) => (
        <div key={name} aria-hidden='true' className='grid gap-2'>
          <span className='text-xs font-semibold text-muted-foreground'>{label}</span>
          <Skeleton className='h-10 rounded-sm' />
        </div>
      ))}
      <div aria-hidden='true' className='grid gap-2'>
        <span className='text-xs font-semibold text-muted-foreground'>Template</span>
        <div className='grid grid-cols-1 gap-2 sm:max-[1139px]:grid-cols-3'>
          {TEMPLATE_OPTIONS.map(({ id }) => (
            <Skeleton key={id} className='h-[42px] rounded-sm' />
          ))}
        </div>
      </div>
      <div aria-hidden='true' className='grid gap-2'>
        <span className='text-xs font-semibold text-muted-foreground'>Border</span>
        <div className='grid grid-cols-1 gap-2 sm:grid-cols-2'>
          {BORDER_OPTIONS.map(({ value }) => (
            <Skeleton key={value} className='h-[42px] rounded-sm' />
          ))}
        </div>
      </div>
      <Skeleton aria-hidden='true' className='h-10 rounded-lg' />
    </div>
  );
}

export function CertificateForm({
  data,
  onChange,
  onClear,
}: CertificateFormProps) {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<CertificateFormValues>();
  const idPrefix = useId();
  // Set when typed text can't be read as a date; the date is cleared and this says why.
  const [typedDateError, setTypedDateError] = useState<string | null>(null);
  const templateTitleId = `${idPrefix}-template`;
  const borderTitleId = `${idPrefix}-border`;
  const isEmpty = FIELDS.every(({ name }) => data[name] === '');

  // Clear form disables itself, so hand focus to the first field instead of dropping it.
  const handleClear = () => {
    onClear();
    setTypedDateError(null);
    // `reset` drops React Hook Form's field refs until the next render, so focus by id.
    document.getElementById(`${idPrefix}-recipientName`)?.focus();
  };

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
        const errorId = `${id}-error`;
        const error =
          name === 'date'
            ? (typedDateError ?? errors.date?.message)
            : errors[name]?.message;
        const errorProps = error
          ? { 'aria-invalid': true, 'aria-describedby': errorId }
          : {};
        return (
          <div key={name} className='grid gap-2'>
            <Label htmlFor={id} className='text-xs font-semibold text-muted-foreground'>
              {label}
            </Label>
            {type === 'date' ? (
              <Controller
                control={control}
                name='date'
                render={({ field }) => (
                  <CertificateDatePicker
                    id={id}
                    value={field.value}
                    inputRef={field.ref}
                    onChange={(value) => {
                      setTypedDateError(null);
                      field.onChange(value);
                    }}
                    onCommitText={(text) => {
                      // Ark would swap unreadable text for today's date; this form
                      // commits typed text itself, so nothing is chosen silently.
                      const iso = parseTypedDate(text);
                      const unreadable = text.trim() !== '' && !iso;
                      field.onChange(iso ?? '');
                      setTypedDateError(unreadable ? TYPED_DATE_ERROR : null);
                    }}
                    onBlur={field.onBlur}
                    inputProps={errorProps}
                  />
                )}
              />
            ) : (
              <Input
                id={id}
                type={type}
                className='h-10 rounded-sm px-3'
                {...register(name)}
                {...errorProps}
              />
            )}
            {error && (
              <p id={errorId} className='text-sm text-destructive'>
                {error}
              </p>
            )}
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

      <Button variant='outline' disabled={isEmpty} onClick={handleClear} className='h-10'>
        Clear form
      </Button>
    </div>
  );
}

interface CertificateDatePickerProps {
  id: string;
  /** ISO `YYYY-MM-DD`, or `''` for no date. */
  value: string;
  onChange: (value: string) => void;
  /** React Hook Form's field ref, so it can focus the text input. */
  inputRef: React.Ref<HTMLInputElement>;
  /** Typed text to commit, on blur or Enter; Ark's own fix-on-blur is off. */
  onCommitText: (text: string) => void;
  onBlur: () => void;
  /** `aria-invalid` and `aria-describedby` for the text input while an error shows. */
  inputProps: React.AriaAttributes;
}

/** Typed text as a picker date, read by the same rule as the form's error message. */
function parseTypedDateValue(text: string) {
  const iso = parseTypedDate(text);
  return iso ? parseDate(iso) : undefined;
}

/** Pick from a calendar or type MM/DD/YYYY; any date, past or future, is allowed. */
function CertificateDatePicker({
  id,
  value,
  onChange,
  inputRef,
  onCommitText,
  onBlur,
  inputProps,
}: CertificateDatePickerProps) {
  const selected = useMemo(() => (value ? [parseDate(value)] : []), [value]);

  return (
    <DatePicker
      ids={{ input: () => id }}
      locale='en-US'
      parse={parseTypedDateValue}
      value={selected}
      // `valueAsString` is locale text (`11/12/2026`); a CalendarDate's `toString()` is ISO.
      onValueChange={(details) => onChange(details.value[0]?.toString() ?? '')}
      positioning={{ placement: 'bottom-start' }}
      className='w-full bg-transparent p-0'
    >
      <DatePickerInput
        ref={inputRef}
        className='h-10 rounded-sm [&>input]:ps-3'
        fixOnBlur={false}
        onBlur={(event) => {
          onCommitText(event.currentTarget.value);
          onBlur();
        }}
        // Ark's Enter selects its focused day even for unreadable text; commit first.
        onKeyDownCapture={(event) => {
          if (event.key !== 'Enter') return;
          event.preventDefault();
          onCommitText(event.currentTarget.value);
        }}
        {...inputProps}
      />
      <DatePickerContent>
        <DatePickerView view='day'>
          <DatePickerViewControl>
            <DatePickerPrevTrigger />
            <DatePickerViewTrigger />
            <DatePickerNextTrigger />
          </DatePickerViewControl>
          <DatePickerTable>
            <DatePickerWeekDays />
            <DatePickerTableDays />
          </DatePickerTable>
        </DatePickerView>
        <DatePickerView view='month'>
          <DatePickerViewControl>
            <DatePickerPrevTrigger />
            <DatePickerViewTrigger />
            <DatePickerNextTrigger />
          </DatePickerViewControl>
          <DatePickerTable>
            <DatePickerTableMonths />
          </DatePickerTable>
        </DatePickerView>
        <DatePickerView view='year'>
          <DatePickerViewControl>
            <DatePickerPrevTrigger />
            <DatePickerViewTrigger />
            <DatePickerNextTrigger />
          </DatePickerViewControl>
          <DatePickerTable>
            <DatePickerTableYears />
          </DatePickerTable>
        </DatePickerView>
      </DatePickerContent>
    </DatePicker>
  );
}
