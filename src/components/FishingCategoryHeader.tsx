import React from "react";
import { Typography } from "@mui/material";

interface FishingCategoryHeaderProps {
  type: "DEEP_SEA" | "SQUID";
}

const FishingCategoryHeader: React.FC<FishingCategoryHeaderProps> = ({
  type,
}) => {
  return (
    <Typography
      variant="h6"
      sx={{
        color: "#0384BD",
        fontSize: "1.1rem",
        fontWeight: 500,
        mb: 2,
        mt: type === "DEEP_SEA" ? 0 : 4,
      }}
    >
      {type === "DEEP_SEA"
        ? "Deep Sea Fishing Packages"
        : "Squid Fishing Packages"}
    </Typography>
  );
};

export default FishingCategoryHeader;
