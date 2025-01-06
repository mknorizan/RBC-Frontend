import React from 'react';
import { Box, Container, Typography, Avatar } from '@mui/material';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import logo from '../assets/logo-rhumuda.PNG';

const AboutUsPage = () => {
  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.default',
      }}
    >
      <Header />
      <Container maxWidth="lg" sx={{ py: 6, flex: 1 }}>
        <Typography 
          variant="h4" 
          component="h1" 
          sx={{ 
            mb: 4,
            textAlign: 'left'
          }}
        >
          About Us
        </Typography>

        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' },
          gap: 6,
          alignItems: 'center'
        }}>
          <Box sx={{ flex: 1 }}>
            <Typography paragraph>
              <strong>RhuMuda Boat Charter</strong> - is your premier destination for unforgettable marine 
              adventures. We're passionate about the sea and committed to providing exceptional 
              boating experiences. Our fleet of well-maintained boats, coupled with our 
              experienced and friendly crew, ensures a safe and enjoyable journey.
            </Typography>
            <Typography paragraph>
              Whether you're seeking a thrilling fishing expedition, a serene sunset cruise, or a 
              fun-filled family outing, we've got you covered. Our charters allow you to tailor 
              your experience to your specific needs and preferences.
            </Typography>
            <Typography paragraph>
              Explore the breathtaking beauty of Pulau Kapas, Terengganu, or simply relax and soak up the sun on the deck. We're dedicated to making your time on the water truly memorable.
            </Typography>

            <Typography 
              variant="h4" 
              component="h2" 
              sx={{ 
                mb: 4,
                textAlign: 'left',
                mt: 6
              }}
            >
              Why Choose Us?
            </Typography>
            <Typography paragraph>
              <strong>Expert Captains</strong> - Our skilled captains know the waters like the back of their hands.
            </Typography>
            <Typography paragraph>
              <strong>Modern Fleet</strong> - Our boats are meticulously maintained boats offers a range of options to suit every need.
            </Typography>
            <Typography paragraph>
              <strong>Personalized Service</strong> - We tailor each trip to your specific needs and preferences.
            </Typography>
            <Typography paragraph>
              <strong>Unmatched Safety</strong> - Your safety is our top priority.
            </Typography>
          </Box>

          <Box sx={{ 
            flex: 1,
            display: 'flex',
            justifyContent: 'center'
          }}>
            <Box
              component="img"
              src={logo}
              alt="Rhumuda Logo"
              sx={{
                width: 520,
                height: 520,
                borderRadius: '50%',
                bgcolor: 'white',
                objectFit: 'contain',
                p: 4
              }}
            />
          </Box>
        </Box>
      </Container>
      <Footer />
    </Box>
  );
};

export default AboutUsPage; 