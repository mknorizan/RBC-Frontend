import React from 'react';
import { Menu, MenuItem } from '@mui/material';

interface MenuDropdownProps {
  anchorEl: null | HTMLElement;
  open: boolean;
  onClose: () => void;
}

const MenuDropdown = ({ anchorEl, open, onClose }: MenuDropdownProps) => {
  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
    >
      <MenuItem onClick={onClose}>Home</MenuItem>
      <MenuItem onClick={onClose}>About</MenuItem>
      <MenuItem onClick={onClose}>Contact</MenuItem>
    </Menu>
  );
};

export default MenuDropdown; 