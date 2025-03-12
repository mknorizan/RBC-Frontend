import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  Box,
  Container,
  Typography,
  Card,
  IconButton,
  useTheme,
  useMediaQuery,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Modal,
  Backdrop,
} from "@mui/material";
import DirectionsBoatIcon from "@mui/icons-material/DirectionsBoat";
import TerrainIcon from "@mui/icons-material/Terrain";
import FishingIcon from "@mui/icons-material/SetMeal";
import BeachAccessIcon from "@mui/icons-material/BeachAccess";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CloseIcon from "@mui/icons-material/Close";
// Import images
import boatCharter from "../assets/services/private-boat/boatCharter.jpg";
import privateBoat from "../assets/services/private-boat/privateBoat.jpg";
import rhumudaBoat from "../assets/services/private-boat/rhumudaBoat.jpg";
import fishing1 from "../assets/services/fishing/fishing1.jpg";
import fishing2 from "../assets/services/fishing/fishing2.jpg";
import fishing3 from "../assets/services/fishing/fishing3.jpg";
import fishing4 from "../assets/services/fishing/fishing4.jpg";
import daytrip1 from "../assets/services/day-trip/daytrip1.jpg";
import daytrip2 from "../assets/services/day-trip/daytrip2.jpg";
import daytrip3 from "../assets/services/day-trip/daytrip3.jpg";
import daytrip4 from "../assets/services/day-trip/daytrip4.jpg";

// Define the blue color to match SearchBar
const RHUMUDA_BLUE = "#0384BD";

type ServiceKey =
  | "Private Boat"
  | "Round Island"
  | "Fishing Charters"
  | "Island Day Trip";

interface ServiceContent {
  title: string;
  icon: JSX.Element;
  description?: string;
  features?: string[];
  images?: string[];
  additionalInfo?: string;
  imageOrientations?: ("landscape" | "portrait")[];
}

const serviceContent: Record<ServiceKey, ServiceContent> = {
  "Private Boat": {
    title: "Private Boat Charter",
    icon: <DirectionsBoatIcon />,
    description:
      "Discover the serenity of the open waters with our exclusive private boat rental service. Explore hidden coves, go fishing, or simply cruise along the coast. Our boats are equipped with modern technology and safety features, ensure a safe and exciting experience.",
    features: [
      "Modern and well-maintained vessels",
      "Experienced crew members",
      "Safety equipment provided",
      "Flexible booking hours",
      "Customizable routes",
    ],
    images: [boatCharter, privateBoat, rhumudaBoat],
    imageOrientations: ["landscape", "landscape", "landscape"],
  },
  "Round Island": {
    title: "Round Island Tour",
    icon: <TerrainIcon />,
    description:
      "Embark on a captivating journey of discovery with our unforgettable Round Island Excursion. Glide along the pristine coastline, marveling at dramatic cliffs plunging into the azure sea, secluded beaches shimmering in the sunlight, and lush mangrove forests teeming with marine life.",
    features: [
      "Navigate through hidden coves and secluded bays",
      "Experience breathtaking panoramic views",
      "Capture stunning photos of the coastline",
      "Feel the invigorating sea breeze",
      "Create lasting memories with your loved ones",
    ],
    additionalInfo:
      "Whether you're seeking adventure, relaxation, or simply a unique perspective, our Round Island Excursion offers an unforgettable experience. Capture breathtaking photos, soak up the sun, and create lasting memories that will stay with you long after your journey ends.",
  },
  "Fishing Charters": {
    title: "Fishing Charters",
    icon: <FishingIcon />,
    description:
      "Embark on an unforgettable fishing adventure with RhuMuda Boat Charter. Our experienced captains will take you to the best fishing spots, where you can cast your line and reel in a variety of fish species. Whether you're a seasoned angler or a beginner, we'll provide you with all the necessary equipment and expert guidance.",
    features: [
      "Expert Guidance: Our knowledgeable captains will share their expertise and tips",
      "Top-Quality Equipment: We provide state-of-the-art fishing gear",
      "Delicious Fresh Catch: Prepare to savor the fruits of your labor",
      "Scenic Views: Enjoy breathtaking coastal landscapes and marine life",
    ],
    images: [fishing1, fishing2, fishing3, fishing4],
    imageOrientations: ["portrait", "portrait", "portrait", "portrait"],
    additionalInfo:
      "Our fishing charters offer a unique opportunity to relax, unwind, and enjoy the thrill of the catch. We cater to both inshore, offshore, and night fishing - depending on your preferences and the season.",
  },
  "Island Day Trip": {
    title: "Island Day Trip",
    icon: <BeachAccessIcon />,
    description:
      "Escape the hustle and bustle of city life and indulge in a serene island getaway. Our Island Day Trips offer the perfect opportunity to unwind, relax, and explore stunning coastal landscapes.",
    features: [
      "Round-trip Transportation: We'll pick you up from a designated location, take you to the island, and then bring you back to the original starting point",
      "Snorkeling Equipment: Enhance your snorkeling experience with our gear including masks, snorkels, and fins, provided free of charge",
      "Life Jackets: Your safety is our priority. Life jackets will be provided to ensure a worry-free experience",
      "Refreshments and Snacks: Stay refreshed and energized with our complimentary snacks and beverages",
      "Experienced Guides: Our knowledgeable guides will share insights into the local culture, history, and marine life",
      "Ample Free Time for Relaxation and Exploration: Indulge in the tranquility of the island and spend your time as you wish",
    ],
    images: [daytrip1, daytrip2, daytrip3, daytrip4],
    imageOrientations: ["landscape", "landscape", "landscape", "landscape"],
    additionalInfo:
      "Experience the crystal-clear waters, pristine beaches, and vibrant marine life of Pulau Kapas. Our experienced crew will take you to the most beautiful spots, where you can snorkel, swim, or simply soak up the sun.",
  },
};

