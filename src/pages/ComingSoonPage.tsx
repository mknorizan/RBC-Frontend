import React from 'react';
import { Box, Typography, Container, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import DirectionsBoatIcon from '@mui/icons-material/DirectionsBoat';

const ComingSoonPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Coming Soon - Rhumuda Boat Charter</title>
      </Helmet>
      <Container maxWidth="md">
        <Box
          sx={{
            minHeight: '80vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            py: 8,
          }}
        >
          <DirectionsBoatIcon 
            sx={{ 
              fontSize: 100, 
              color: '#0384BD',
              mb: 4,
              animation: 'float 3s ease-in-out infinite',
              '@keyframes float': {
                '0%, 100%': {
                  transform: 'translateY(0)',
                },
                '50%': {
                  transform: 'translateY(-20px)',
                },
              },
            }} 
          />
          
          <Typography 
            variant="h2" 
            component="h1" 
            gutterBottom
            sx={{ 
              color: '#0384BD',
              fontWeight: 'bold',
              mb: 3,
            }}
          >
            Coming Soon
          </Typography>
          
          <Typography 
            variant="h5" 
            color="textSecondary" 
            paragraph
            sx={{ mb: 4, maxWidth: '600px' }}
          >
            We're working on something exciting! Soon you'll be able to list your boat and join our growing community of boat owners.
          </Typography>

          <Box sx={{ mt: 4 }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/')}
              sx={{
                bgcolor: '#0384BD',
                '&:hover': {
                  bgcolor: '#026994',
                },
                px: 4,
                py: 1.5,
              }}
            >
              Back to Home
            </Button>
          </Box>

          {/* <Typography 
            variant="body1" 
            color="textSecondary"
            sx={{ mt: 6 }}
          >
            Want to be notified when we launch? Stay tuned for updates!
          </Typography> */}
        </Box>
      </Container>
    </>
  );
};

export default ComingSoonPage;
