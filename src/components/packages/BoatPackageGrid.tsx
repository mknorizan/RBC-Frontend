import React from "react";
import { Grid, Container, Typography } from "@mui/material";
import PackageCard from "./PackageCard";
import { BoatPackage } from "../../types/packages";
import rhumudaBoat from "../../assets/boat/rhumuda_boat.jpg";
import boatCharter1 from "../../assets/boat/boat_charter_1.jpg";

const boatPackages: BoatPackage[] = [
  {
    id: "boat1",
    type: "boat",
    title: "Package 1",
    image: rhumudaBoat,
    description: "Private boat charter package",
    privateBoatPrice: 750,
    duration: "4 hours",
    capacity: 8,
    services: ["Return trip", "Free Activity", "Snorkeling"],
  },
  {
    id: "boat2",
    type: "boat",
    title: "Package 2",
    image: boatCharter1,
    description: "Group boat charter package",
    adultPrice: 49,
    kidPrice: 35,
    duration: "4 hours",
    capacity: 8,
    services: ["Return trip", "Free Activity", "Snorkeling"],
  },
];

const BoatPackageGrid = () => {
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
        Boat Charter Packages
      </Typography>
      <Grid container spacing={2}>
        {boatPackages.map((pkg) => (
          <Grid item xs={12} sm={6} md={3} key={pkg.id}>
            <PackageCard package={pkg} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default BoatPackageGrid;
