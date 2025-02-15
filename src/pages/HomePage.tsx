import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Stack,
  CircularProgress,
  Alert,
  Grid,
  Container,
  Card,
  CardContent,
  Button,
} from "@mui/material";
import SearchBar from "../components/SearchBar/SearchBar";
import boatIcon from "../assets/icons/boat_color.png";
import islandIcon from "../assets/icons/island_color.png";
import fishingIcon from "../assets/icons/fishing_color.png";
import yachtIcon from "../assets/icons/yatch.png";
import summerIcon from "../assets/icons/summer-holidays.png";
import { Package } from "../types/package";
import PackageCard from "../components/PackageCard/PackageCard";
import FishingCategoryHeader from "../components/FishingCategoryHeader";
import { Helmet } from 'react-helmet-async';

const ServicesSection = () => {
  const services = [
    {
      icon: yachtIcon,
      title: "Private Boat",
      description:
        "Experience the serenity of the open waters with our private boat rentals. Explore hidden coves, fish, or simply cruise. Our modern boats prioritize safety and an exciting journey.",
    },
    {
      icon: summerIcon,
      title: "Island Day Trip",
      description:
        "Escape city life with our serene island day trips to Pulau Kapas. Enjoy crystal-clear waters, pristine beaches, and vibrant marine life. Snorkel, swim, or relax - our experienced crew will guide you.",
    },
    {
      icon: fishingIcon,
      title: "Fishing",
      description:
        "Thrill seeking fishing with us. Expert guides, prime spots, all skill levels welcome, inshore, offshore, night fishing options.",
    },
    {
      icon: boatIcon,
      title: "Round Island",
      description:
        "Explore the island's beauty on our Round-Island Excursion. Discover breathtaking views, hidden beaches, and stunning landscapes. Experience wonder and tranquility.",
    },
  ];

  return (
    <Container maxWidth="lg">
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{
          mb: 6,
          fontWeight: 500,
          color: "text.primary",
        }}
      >
        Services Offered
      </Typography>
      <Grid container spacing={4} sx={{ mb: 6 }}>
        {services.map((service, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              elevation={0}
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                bgcolor: "transparent",
              }}
            >
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 2,
                }}
              >
                <img
                  src={service.icon}
                  alt={service.title}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                />
              </Box>
              <CardContent sx={{ flexGrow: 1, p: 2 }}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{
                    fontWeight: 500,
                    mb: 2,
                  }}
                >
                  {service.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    lineHeight: 1.6,
                    mb: 2,
                  }}
                >
                  {service.description}
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
          href="/services"
          sx={{
            borderRadius: 28,
            px: 4,
            py: 1,
            textTransform: "none",
            fontSize: "1rem",
          }}
        >
          Learn more about our services
        </Button>
      </Box>
    </Container>
  );
};

