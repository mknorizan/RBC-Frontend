import React from "react";
import { Box, Typography } from "@mui/material";

const RoundIslandService = () => {
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
        Embark on a captivating journey of discovery with our unforgettable
        Round Island Excursion. Glide along the pristine coastline, marveling at
        dramatic cliffs plunging into the azure sea, secluded beaches shimmering
        in the sunlight, and lush mangrove forests teeming with life.
      </Typography>

      <Typography paragraph>
        Our experienced crew will navigate you through hidden coves, revealing
        secluded bays and breathtaking panoramas. Feel the invigorating sea
        breeze in your hair as you explore the island's stunning natural beauty.
      </Typography>

      <Typography paragraph>
        Whether you're seeking adventure, relaxation, or simply a unique
        perspective, our Round Island Excursion offers an unforgettable
        experience. Capture breathtaking photos, soak up the sun, and create
        lasting memories that will stay with you long after your journey ends.
      </Typography>

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

export default RoundIslandService;
