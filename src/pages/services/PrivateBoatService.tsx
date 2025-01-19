import React from "react";
import { Typography, Box, Grid } from "@mui/material";
import rhumudaBoat from "../../assets/services-img/boat/rhumuda_boat.jpg";
import privateBoat1 from "../../assets/services-img/boat/private_boat_1.jpg";
import boatCharter1 from "../../assets/services-img/boat/boat_charter_1.jpg";

const PrivateBoatService = () => {
  return (
    <Box
      sx={{
        bgcolor: "#f5f5f5",
        borderRadius: "20px",
        p: 4,
        boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.05)",
        border: "1px solid #eee",
      }}
    >
      <Typography paragraph>
        Discover the serenity of the open waters with our exclusive private boat
        rental service. Explore hidden coves, go fishing, or simply cruise along
        the coast. Our boats are equipped with modern technology and safety
        features, ensure a safe and exciting experience.
      </Typography>

      <Box sx={{ my: 4 }}>
        <Grid container spacing={2}>
          {/* Top wide image */}
          <Grid item xs={12}>
            <Box
              component="img"
              src={rhumudaBoat}
              alt="Rhumuda Boat"
              sx={{
                width: "100%",
                height: "300px",
                objectFit: "cover",
                borderRadius: 2,
                display: "block",
                transition: "transform 0.3s ease",
                "&:hover": {
                  transform: "scale(1.02)",
                },
              }}
            />
          </Grid>

          {/* Bottom two images */}
          {[privateBoat1, boatCharter1].map((img, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <Box
                component="img"
                src={img}
                alt={`Boat Service ${index + 1}`}
                sx={{
                  width: "100%",
                  height: "300px",
                  objectFit: "cover",
                  borderRadius: 2,
                  display: "block",
                  transition: "transform 0.3s ease",
                  "&:hover": {
                    transform: "scale(1.02)",
                  },
                }}
              />
            </Grid>
          ))}
        </Grid>
      </Box>

      <Typography variant="h5" component="h2" sx={{ mt: 4, mb: 2 }}>
        Customize Your Experience:
      </Typography>
      <Box component="ul" sx={{ pl: 2 }}>
        <Typography component="li" paragraph>
          <strong>Island Hopping:</strong> Explore hidden coves, pristine
          beaches, and vibrant marine life.
        </Typography>
        <Typography component="li" paragraph>
          <strong>Fishing Expeditions:</strong> Cast your line and reel in your
          dream catch
        </Typography>
      </Box>

      <Typography variant="h5" component="h2" sx={{ mt: 4, mb: 2 }}>
        Our Commitment:
      </Typography>
      <Box component="ul" sx={{ pl: 2 }}>
        <Typography component="li" paragraph>
          <strong>Safety:</strong> Our experienced crew prioritizes your safety
          and comfort.
        </Typography>
        <Typography component="li" paragraph>
          <strong>Vessels:</strong> Our fleet of modern boats are meticulously
          maintained.
        </Typography>
        <Typography component="li" paragraph>
          <strong>Personalized Service:</strong> Tailor-made experiences to suit
          your preferences.
        </Typography>
      </Box>
    </Box>
  );
};

export default PrivateBoatService;
