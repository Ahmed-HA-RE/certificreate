"use client";

import {
  DatePicker as ArkCalendar,
  type DateValue,
  useDatePicker as useArkDatePicker,
  useDatePickerContext as useArkDatePickerContext,
} from "@ark-ui/react/date-picker";
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";
import type React from "react";
import { useId } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export const useCalendar = useArkDatePicker;
export const useCalendarContext = useArkDatePickerContext;
export const CalendarContext: typeof ArkCalendar.Context = ArkCalendar.Context;

const calendarRootClassName = cn(
  "p-2 [--cell-radius:var(--radius-md)] [--cell-size:--spacing(7)] group/calendar bg-background in-data-[slot=card-content]:bg-transparent in-data-[slot=popover-content]:bg-transparent",
  "w-fit"
);

/** The reader's time zone. Without one, zag reads today's date in UTC. */
const localTimeZone = () => Intl.DateTimeFormat().resolvedOptions().timeZone;

export const Calendar = (
  props: React.ComponentProps<typeof ArkCalendar.Root>
) => {
  const {
    lazyMount = true,
    unmountOnExit = true,
    inline = true,
    timeZone = localTimeZone(),
    ids,
    className,
    ...rest
  } = props;
  const rootId = useId();
  // zag moves keyboard focus to a day by finding it inside the content part,
  // which an inline calendar doesn't render: its root stands in, by sharing
  // the id zag looks the content up by.
  const root = ids?.root ?? rootId;
  const inlineIds = { ...ids, content: ids?.content ?? root, root };

  return (
    <ArkCalendar.Root
      className={cn(calendarRootClassName, className)}
      data-slot="calendar"
      ids={inline ? inlineIds : ids}
      inline={inline}
      lazyMount={lazyMount}
      timeZone={timeZone}
      unmountOnExit={unmountOnExit}
      {...rest}
    />
  );
};

export const CalendarRootProvider = (
  props: React.ComponentProps<typeof ArkCalendar.RootProvider>
) => {
  const { lazyMount = true, unmountOnExit = true, className, ...rest } = props;

  return (
    <ArkCalendar.RootProvider
      className={cn(calendarRootClassName, className)}
      data-slot="calendar"
      lazyMount={lazyMount}
      unmountOnExit={unmountOnExit}
      {...rest}
    />
  );
};

export const CalendarControl = (
  props: React.ComponentProps<typeof ArkCalendar.Control>
) => (
  <ArkCalendar.Control
    className="inline-flex items-center gap-2"
    data-slot="calendar-control"
    {...props}
  />
);

export const CalendarLabel = (
  props: React.ComponentProps<typeof ArkCalendar.Label>
) => (
  <ArkCalendar.Label
    className="font-medium text-sm"
    data-slot="calendar-label"
    {...props}
  />
);

export const CalendarTrigger = (
  props: React.ComponentProps<typeof ArkCalendar.Trigger>
) => <ArkCalendar.Trigger data-slot="calendar-trigger" {...props} />;

export const CalendarPresetTrigger = (
  props: React.ComponentProps<typeof ArkCalendar.PresetTrigger>
) => (
  <ArkCalendar.PresetTrigger data-slot="calendar-preset-trigger" {...props} />
);

export const CalendarViewDate = (
  props: React.ComponentProps<typeof ArkCalendar.RangeText>
) => {
  const { className, ...rest } = props;

  return (
    <ArkCalendar.RangeText
      className={cn(
        "select-none font-medium text-sm",
        className
      )}
      data-slot="calendar-range-text"
      {...rest}
    />
  );
};

export const CalendarTodayTrigger = (
  props: React.ComponentProps<typeof Button>
) => {
  const { variant = "outline", size = "lg", ...rest } = props;

  return (
    <CalendarContext>
      {(calendar) => {
        const handleSelectToday = () => {
          calendar.selectToday();
        };

        return (
          <Button
            data-slot="calendar-today-trigger"
            onClick={handleSelectToday}
            size={size}
            variant={variant}
            {...rest}
          >
            Today
          </Button>
        );
      }}
    </CalendarContext>
  );
};