const HomePage: React.FC = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("boat");
  const [categoryName, setCategoryName] = useState<string>("Boat Charter");

  const handleCategorySelect = async (category: string) => {
    setSelectedCategory(category);
    try {
      const response = await fetch(
        `http://localhost:8080/api/package-categories/${
          category === "boat" ? 1 : category === "island" ? 2 : 3
        }`
      );
      const data = await response.json();
      setCategoryName(data.name);
    } catch (err) {
      setError("Failed to load category name");
    }
  };

  const sortFishingPackages = (packages: Package[]) => {
    if (selectedCategory !== "fishing") return packages;

    // Sort by fishing type (Deep Sea first, then Squid)
    return [...packages].sort((a, b) => {
      if (a.fishingType === "DEEP_SEA" && b.fishingType === "SQUID") return -1;
      if (a.fishingType === "SQUID" && b.fishingType === "DEEP_SEA") return 1;
      return 0;
    });
  };

  useEffect(() => {
    const fetchPackages = async () => {
      setLoading(true);
      try {
        const categoryId =
          selectedCategory === "boat"
            ? 1
            : selectedCategory === "island"
            ? 2
            : 3;
        const response = await fetch(
          `http://localhost:8080/api/packages/category/${categoryId}`
        );
        const data = (await response.json()) as Package[];

        // Sort packages if it's fishing category
        const sortedPackages = sortFishingPackages(data);
        setPackages(sortedPackages);
      } catch (err) {
        console.error("Error details:", err);
        setError("Failed to load packages");
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, [selectedCategory]);

  const renderPackages = () => {
    if (selectedCategory === "fishing") {
      const deepSeaPackages = packages.filter(
        (pkg) => pkg.fishingType === "DEEP_SEA"
      );
      const squidPackages = packages.filter(
        (pkg) => pkg.fishingType === "SQUID"
      );

      return (
        <Box sx={{ width: "100%" }}>
          {deepSeaPackages.length > 0 && (
            <Box>
              <FishingCategoryHeader type="DEEP_SEA" />
              <Grid container spacing={3}>
                {deepSeaPackages.map((pkg) => (
                  <Grid item xs={12} sm={6} md={4} key={pkg.id}>
                    <PackageCard {...pkg} />
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          {squidPackages.length > 0 && (
            <Box>
              <FishingCategoryHeader type="SQUID" />
              <Grid container spacing={3}>
                {squidPackages.map((pkg) => (
                  <Grid item xs={12} sm={6} md={4} key={pkg.id}>
                    <PackageCard {...pkg} />
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </Box>
      );
    }

    return (
      <Grid container spacing={3}>
        {packages.map((pkg) => (
          <Grid item xs={12} sm={6} md={4} key={pkg.id}>
            <PackageCard {...pkg} />
          </Grid>
        ))}
      </Grid>
    );
  };

  return (
    <>
      <Helmet>
        <title>Rhumuda Boat Charter</title>
        <meta name="description" content="Welcome to Rhumuda Boat Charter - Your premier destination for boat charters in Malaysia" />
      </Helmet>
      <Box>
        {/* Category Selector Section */}
        <Stack
          direction="row"
          spacing={4}
          justifyContent="left"
          alignItems="center"
          sx={{ mt: 4 }}
        >
          <Box sx={{ position: "relative" }}>
            <Box
              component="img"
              src={boatIcon}
              alt="Boat Charter"
              onClick={() => handleCategorySelect("boat")}
              sx={{
                width: 80,
                height: 80,
                cursor: "pointer",
                transition: "transform 0.2s",
                "&:hover": {
                  transform: "scale(1.1)",
                },
              }}
            />
            <Box
              sx={{
                position: "absolute",
                bottom: -8,
                left: 0,
                right: 0,
                height: 3,
                bgcolor: selectedCategory === "boat" ? "#06FB07" : "transparent",
                transition: "background-color 0.3s",
              }}
            />
          </Box>

          <Box sx={{ position: "relative" }}>
            <Box
              component="img"
              src={islandIcon}
              alt="Island Trips"
              onClick={() => handleCategorySelect("island")}
              sx={{
                width: 80,
                height: 80,
                cursor: "pointer",
                transition: "transform 0.2s",
                "&:hover": {
                  transform: "scale(1.1)",
                },
              }}
            />
            <Box
              sx={{
                position: "absolute",
                bottom: -8,
                left: 0,
                right: 0,
                height: 3,
                bgcolor:
                  selectedCategory === "island" ? "#06FB07" : "transparent",
                transition: "background-color 0.3s",
              }}
            />
          </Box>

          <Box sx={{ position: "relative" }}>
            <Box
              component="img"
              src={fishingIcon}
              alt="Fishing Trips"
              onClick={() => handleCategorySelect("fishing")}
              sx={{
                width: 80,
                height: 80,
                cursor: "pointer",
                transition: "transform 0.2s",
                "&:hover": {
                  transform: "scale(1.1)",
                },
              }}
            />
            <Box
              sx={{
                position: "absolute",
                bottom: -8,
                left: 0,
                right: 0,
                height: 3,
                bgcolor:
                  selectedCategory === "fishing" ? "#06FB07" : "transparent",
                transition: "background-color 0.3s",
              }}
            />
          </Box>
        </Stack>

        {/* Package Title */}
        <Typography
          variant="h4"
          component="h1"
          sx={{
            mt: 4,
            mb: 3,
            textAlign: "left",
            fontWeight: 500,
            color: "text.primary",
          }}
        >
          {categoryName}
        </Typography>

        <Box
          sx={{
            mt: 4,
            display: "flex",
            flexDirection: "column",
            width: "100%",
          }}
        >
          {loading && <CircularProgress />}
          {error && <Alert severity="error">{error}</Alert>}
          {!loading && !error && renderPackages()}
        </Box>

        {/* Explore Pulau Kapas Section */}
        <Box sx={{ py: 8, bgcolor: "background.default" }}>
          <Container maxWidth="lg">
            <Typography
              variant="h4"
              align="center"
              gutterBottom
              sx={{
                mb: 6,
                fontWeight: 500,
                color: "text.primary",
              }}
            >
              Explore Pulau Kapas
            </Typography>
            <Box
              sx={{
                position: "relative",
                width: "100%",
                paddingTop: "56.25%", // 16:9 aspect ratio
                borderRadius: "16px",
                overflow: "hidden",
                boxShadow: 3,
              }}
            >
              <iframe
                src="https://www.youtube.com/embed/iR8MHSyERTk"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  border: 0,
                }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Explore Pulau Kapas"
              />
            </Box>
          </Container>
        </Box>

        {/* Services Offered Section */}
        <Box sx={{ py: 8, bgcolor: "background.default" }}>
          <ServicesSection />
        </Box>
      </Box>
    </>
  );
};

export default HomePage;
