import React from "react";
import {
  Box,
  FormControl,
  InputLabel,
  IconButton,
  TextField,
  Popover,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import GroupsIcon from "@mui/icons-material/Groups";

interface ReservationPassengersProps {
  value: number;
  onChange: (value: number) => void;
}

const ReservationPassengers: React.FC<ReservationPassengersProps> = ({
  value,
  onChange,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const MIN_PASSENGERS = 1;
  const MAX_PASSENGERS = 20;

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleIncrement = () => {
    if (value < MAX_PASSENGERS) {
      onChange(value + 1);
    }
  };

  const handleDecrement = () => {
    if (value > MIN_PASSENGERS) {
      onChange(value - 1);
    }
  };

  const open = Boolean(anchorEl);

  return (
    <Box sx={{ minWidth: 200 }}>
      <FormControl fullWidth>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
          <GroupsIcon sx={{ color: "text.secondary" }} />
          <InputLabel
            shrink={false}
            sx={{
              position: "relative",
              transform: "none",
              color: "text.primary",
            }}
          >
            Passengers
          </InputLabel>
        </Box>
        <TextField
          value={`${value} Passenger${value > 1 ? "s" : ""}`}
          onClick={handleClick}
          variant="outlined"
          InputProps={{
            readOnly: true,
          }}
          fullWidth
        />
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
          PaperProps={{
            sx: {
              p: 2,
              width: "200px",
              boxSizing: "border-box",
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 1,
            }}
          >
            <IconButton
              onClick={handleDecrement}
              disabled={value <= MIN_PASSENGERS}
              size="small"
            >
              <RemoveIcon fontSize="small" />
            </IconButton>
            <TextField
              value={value}
              inputProps={{
                style: { textAlign: "center" },
                readOnly: true,
              }}
              sx={{ width: "60px" }}
            />
            <IconButton
              onClick={handleIncrement}
              disabled={value >= MAX_PASSENGERS}
              size="small"
            >
              <AddIcon fontSize="small" />
            </IconButton>
          </Box>
          <Typography
            variant="caption"
            sx={{
              mt: 1,
              display: "block",
              textAlign: "center",
              color: "text.secondary",
            }}
          >
            Maximum {MAX_PASSENGERS} passengers
          </Typography>
        </Popover>
      </FormControl>
    </Box>
  );
};

export default ReservationPassengers;
