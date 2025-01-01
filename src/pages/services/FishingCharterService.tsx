import React from 'react';
import { Typography, Box } from '@mui/material';

const FishingCharterService = () => {
  return (
    <Box
      sx={{
        bgcolor: '#f5f5f5',
        borderRadius: '20px',
        p: 4,
        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.05)',
        border: '1px solid #eee',
      }}
    >
      <Typography paragraph>
        Embark on an unforgettable fishing adventure with RhuMuda Boat Charter. Our experienced 
        captains will take you to the best fishing spots, where you can cast your line and reel 
        in a variety of fish species. Whether you're a seasoned angler or a beginner, we'll 
        provide you with all the necessary equipment and expert guidance.
      </Typography>

      <Typography paragraph>
        Our fishing charters offer a unique opportunity to relax, unwind, and enjoy the thrill 
        of the catch. We cater to both inshore, offshore, and night fishing - depending on your 
        preferences and the season.
      </Typography>

      <Typography 
        variant="h5" 
        component="h2" 
        sx={{ 
          mt: 4, 
          mb: 2,
          fontFamily: 'Playfair Display, serif'
        }}
      >
        What to expect on a fishing charter:
      </Typography>

      <Box component="ul" sx={{ pl: 2, mb: 0 }}>
        <Typography component="li" paragraph>
          <strong>Expert Guidance:</strong> Our knowledgeable captains will share their expertise and tips.
        </Typography>
        <Typography component="li" paragraph>
          <strong>Top-Quality Equipment:</strong> We provide state-of-the-art fishing gear.
        </Typography>
        <Typography component="li" paragraph>
          <strong>Delicious Fresh Catch:</strong> Prepare to savor the fruits of your labor.
        </Typography>
        <Typography component="li" paragraph>
          <strong>Scenic Views:</strong> Enjoy breathtaking coastal landscapes and marine life.
        </Typography>
      </Box>
    </Box>
  );
};

export default FishingCharterService; 