import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  IconButton,
  useScrollTrigger,
  Menu,
  MenuItem,
  Container,
  Stack,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import logo from "../../assets/logo-rhumuda.PNG";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import SearchBar from "../search/SearchBar";

// Add prop for hiding search bar
interface HeaderProps {
  hideSearch?: boolean;
}

const Header = ({ hideSearch = false }: HeaderProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  });
  const navigate = useNavigate();

  const menuItems = [
    // { label: 'Home', path: '/rhumuda' },
    { label: "About Us", path: "/about" },
    { label: "Contact Us", path: "/contact" },
    { label: "Services", path: "/services" },
  ];

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar
      position="sticky"
      sx={{
        bgcolor: "background.paper",
        boxShadow: trigger ? 1 : 0,
        transition: "all 0.3s",
        height: hideSearch
          ? trigger
            ? "70px"
            : "90px" // Height without search bar
          : trigger
          ? "140px"
          : "180px", // Height with search bar
        zIndex: 1100,
        top: 0,
      }}
    >
      {/* Top Row */}
      <Toolbar sx={{ height: trigger ? "70px" : "90px" }}>
        <Container
          maxWidth="lg"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Logo */}
          <Box
            component={RouterLink}
            to="/"
            sx={{
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
            }}
          >
            <Box
              component="img"
              src={logo}
              alt="Rhumuda Logo"
              sx={{
                height: trigger ? "65px" : "85px",
                transition: "height 0.3s",
              }}
            />
          </Box>

          {/* Action Buttons and Menu */}
          <Stack direction="row" spacing={2} alignItems="center">
            {/* Desktop Navigation */}
            <Stack
              direction="row"
              spacing={2}
              sx={{
                display: { xs: "none", md: "flex" },
                alignItems: "center",
              }}
            >
              <Button
                variant="text"
                sx={{
                  whiteSpace: "nowrap",
                  color: "text.primary",
                  fontSize: "1rem",
                  textTransform: "none",
                  "&:hover": {
                    backgroundColor: "transparent",
                    color: "#0384BD ",
                  },
                }}
              >
                List your Boat
              </Button>
              <Button
                variant="text"
                sx={{
                  whiteSpace: "nowrap",
                  color: "text.primary",
                  fontSize: "1rem",
                  textTransform: "none",
                  "&:hover": {
                    backgroundColor: "transparent",
                    color: "#0384BD ",
                  },
                }}
              >
                Manage Booking
              </Button>
            </Stack>

            {/* Hamburger Menu */}
            <IconButton
              onClick={handleMenuOpen}
              sx={{
                ml: 2,
                border: "1px solid",
                borderColor: "grey.300",
                borderRadius: "50px",
                padding: "8px",
                "&:hover": {
                  borderColor: "grey.400",
                  backgroundColor: "transparent",
                },
              }}
              edge="end"
              color="inherit"
            >
              <MenuIcon />
            </IconButton>

            {/* Menu Dropdown */}
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              sx={{
                "& .MuiPaper-root": {
                  mt: 1,
                  borderRadius: "20px",
                  minWidth: "200px",
                  boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
                  border: "1px solid #e0e0e0",
                },
                "& .MuiList-root": {
                  py: 1,
                },
              }}
            >
              {menuItems.map((item) => (
                <MenuItem
                  key={item.path}
                  component={RouterLink}
                  to={item.path}
                  onClick={handleMenuClose}
                  sx={{
                    py: 1.5,
                    px: 3,
                    fontSize: "1.1rem",
                    fontWeight: 400,
                    color: "text.primary",
                    "&:hover": {
                      backgroundColor: "rgba(0, 0, 0, 0.04)",
                    },
                  }}
                >
                  {item.label}
                </MenuItem>
              ))}
            </Menu>
          </Stack>
        </Container>
      </Toolbar>

      {/* Bottom Row - Search Bar */}
      {!hideSearch && (
        <Container maxWidth="lg" sx={{ py: 1 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
              maxWidth: "800px",
              margin: "0 auto",
            }}
          >
            <SearchBar />
          </Box>
        </Container>
      )}
    </AppBar>
  );
};

export default Header;
