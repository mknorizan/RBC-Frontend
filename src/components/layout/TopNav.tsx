import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Box, 
  Button, 
  IconButton, 
  Menu,
  MenuItem 
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import logo from '../../assets/images/logo-rhumuda.PNG';
import { Link as RouterLink } from 'react-router-dom';

const TopNav = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  
  const menuItems = [
    { label: 'About Us', path: '/about' },
    { label: 'Services', path: '/services' },
    { label: 'Contact Us', path: '/contact' },
  ];

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar 
      position="static" 
      elevation={0}
      sx={{ 
        bgcolor: 'transparent',
        color: 'text.primary'
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Logo */}
        <Box 
          component={RouterLink}
          to="/"
          sx={{ 
            display: 'flex', 
            alignItems: 'center',
            textDecoration: 'none'
          }}
        >
          <Box 
            component="img"
            src={logo}
            alt="Rhumuda Logo"
            sx={{ height: 60 }}
          />
        </Box>

        {/* Right Side Actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* Action Buttons */}
          <Button 
            variant="outlined"
            sx={{ 
              borderRadius: '20px',
              color: 'text.primary',
              borderColor: 'text.primary',
              whiteSpace: 'nowrap'
            }}
          >
            List your boat
          </Button>
          <Button 
            variant="outlined"
            sx={{ 
              borderRadius: '20px',
              color: 'text.primary',
              borderColor: 'text.primary',
              whiteSpace: 'nowrap'
            }}
          >
            Manage booking
          </Button>

          {/* Hamburger Menu */}
          <IconButton 
            onClick={handleMenuOpen}
            sx={{ ml: 1 }}
          >
            <MenuIcon />
          </IconButton>

          {/* Menu Dropdown */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            {menuItems.map((item) => (
              <MenuItem 
                key={item.path}
                component={RouterLink}
                to={item.path}
                onClick={handleMenuClose}
              >
                {item.label}
              </MenuItem>
            ))}
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default TopNav;