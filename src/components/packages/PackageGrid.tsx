import React from "react";
import { Grid, Container, Typography, Box } from "@mui/material";
import PackageCard from "./PackageCard";
import { RecreationPackage, FishingPackage } from "../../types/packages";
import dayTrip2 from "../../assets/daytrip/day_trip_2.jpg";
import dayTrip3 from "../../assets/daytrip/day_trip_3.jpg";
import dayTrip6 from "../../assets/daytrip/day_trip_6.jpg";

const recreationPackages: RecreationPackage[] = [
  {
    id: "rec1",
    type: "recreation",
    title: "Package 1",
    image: dayTrip3,
    description: "Basic day trip package",
    adultPrice: 49,
    kidPrice: 35,
    duration: "4 hours",
    capacity: 8,
    services: ["Return trip", "Free Activity", "Snorkeling"],
  },
  {
    id: "rec2",
    type: "recreation",
    title: "Package 2",
    image: dayTrip6,
    description: "Standard day trip package",
    adultPrice: 59,
    kidPrice: 45,
    duration: "4 hours",
    capacity: 8,
    services: ["Return trip", "Free Activity", "Snorkeling"],
  },
  {
    id: "rec3",
    type: "recreation",
    title: "Package 3",
    image: dayTrip2,
    description: "Premium day trip package",
    adultPrice: 69,
    kidPrice: 55,
    duration: "4 hours",
    capacity: 8,
    services: ["Return trip", "Free Activity", "Snorkeling"],
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
