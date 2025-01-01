import React from "react";
import { Grid, Container, Typography, Box } from "@mui/material";
import PackageCard from "./PackageCard";
import { RecreationPackage, FishingPackage } from "../../types/packages";

const recreationPackages: RecreationPackage[] = [
  {
    id: "rec1",
    type: "recreation",
    title: "Package 1",
    description: "Basic recreation package with essential services",
    adultPrice: 39,
    kidPrice: 25,
    duration: "4 hours",
    capacity: 8,
    services: ["Return Trip", "Free Activity"],
  },
  {
    id: "rec2",
    type: "recreation",
    title: "Package 2",
    description: "Enhanced package with snorkeling equipment",
    adultPrice: 49,
    kidPrice: 35,
    duration: "4 hours",
    capacity: 8,
    services: [
      "Return Trip",
      "Free Activity",
      "Life jacket and snorkeling equipment",
    ],
  },
  {
    id: "rec3",
    type: "recreation",
    title: "Package 3",
    description: "Complete package with guided snorkeling",
    adultPrice: 49,
    kidPrice: 35,
    duration: "4 hours",
    capacity: 8,
    services: [
      "Return Trip",
      "Free Activity",
      "Life jacket and snorkeling equipment",
      "Snorkeling Activity",
    ],
  },
  {
    id: "rec4",
    type: "recreation",
    title: "Private Boat Package",
    description: "Exclusive private boat experience",
    privateBoatPrice: 750,
    duration: "4 hours",
    capacity: 8,
    services: ["Return Trip", "Free Activity", "Snorkeling Activity"],
  },
];

const fishingPackages: FishingPackage[] = [
  {
    id: "fish1",
    type: "fishing",
    title: "Fishing Package 1",
    description: "Short-range fishing experience",
    priceRange: { min: 1400, max: 1500 },
    duration: "12 hours",
    capacity: 8,
    distance: "25KM - 45KM",
    services: ["Professional Equipment", "Experienced Guide"],
    techniques: ["Appolo", "Jigging", "Bottom"],
  },
  // Add other fishing packages...
];

interface PackageGridProps {
  type: "recreation" | "fishing";
}

const PackageGrid = ({ type }: PackageGridProps) => {
  const packages = type === "recreation" ? recreationPackages : fishingPackages;

  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      <Typography
        variant="h4"
        gutterBottom
        align="left"
        sx={{
          fontFamily: "Playfair Display, serif",
        }}
      >
        {type === "recreation"
          ? "Daytrip Package to Pulau Kapas"
          : "Fishing Packages"}
      </Typography>
      <Grid container spacing={2}>
        {packages.map((pkg) => (
          <Grid item xs={12} sm={6} md={3} key={pkg.id}>
            <PackageCard package={pkg} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default PackageGrid;
