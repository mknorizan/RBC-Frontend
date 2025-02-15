import React from "react";
import { TextField } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

interface AlternativeDatePickerProps {
  value: string;
  onChange: (value: string) => void;
  mainBookingDate: string;
  label: string;
}

const AlternativeDatePicker: React.FC<AlternativeDatePickerProps> = ({
  value,
  onChange,
  mainBookingDate,
  label,
}) => {
  const handleDateChange = (date: dayjs.Dayjs | null) => {
    if (date) {
      onChange(date.format("YYYY-MM-DD"));
    } else {
      onChange("");
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label={label}
        value={value ? dayjs(value) : null}
        onChange={handleDateChange}
        minDate={mainBookingDate ? dayjs(mainBookingDate) : undefined}
        format="DD/MM/YYYY"
        slotProps={{
          textField: {
            fullWidth: true,
            variant: "outlined",
          },
        }}
      />
    </LocalizationProvider>
  );
};

export default AlternativeDatePicker;
