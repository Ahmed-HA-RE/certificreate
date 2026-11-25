"use client";

import {
  DatePicker as ArkDatePicker,
  useDatePickerContext,
} from "@ark-ui/react/date-picker";
import { Portal } from "@ark-ui/react/portal";
import { CalendarIcon, ClockIcon } from "lucide-react";
import type React from "react";
import { cn } from "@/lib/utils";
import {
  Calendar,
  CalendarClearTrigger,
  CalendarLabel,
  CalendarMonthSelect,
  CalendarNextTrigger,
  CalendarPresetTrigger,
  CalendarPrevTrigger,
  CalendarRootProvider,
  CalendarTable,
  CalendarTableBody,
  CalendarTableCell,
  CalendarTableDays,
  CalendarTableHead,
  CalendarTableHeader,
  CalendarTableMonths,
  CalendarTableNextMonth,
  CalendarTableRow,
  CalendarTableYears,
  CalendarTodayTrigger,
  CalendarView,
  CalendarViewControl,
  CalendarViewDate,
  CalendarViewTrigger,
  CalendarWeekDays,
  CalendarWeekNumberCell,
  CalendarWeekNumberHeaderCell,
  CalendarYearSelect,
} from "@/components/ui/calendar";
import type { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  type InputGroupProps,
} from "@/components/ui/input-group";

export const useDatePicker = useDatePickerContext;

// The calendar's parts under the date picker's names, as the other bases
// export them: a date picker composes from this one file on every base.
export const DatePickerClearTrigger = CalendarClearTrigger;
export const DatePickerLabel = CalendarLabel;
export const DatePickerMonthSelect = CalendarMonthSelect;
export const DatePickerNextTrigger = CalendarNextTrigger;
export const DatePickerPrevTrigger = CalendarPrevTrigger;
export const DatePickerRootProvider = CalendarRootProvider;
export const DatePickerTable = CalendarTable;
export const DatePickerTableBody = CalendarTableBody;
export const DatePickerTableCell = CalendarTableCell;
export const DatePickerTableDays = CalendarTableDays;
export const DatePickerTableHead = CalendarTableHead;
export const DatePickerTableHeader = CalendarTableHeader;
export const DatePickerTableMonths = CalendarTableMonths;
export const DatePickerTableNextMonth = CalendarTableNextMonth;
export const DatePickerTableRow = CalendarTableRow;
export const DatePickerTableYears = CalendarTableYears;
export const DatePickerTodayTrigger = CalendarTodayTrigger;
export const DatePickerView = CalendarView;
export const DatePickerViewControl = CalendarViewControl;
export const DatePickerViewDate = CalendarViewDate;
export const DatePickerViewTrigger = CalendarViewTrigger;
export const DatePickerWeekDays = CalendarWeekDays;
export const DatePickerWeekNumberCell = CalendarWeekNumberCell;
export const DatePickerWeekNumberHeaderCell = CalendarWeekNumberHeaderCell;
export const DatePickerYearSelect = CalendarYearSelect;

export const DatePicker = (props: React.ComponentProps<typeof Calendar>) => {
  const { positioning = { placement: "top" }, ...rest } = props;

  return (
    <Calendar
      data-slot="date-picker"
      inline={false}
      positioning={positioning}
      {...rest}
    />
  );
};

/** The id `DatePickerValue` takes, from the trigger's, for the trigger's name. */
const valueTextId = (triggerId: string | null | undefined) =>
  `${triggerId}-value`;