const ServiceContent2 = ({ service }: { service: ServiceContent }) => {
  const [openImageModal, setOpenImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  const handleImageClick = (image: string) => {
    setSelectedImage(image);
    setOpenImageModal(true);
  };

  const handleCloseModal = () => {
    setOpenImageModal(false);
  };

  // Determine if the first image is portrait (for fishing images)
  const isFirstImagePortrait = service.imageOrientations?.[0] === "portrait";

  return (
    <Box sx={{ p: 3, bgcolor: "background.paper", borderRadius: 2 }}>
      {/* Hero Section */}
      <Box sx={{ position: "relative", mb: 6 }}>
        {service.images && (
          <Box
            sx={{
              width: "100%",
              height: "400px",
              overflow: "hidden",
              borderRadius: "16px 16px 0 0",
              cursor: "pointer",
              position: "relative",
              "&::after": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0,0,0,0.1)",
                opacity: 0,
                transition: "opacity 0.3s ease",
              },
              "&:hover::after": {
                opacity: 1,
              },
              "&:hover": {
                "& .zoom-hint": {
                  opacity: 1,
                },
              },
            }}
            onClick={() => handleImageClick(service.images![0])}
          >
            <Box
              component="img"
              src={service.images[0]}
              alt={service.title}
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                // Adjust object-position based on image orientation
                objectPosition: isFirstImagePortrait
                  ? "center 30%"
                  : "center center",
                transition: "transform 0.3s ease",
                "&:hover": {
                  transform: "scale(1.03)",
                },
              }}
            />
            <Box
              className="zoom-hint"
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                color: "white",
                backgroundColor: "rgba(0,0,0,0.6)",
                padding: "8px 16px",
                borderRadius: "4px",
                opacity: 0,
                transition: "opacity 0.3s ease",
                zIndex: 2,
                fontSize: "0.9rem",
                fontWeight: "bold",
              }}
            >
              Click to enlarge
            </Box>
          </Box>
        )}

        {/* Title Card */}
        <Paper
          elevation={3}
          sx={{
            position: "relative",
            mt: service.images ? -4 : 0,
            mx: "auto",
            p: 3,
            maxWidth: "90%",
            bgcolor: "background.paper",
            borderRadius: 2,
            zIndex: 1,
          }}
        >
          <Typography variant="h5" gutterBottom align="center">
            {service.title}
          </Typography>
          <Typography variant="body1" align="center">
            {service.description}
          </Typography>
        </Paper>
      </Box>

      {/* Content Section */}
      <Grid container spacing={4} sx={{ mt: 2 }}>
        {/* Features */}
        <Grid item xs={12} md={service.images ? 6 : 12}>
          <Typography variant="h6" gutterBottom sx={{ color: RHUMUDA_BLUE }}>
            What We Offer
          </Typography>
          <List>
            {service.features?.map((feature, index) => (
              <ListItem key={index}>
                <ListItemIcon>
                  <CheckCircleOutlineIcon sx={{ color: RHUMUDA_BLUE }} />
                </ListItemIcon>
                <ListItemText primary={feature} />
              </ListItem>
            ))}
          </List>
          {service.additionalInfo && (
            <Paper
              elevation={0}
              sx={{
                mt: 3,
                p: 2,
                bgcolor: "background.paper",
                color: "text.primary",
                borderRadius: 2,
                border: `1px solid ${RHUMUDA_BLUE}`,
              }}
            >
              <Typography variant="body1">{service.additionalInfo}</Typography>
            </Paper>
          )}
        </Grid>

        {/* Additional Images */}
        {service.images && (
          <Grid item xs={12} md={6}>
            <Grid container spacing={2}>
              {service.images.slice(1).map((image, index) => {
                // Check if this image is portrait
                const isPortrait =
                  service.imageOrientations?.[index + 1] === "portrait";

                return (
                  <Grid item xs={12} sm={6} key={index}>
                    <Box
                      sx={{
                        width: "100%",
                        height: 200,
                        borderRadius: 2,
                        overflow: "hidden",
                        cursor: "pointer",
                        position: "relative",
                        "&::after": {
                          content: '""',
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          backgroundColor: "rgba(0,0,0,0.1)",
                          opacity: 0,
                          transition: "opacity 0.3s ease",
                        },
                        "&:hover::after": {
                          opacity: 1,
                        },
                        "&:hover": {
                          "& .zoom-hint": {
                            opacity: 1,
                          },
                        },
                      }}
                      onClick={() => handleImageClick(image)}
                    >
                      <Box
                        component="img"
                        src={image}
                        alt={`${service.title} ${index + 2}`}
                        sx={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          // Adjust object-position based on image orientation
                          objectPosition: isPortrait
                            ? "center 30%"
                            : "center center",
                          transition: "transform 0.3s ease",
                          "&:hover": {
                            transform: "scale(1.03)",
                          },
                        }}
                      />
                      <Box
                        className="zoom-hint"
                        sx={{
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                          color: "white",
                          backgroundColor: "rgba(0,0,0,0.6)",
                          padding: "6px 12px",
                          borderRadius: "4px",
                          opacity: 0,
                          transition: "opacity 0.3s ease",
                          zIndex: 2,
                          fontSize: "0.8rem",
                          fontWeight: "bold",
                        }}
                      >
                        Click to enlarge
                      </Box>
                    </Box>
                  </Grid>
                );
              })}
            </Grid>
          </Grid>
        )}
      </Grid>

      {/* Image Modal */}
      <Modal
        open={openImageModal}
        onClose={handleCloseModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 2,
        }}
      >
        <Box
          sx={{
            position: "relative",
            maxWidth: "90vw",
            maxHeight: "90vh",
            outline: "none",
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 1,
          }}
        >
          <IconButton
            onClick={handleCloseModal}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: "white",
              bgcolor: "rgba(0,0,0,0.5)",
              zIndex: 1,
              "&:hover": {
                bgcolor: "rgba(0,0,0,0.7)",
              },
            }}
          >
            <CloseIcon />
          </IconButton>
          <Box
            component="img"
            src={selectedImage}
            alt="Enlarged view"
            sx={{
              display: "block",
              maxWidth: "100%",
              maxHeight: "85vh",
              objectFit: "contain",
              margin: "0 auto",
            }}
          />
        </Box>
      </Modal>
    </Box>
  );
};

