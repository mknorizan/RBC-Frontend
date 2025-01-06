import React from 'react';
import { Box, Typography, Container, IconButton, Divider } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import XIcon from '@mui/icons-material/X'; // The new Twitter/X icon

const Footer = () => {
  return (
    <>
      <Divider sx={{ borderColor: '#000' }} />
      <Container maxWidth="lg">
        <Box
          sx={{
            py: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          {/* Copyright Text */}
          <Typography sx={{ fontSize: '0.9rem' }}>
            © 2025 Rhumuda Boat Charter
          </Typography>

          {/* Social Media Icons */}
          <Box>
            <IconButton
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              size="small"
              sx={{ color: '#000' }}
            >
              <FacebookIcon />
            </IconButton>
            <IconButton
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              size="small"
              sx={{ color: '#000' }}
            >
              <InstagramIcon />
            </IconButton>
            <IconButton
              href="https://x.com"
              target="_blank"
              rel="noopener noreferrer"
              size="small"
              sx={{ color: '#000' }}
            >
              <XIcon />
            </IconButton>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default Footer; 