export const DatePickerTrigger = (
  props: React.ComponentProps<typeof ArkDatePicker.Trigger>
) => {
  const {
    className,
    children,
    "aria-labelledby": ariaLabelledBy,
    ...rest
  } = props;
  const datePicker = useDatePickerContext();
  const triggerId = datePicker.getTriggerProps().id;
  // zag's label, Open calendar, would hide the date or the placeholder the
  // button shows: the name is that label (or the one passed in) followed by
  // the `DatePickerValue` inside. Without one, zag's label alone remains.
  const labelledBy = [ariaLabelledBy ?? triggerId, valueTextId(triggerId)]
    .filter(Boolean)
    .join(" ");

  return (
    <ArkDatePicker.Control data-slot="date-picker-control">
      <ArkDatePicker.Trigger
        aria-labelledby={labelledBy}
        className={cn(
          "justify-start",
          "text-left data-placeholder-shown:[&>span]:text-muted-foreground",
          "active:scale-100",
          "[&_svg:not([class*='text-'])]:opacity-64",
          className
        )}
        data-slot="date-picker-trigger"
        {...rest}
      >
        {children}
      </ArkDatePicker.Trigger>
    </ArkDatePicker.Control>
  );
};

interface DatePickerInputProps
  extends Omit<React.ComponentProps<typeof ArkDatePicker.Input>, "size"> {
  size?: InputGroupProps["size"];
}

export const DatePickerInput = (props: DatePickerInputProps) => {
  const { size, className, ...rest } = props;

  return (
    <ArkDatePicker.Control data-slot="date-picker-control">
      {/* `className` styles the visible box, which is the group. */}
      <InputGroup className={className} size={size}>
        <ArkDatePicker.Input data-slot="date-picker-input" {...rest} asChild>
          <InputGroupInput />
        </ArkDatePicker.Input>

        <InputGroupAddon align="inline-end">
          <ArkDatePicker.Trigger data-slot="date-picker-trigger" asChild>
            <InputGroupButton size="icon-xs" variant="ghost">
              <CalendarIcon aria-hidden className="text-muted-foreground" />
            </InputGroupButton>
          </ArkDatePicker.Trigger>
        </InputGroupAddon>
      </InputGroup>
    </ArkDatePicker.Control>
  );
};

export const DatePickerTimer = (props: React.ComponentProps<typeof Input>) => {
  const { className, ...rest } = props;

  return (
    <InputGroup>
      <InputGroupAddon>
        <ClockIcon />
      </InputGroupAddon>
      <InputGroupInput
        className={cn(
          "[&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none",
          className
        )}
        step="1"
        type="time"
        {...rest}
      />
    </InputGroup>
  );
};

export const DatePickerContent = (
  props: React.ComponentProps<typeof ArkDatePicker.Content>
) => {
  const { className, ...rest } = props;

  return (
    <Portal>
      <ArkDatePicker.Positioner data-slot="date-picker-positioner">
        <ArkDatePicker.Content
          className={cn(
            "[--cell-size:--spacing(8)]",
            "z-[calc(50+var(--layer-index,0))]",
            "w-fit min-w-72",
            "p-3",
            "bg-popover",
            "text-popover-foreground",
            "rounded-xl border shadow-lg/5",
            "outline-none",
            "origin-(--transform-origin)",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:animate-out data-[state=open]:animate-in",
            "data-[state=closed]:zoom-out-[98%] data-[state=open]:zoom-in-[98%]",
            "motion-reduce:animate-none!",
            className
          )}
          data-slot="date-picker-content"
          {...rest}
        />
      </ArkDatePicker.Positioner>
    </Portal>
  );
};

export const DatePickerValue = (
  props: React.ComponentProps<typeof ArkDatePicker.ValueText>
) => {
  const { className, ...rest } = props;
  const datePicker = useDatePickerContext();

  return (
    <ArkDatePicker.ValueText
      className={cn("font-medium text-sm", className)}
      data-slot="date-picker-value"
      id={valueTextId(datePicker.getTriggerProps().id)}
      {...rest}
    />
  );
};

export const DatePickerPresetTrigger = (
  props: React.ComponentProps<typeof ArkDatePicker.PresetTrigger>
) => (
  <CalendarPresetTrigger data-slot="date-picker-preset-trigger" {...props} />
);
