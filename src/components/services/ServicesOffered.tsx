import React from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import yachtIcon from "../../assets/icons/yatch.png";
import summerIcon from "../../assets/icons/summer-holidays.png";
import fishingIcon from "../../assets/icons/fishing.png";
import boatIcon from "../../assets/icons/boat2.png";

const services = [
  {
    name: "Private Boat",
    icon: yachtIcon,
    content:
      "Experience the serenity of the open waters with our private boat rentals. Explore hidden coves, fish, or simply cruise. Our modern boats prioritize safety and an exciting journey.",
  },
  {
    name: "Island Day Trip",
    icon: summerIcon,
    content:
      "Escape city life with our serene island day trips to Pulau Kapas. Enjoy crystal-clear waters, pristine beaches, and vibrant marine life. Snorkel, swim, or relax – our experienced crew will guide you",
  },
  {
    name: "Fishing",
    icon: fishingIcon,
    content:
      "Thrill-seeking fishing with us. Expert guides, prime spots, all skill levels welcome. Inshore, offshore, night fishing options",
  },
  {
    name: "Round Island",
    icon: boatIcon,
    content:
      "Explore the island's beauty on our Round-Island Excursion. Discover breathtaking views, hidden beaches, and stunning landscapes. Experience wonder and tranquility",
  },
];

const ServicesOffered = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ width: "100%", my: 8 }}>
      <Typography
        variant="h4"
        component="h2"
        align="center"
        sx={{
          mb: 6,
          fontFamily: "Playfair Display, serif",
        }}
      >
        Services Offered
      </Typography>

      <Grid container spacing={4} sx={{ mb: 4 }}>
        {services.map((service) => (
          <Grid item xs={12} sm={6} md={3} key={service.name}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                borderRadius: "16px",
                boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)",
                transition: "transform 0.2s ease-in-out",
                "&:hover": {
                  transform: "translateY(-4px)",
                },
              }}
            >
              <CardContent sx={{ flexGrow: 1, textAlign: "center" }}>
                <Box
                  component="img"
                  src={service.icon}
                  alt={service.name}
                  sx={{
                    width: 64,
                    height: 64,
                    mb: 2,
                    objectFit: "contain",
                  }}
                />
                <Typography
                  gutterBottom
                  variant="h6"
                  component="h3"
                  sx={{
                    fontWeight: 600,
                    mb: 2,
                  }}
                >
                  {service.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {service.content}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/services/private-boat")}
          sx={{
            px: 4,
            py: 1.5,
            borderRadius: "25px",
            textTransform: "none",
            fontSize: "1rem",
          }}
        >
          Learn more about our services
        </Button>
      </Box>
    </Box>
  );
};

export default ServicesOffered;
