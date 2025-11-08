import { useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import { CalendarIcon } from "lucide-react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import dayjs from "dayjs";

type Props = {
  value?: string; // YYYY-MM-DD
  onSelect?: (dateString: string) => void;
};

export default function CalendarSelect({ value, onSelect }: Props) {
  const initial = value ? new Date(value) : new Date();
  const [date, setDate] = useState<Date>(initial);
  const [open, setOpen] = useState(false);

  function handleSelect(d: Date | undefined) {
    if (!d) return;
    setDate(d);
    const iso = dayjs(d).format("YYYY-MM-DD");
    if (onSelect) onSelect(iso);
    // close the popover
    setOpen(false);
  }

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button className="calendar-trigger" aria-label="Select date">
          <CalendarIcon className="calendar-icon" />
          {dayjs(date).isSame(dayjs(), "day") ? "Today" : dayjs(date).format("dddd, MMM D")}
        </button>
      </Popover.Trigger>

      <Popover.Content sideOffset={6} className="calendar-popover">
        <div className="calendar-popover-header">Schedule exact start date</div>
        <DayPicker mode="single" required selected={date} onSelect={handleSelect} weekStartsOn={1} />
      </Popover.Content>
    </Popover.Root>
  );
}
