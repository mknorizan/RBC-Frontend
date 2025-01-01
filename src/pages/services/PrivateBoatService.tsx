import React from 'react';
import { Typography, Box } from '@mui/material';

const PrivateBoatService = () => {
  return (
    <Box
      sx={{
        bgcolor: '#f5f5f5',  // Light grey background
        borderRadius: '20px',
        p: 4,
        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.05)',
        border: '1px solid #eee',
      }}
    >
      <Typography paragraph>
        Discover the serenity of the open waters with our exclusive private boat rental service. 
        Explore hidden coves, go fishing, or simply cruise along the coast. Our boats are equipped 
        with modern technology and safety features, ensure a safe and exciting experience.
      </Typography>

      <Typography variant="h5" component="h2" sx={{ mt: 4, mb: 2 }}>
        Customize Your Experience:
      </Typography>
      <Box component="ul" sx={{ pl: 2 }}>
        <Typography component="li" paragraph>
          <strong>Island Hopping:</strong> Explore hidden coves, pristine beaches, and vibrant marine life.
        </Typography>
        <Typography component="li" paragraph>
          <strong>Fishing Expeditions:</strong> Cast your line and reel in your dream catch
        </Typography>
      </Box>

      <Typography variant="h5" component="h2" sx={{ mt: 4, mb: 2 }}>
        Our Commitment:
      </Typography>
      <Box component="ul" sx={{ pl: 2 }}>
        <Typography component="li" paragraph>
          <strong>Safety:</strong> Our experienced crew prioritizes your safety and comfort.
        </Typography>
        <Typography component="li" paragraph>
          <strong>Vessels:</strong> Our fleet of modern boats are meticulously maintained.
        </Typography>
        <Typography component="li" paragraph>
          <strong>Personalized Service:</strong> Tailor-made experiences to suit your preferences.
        </Typography>
      </Box>
    </Box>
  );
};

export default PrivateBoatService; 