export const CalendarClearTrigger = (
  props: React.ComponentProps<typeof ArkCalendar.ClearTrigger>
) => <ArkCalendar.ClearTrigger data-slot="calendar-clear-trigger" {...props} />;

export const CalendarYearSelect = (
  props: React.ComponentProps<typeof ArkCalendar.YearSelect>
) => {
  const { className, ...rest } = props;
  const calendar = useCalendarContext();

  return (
    <div
      className={cn(
        "has-focus:border-ring border-input has-focus:ring-ring/50 border has-focus:ring-3 relative inline-flex items-center rounded-(--cell-radius)",
        className
      )}
      data-slot="calendar-year-select-wrapper"
    >
      <select
        className={calendarSelectClassName}
        data-slot="calendar-year-select"
        {...calendar.getYearSelectProps()}
        {...rest}
      >
        {calendar.getYears().map((year) => (
          <option disabled={year.disabled} key={year.value} value={year.value}>
            {year.label}
          </option>
        ))}
      </select>
      <ChevronDownIcon
        aria-hidden="true"
        className="pointer-events-none absolute inset-e-1.5 top-1/2 size-3.5 -translate-y-1/2 select-none text-muted-foreground"
        data-slot="calendar-year-select-icon"
      />
    </div>
  );
};

const calendarSelectClassName =
  "h-(--cell-size) w-full min-w-0 appearance-none bg-transparent py-0 ps-1.5 pe-6 font-medium text-sm outline-none";

export const CalendarMonthSelect = (
  props: React.ComponentProps<typeof ArkCalendar.MonthSelect>
) => {
  const { className, ...rest } = props;
  const calendar = useCalendarContext();

  return (
    <div
      className={cn(
        "has-focus:border-ring border-input has-focus:ring-ring/50 border has-focus:ring-3 relative inline-flex items-center rounded-(--cell-radius)",
        className
      )}
      data-slot="calendar-month-select-wrapper"
    >
      <select
        className={calendarSelectClassName}
        data-slot="calendar-month-select"
        {...calendar.getMonthSelectProps()}
        {...rest}
      >
        {calendar.getMonths({ format: "short" }).map((month) => (
          <option
            disabled={month.disabled}
            key={month.value}
            value={month.value}
          >
            {month.label}
          </option>
        ))}
      </select>
      <ChevronDownIcon
        aria-hidden="true"
        className="pointer-events-none absolute inset-e-1.5 top-1/2 size-3.5 -translate-y-1/2 select-none text-muted-foreground"
        data-slot="calendar-month-select-icon"
      />
    </div>
  );
};

export const CalendarView = (
  props: React.ComponentProps<typeof ArkCalendar.View>
) => {
  const { className, ...rest } = props;

  return (
    <ArkCalendar.View
      className={cn("flex flex-col gap-1", className)}
      data-slot="calendar-view"
      {...rest}
    />
  );
};

export const CalendarViewTrigger = (
  props: React.ComponentProps<typeof ArkCalendar.ViewTrigger>
) => {
  const { className, children, ...rest } = props;

  return (
    <ArkCalendar.ViewTrigger
      className={cn(
        "h-6 pe-1 ps-1.5 flex select-none items-center gap-1 rounded-(--cell-radius) font-medium text-sm [&>svg]:size-3.5 [&>svg]:text-muted-foreground",
        className
      )}
      data-slot="calendar-view-trigger"
      {...rest}
    >
      {children ?? <CalendarViewDate />}
    </ArkCalendar.ViewTrigger>
  );
};

export const CalendarViewControl = (
  props: React.ComponentProps<typeof ArkCalendar.ViewControl>
) => {
  const { className, ...rest } = props;

  return (
    <ArkCalendar.ViewControl
      className={cn(
        "relative",
        "h-auto w-full",
        "flex items-center gap-1.5",
        className
      )}
      data-slot="calendar-view-control"
      {...rest}
    />
  );
};

