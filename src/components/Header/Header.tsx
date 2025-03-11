import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Box,
  Container,
  Stack,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import logo from "../../assets/images/logo-rhumuda.PNG";
import SearchBar from "../SearchBar/SearchBar";
import { SYSTEM_PADDING } from "../../constants/layout";

// Debounce function with a longer wait time to prevent rapid state changes
const debounce = (func: Function, wait: number) => {
  let timeout: ReturnType<typeof setTimeout>;
  return function executedFunction(...args: any[]) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isSearchVisible =
    !location.pathname.startsWith("/inquiry") &&
    !location.pathname.startsWith("/summary");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openBookingDialog, setOpenBookingDialog] = useState(false);
  const [bookingId, setBookingId] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const open = Boolean(anchorEl);

  // Use debounced scroll handler with hysteresis to prevent flickering
  const handleScroll = useCallback(
    debounce(() => {
      const scrollPosition = window.scrollY;
      // Add hysteresis: different thresholds for scrolling up vs down
      if (!isScrolled && scrollPosition > 30) {
        setIsScrolled(true);
      } else if (isScrolled && scrollPosition < 10) {
        setIsScrolled(false);
      }
    }, 50), // Increased debounce time for smoother transitions
    [isScrolled] // Include isScrolled in dependencies for hysteresis
  );

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOpenBookingDialog = () => {
    handleClose();
    setOpenBookingDialog(true);
  };

  const handleCloseBookingDialog = () => {
    setOpenBookingDialog(false);
    setBookingId("");
  };

  const handleBookingSubmit = () => {
    if (bookingId.trim()) {
      // Remove any spaces and special characters
      const cleanBookingId = bookingId.trim().replace(/[^a-zA-Z0-9]/g, "");
      console.log("Submitting Booking ID:", cleanBookingId); // Debug log
      handleCloseBookingDialog();
      navigate(`/summary/${encodeURIComponent(cleanBookingId)}`);
    }
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    handleClose();
  };

  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: "white",
        top: 0,
        zIndex: (theme) => theme.zIndex.drawer + 1,
        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
        transition: "all 0.3s ease-in-out",
      }}
    >
      <Container maxWidth={false} disableGutters sx={{ px: SYSTEM_PADDING.x }}>
        <Stack>
          <Toolbar
            disableGutters
            sx={{
              minHeight: isScrolled ? "70px" : "100px",
              height: isScrolled ? "70px" : "100px",
              justifyContent: "space-between",
              transition: "all 0.3s ease-in-out",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                flex: 1,
                position: "relative",
              }}
            >
              <Box
                component="img"
                src={logo}
                alt="Rhumuda Charter Logo"
                onClick={() => navigate("/")}
                sx={{
                  height: isScrolled ? 50 : 80,
                  marginRight: 1,
                  cursor: "pointer",
                  transition: "all 0.3s ease-in-out",
                }}
              />

              {/* Compact SearchBar in header when scrolled */}
              {isSearchVisible && isScrolled && (
                <Box
                  sx={{
                    position: "absolute",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "100%",
                    maxWidth: "600px",
                    zIndex: 1,
                    transition: "all 0.3s ease-in-out",
                  }}
                >
                  <SearchBar isCompact={true} />
                </Box>
              )}
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              {!isScrolled && (
                <>
                  <Button
                    color="inherit"
                    onClick={() => navigate("/coming-soon")}
                    sx={{
                      color: "black",
                      textTransform: "none",
                      fontSize: "1rem",
                      transition: "color 0.2s ease-in-out",
                      "&:hover": {
                        color: "#0384BD",
                        backgroundColor: "transparent",
                      },
                    }}
                  >
                    List your Boat
                  </Button>
                  <Button
                    color="inherit"
                    sx={{
                      color: "black",
                      textTransform: "none",
                      fontSize: "1rem",
                      transition: "color 0.2s ease-in-out",
                      "&:hover": {
                        color: "#0384BD",
                        backgroundColor: "transparent",
                      },
                    }}
                    onClick={handleOpenBookingDialog}
                  >
                    Manage Booking
                  </Button>
                </>
              )}
              <IconButton
                onClick={handleMenuClick}
                sx={{
                  ml: 1,
                  color: "black",
                }}
              >
                <MenuIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                PaperProps={{
                  sx: {
                    mt: 1.5,
                    minWidth: 180,
                    border: "1px solid black",
                    borderRadius: "16px",
                    boxShadow: "0px 4px 20px 0px rgba(0, 0, 0, 0.15)",
                    "& .MuiMenuItem-root": {
                      fontSize: "1rem",
                      padding: "12px 24px",
                      transition: "color 0.2s ease-in-out",
                      "&:hover": {
                        color: "#0384BD",
                        backgroundColor: "transparent",
                      },
                    },
                  },
                }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              >
                {isScrolled && (
                  <>
                    <MenuItem onClick={() => navigate("/coming-soon")}>
                      List your Boat
                    </MenuItem>
                    <MenuItem onClick={handleOpenBookingDialog}>
                      Manage Booking
                    </MenuItem>
                    <Divider sx={{ my: 1 }} />
                  </>
                )}
                <MenuItem onClick={() => handleNavigation("/about")}>
                  About Us
                </MenuItem>
                <MenuItem onClick={() => handleNavigation("/contact")}>
                  Contact Us
                </MenuItem>
                <MenuItem onClick={() => handleNavigation("/services")}>
                  Services
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>

          {/* Full-size SearchBar below the toolbar when not scrolled */}
          {isSearchVisible && !isScrolled && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                mb: 3,
                transition: "all 0.3s ease-in-out",
              }}
            >
              <SearchBar isCompact={false} />
            </Box>
          )}
        </Stack>
      </Container>

      {/* Booking ID Dialog */}
      <Dialog
        open={openBookingDialog}
        onClose={handleCloseBookingDialog}
        PaperProps={{
          sx: {
            width: "100%",
            maxWidth: "400px",
            p: 2,
          },
        }}
      >
        <DialogTitle sx={{ pb: 2 }}>Enter Booking ID</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Booking ID"
            type="text"
            fullWidth
            variant="outlined"
            value={bookingId}
            onChange={(e) => setBookingId(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleBookingSubmit();
              }
            }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleCloseBookingDialog} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleBookingSubmit}
            variant="contained"
            color="primary"
            disabled={!bookingId.trim()}
          >
            Enter
          </Button>
        </DialogActions>
      </Dialog>
    </AppBar>
  );
};

export default Header;
