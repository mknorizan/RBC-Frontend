import React from "react";
import { Box, IconButton, Container } from "@mui/material";
import fishingIcon from "../../assets/icons/fishing_color.png";
import islandIcon from "../../assets/icons/island_color.png";
import boatIcon from "../../assets/icons/boat_color.png";

interface CharterTypeSelectorProps {
  selectedType: "recreation" | "fishing" | "boat";
  onTypeChange: (type: "recreation" | "fishing" | "boat") => void;
}

const CharterTypeSelector = ({
  selectedType,
  onTypeChange,
}: CharterTypeSelectorProps) => {
  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-start",
          gap: 2,
          mb: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            borderBottom:
              selectedType === "boat" ? "2px solid #4CAF50" : "none",
            pb: 0.1,
          }}
        >
          <IconButton
            onClick={() => onTypeChange("boat")}
            sx={{
              width: 90,
              height: 90,
              p: 0.25,
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: "transparent",
                transform: "scale(1.05)",
              },
            }}
          >
            <img
              src={boatIcon}
              alt="Boat Charter"
              style={{
                width: "80px",
                height: "80px",
                objectFit: "contain",
              }}
            />
          </IconButton>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            borderBottom:
              selectedType === "recreation" ? "2px solid #4CAF50" : "none",
            pb: 0.1,
          }}
        >
          <IconButton
            onClick={() => onTypeChange("recreation")}
            sx={{
              width: 90,
              height: 90,
              p: 0.25,
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: "transparent",
                transform: "scale(1.05)",
              },
            }}
          >
            <img
              src={islandIcon}
              alt="Recreation"
              style={{
                width: "80px",
                height: "80px",
                objectFit: "contain",
              }}
            />
          </IconButton>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            borderBottom:
              selectedType === "fishing" ? "2px solid #4CAF50" : "none",
            pb: 0.1,
          }}
        >
          <IconButton
            onClick={() => onTypeChange("fishing")}
            sx={{
              width: 90,
              height: 90,
              p: 0.25,
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: "transparent",
                transform: "scale(1.05)",
              },
            }}
          >
            <img
              src={fishingIcon}
              alt="Fishing"
              style={{
                width: "80px",
                height: "80px",
                objectFit: "contain",
              }}
            />
          </IconButton>
        </Box>
      </Box>
    </Container>
  );
};

export default CharterTypeSelector;
