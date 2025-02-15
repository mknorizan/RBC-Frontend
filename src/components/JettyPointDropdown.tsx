import React, { useState, useEffect } from "react";
import {
  FormControl,
  TextField,
  MenuItem,
  Box,
  InputLabel,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";

interface JettyPoint {
  id: number;
  name: string;
  isActive: boolean;
}

interface JettyPointDropdownProps {
  value: string;
  onChange: (value: string) => void;
  isCompact?: boolean;
}

const JettyPointDropdown: React.FC<JettyPointDropdownProps> = ({
  value,
  onChange,
  isCompact = false,
}) => {
  const [jettyPoints, setJettyPoints] = useState<JettyPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJettyPoints();
  }, []);

  const fetchJettyPoints = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/jetty-points");
      const data = await response.json();
      setJettyPoints(data);

      // If no value is selected and Rhumuda point exists, select it
      if (!value) {
        const rhumudaPoint = data.find(
          (point: JettyPoint) => point.id === 1 && point.isActive
        );
        if (rhumudaPoint) {
          onChange(rhumudaPoint.id.toString());
        }
      }
    } catch (error) {
      console.error("Error fetching jetty points:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

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
          <LocationOnIcon
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
            Jetty Point
          </InputLabel>
        </Box>
        <TextField
          select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={loading}
          variant="standard"
          sx={{
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
          }}
        >
          <MenuItem
            value=""
            disabled
            sx={{
              fontSize: isCompact ? "0.875rem" : "1rem",
              py: isCompact ? 0.5 : 1,
            }}
          >
            Select a jetty point
          </MenuItem>
          {jettyPoints.map((point) => (
            <MenuItem
              key={point.id}
              value={point.id.toString()}
              sx={{
                fontSize: isCompact ? "0.875rem" : "1rem",
                py: isCompact ? 0.5 : 1,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {point.name}
            </MenuItem>
          ))}
        </TextField>
      </FormControl>
    </Box>
  );
};

export default JettyPointDropdown;
