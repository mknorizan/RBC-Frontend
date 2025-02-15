import React, { useState, useEffect } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";

interface Package {
  id: number;
  name: string;
  description: string;
  basePrice: number;
  maxCapacity: number;
  duration: number;
  isActive: boolean;
  categoryId: number;
}

interface PackageDropdownProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  categoryId: number;
}

const PackageDropdown: React.FC<PackageDropdownProps> = ({
  value,
  onChange,
  error,
  categoryId,
}) => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/packages/category/${categoryId}`
        );
        const text = await response.text();
        if (text.trim() === "") {
          console.log("Empty response received");
          return;
        }
        const data = JSON.parse(text);
        if (Array.isArray(data)) {
          setPackages(data);
        }
      } catch (error) {
        console.error("Error fetching packages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, [categoryId]);

  return (
    <FormControl fullWidth error={!!error}>
      <InputLabel>Package</InputLabel>
      <Select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        label="Package"
        disabled={loading}
      >
        {packages.map((pkg) => (
          <MenuItem key={pkg.id} value={pkg.id.toString()}>
            {pkg.name}
          </MenuItem>
        ))}
      </Select>
      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );
};

export default PackageDropdown;
