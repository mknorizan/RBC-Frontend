import React from "react";
import { Box, TextField, InputLabel, FormControl } from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";

interface BookingDatePickerProps {
  value: string;
  onChange: (value: string) => void;
  isCompact?: boolean;
}

const BookingDatePicker: React.FC<BookingDatePickerProps> = ({
  value,
  onChange,
  isCompact = false,
}) => {
  const minDate = dayjs().add(1, "day");
  const maxDate = dayjs().add(3, "month");

  return (
    <Box
      sx={{
        minWidth: isCompact ? 150 : 200,
        transition: "all 0.3s ease-in-out",
      }}
    >
      <FormControl fullWidth>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: isCompact ? 0.5 : 1,
            mb: isCompact ? 0 : 0.25,
          }}
        >
          <CalendarTodayIcon
            sx={{
              fontSize: isCompact ? "1rem" : "1.2rem",
              color: "black",
              transition: "all 0.3s ease-in-out",
            }}
          />
          <InputLabel
            shrink={false}
            sx={{
              position: "relative",
              transform: "none",
              color: "text.primary",
              fontSize: isCompact ? "0.75rem" : "1rem",
              transition: "all 0.3s ease-in-out",
              whiteSpace: "nowrap",
            }}
          >
            Date
          </InputLabel>
        </Box>
        <DatePicker
          value={value ? dayjs(value) : null}
          onChange={(newValue) => {
            // Keep the backend format as YYYY-MM-DD
            onChange(newValue ? newValue.format("YYYY-MM-DD") : "");
          }}
          minDate={minDate}
          maxDate={maxDate}
          format="DD/MM/YYYY" // Display format for the user
          slotProps={{
            textField: {
              variant: "standard",
              sx: {
                minWidth: isCompact ? 150 : 200,
                transition: "all 0.3s ease-in-out",
                "& .MuiInput-underline:before": {
                  borderBottom: "none"
                },
                "& .MuiInput-underline:after": {
                  borderBottom: "none"
                },
                "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
                  borderBottom: "none"
                },
                "& .MuiInput-input": {
                  fontSize: isCompact ? "0.875rem" : "1rem",
                  py: isCompact ? 0.25 : 1,
                  transition: "all 0.3s ease-in-out",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                },
                "& .MuiInput-root": {
                  "&:before, &:after": {
                    borderBottomWidth: isCompact ? "0.5px" : "1px",
                  },
                },
              },
            },
            popper: {
              sx: {
                "& .MuiPickersDay-root": {
                  fontSize: isCompact ? "0.875rem" : "1rem",
                },
                "& .MuiTypography-root": {
                  fontSize: isCompact ? "0.875rem" : "1rem",
                },
              },
            },
          }}
        />
      </FormControl>
    </Box>
  );
};

export default BookingDatePicker;
