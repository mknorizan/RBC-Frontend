import React from "react";
import { Box, FormControl, InputLabel } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

interface ReservationDatePickerProps {
  value: string;
  onChange: (value: string) => void;
}

const ReservationDatePicker: React.FC<ReservationDatePickerProps> = ({
  value,
  onChange,
}) => {
  const [selectedDate, setSelectedDate] = React.useState<Dayjs | null>(
    value ? dayjs(value) : null
  );

  const handleDateChange = (newValue: Dayjs | null) => {
    if (newValue) {
      setSelectedDate(newValue);
      onChange(newValue.format("YYYY-MM-DD"));
    }
  };

  // Disable past dates and dates more than 3 months ahead
  const disableDates = (date: Dayjs) => {
    const today = dayjs();
    const threeMonthsFromNow = today.add(3, "month");
    return (
      date.isBefore(today, "day") || date.isAfter(threeMonthsFromNow, "day")
    );
  };

  return (
    <Box sx={{ minWidth: 200 }}>
      <FormControl fullWidth>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
          <CalendarMonthIcon sx={{ color: "text.secondary" }} />
          <InputLabel
            shrink={false}
            sx={{
              position: "relative",
              transform: "none",
              color: "text.primary",
            }}
          >
            Booking Date
          </InputLabel>
        </Box>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            value={selectedDate}
            onChange={handleDateChange}
            shouldDisableDate={disableDates}
            format="DD/MM/YYYY"
            slotProps={{
              textField: {
                fullWidth: true,
                variant: "outlined",
                placeholder: "Select a date",
              },
            }}
          />
        </LocalizationProvider>
      </FormControl>
    </Box>
  );
};

export default ReservationDatePicker;
