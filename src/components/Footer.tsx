import React from 'react';
import { Box, Container, Typography, IconButton, Divider } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        mt: 'auto',
        backgroundColor: 'white',
      }}
    >
      <Container maxWidth="lg">
        <Divider sx={{ mb: 3 }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} Rhumuda Boat Charter
          </Typography>
          <Box>
            <IconButton
              href="https://www.facebook.com/rhumudaboatcharter"
              target="_blank"
              rel="noopener noreferrer"
              size="small"
              sx={{ color: '#1877f2' }}
            >
              <FacebookIcon />
            </IconButton>
            <IconButton
              href="https://www.instagram.com/rhumudaboatcharter"
              target="_blank"
              rel="noopener noreferrer"
              size="small"
              sx={{ color: '#e4405f' }}
            >
              <InstagramIcon />
            </IconButton>
            <IconButton
              href="https://www.tiktok.com/@rhumudaboatcharter "
              target="_blank"
              rel="noopener noreferrer"
              size="small"
              sx={{ color: '#000000' }}
            >
              <TwitterIcon />
            </IconButton>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
