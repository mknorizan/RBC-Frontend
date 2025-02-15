import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Box, Typography, Grid, Container } from '@mui/material';
import logoRhumuda from '../assets/images/logo-rhumuda.PNG';

const AboutUsPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>About Us | Rhumuda Boat Charter</title>
        <meta name="description" content="Learn about Rhumuda Boat Charter's history, mission, and commitment to providing exceptional boat charter experiences in Malaysia" />
      </Helmet>
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          {/* Left Column - 70% */}
          <Grid item xs={12} md={8}>
            <Box>
              {/* About Us Section */}
              <Typography variant="h3" component="h1" sx={{ mb: 4, color: '#2C3E50', fontWeight: 500 }}>
                About Us
              </Typography>

              <Box sx={{ mb: 6 }}>
                <Typography variant="h5" component="h2" sx={{ mb: 2, color: '#34495E', fontWeight: 500 }}>
                  RhuMuda Boat Charter
                </Typography>
                <Typography variant="body1" sx={{ mb: 2, color: '#2C3E50', lineHeight: 1.8 }}>
                  - is your premier destination for unforgettable marine adventures. We're passionate about the sea 
                  and committed to providing exceptional boating experiences. Our fleet of well-maintained boats, 
                  coupled with our experienced and friendly crew, ensures a safe and enjoyable journey.
                </Typography>
                <Typography variant="body1" sx={{ mb: 2, color: '#2C3E50', lineHeight: 1.8 }}>
                  Whether you're seeking a thrilling fishing expedition, a serene sunset cruise, or a fun-filled 
                  family outing, we've got you covered. Our charters allow you to tailor your experience to your 
                  specific needs and preferences.
                </Typography>
                <Typography variant="body1" sx={{ mb: 4, color: '#2C3E50', lineHeight: 1.8 }}>
                  Explore the breathtaking beauty of Pulau Kapas, Terengganu, or simply relax and soak up the 
                  sun on the deck. We're dedicated to making your time on the water truly memorable.
                </Typography>
              </Box>

              {/* Boat Image */}
              <Box
                sx={{
                  width: '100%',
                  height: 300,
                  mb: 6,
                  borderRadius: 2,
                  overflow: 'hidden',
                }}
              >
                <Box
                  component="img"
                  src="/images/packages/boat/package1.jpg"
                  alt="RhuMuda Boat"
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </Box>

              {/* Why Choose Us Section */}
              <Box>
                <Typography variant="h4" component="h2" sx={{ mb: 4, color: '#2C3E50', fontWeight: 500 }}>
                  Why Choose Us?
                </Typography>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="h6" component="h3" sx={{ color: '#34495E', fontWeight: 500 }}>
                    Expert Captains
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#2C3E50', lineHeight: 1.8 }}>
                    - Our skilled captains know the waters like the back of their hands.
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="h6" component="h3" sx={{ color: '#34495E', fontWeight: 500 }}>
                    Modern Fleet
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#2C3E50', lineHeight: 1.8 }}>
                    - Our boats are meticulously maintained boats offers a range of options to suit every need.
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="h6" component="h3" sx={{ color: '#34495E', fontWeight: 500 }}>
                    Personalized Service
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#2C3E50', lineHeight: 1.8 }}>
                    - We tailor each trip to your specific needs and preferences.
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="h6" component="h3" sx={{ color: '#34495E', fontWeight: 500 }}>
                    Unmatched Safety
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#2C3E50', lineHeight: 1.8 }}>
                    - Your safety is our top priority.
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>

          {/* Right Column - 30% */}
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-start',
                pt: 8,
              }}
            >
              <Box
                component="img"
                src={logoRhumuda}
                alt="RhuMuda Boat Charter Logo"
                sx={{
                  width: '100%',
                  maxWidth: 300,
                  height: 'auto',
                  objectFit: 'contain',
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default AboutUsPage;
