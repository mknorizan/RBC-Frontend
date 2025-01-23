import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  CircularProgress,
  Alert,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import Header from "../components/layout/Header";
import axiosInstance from "../config/axios";
import CircleIcon from "@mui/icons-material/Circle";
import rhumudaMap from "../assets/maps/rhumuda-map.png";

interface SearchParams {
  jettyPoint: string;
  bookingDate: string;
  passengers: number;
}

interface CustomerInfo {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  addressLine1: string;
  addressLine2: string;
  postalCode: string;
  city: string;
  country: string;
}

interface ReservationDetails {
  jettyLocation: string;
  bookingDate: string;
  numberOfPassengers: number;
  packageType: string;
  addOns: string[];
}

interface OtherOptions {
  alternativeDate1: string;
  alternativeDate2: string;
  specialRequests: string;
}

interface PackageOption {
  id: number;
  title: string;
  name: string;
  type: string;
  description: string;
  price: number;
  services: string[];
  priceMin?: number;
  priceMax?: number;
  distance?: string;
  techniques?: string[];
}

const addOns = [
  { id: "lifejacket", name: "Life jacket & Safety equipments", price: 10 },
  { id: "snorkeling", name: "Snorkeling in water garden", price: 10 },
  { id: "boattour", name: "Boat tour around Pulau Kapas", price: 25 },
  { id: "lunch", name: "Lunch Set", price: 10 },
  { id: "guide", name: "Tourist Guide", price: 10 },
];

const JETTY_COORDINATES = {
  Rhumuda: {
    lat: 5.2135,
    lon: 103.2633,
    mapUrl: "https://maps.app.goo.gl/LkARLZyNr5NqLqeM7",
  },
  "Kuala Terengganu": {
    lat: 5.3302,
    lon: 103.1408,
    mapUrl: "", // Add the Google Maps URL when you have it
  },
} as const;

const SummaryPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [bookingId, setBookingId] = useState<string>("");
  const [selectedPackage, setSelectedPackage] = useState<PackageOption | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const { searchParams, customerInfo, reservationDetails, otherOptions } =
    location.state as {
      searchParams: SearchParams;
      customerInfo: CustomerInfo;
      reservationDetails: ReservationDetails;
      otherOptions: OtherOptions;
    };

  // Generate booking ID
  useEffect(() => {
    const generateBookingId = () => {
      const timestamp = new Date().getTime().toString().slice(-6);
      const random = Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, "0");
      return `BK${timestamp}${random}`;
    };

    setBookingId(generateBookingId());
  }, []);

  // Fetch package details
  useEffect(() => {
    const fetchPackageDetails = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get("/api/packages");
        const packages = response.data;
        const selected = packages.find(
          (pkg: PackageOption) =>
            String(pkg.id) === String(reservationDetails.packageType)
        );

        if (selected) {
          setSelectedPackage(selected);
        } else {
          setError("Selected package not found");
        }
      } catch (error) {
        console.error("Error fetching package details:", error);
        setError("Failed to load package details");
      } finally {
        setIsLoading(false);
      }
    };

    if (reservationDetails.packageType) {
      fetchPackageDetails();
    }
  }, [reservationDetails.packageType]);

  const handleEditCustomerInfo = () => {
    navigate("/inquiry/info", {
      state: {
        searchParams,
        customerInfo,
        reservationDetails,
        otherOptions,
        isEditing: true,
      },
    });
  };

  const renderPackageServices = (pkg: PackageOption) => {
    if (!pkg) return null;

    return (
      <Grid container spacing={3}>
        {/* Price Information */}
        <Grid item xs={12}>
          {pkg.priceMin && pkg.priceMax ? (
            <Typography variant="h6" color="primary" gutterBottom>
              Price Range: RM {pkg.priceMin} - RM {pkg.priceMax}
            </Typography>
          ) : (
            <Typography variant="h6" color="primary" gutterBottom>
              RM {pkg.price}
            </Typography>
          )}
        </Grid>

        {/* Services */}
        {pkg.services && pkg.services.length > 0 && (
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" gutterBottom sx={{ color: "#555" }}>
              Services Included:
            </Typography>
            <List dense>
              {pkg.services.map((service, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <CircleIcon sx={{ fontSize: 8, color: "#0384BD" }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={service}
                    primaryTypographyProps={{
                      sx: { color: "#555" },
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Grid>
        )}

        {/* Fishing Specific Details */}
        {pkg.techniques && pkg.techniques.length > 0 && (
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" gutterBottom sx={{ color: "#555" }}>
              Fishing Techniques:
            </Typography>
            <List dense>
              {pkg.techniques.map((technique, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <CircleIcon sx={{ fontSize: 8, color: "#0384BD" }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={technique}
                    primaryTypographyProps={{
                      sx: { color: "#555" },
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Grid>
        )}

        {/* Distance Information */}
        {pkg.distance && (
          <Grid item xs={12} sx={{ mb: 0, pb: 0 }}>
            <Typography
              variant="body1"
              sx={{
                color: "#000",
                mb: 0,
                pb: 0,
                lineHeight: 1.5,
              }}
            >
              {pkg.distance} distance covered
            </Typography>
          </Grid>
        )}

        {/* Add-ons Section */}
        {reservationDetails.addOns && reservationDetails.addOns.length > 0 && (
          <Grid item xs={12} sx={{ mt: 0, pt: 0 }}>
            <Typography
              variant="subtitle1"
              sx={{
                color: "#000",
                mt: 0,
                pt: 0,
                mb: 1,
                lineHeight: 1.5,
              }}
            >
              Add-ons:
            </Typography>
            <List dense>
              {reservationDetails.addOns.map((addonId) => {
                const addon = addOns.find((a) => a.id === addonId);
                return addon ? (
                  <ListItem key={addon.id}>
                    <ListItemIcon>
                      <CircleIcon sx={{ fontSize: 8, color: "#0384BD" }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={`${addon.name} (RM ${addon.price})`}
                      primaryTypographyProps={{
                        sx: { color: "#000" },
                      }}
                    />
                  </ListItem>
                ) : null;
              })}
            </List>
          </Grid>
        )}
      </Grid>
    );
  };

  const handleSendInquiry = async () => {
    try {
      setIsLoading(true);
      const bookingData = {
        bookingId,
        customerInfo,
        reservationDetails,
        otherOptions,
        packageDetails: selectedPackage,
        totalAmount:
          (selectedPackage?.priceMin || selectedPackage?.price || 0) +
          reservationDetails.addOns.reduce((total, addonId) => {
            const addon = addOns.find((a) => a.id === addonId);
            return total + (addon?.price || 0);
          }, 0),
      };

      await axiosInstance.post("/api/bookings", bookingData);

      // Navigate to success page or show success message
      navigate("/booking-success", {
        state: {
          bookingId,
          totalAmount: bookingData.totalAmount,
        },
      });
    } catch (error) {
      console.error("Error sending inquiry:", error);
      setError("Failed to send inquiry. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header hideSearch={true} />
      <Container maxWidth="lg" sx={{ py: 6, flex: 1, mt: 2 }}>
        <Box sx={{ display: "flex", gap: 4 }}>
          {/* Left Column - 70% */}
          <Box sx={{ flex: "0 0 70%" }}>
            {/* Booking ID and Package Section */}
            <Paper
              elevation={0}
              sx={{
                p: 4,
                pb: 3,
                border: "none",
                bgcolor: "transparent",
                borderBottom: "1px solid #e0e0e0",
                mb: 3,
              }}
            >
              <Box>
                <Typography variant="h4" gutterBottom>
                  Booking ID:{" "}
                  <Box
                    component="span"
                    sx={{ color: "#0384BD", fontWeight: 500 }}
                  >
                    {bookingId}
                  </Box>
                </Typography>

                <Typography variant="h4" gutterBottom>
                  Package:{" "}
                  {isLoading ? (
                    <CircularProgress size={24} />
                  ) : error ? (
                    <Alert severity="error" sx={{ mt: 1 }}>
                      {error}
                    </Alert>
                  ) : selectedPackage ? (
                    <Box
                      component="span"
                      sx={{ color: "#333", fontWeight: 500 }}
                    >
                      {selectedPackage.title ||
                        selectedPackage.name ||
                        selectedPackage.description}
                    </Box>
                  ) : (
                    <Typography component="span" color="text.secondary">
                      No package selected
                    </Typography>
                  )}
                </Typography>
              </Box>
            </Paper>

            {/* Description Section */}
            <Paper
              elevation={0}
              sx={{
                p: 4,
                pt: 3,
                border: "none",
                bgcolor: "transparent",
                borderBottom: "1px solid #e0e0e0",
                mb: 4,
              }}
            >
              <Box>
                <Typography
                  variant="body1"
                  sx={{
                    color: "#555",
                    lineHeight: 1.8,
                    maxWidth: "800px",
                    fontStyle: "italic",
                  }}
                >
                  Embark on an unforgettable fishing adventure with RhuMuda Boat
                  Charter. Our experienced captains will take you to the best
                  fishing spots, where you can cast your line and reel in a
                  variety of fish species. Whether you're a seasoned angler or a
                  beginner, we'll provide you with all the necessary equipment
                  and expert guidance.
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: "#555",
                    lineHeight: 1.8,
                    maxWidth: "800px",
                    marginTop: "16px",
                    fontStyle: "italic",
                  }}
                >
                  Our fishing charters offer a unique opportunity to relax,
                  unwind, and enjoy the thrill of the catch. We cater to both
                  inshore, offshore, and night fishing - depending on your
                  preferences and the season.
                </Typography>
              </Box>
            </Paper>

            {/* Customer Details Section */}
            <Paper
              elevation={0}
              sx={{
                p: 4,
                pt: 3,
                pb: 10,
                border: "none",
                bgcolor: "transparent",
                borderBottom: "1px solid #e0e0e0",
                mb: 3,
              }}
            >
              <Typography variant="h4" gutterBottom>
                Customer Details
              </Typography>

              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  border: "1px solid #e0e0e0",
                  bgcolor: "#fff",
                  position: "relative",
                }}
              >
                <Grid container spacing={4}>
                  <Grid item xs={12} md={6}>
                    <Box>
                      <Typography variant="body1" gutterBottom>
                        <Box
                          component="span"
                          sx={{ color: "#000", fontWeight: "bold" }}
                        >
                          Name:{" "}
                        </Box>
                        {customerInfo.firstName} {customerInfo.lastName}
                      </Typography>

                      <Typography variant="body1" gutterBottom sx={{ mt: 2 }}>
                        <Box
                          component="span"
                          sx={{ color: "#000", fontWeight: "bold" }}
                        >
                          Email:{" "}
                        </Box>
                        {customerInfo.email}
                      </Typography>

                      <Typography variant="body1" gutterBottom sx={{ mt: 2 }}>
                        <Box
                          component="span"
                          sx={{ color: "#000", fontWeight: "bold" }}
                        >
                          Phone:{" "}
                        </Box>
                        {customerInfo.phoneNumber}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Box>
                      <Typography variant="body1">
                        <Box
                          component="span"
                          sx={{ color: "#000", fontWeight: "bold" }}
                        >
                          Address:{" "}
                        </Box>
                        {customerInfo.addressLine1}
                        {customerInfo.addressLine2 && (
                          <>
                            <br />
                            {customerInfo.addressLine2}
                          </>
                        )}
                        <br />
                        {customerInfo.city}, {customerInfo.postalCode}
                        <br />
                        {customerInfo.country}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>

                <Box
                  sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}
                >
                  <Button
                    onClick={handleEditCustomerInfo}
                    variant="contained"
                    size="small"
                    sx={{
                      bgcolor: "#0384BD",
                      color: "white",
                      "&:hover": {
                        bgcolor: "#026890",
                      },
                    }}
                  >
                    Edit Details
                  </Button>
                </Box>
              </Paper>
            </Paper>

            {/* Services Section */}
            <Paper
              elevation={0}
              sx={{
                p: 4,
                pt: 3,
                pb: 3,
                border: "none",
                bgcolor: "transparent",
                borderBottom: "1px solid #e0e0e0",
                mb: 3,
              }}
            >
              <Typography variant="h4" gutterBottom>
                Services
              </Typography>

              {isLoading ? (
                <CircularProgress size={24} />
              ) : error ? (
                <Alert severity="error" sx={{ mt: 1 }}>
                  {error}
                </Alert>
              ) : selectedPackage ? (
                <Grid container spacing={3}>
                  {/* Services */}
                  {selectedPackage.services &&
                    selectedPackage.services.length > 0 && (
                      <Grid item xs={12}>
                        <List dense>
                          {selectedPackage.services.map((service, index) => (
                            <ListItem key={index}>
                              <ListItemIcon>
                                <CircleIcon
                                  sx={{ fontSize: 8, color: "#0384BD" }}
                                />
                              </ListItemIcon>
                              <ListItemText
                                primary={service}
                                primaryTypographyProps={{
                                  sx: { color: "#555" },
                                }}
                              />
                            </ListItem>
                          ))}
                        </List>
                      </Grid>
                    )}

                  {/* Distance Information */}
                  {selectedPackage.distance && (
                    <Grid item xs={12} sx={{ mb: 0, pb: 0 }}>
                      <Typography
                        variant="body1"
                        sx={{
                          color: "#000",
                          mb: 0,
                          pb: 0,
                          lineHeight: 1.5,
                        }}
                      >
                        {selectedPackage.distance} distance covered
                      </Typography>
                    </Grid>
                  )}

                  {/* Add-ons Section */}
                  {reservationDetails.addOns &&
                    reservationDetails.addOns.length > 0 && (
                      <Grid item xs={12} sx={{ mt: 0, pt: 0 }}>
                        <Typography
                          variant="subtitle1"
                          sx={{
                            color: "#000",
                            mt: 0,
                            pt: 0,
                            mb: 1,
                            lineHeight: 1.5,
                          }}
                        >
                          Add-ons:
                        </Typography>
                        <List dense>
                          {reservationDetails.addOns.map((addonId) => {
                            const addon = addOns.find((a) => a.id === addonId);
                            return addon ? (
                              <ListItem key={addon.id}>
                                <ListItemIcon>
                                  <CircleIcon
                                    sx={{ fontSize: 8, color: "#0384BD" }}
                                  />
                                </ListItemIcon>
                                <ListItemText
                                  primary={`${addon.name} (RM ${addon.price})`}
                                  primaryTypographyProps={{
                                    sx: { color: "#555" },
                                  }}
                                />
                              </ListItem>
                            ) : null;
                          })}
                        </List>
                      </Grid>
                    )}
                </Grid>
              ) : (
                <Typography color="text.secondary">
                  No package details available
                </Typography>
              )}
            </Paper>

            {/* Location Section */}
            <Paper
              elevation={0}
              sx={{
                p: 4,
                pb: 10,
                border: "none",
                bgcolor: "transparent",
                borderBottom: "1px solid #e0e0e0",
                mb: 4,
              }}
            >
              <Typography variant="h4" gutterBottom>
                Location
              </Typography>

              <Box>
                <Box
                  component="a"
                  href={
                    JETTY_COORDINATES[
                      reservationDetails.jettyLocation as keyof typeof JETTY_COORDINATES
                    ].mapUrl
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    display: "block",
                    position: "relative",
                    cursor: "pointer",
                    maxWidth: "600px",
                    "&:hover": {
                      "& .hover-overlay": {
                        opacity: 1,
                      },
                    },
                  }}
                >
                  <Box
                    component="img"
                    src={rhumudaMap}
                    alt="Location Map"
                    sx={{
                      width: "100%",
                      height: "300px",
                      display: "block",
                      border: "none",
                      objectFit: "cover",
                    }}
                  />
                  <Box
                    className="hover-overlay"
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      bgcolor: "rgba(3, 132, 189, 0.1)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      opacity: 0,
                      transition: "opacity 0.2s",
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{
                        color: "#0384BD",
                        bgcolor: "rgba(255, 255, 255, 0.9)",
                        px: 2,
                        py: 1,
                      }}
                    >
                      Open in Google Maps
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Paper>

            {/* Cancellation Policy Section */}
            <Paper
              elevation={0}
              sx={{
                p: 4,
                pb: 10,
                border: "none",
                bgcolor: "transparent",
                borderBottom: "1px solid #e0e0e0",
                mb: 4,
              }}
            >
              <Typography variant="h4" gutterBottom>
                Cancellation Policy
              </Typography>
              <Typography variant="body1" sx={{ color: "#555" }}>
                Full refund up to 7 days prior
              </Typography>
            </Paper>
          </Box>

          {/* Right Column - 30% */}
          <Box
            sx={{
              flex: "0 0 30%",
              position: "sticky",
              top: 24,
              alignSelf: "flex-start",
              height: "fit-content",
            }}
          >
            <Paper
              elevation={0}
              sx={{
                p: 4,
                border: "1px solid #e0e0e0",
                bgcolor: "#fff",
              }}
            >
              <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                Estimated Cost
              </Typography>

              <Typography
                variant="h4"
                gutterBottom
                sx={{ mb: 4, fontWeight: 500 }}
              >
                MYR{" "}
                {(selectedPackage?.priceMin || selectedPackage?.price || 0) +
                  reservationDetails.addOns.reduce((total, addonId) => {
                    const addon = addOns.find((a) => a.id === addonId);
                    return total + (addon?.price || 0);
                  }, 0)}
                .00
              </Typography>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" sx={{ color: "#000" }} gutterBottom>
                  Jetty Location
                </Typography>
                <Typography variant="body1" sx={{ color: "#555" }}>
                  {reservationDetails.jettyLocation}
                </Typography>
              </Box>

              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={6}>
                  <Typography variant="subtitle1" sx={{ color: "#000" }} gutterBottom>
                    Date
                  </Typography>
                  <Typography variant="body1" sx={{ color: "#555" }}>
                    {reservationDetails.bookingDate}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle1" sx={{ color: "#000" }} gutterBottom>
                    Group Size
                  </Typography>
                  <Typography variant="body1" sx={{ color: "#555" }}>
                    {reservationDetails.numberOfPassengers}
                  </Typography>
                </Grid>
              </Grid>

              <Button
                fullWidth
                onClick={handleSendInquiry}
                sx={{
                  bgcolor: "#0384BD",
                  color: "white",
                  py: 1.5,
                  mb: 4,
                  "&:hover": {
                    bgcolor: "#026890",
                  },
                }}
              >
                Send Inquiry
              </Button>

              <Box sx={{ borderTop: "1px solid #e0e0e0", pt: 3 }}>
                <Grid container justifyContent="space-between" sx={{ mb: 1 }}>
                  <Typography variant="subtitle1">Base Cost</Typography>
                  <Typography variant="subtitle1">
                    RM {selectedPackage?.priceMin || selectedPackage?.price}
                  </Typography>
                </Grid>

                {reservationDetails.addOns &&
                reservationDetails.addOns.length > 0 ? (
                  <>
                    <Grid
                      container
                      justifyContent="space-between"
                      sx={{ mb: 1 }}
                    >
                      <Typography variant="subtitle1">Add On:</Typography>
                      <Typography variant="subtitle1">
                        {reservationDetails.addOns.map((addonId) => {
                          const addon = addOns.find((a) => a.id === addonId);
                          return addon ? (
                            <Box key={addon.id} sx={{ textAlign: "right" }}>
                              RM {addon.price}
                            </Box>
                          ) : null;
                        })}
                      </Typography>
                    </Grid>
                  </>
                ) : (
                  <Grid container justifyContent="space-between" sx={{ mb: 1 }}>
                    <Typography variant="subtitle1">Add On:</Typography>
                    <Typography variant="subtitle1">None</Typography>
                  </Grid>
                )}

                <Grid
                  container
                  justifyContent="space-between"
                  sx={{
                    borderTop: "1px solid #e0e0e0",
                    pt: 2,
                    mt: 2,
                  }}
                >
                  <Typography variant="h6">Total</Typography>
                  <Typography variant="h6">
                    RM{" "}
                    {(selectedPackage?.priceMin ||
                      selectedPackage?.price ||
                      0) +
                      reservationDetails.addOns.reduce((total, addonId) => {
                        const addon = addOns.find((a) => a.id === addonId);
                        return total + (addon?.price || 0);
                      }, 0)}
                    .00
                  </Typography>
                </Grid>
              </Box>
            </Paper>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default SummaryPage;
