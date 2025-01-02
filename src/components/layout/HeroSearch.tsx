import React, { useState } from 'react';
import { Box, Paper, Typography, Button, Divider } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const HeroSearch = () => {
  const [location] = useState('Rhu Muda, Marang');
  const [dates, setDates] = useState('Add dates');
  const [passengers, setPassengers] = useState('Add passengers');

  return (
    <Box sx={{ 
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      px: 2,
      mt: 4
    }}>
      <Paper
        elevation={3}
        sx={{
          display: 'flex',
          maxWidth: 800,
          width: '100%',
          borderRadius: '50px',
          overflow: 'hidden',
          p: 1
        }}
      >
        {/* Jetty Point */}
        <Box 
          sx={{ 
            flex: 1,
            p: 2,
            cursor: 'pointer',
            '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.04)' }
          }}
        >
          <Typography variant="subtitle2" color="text.secondary">
            Jetty point
          </Typography>
          <Typography>{location}</Typography>
        </Box>

        <Divider orientation="vertical" flexItem />

        {/* Booking Date */}
        <Box 
          sx={{ 
            flex: 1,
            p: 2,
            cursor: 'pointer',
            '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.04)' }
          }}
        >
          <Typography variant="subtitle2" color="text.secondary">
            Booking date
          </Typography>
          <Typography>{dates}</Typography>
        </Box>

        <Divider orientation="vertical" flexItem />

        {/* Passengers */}
        <Box 
          sx={{ 
            flex: 1,
            p: 2,
            cursor: 'pointer',
            '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.04)' }
          }}
        >
          <Typography variant="subtitle2" color="text.secondary">
            Passengers
          </Typography>
          <Typography>{passengers}</Typography>
        </Box>

        {/* Search Button */}
        <Button
          variant="contained"
          color="primary"
          sx={{
            borderRadius: '50px',
            px: 3,
            mx: 1,
            minWidth: 'auto'
          }}
        >
          <SearchIcon />
        </Button>
      </Paper>
    </Box>
  );
};

export default HeroSearch;