export const CalendarPrevTrigger = (
  props: React.ComponentProps<typeof ArkCalendar.PrevTrigger>
) => (
  <ArkCalendar.PrevTrigger data-slot="calendar-prev-trigger" {...props} asChild>
    <Button aria-label="Previous" className="me-auto" size="icon" variant="ghost">
      <ChevronLeftIcon aria-hidden className="rtl:rotate-180" />
    </Button>
  </ArkCalendar.PrevTrigger>
);

export const CalendarNextTrigger = (
  props: React.ComponentProps<typeof ArkCalendar.NextTrigger>
) => (
  <ArkCalendar.NextTrigger data-slot="calendar-next-trigger" {...props} asChild>
    <Button aria-label="Next" className="ms-auto" size="icon" variant="ghost">
      <ChevronRightIcon aria-hidden className="rtl:rotate-180" />
    </Button>
  </ArkCalendar.NextTrigger>
);

export const CalendarTable = (
  props: React.ComponentProps<typeof ArkCalendar.Table>
) => {
  const { className, ...rest } = props;

  return (
    <ArkCalendar.Table
      className={cn("group", "w-full min-w-60", "border-collapse", className)}
      data-slot="calendar-table"
      {...rest}
    />
  );
};

interface CalendarWeekDaysProps
  extends React.ComponentProps<typeof ArkCalendar.TableHead> {
  /**
   * Weekday label width. `short` is two letters (`Su`), matching the other
   * calendar bases, or the whole short name where two letters would repeat
   * (Arabic and Hebrew short names share their first two).
   *
   * @default 'short'
   */
  format?: "narrow" | "short" | "long";
}

/** A weekday's header label in the given format (see `CalendarWeekDaysProps`). */
const weekDayLabel = (
  weekDays: { short: string }[],
  weekDay: { long: string; narrow: string; short: string },
  format: "narrow" | "short" | "long"
) => {
  if (format !== "short") {
    return weekDay[format];
  }
  const initials = new Set(weekDays.map((day) => day.short.slice(0, 2)));

  return initials.size === weekDays.length
    ? weekDay.short.slice(0, 2)
    : weekDay.short;
};

export const CalendarWeekDays = (props: CalendarWeekDaysProps) => {
  const { format = "short", ...rest } = props;

  return (
    <CalendarContext>
      {(calendar) => (
        <CalendarTableHead data-slot="calendar-table-head" {...rest}>
          <CalendarTableRow>
            {calendar.showWeekNumbers ? (
              <CalendarWeekNumberHeaderCell>Wk</CalendarWeekNumberHeaderCell>
            ) : null}
            {calendar.weekDays.map((weekDay) => (
              <CalendarTableHeader key={weekDay.short}>
                {weekDayLabel(calendar.weekDays, weekDay, format)}
              </CalendarTableHeader>
            ))}
          </CalendarTableRow>
        </CalendarTableHead>
      )}
    </CalendarContext>
  );
};

/**
 * The days a row's week number is read from, for its text and its label.
 * zag numbers a row by the ISO week of its first day, so a row that starts on
 * Sunday would get the week ending on that Sunday. Handed the row from its
 * fourth day on, it numbers the row by its middle day, which always lies in
 * the ISO week holding most of the row.
 */
const weekNumberDays = (week: DateValue[]) => week.slice(3);

export const CalendarTableDays = (
  props: React.ComponentProps<typeof CalendarTableBody>
) => {
  const { tabIndex, ...rest } = props;
  return (
    <CalendarContext>
      {(calendar) => (
        <CalendarTableBody {...rest}>
          {calendar.weeks.map((week, index) => (
            <CalendarTableRow key={week.map((day) => day.toString()).join("-")}>
              {calendar.showWeekNumbers ? (
                <CalendarWeekNumberCell
                  week={weekNumberDays(week)}
                  weekIndex={index}
                >
                  {calendar.getWeekNumber(weekNumberDays(week))}
                </CalendarWeekNumberCell>
              ) : null}
              {week.map((day) => (
                <CalendarTableCell
                  key={day.toString()}
                  tabIndex={tabIndex ?? undefined}
                  value={day}
                >
                  {day.day}
                </CalendarTableCell>
              ))}
            </CalendarTableRow>
          ))}
        </CalendarTableBody>
      )}
    </CalendarContext>
  );
};

