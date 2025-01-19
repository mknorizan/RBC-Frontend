import React from "react";
import { Typography, Box, Grid } from "@mui/material";
import fishingService1 from "../../assets/services-img/fishing/fishing_service_1.jpg";
import fishingService2 from "../../assets/services-img/fishing/fishing_service_2.jpg";
import fishingService3 from "../../assets/services-img/fishing/fishing_service_3.jpg";
import fishingService4 from "../../assets/services-img/fishing/fishing_service_4.jpg";

const FishingCharterService = () => {
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
        Embark on an unforgettable fishing adventure with RhuMuda Boat Charter.
        Our experienced captains will take you to the best fishing spots, where
        you can cast your line and reel in a variety of fish species. Whether
        you're a seasoned angler or a beginner, we'll provide you with all the
        necessary equipment and expert guidance.
      </Typography>

      <Box sx={{ my: 4 }}>
        <Grid container spacing={2} justifyContent="center">
          {[
            fishingService1,
            fishingService2,
            fishingService3,
            fishingService4,
          ].map((img, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Box
                component="img"
                src={img}
                alt={`Fishing Service ${index + 1}`}
                sx={{
                  width: "100%",
                  height: "300px",
                  objectFit: "cover",
                  borderRadius: 2,
                  display: "block",
                  maxWidth: "100%",
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

      <Typography paragraph>
        Our fishing charters offer a unique opportunity to relax, unwind, and
        enjoy the thrill of the catch. We cater to both inshore, offshore, and
        night fishing - depending on your preferences and the season.
      </Typography>

      <Typography
        variant="h5"
        component="h2"
        sx={{
          mt: 4,
          mb: 2,
          fontFamily: "Playfair Display, serif",
        }}
      >
        What to expect on a fishing charter:
      </Typography>

      <Box component="ul" sx={{ pl: 2, mb: 0 }}>
        <Typography component="li" paragraph>
          <strong>Expert Guidance:</strong> Our knowledgeable captains will
          share their expertise and tips.
        </Typography>
        <Typography component="li" paragraph>
          <strong>Top-Quality Equipment:</strong> We provide state-of-the-art
          fishing gear.
        </Typography>
        <Typography component="li" paragraph>
          <strong>Delicious Fresh Catch:</strong> Prepare to savor the fruits of
          your labor.
        </Typography>
        <Typography component="li" paragraph>
          <strong>Scenic Views:</strong> Enjoy breathtaking coastal landscapes
          and marine life.
        </Typography>
      </Box>
    </Box>
  );
};

export default FishingCharterService;
