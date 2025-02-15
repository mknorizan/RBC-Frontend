import React, { useState, useEffect } from "react";
import { FormControl, InputLabel, Select, MenuItem, Box } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";

interface JettyPoint {
  id: number;
  name: string;
  isActive: boolean;
}

interface ReservationJettyPointProps {
  value: string;
  onChange: (value: string) => void;
}

const ReservationJettyPoint: React.FC<ReservationJettyPointProps> = ({
  value,
  onChange,
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

  return (
    <Box sx={{ minWidth: 200 }}>
      <FormControl fullWidth>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
          <LocationOnIcon sx={{ color: "text.secondary" }} />
          <InputLabel
            shrink={false}
            sx={{
              position: "relative",
              transform: "none",
              color: "text.primary",
            }}
          >
            Jetty Point
          </InputLabel>
        </Box>
        <Select
          value={value}
          onChange={(e) => onChange(e.target.value as string)}
          disabled={loading}
          variant="outlined"
          displayEmpty
        >
          <MenuItem value="" disabled>
            Select a jetty point
          </MenuItem>
          {jettyPoints.map((point) => (
            <MenuItem key={point.id} value={point.id.toString()}>
              {point.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default ReservationJettyPoint;