interface CalendarTableNextMonthProps
  extends React.ComponentProps<typeof CalendarTableBody> {
  /**
   * The number of months to offset
   *
   * @default 1
   */
  months?: number;
}

export const CalendarTableNextMonth = (props: CalendarTableNextMonthProps) => {
  const { months = 1, tabIndex, ...rest } = props;

  return (
    <CalendarContext>
      {(calendar) => {
        const offset = calendar.getOffset({ months });

        return (
          <CalendarTableBody {...rest}>
            {offset.weeks.map((week) => (
              <CalendarTableRow
                key={week.map((day) => day.toString()).join("-")}
              >
                {week.map((day) => (
                  <CalendarTableCell
                    key={day.toString()}
                    tabIndex={tabIndex ?? undefined}
                    value={day}
                    visibleRange={offset.visibleRange}
                  >
                    {day.day}
                  </CalendarTableCell>
                ))}
              </CalendarTableRow>
            ))}
          </CalendarTableBody>
        );
      }}
    </CalendarContext>
  );
};

export const CalendarTableHead = (
  props: React.ComponentProps<typeof ArkCalendar.TableHead>
) => <ArkCalendar.TableHead data-slot="calendar-table-head" {...props} />;

export const CalendarTableRow = (
  props: React.ComponentProps<typeof ArkCalendar.TableRow>
) => {
  const { className, ...rest } = props;
  return (
    <ArkCalendar.TableRow
      className={cn("mt-2 flex w-full", className)}
      data-slot="calendar-table-row"
      {...rest}
    />
  );
};

export const CalendarTableHeader = (
  props: React.ComponentProps<typeof ArkCalendar.TableHeader>
) => {
  const { className, ...rest } = props;

  return (
    <ArkCalendar.TableHeader
      className={cn(
        "flex h-(--cell-size) w-full items-center justify-center",
        "select-none rounded-(--cell-radius) font-normal text-[0.8rem] text-muted-foreground",
        className
      )}
      data-slot="calendar-table-header"
      {...rest}
    />
  );
};

export const CalendarTableBody = (
  props: React.ComponentProps<typeof ArkCalendar.TableBody>
) => <ArkCalendar.TableBody data-slot="calendar-table-body" {...props} />;

// The cell's own props go to the cell; the rest (`className`, `ref`…) to the
// day button it renders.
type CalendarTableCellProps = Pick<
  React.ComponentProps<typeof ArkCalendar.TableCell>,
  "disabled" | "value" | "visibleRange"
> &
  React.ComponentProps<typeof ArkCalendar.TableCellTrigger>;

export const CalendarTableCell = (props: CalendarTableCellProps) => {
  const { value, visibleRange, disabled, className, onKeyDown, ...rest } =
    props;

  // Each cell is a `role="button"` div, and zag's grid selects on Enter
  // only: Space presses it the way a click does, as on a button.
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    if (event.key !== " " || event.defaultPrevented) {
      return;
    }
    event.preventDefault();
    event.currentTarget.click();
  };

  return (
    <ArkCalendar.TableCell
      className={cn(
        "group/day relative",
        "h-(--cell-size) w-full",
        "select-none text-center",
        "[&:first-child[aria-selected=true]_button]:rounded-l-(--cell-radius)",
        "[&:last-child[aria-selected=true]_button]:rounded-r-(--cell-radius)"
      )}
      data-slot="calendar-table-cell"
      disabled={disabled}
      value={value}
      visibleRange={visibleRange}
    >
      <ArkCalendar.TableCellTrigger
        className={cn(
          "relative isolate z-10 flex aspect-square size-auto w-full min-w-(--cell-size) flex-col gap-1 border-0 font-normal leading-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 data-focus:relative data-focus:z-10 data-in-range:rounded-none data-range-end:rounded-(--cell-radius) data-range-start:rounded-(--cell-radius) data-range-end:rounded-r-(--cell-radius) data-range-start:rounded-l-(--cell-radius) data-in-range:bg-muted data-range-end:bg-primary data-range-start:bg-primary data-in-range:text-foreground data-outside-range:text-muted-foreground data-range-end:text-primary-foreground data-range-start:text-primary-foreground dark:hover:text-foreground [&>span]:text-xs [&>span]:opacity-70 [&[data-selected]]:bg-primary [&[data-selected]]:text-primary-foreground [&[data-today]:not([data-selected])]:bg-muted [&[data-today]:not([data-selected])]:text-foreground",
          "inline-flex select-none items-center justify-center outline-none",
          "data-disabled:pointer-events-none data-disabled:opacity-50",
          "data-unavailable:pointer-events-none data-unavailable:line-through data-unavailable:opacity-50",
          className
        )}
        data-slot="calendar-table-cell-trigger"
        onKeyDown={handleKeyDown}
        {...rest}
      />
    </ArkCalendar.TableCell>
  );
};

