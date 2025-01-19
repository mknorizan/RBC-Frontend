import React from "react";
import { Typography, Box, Grid } from "@mui/material";
import dayTrip1 from "../../assets/services-img/daytrip/daytrip_1.jpg";
import dayTrip2 from "../../assets/services-img/daytrip/daytrip_2.jpg";
import dayTrip3 from "../../assets/services-img/daytrip/daytrip_3.jpg";
import dayTrip4 from "../../assets/services-img/daytrip/daytrip_4.jpg";

const IslandDayTripService = () => {
  return (
    <Box
      sx={{
        bgcolor: "#f5f5f5", // Light grey background
        borderRadius: "20px",
        p: 4,
        boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.05)",
        border: "1px solid #eee",
      }}
    >
      <Typography paragraph>
        Escape the hustle and bustle of city life and indulge in a serene island
        getaway. Our Island Day Trips offer the perfect opportunity to unwind,
        relax, and explore stunning coastal landscapes.
      </Typography>

      <Box sx={{ my: 4 }}>
        <Grid container spacing={2} justifyContent="center">
          {[dayTrip1, dayTrip2, dayTrip3, dayTrip4].map((img, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <Box
                component="img"
                src={img}
                alt={`Island Day Trip ${index + 1}`}
                sx={{
                  width: "100%",
                  height: "400px",
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

      <Typography paragraph>
        Experience the crystal-clear waters, pristine beaches, and vibrant
        marine life of Pulau Kapas. Our experienced crew will take you to the
        most beautiful spots, where you can snorkel, swim, or simply soak up the
        sun.
      </Typography>

      <Typography variant="h5" component="h2" sx={{ mt: 4, mb: 2 }}>
        Services Include:
      </Typography>
      <Box component="ul" sx={{ pl: 2 }}>
        <Typography component="li" paragraph>
          <strong>Round-trip Transportation:</strong> We'll pick you up from a
          designated location, take you to the island, and then bring you back
          to the original starting point. This service ensures a hassle-free and
          convenient experience.
        </Typography>
        <Typography component="li" paragraph>
          <strong>Snorkeling Equipment:</strong> Enhance your snorkeling
          experience with our gear including masks, snorkels, and fins, provided
          free of charge.
        </Typography>
        <Typography component="li" paragraph>
          <strong>Life Jackets:</strong> Your safety is our priority. Life
          jackets will be provided to ensure a worry-free experience.
        </Typography>
        <Typography component="li" paragraph>
          <strong>Refreshments and Snacks:</strong> Stay refreshed and energized
          with our complimentary snacks and beverages.
        </Typography>
        <Typography component="li" paragraph>
          <strong>Experienced Guides:</strong> Our knowledgeable guides will
          share insights into the local culture, history, and marine life.
        </Typography>
        <Typography component="li" paragraph>
          <strong>Ample Free Time for Relaxation and Exploration:</strong>{" "}
          Indulge in the tranquility of the island and spend your time as you
          wish.
        </Typography>
      </Box>
    </Box>
  );
};

export default IslandDayTripService;
