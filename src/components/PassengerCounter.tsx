import React, { useState } from "react";
import {
  Box,
  IconButton,
  TextField,
  FormControl,
  Popover,
  Typography,
  InputLabel,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import PersonIcon from "@mui/icons-material/Person";

interface PassengerCounterProps {
  value: number;
  onChange: (value: number) => void;
  isCompact?: boolean;
}

const PassengerCounter: React.FC<PassengerCounterProps> = ({
  value,
  onChange,
  isCompact = false,
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
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
          <PersonIcon
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
            Passengers
          </InputLabel>
        </Box>
        <TextField
          value={`${value} Passenger${value > 1 ? "s" : ""}`}
          onClick={handleClick}
          variant="standard"
          InputProps={{
            readOnly: true,
          }}
          sx={{
            minWidth: isCompact ? 150 : 200,
            cursor: "pointer",
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
          }}
        />
        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          PaperProps={{
            sx: {
              p: isCompact ? 1.5 : 2,
              width: isCompact ? 180 : 200,
              "& .MuiTypography-root": {
                fontSize: isCompact ? "0.75rem" : "0.875rem",
              },
              "& .MuiIconButton-root": {
                padding: isCompact ? 0.5 : 1,
              },
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

export default PassengerCounter;
