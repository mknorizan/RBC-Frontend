import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Box, Typography, Container, Grid, Paper } from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';

const ContactUsPage: React.FC = () => {
  const handleWhatsAppClick = () => {
    window.open('https://wa.link/zfhxeq', '_blank');
  };

  return (
    <>
      <Helmet>
        <title>Contact Us | Rhumuda Boat Charter</title>
        <meta name="description" content="Get in touch with Rhumuda Boat Charter. Contact us for inquiries, bookings, or any questions about our boat charter services" />
      </Helmet>
      <Container maxWidth="xl" sx={{ mt: 8, mb: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1" sx={{ mb: 1, color: '#2C3E50', fontWeight: 500 }}>
            Reach out to us with any questions, we'll try to help!
          </Typography>
          {/* <Typography variant="h6" sx={{ color: '#34495E' }}>
            Reach out to us with any questions, we'll try to help!
          </Typography> */}
        </Box>

        <Grid container spacing={3} justifyContent="center">
          {/* WhatsApp Contact Section */}
          <Grid item xs={12} sm={6} md={4}>
            <Paper
              elevation={0}
              onClick={handleWhatsAppClick}
              sx={{
                p: 3,
                textAlign: 'center',
                bgcolor: '#f8f9fa',
                borderRadius: 4,
                cursor: 'pointer',
                minHeight: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                },
              }}
            >
              <WhatsAppIcon sx={{ fontSize: 36, color: '#1a237e', mb: 1.5 }} />
              <Typography 
                variant="h6" 
                sx={{ 
                  mb: 0.5, 
                  color: '#2C3E50',
                  fontSize: '1.1rem',
                }}
              >
                +6013-631 1100
              </Typography>
              <Typography variant="subtitle1" sx={{ mb: 1, color: '#2C3E50', fontWeight: 500 }}>
                Live Chat Hours
              </Typography>
              <Box sx={{ mt: 'auto' }}>
                <Typography variant="body1" sx={{ color: '#34495E', lineHeight: 1.4 }}>
                  Monday - Sunday
                </Typography>
                <Typography variant="body1" sx={{ color: '#34495E', lineHeight: 1.4 }}>
                  6:00 AM - 9:00 PM
                </Typography>
              </Box>
            </Paper>
          </Grid>

          {/* Phone Contact */}
          <Grid item xs={12} sm={6} md={4}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                textAlign: 'center',
                bgcolor: '#f8f9fa',
                borderRadius: 4,
                minHeight: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <PhoneIcon sx={{ fontSize: 36, color: '#1a237e', mb: 1.5 }} />
              <Typography 
                variant="h6" 
                sx={{ 
                  mb: 0.5, 
                  color: '#2C3E50',
                  fontSize: '1.1rem',
                }}
              >
                +609 618 6140
              </Typography>
              <Typography variant="subtitle1" sx={{ mb: 1, color: '#2C3E50', fontWeight: 500 }}>
                Phone Call Hours
              </Typography>
              <Box sx={{ mt: 'auto' }}>
                <Typography variant="body1" sx={{ color: '#34495E', lineHeight: 1.4 }}>
                  Monday - Friday
                </Typography>
                <Typography variant="body1" sx={{ color: '#34495E', lineHeight: 1.4 }}>
                  6:00 AM - 9:00 PM
                </Typography>
              </Box>
            </Paper>
          </Grid>

          {/* Email Contact */}
          <Grid item xs={12} sm={6} md={4}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                textAlign: 'center',
                bgcolor: '#f8f9fa',
                borderRadius: 4,
                minHeight: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <EmailIcon sx={{ fontSize: 36, color: '#1a237e', mb: 1.5 }} />
              <Typography 
                variant="h6" 
                sx={{ 
                  mb: 0.5, 
                  color: '#2C3E50',
                  fontSize: '1.1rem',
                  width: '100%',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                rhumudaboatcharter@gmail.com
              </Typography>
              <Typography variant="subtitle1" sx={{ mb: 1, color: '#2C3E50', fontWeight: 500 }}>
                Email Hours
              </Typography>
              <Box sx={{ mt: 'auto' }}>
                <Typography variant="body1" sx={{ color: '#34495E', lineHeight: 1.4 }}>
                  Monday - Sunday
                </Typography>
                <Typography variant="body1" sx={{ color: '#34495E', lineHeight: 1.4 }}>
                  6:00 AM - 9:00 PM
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default ContactUsPage;
