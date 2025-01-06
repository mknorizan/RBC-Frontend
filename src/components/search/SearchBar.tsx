import React, { useState } from "react";
import {
  Paper,
  IconButton,
  Box,
  Divider,
  Typography,
  Select,
  MenuItem,
  Popover,
  Button,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import SearchIcon from "@mui/icons-material/Search";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import DateRangeIcon from "@mui/icons-material/DateRange";
import PersonIcon from "@mui/icons-material/Person";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [passengers, setPassengers] = useState<number>(0);
  const [location, setLocation] = useState("rhumuda");
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  // Calculate min and max dates
  const tomorrow = dayjs().add(1, "day");
  const maxDate = dayjs().add(3, "months");

  const jettyLocations = ["Rhumuda", "Kuala Terengganu"]; // Exact match with InquiryPage

  const handlePassengerClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handlePassengerChange = (newValue: string) => {
    const numValue = parseInt(newValue);
    if (!isNaN(numValue) && numValue >= 0 && numValue <= 20) {
      setPassengers(numValue);
    }
  };

  const incrementPassengers = () => {
    if (passengers < 20) {
      setPassengers((prev) => prev + 1);
    }
  };

  const decrementPassengers = () => {
    if (passengers > 0) {
      setPassengers((prev) => prev - 1);
    }
  };

  const open = Boolean(anchorEl);

  const handleSearch = () => {
    // Format the jetty point to match exactly
    const formattedJettyPoint = jettyLocations.find(
      (location) => location.toLowerCase() === location.toLowerCase()
    );

    if (formattedJettyPoint) {
      navigate("/inquiry", {
        state: {
          jettyPoint: formattedJettyPoint, // Use the correctly formatted value
          bookingDate: selectedDate?.format("DD/MM/YYYY"),
          passengers: Number(passengers),
        },
      });
    }
  };

  return (
    <Paper
      component="form"
      sx={{
        p: "2px",
        display: "flex",
        alignItems: "center",
        width: "100%",
        maxWidth: 800,
        borderRadius: "50px",
        border: "2px solid #000000",
        boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
        height: "70px",
      }}
    >
      {/* Jetty Point */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          px: 2,
          height: "100%",
          justifyContent: "center",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <LocationOnIcon sx={{ color: "#000000" }} />
          <Typography
            variant="subtitle2"
            sx={{
              ml: 1,
              color: "#000000",
              fontWeight: 500,
            }}
          >
            Jetty point
          </Typography>
        </Box>
        <Select
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          variant="standard"
          sx={{
            "&:before": { display: "none" },
            "&:after": { display: "none" },
            "& .MuiSelect-select": {
              py: 0,
              fontSize: "1.1rem",
            },
          }}
        >
          <MenuItem value="kuala-terengganu">Kuala Terengganu</MenuItem>
          <MenuItem value="rhumuda">Rhumuda</MenuItem>
        </Select>
      </Box>

      <Divider
        orientation="vertical"
        flexItem
        sx={{
          height: "55%",
          borderColor: "#000000",
          my: "auto",
          mx: 1,
        }}
      />

      {/* Booking Date */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          px: 2,
          height: "100%",
          justifyContent: "center",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <DateRangeIcon sx={{ color: "#000000" }} />
          <Typography
            variant="subtitle2"
            sx={{
              ml: 1,
              color: "#000000",
              fontWeight: 500,
            }}
          >
            Booking date
          </Typography>
        </Box>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            value={selectedDate}
            onChange={(newValue) => setSelectedDate(newValue)}
            minDate={tomorrow}
            maxDate={maxDate}
            format="DD/MM/YYYY"
            slotProps={{
              textField: {
                variant: "standard",
                placeholder: "Add dates",
                sx: {
                  "& .MuiInputBase-input": {
                    fontSize: "1.1rem",
                    padding: "0",
                  },
                  "& .MuiInput-underline:before": {
                    borderBottom: "none",
                  },
                  "& .MuiInput-underline:hover:before": {
                    borderBottom: "none",
                  },
                  "& .MuiInput-underline:after": {
                    borderBottom: "none",
                  },
                },
              },
            }}
          />
        </LocalizationProvider>
      </Box>

      <Divider
        orientation="vertical"
        flexItem
        sx={{
          height: "55%",
          borderColor: "#000000",
          my: "auto",
          mx: 1,
        }}
      />

      {/* Passengers */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          px: 2,
          height: "100%",
          justifyContent: "center",
          cursor: "pointer",
        }}
        onClick={handlePassengerClick}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <PersonIcon sx={{ color: "#000000" }} />
          <Typography
            variant="subtitle2"
            sx={{
              ml: 1,
              color: "#000000",
              fontWeight: 500,
            }}
          >
            Passengers
          </Typography>
        </Box>
        <Typography sx={{ fontSize: "1.1rem" }}>
          {passengers === 0 ? "Add passengers" : `${passengers} passengers`}
        </Typography>
      </Box>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        sx={{
          "& .MuiPopover-paper": {
            width: "300px",
            p: 2,
            mt: 1,
          },
        }}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>
          Group Size
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
          }}
        >
          <IconButton
            onClick={decrementPassengers}
            disabled={passengers <= 0}
            sx={{
              border: "1px solid",
              borderColor: passengers <= 0 ? "grey.300" : "grey.500",
              borderRadius: "50%",
            }}
          >
            <Typography variant="h6">-</Typography>
          </IconButton>

          <input
            type="text"
            value={passengers}
            onChange={(e) => handlePassengerChange(e.target.value)}
            style={{
              width: "60px",
              height: "40px",
              textAlign: "center",
              fontSize: "1.1rem",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />

          <IconButton
            onClick={incrementPassengers}
            disabled={passengers >= 20}
            sx={{
              border: "1px solid",
              borderColor: passengers >= 20 ? "grey.300" : "grey.500",
              borderRadius: "50%",
            }}
          >
            <Typography variant="h6">+</Typography>
          </IconButton>
        </Box>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 2, textAlign: "center" }}
        >
          Maximum 20 passengers allowed
        </Typography>
      </Popover>

      <IconButton
        onClick={handleSearch}
        type="button"
        sx={{
          p: "16px",
          bgcolor: "#0384BD",
          borderRadius: "50%",
          mr: "6px",
          "&:hover": {
            bgcolor: "#026890",
          },
          height: "56px",
          width: "56px",
        }}
      >
        <SearchIcon sx={{ color: "white", fontSize: "1.8rem" }} />
      </IconButton>
    </Paper>
  );
};

export default SearchBar;
