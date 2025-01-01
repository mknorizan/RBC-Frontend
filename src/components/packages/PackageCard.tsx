import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Divider,
} from "@mui/material";
import { RecreationPackage, FishingPackage } from "../../types/packages";

interface PackageCardProps {
  package: RecreationPackage | FishingPackage;
}

const PackageCard = ({ package: pkg }: PackageCardProps) => {
  const renderPrice = () => {
    if (pkg.type === "recreation" || pkg.type === "boat") {
      if (pkg.privateBoatPrice) {
        return (
          <Typography align="center" sx={{ minHeight: "72px" }}>
            RM{pkg.privateBoatPrice} | Private boat
          </Typography>
        );
      }
      return (
        <Box sx={{ minHeight: "72px" }}>
          <Typography align="center">RM{pkg.adultPrice} | Adult</Typography>
          {pkg.kidPrice && (
            <Typography align="center">
              RM{pkg.kidPrice} | Kids (4-11)
            </Typography>
          )}
          <Typography align="center">FREE | Kids (0-3)</Typography>
        </Box>
      );
    }
    // This is for fishing packages
    return (
      <Box sx={{ minHeight: "72px" }}>
        <Typography align="center">
          Price from RM{pkg.priceRange.min} - RM{pkg.priceRange.max}
        </Typography>
        <Typography align="center">Rent up to {pkg.duration}</Typography>
        <Typography align="center">
          {pkg.capacity} persons max capacity
        </Typography>
      </Box>
    );
  };

  return (
    <Card
      sx={{
        height: "100%",
        minHeight: "400px",
        width: "100%",
        border: "1px solid #000",
        borderRadius: 1,
        boxShadow: "none",
        p: 2,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CardContent
        sx={{ p: 0, flex: 1, display: "flex", flexDirection: "column" }}
      >
        {/* Title */}
        <Typography
          variant="h5"
          component="h2"
          align="center"
          gutterBottom
          sx={{ fontFamily: "Playfair Display, serif" }}
        >
          {pkg.title}
        </Typography>

        {/* Image if available */}
        {pkg.image && (
          <Box sx={{ mb: 2, textAlign: "center" }}>
            <img
              src={pkg.image}
              alt={pkg.title}
              style={{
                maxWidth: "100%",
                height: "auto",
                borderRadius: "4px",
              }}
            />
          </Box>
        )}

        {/* Price Section */}
        <Box sx={{ mb: 2, textAlign: "center" }}>{renderPrice()}</Box>

        {/* Divider Line */}
        <Divider
          sx={{
            borderColor: "#000",
            borderStyle: "solid",
          }}
        />

        {/* Services Section */}
        <Box
          sx={{
            textAlign: "center",
            mt: 2,
            flex: 1,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography align="center" sx={{ mb: 1 }}>
            Service Includes:
          </Typography>
          {pkg.type === "fishing" && pkg.distance && (
            <Typography variant="body2" align="center" sx={{ mb: 1 }}>
              {pkg.distance}
            </Typography>
          )}
          {pkg.services.map((service, index) => (
            <Typography key={index} variant="body2" align="center">
              {service}
            </Typography>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

export default PackageCard;