export const CalendarWeekNumberHeaderCell = (
  props: React.ComponentProps<typeof ArkCalendar.WeekNumberHeaderCell>
) => {
  const { className, ...rest } = props;

  return (
    <ArkCalendar.WeekNumberHeaderCell
      className={cn(
        "h-(--cell-size) w-full min-w-(--cell-size)",
        "flex items-center justify-center",
        "select-none font-medium text-muted-foreground/64 text-xs",
        className
      )}
      data-slot="calendar-week-number-header-cell"
      {...rest}
    />
  );
};

export const CalendarWeekNumberCell = (
  props: React.ComponentProps<typeof ArkCalendar.WeekNumberCell>
) => {
  const { className, ...rest } = props;

  return (
    <ArkCalendar.WeekNumberCell
      className={cn(
        "h-(--cell-size) w-full min-w-(--cell-size)",
        "flex items-center justify-center",
        "select-none text-muted-foreground text-xs",
        className
      )}
      data-slot="calendar-week-number-cell"
      {...rest}
    />
  );
};

interface CalendarTableMonthsProps
  extends React.ComponentProps<typeof CalendarTableBody> {
  /** How many months each row holds. */
  columns?: number;
  /** How month names are written: `short` (`Jan`) or `long` (`January`). */
  format?: "short" | "long";
}

// Day cells are square; in the 4-column month and year grids that makes boxes
// as wide as a quarter of the calendar, so these cells are one row tall instead.
const pickerCellClassName = "aspect-auto h-(--cell-size) rounded-(--cell-radius)";

export const CalendarTableMonths = (props: CalendarTableMonthsProps) => {
  const { columns = 4, format = "short", ...rest } = props;

  return (
    <CalendarContext>
      {(calendar) => (
        <CalendarTableBody {...rest}>
          {calendar.getMonthsGrid({ columns, format }).map((months) => (
            <CalendarTableRow
              key={months.map((month) => month.value).join("-")}
            >
              {months.map((month) => (
                <CalendarTableCell
                  className={pickerCellClassName}
                  key={month.value}
                  value={month.value}
                >
                  {month.label}
                </CalendarTableCell>
              ))}
            </CalendarTableRow>
          ))}
        </CalendarTableBody>
      )}
    </CalendarContext>
  );
};

interface CalendarTableYearsProps
  extends React.ComponentProps<typeof CalendarTableBody> {
  /** How many years each row holds. */
  columns?: number;
}

export const CalendarTableYears = (props: CalendarTableYearsProps) => {
  const { columns = 4, ...rest } = props;

  return (
    <CalendarContext>
      {(calendar) => (
        <CalendarTableBody {...rest}>
          {calendar.getYearsGrid({ columns }).map((years) => (
            <CalendarTableRow key={years.map((year) => year.value).join("-")}>
              {years.map((year) => (
                <CalendarTableCell
                  className={pickerCellClassName}
                  key={year.value}
                  value={year.value}
                >
                  {year.label}
                </CalendarTableCell>
              ))}
            </CalendarTableRow>
          ))}
        </CalendarTableBody>
      )}
    </CalendarContext>
  );
};
