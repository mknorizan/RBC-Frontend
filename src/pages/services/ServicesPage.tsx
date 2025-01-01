import React from "react";
import {
  Box,
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import SearchBar from "../../components/search/SearchBar";
import PrivateBoatService from "./PrivateBoatService";
import FishingCharterService from "./FishingCharterService";
import IslandDayTripService from "./IslandDayTripService";

const ServicesPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // If we're at the root services path, redirect to private-boat
  React.useEffect(() => {
    if (location.pathname === "/services") {
      navigate("/services/private-boat", { replace: true });
    }
  }, [location.pathname, navigate]);

  const services = [
    { path: "private-boat", label: "Private Boat" },
    { path: "fishing-charters", label: "Fishing Charters" },
    { path: "island-day-trip", label: "Island Day Trip" },
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.default",
      }}
    >
      <Header />
      <Container maxWidth="lg" sx={{ py: 4, flex: 1 }}>
        <Box sx={{ display: "flex", gap: 4 }}>
          <Box sx={{ width: 240, flexShrink: 0 }}>
            <List>
              {services.map((service) => (
                <ListItem
                  key={service.path}
                  onClick={() => navigate(`/services/${service.path}`)}
                  sx={{
                    cursor: "pointer",
                    py: 2,
                    borderBottom:
                      location.pathname === `/services/${service.path}`
                        ? "2px solid #4CAF50"
                        : "2px solid transparent",
                    "&:hover": {
                      borderBottom: "2px solid #81C784",
                    },
                    typography: "h5",
                    fontFamily: "Playfair Display, serif",
                    color:
                      location.pathname === `/services/${service.path}`
                        ? "text.primary"
                        : "text.secondary",
                  }}
                >
                  {service.label}
                </ListItem>
              ))}
            </List>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Routes>
              <Route index element={<PrivateBoatService />} />
              <Route path="private-boat" element={<PrivateBoatService />} />
              <Route
                path="fishing-charters"
                element={<FishingCharterService />}
              />
              <Route
                path="island-day-trip"
                element={<IslandDayTripService />}
              />
              <Route path="*" element={<PrivateBoatService />} />
            </Routes>
          </Box>
        </Box>
      </Container>
      <Footer />
    </Box>
  );
};

export default ServicesPage;