const ServicesPage = () => {
  const [selectedService, setSelectedService] =
    useState<ServiceKey>("Private Boat");

  const handleServiceChange = (service: ServiceKey) => {
    setSelectedService(service);
  };

  return (
    <>
      <Helmet>
        <title>Our Services | Rhumuda Boat Charter</title>
        <meta
          name="description"
          content="Discover our range of boat charter services - from fishing trips to island hopping adventures at Rhumuda Boat Charter"
        />
      </Helmet>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: "flex", gap: 4 }}>
          {/* Service Navigation - Sticky */}
          <Box
            sx={{
              width: 200,
              position: "sticky",
              top: 80,
              alignSelf: "flex-start",
              maxHeight: "calc(100vh - 100px)",
              overflowY: "auto",
              bgcolor: "background.default",
              p: 2,
              borderRadius: 2,
              boxShadow: 1,
              zIndex: 1,
            }}
          >
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 500 }}>
              Our Services
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1,
              }}
            >
              {Object.entries(serviceContent).map(([key, service]) => (
                <Card
                  key={key}
                  sx={{
                    p: 2,
                    cursor: "pointer",
                    bgcolor: "background.paper",
                    color: "text.primary",
                    transition: "all 0.2s ease-in-out",
                    border:
                      selectedService === key
                        ? `2px solid ${RHUMUDA_BLUE}`
                        : "2px solid transparent",
                    "&:hover": {
                      color: RHUMUDA_BLUE,
                      bgcolor: "background.paper",
                      transform: "translateY(-2px)",
                      boxShadow: 2,
                      border: `2px solid ${RHUMUDA_BLUE}`,
                    },
                  }}
                  onClick={() => handleServiceChange(key as ServiceKey)}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {React.cloneElement(service.icon, {
                      sx: {
                        color:
                          selectedService === key
                            ? "text.primary"
                            : "text.primary",
                        transition: "color 0.2s ease-in-out",
                        ".MuiCard-root:hover &": {
                          color: RHUMUDA_BLUE,
                        },
                      },
                    })}
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: "0.9rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        fontWeight: selectedService === key ? 600 : 400,
                        transition: "color 0.2s ease-in-out",
                        ".MuiCard-root:hover &": {
                          color: RHUMUDA_BLUE,
                        },
                      }}
                    >
                      {key}
                    </Typography>
                  </Box>
                </Card>
              ))}
            </Box>
          </Box>

          {/* Service Content */}
          <Box sx={{ flex: 1 }}>
            <ServiceContent2 service={serviceContent[selectedService]} />
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default ServicesPage;
