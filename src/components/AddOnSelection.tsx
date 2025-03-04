import React, { useState, useEffect } from "react";
import {
  FormGroup,
  FormControlLabel,
  Checkbox,
  Typography,
  Box,
} from "@mui/material";
import { API_CONFIG, getApiUrl } from "../config/api";

interface AddOn {
  id: number;
  name: string;
  description: string;
  price: number;
  isActive: boolean;
  perPerson: boolean;
}

interface AddOnSelectionProps {
  selectedAddOns: string[];
  onAddOnChange: (addOnId: string) => void;
  passengers: number;
}

const AddOnSelection: React.FC<AddOnSelectionProps> = ({
  selectedAddOns,
  onAddOnChange,
  passengers,
}) => {
  const [addOns, setAddOns] = useState<AddOn[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAddOns = async () => {
      try {
        const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.ADD_ONS));
        if (!response.ok) {
          throw new Error("Failed to fetch add-ons");
        }
        const data = await response.json();
        setAddOns(data);
      } catch (error) {
        console.error("Error fetching add-ons:", error);
        setError("Failed to load add-ons");
      }
    };

    fetchAddOns();
  }, []);

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  const getAddOnPriceLabel = (addon: AddOn) => {
    return `${addon.name}${addon.perPerson ? ' (RM10/pax)' : ' (RM10)'}`;
  };

  return (
    <Box>
      <Typography variant="subtitle1" sx={{ mb: 2 }}>
        Add-ons
      </Typography>
      <FormGroup>
        {[...addOns]
          .sort((a, b) => {
            // Sort by perPerson (false comes first)
            if (a.perPerson !== b.perPerson) {
              return a.perPerson ? 1 : -1;
            }
            // If both have same perPerson value, sort by name
            return a.name.localeCompare(b.name);
          })
          .map((addon) => (
            <FormControlLabel
              key={addon.id}
              control={
                <Checkbox
                  checked={selectedAddOns.includes(addon.id.toString())}
                  onChange={() => onAddOnChange(addon.id.toString())}
                />
              }
              label={getAddOnPriceLabel(addon)}
            />
          ))}
      </FormGroup>
    </Box>
  );
};

export default AddOnSelection;
