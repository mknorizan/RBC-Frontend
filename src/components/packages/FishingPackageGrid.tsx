import React from "react";
import { Grid, Container, Typography, Box } from "@mui/material";
import PackageCard from "./PackageCard";
import { FishingPackage } from "../../types/packages";
import boatFishing1 from "../../assets/deep-sea/boat_fishing_1.jpg";
import boatFishing2 from "../../assets/deep-sea/boat_fishing_2.jpg";
import boatFishing3 from "../../assets/deep-sea/boat_fishing_3.jpg";
import squidFishing1 from "../../assets/squid/squid_fishing_1.jpg";
import squidFishing2 from "../../assets/squid/squid_fishing_2.jpg";

const fishingPackages: FishingPackage[] = [
  {
    id: "fish1",
    type: "fishing",
    title: "Package 1",
    image: boatFishing1,
    description: "Short-range fishing experience",
    priceRange: { min: 1400, max: 1500 },
    duration: "12 hours",
    capacity: 8,
    distance: "25KM - 45KM",
    services: ["Professional Equipment", "Appolo", "Jigging", "Bottom"],
    techniques: ["Appolo", "Jigging", "Bottom"],
  },
  {
    id: "fish2",
    type: "fishing",
    title: "Package 2",
    image: boatFishing2,
    description: "Mid-range fishing adventure",
    priceRange: { min: 1700, max: 1800 },
    duration: "12 hours",
    capacity: 8,
    distance: "45KM - 75KM",
    services: ["Professional Equipment", "Appolo", "Jigging", "Bottom"],
    techniques: ["Appolo", "Jigging", "Bottom"],
  },
  {
    id: "fish3",
    type: "fishing",
    title: "Package 3",
    image: boatFishing3,
    description: "Long-range fishing expedition",
    priceRange: { min: 2000, max: 2200 },
    duration: "12 hours",
    capacity: 8,
    distance: "75KM - 110KM",
    services: ["Professional Equipment", "Appolo", "Jigging", "Bottom"],
    techniques: ["Appolo", "Jigging", "Bottom"],
  },
];

const squidPackages: FishingPackage[] = [
  {
    id: "squid1",
    type: "fishing",
    title: "Package 1",
    image: squidFishing1,
    description: "Basic squid fishing experience",
    priceRange: { min: 1400, max: 1500 },
    duration: "12 hours",
    capacity: 8,
    distance: "20KM - 30KM",
    services: ["Ice for squid storage", "Mineral waters", "Jigging"],
    techniques: ["Jigging"],
  },
  {
    id: "squid2",
    type: "fishing",
    title: "Package 2",
    image: squidFishing2,
    description: "Premium squid fishing experience",
    priceRange: { min: 1800, max: 2000 },
    duration: "12 hours",
    capacity: 8,
    distance: "20KM - 30KM",
    services: ["Ice for squid storage", "Mineral waters", "Jigging"],
    techniques: ["Jigging"],
  },
];

const FishingPackageGrid = () => {
  return (
    <Box>
      {/* Fishing Package Section */}
      <Container maxWidth="lg" sx={{ py: 2 }}>
        <Typography
          variant="h4"
          gutterBottom
          align="left"
          sx={{
            fontFamily: "Playfair Display, serif",
          }}
        >
          Deep Sea Fishing Packages
        </Typography>
        <Grid container spacing={2} sx={{ justifyContent: "flex-start" }}>
          {fishingPackages.map((pkg) => (
            <Grid item xs={12} sm={6} md={3} key={pkg.id}>
              <PackageCard package={pkg} />
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Squid Fishing Section */}
      <Container maxWidth="lg" sx={{ py: 2, mt: 4 }}>
        <Typography
          variant="h4"
          gutterBottom
          align="left"
          sx={{
            fontFamily: "Playfair Display, serif",
          }}
        >
          Squid Fishing Packages
        </Typography>
        <Grid container spacing={2} sx={{ justifyContent: "flex-start" }}>
          {squidPackages.map((pkg) => (
            <Grid item xs={12} sm={6} md={3} key={pkg.id}>
              <PackageCard package={pkg} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default FishingPackageGrid;
