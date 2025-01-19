import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Checkbox,
  Button,
  FormHelperText,
  IconButton,
  CircularProgress,
  FormControlLabel,
  Skeleton,
  Alert,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import dayjs from "dayjs";
import Header from "../components/layout/Header";
import axiosInstance from "../config/axios";
import CircleIcon from "@mui/icons-material/Circle";
import { CheckCircleOutline } from "@mui/icons-material";

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

interface PackageOption {
  id: number;
  title: string;
  name: string;
  type: string;
  description: string;
  price: number;
  services: string[];

  // Boat package specific fields
  adultPrice?: number;
  kidPrice?: number;
  privateBoatPrice?: number;

  // Fishing package specific fields
  priceMin?: number;
  priceMax?: number;
  distance?: string;
  techniques?: string[];
}

interface PackageServices {
  services: string[];
  techniques?: string[]; // For fishing packages
  distance?: string; // For fishing packages
}

interface AddOn {
  id: string;
  name: string;
  price: number;
}

const addOns: AddOn[] = [
  { id: "lifejacket", name: "Life jacket & Safety equipments", price: 10 },
  { id: "snorkeling", name: "Snorkeling in water garden", price: 10 },
  { id: "boattour", name: "Boat tour around Pulau Kapas", price: 25 },
  { id: "lunch", name: "Lunch Set", price: 10 },
  { id: "guide", name: "Tourist Guide", price: 10 },
];

const InquiryReservation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { searchParams, customerInfo } = location.state as {
    searchParams: SearchParams;
    customerInfo: CustomerInfo;
  };

  const [reservationDetails, setReservationDetails] =
    useState<ReservationDetails>({
      jettyLocation: searchParams?.jettyPoint || "",
      bookingDate: searchParams?.bookingDate || "",
      numberOfPassengers: searchParams?.passengers || 1,
      packageType: "",
      addOns: [],
    });

  const [packages, setPackages] = useState<PackageOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [touchedFields, setTouchedFields] = useState<{
    [key: string]: boolean;
  }>({});

  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(
    reservationDetails.bookingDate
      ? dayjs(reservationDetails.bookingDate, "DD/MM/YYYY")
      : null
  );

  const [selectedPackage, setSelectedPackage] = useState<PackageOption | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPackages = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get("/api/packages");
        console.log("API Response:", response.data);
        setPackages(response.data);
      } catch (err) {
        console.error("Error fetching packages:", err);
        setError("Failed to load packages. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPackages();
  }, []);

  const getPackageServices = (packageId: string): string[] => {
    // If packages haven't loaded yet, return empty array
    if (!packages || packages.length === 0) {
      return [];
    }

    const selectedPackage = packages.find((pkg) => pkg.id === packageId);

    if (!selectedPackage || !selectedPackage.services) {
      return [];
    }

    const services = [...selectedPackage.services];

    // Add fishing-specific info if available
    if ("techniques" in selectedPackage && selectedPackage.techniques) {
      if (selectedPackage.distance) {
        services.push(`Distance: ${selectedPackage.distance}`);
      }
      selectedPackage.techniques.forEach((technique) => {
        services.push(`Technique: ${technique}`);
      });
    }

    return services;
  };

  const handleReservationChange =
    (field: keyof ReservationDetails) =>
    (event: React.ChangeEvent<{ value: unknown }>) => {
      setReservationDetails((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
      setTouchedFields((prev) => ({
        ...prev,
        [field]: true,
      }));
    };

  const shouldShowReservationError = (field: string) => {
    return (
      touchedFields[field] &&
      !reservationDetails[field as keyof ReservationDetails]
    );
  };

  const validateReservationDetails = () => {
    const requiredFields: (keyof ReservationDetails)[] = [
      "jettyLocation",
      "bookingDate",
      "numberOfPassengers",
      "packageType",
    ];

    const newTouchedFields = requiredFields.reduce(
      (acc, field) => ({
        ...acc,
        [field]: true,
      }),
      {}
    );

    setTouchedFields(newTouchedFields);

    return requiredFields.every((field) => reservationDetails[field]);
  };

  const handleNext = () => {
    if (!validateReservationDetails()) {
      return;
    }

    navigate("/inquiry/options", {
      state: {
        searchParams,
        customerInfo,
        reservationDetails,
      },
    });
  };

  const handleDateChange = (date: dayjs.Dayjs | null) => {
    if (date) {
      setSelectedDate(date);
      setReservationDetails((prev) => ({
        ...prev,
        bookingDate: date.format("DD/MM/YYYY"),
      }));
      setShowCalendar(false);
    }
  };

  const handleAddOnToggle = (addonId: string) => {
    setReservationDetails((prev) => {
      const currentAddOns = prev.addOns || [];
      const newAddOns = currentAddOns.includes(addonId)
        ? currentAddOns.filter((id) => id !== addonId)
        : [...currentAddOns, addonId];

      return {
        ...prev,
        addOns: newAddOns,
      };
    });
  };

  const handlePackageSelection = (packageId: string) => {
    console.log("Selected package ID:", packageId);
    console.log("Available packages:", packages);

    if (!packageId) {
      console.error("No package ID provided");
      return;
    }

    try {
      const selected = packages.find(
        (pkg) => String(pkg.id) === String(packageId)
      );
      console.log("Found selected package:", selected);

      if (selected) {
        setSelectedPackage(selected);
        setReservationDetails((prev) => ({
          ...prev,
          packageType: packageId,
        }));
      } else {
        console.error("Package not found with ID:", packageId);
        setError("Selected package not found");
      }
    } catch (err) {
      console.error("Error in package selection:", err);
      setError("Error selecting package");
    }
  };

  const renderPackageDetails = (pkg: PackageOption) => {
    if (!pkg) return null;

    return (
      <Box>
        {pkg.title && (
          <Typography variant="h6" gutterBottom>
            {pkg.title}
          </Typography>
        )}

        {pkg.description && (
          <Typography variant="body1" gutterBottom>
            {pkg.description}
          </Typography>
        )}

        {pkg.price && (
          <Typography variant="h6" color="primary" gutterBottom>
            RM {pkg.price}
          </Typography>
        )}

        {pkg.services && pkg.services.length > 0 && (
          <>
            <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
              Services Included:
            </Typography>
            <List dense>
              {pkg.services.map((service, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <CircleIcon sx={{ fontSize: 8 }} />
                  </ListItemIcon>
                  <ListItemText primary={service} />
                </ListItem>
              ))}
            </List>
          </>
        )}

        {pkg.techniques && pkg.techniques.length > 0 && (
          <>
            <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
              Fishing Techniques:
            </Typography>
            <List dense>
              {pkg.techniques.map((technique, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <CircleIcon sx={{ fontSize: 8 }} />
                  </ListItemIcon>
                  <ListItemText primary={technique} />
                </ListItem>
              ))}
            </List>
          </>
        )}

        {pkg.distance && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Distance: {pkg.distance}
          </Typography>
        )}
      </Box>
    );
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.default",
      }}
    >
      <Header hideSearch={true} />
      <Container
        maxWidth="lg"
        sx={{
          py: 6,
          flex: 1,
          mt: 2,
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          align="center"
          sx={{
            fontFamily: "Playfair Display, serif",
            mb: 4,
          }}
        >
          Reservation Details
        </Typography>

        <Paper
          elevation={0}
          sx={{
            p: 4,
            border: "1px solid #e0e0e0",
            bgcolor: "#f5f5f5",
          }}
        >
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <FormControl
                fullWidth
                error={shouldShowReservationError("jettyLocation")}
                sx={{
                  bgcolor: "white",
                  borderRadius: 1,
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: shouldShowReservationError("jettyLocation")
                        ? "error.main"
                        : "#e0e0e0",
                    },
                  },
                }}
              >
                <InputLabel required>Jetty Location</InputLabel>
                <Select
                  value={reservationDetails.jettyLocation}
                  onChange={handleReservationChange("jettyLocation")}
                  label="Jetty Location"
                  onBlur={() =>
                    setTouchedFields((prev) => ({
                      ...prev,
                      jettyLocation: true,
                    }))
                  }
                >
                  <MenuItem value="Rhumuda">Rhumuda</MenuItem>
                  <MenuItem value="Kuala Terengganu">Kuala Terengganu</MenuItem>
                </Select>
                {shouldShowReservationError("jettyLocation") && (
                  <FormHelperText>Jetty location is required</FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl
                fullWidth
                error={shouldShowReservationError("bookingDate")}
                sx={{
                  position: "relative",
                  bgcolor: "white",
                  borderRadius: 1,
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: shouldShowReservationError("bookingDate")
                        ? "error.main"
                        : "#e0e0e0",
                    },
                  },
                }}
              >
                <Box
                  onClick={() => setShowCalendar(!showCalendar)}
                  sx={{
                    p: 2,
                    border: "1px solid",
                    borderColor: shouldShowReservationError("bookingDate")
                      ? "error.main"
                      : "#e0e0e0",
                    borderRadius: 1,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography
                    color={
                      reservationDetails.bookingDate
                        ? "text.primary"
                        : "text.secondary"
                    }
                  >
                    {reservationDetails.bookingDate || "Select Date"}
                  </Typography>
                  <CalendarTodayIcon />
                </Box>
                {showCalendar && (
                  <Paper
                    sx={{
                      position: "absolute",
                      zIndex: 1000,
                      mt: 1,
                    }}
                  >
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DateCalendar
                        value={selectedDate}
                        onChange={handleDateChange}
                        minDate={dayjs().add(1, "day")}
                        maxDate={dayjs().add(3, "months")}
                      />
                    </LocalizationProvider>
                  </Paper>
                )}
                {shouldShowReservationError("bookingDate") && (
                  <FormHelperText>Booking date is required</FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl
                fullWidth
                error={shouldShowReservationError("numberOfPassengers")}
                sx={{
                  bgcolor: "white",
                  borderRadius: 1,
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: shouldShowReservationError(
                        "numberOfPassengers"
                      )
                        ? "error.main"
                        : "#e0e0e0",
                    },
                  },
                }}
              >
                <InputLabel required>Number of Passengers</InputLabel>
                <Select
                  value={reservationDetails.numberOfPassengers}
                  onChange={handleReservationChange("numberOfPassengers")}
                  label="Number of Passengers"
                  onBlur={() =>
                    setTouchedFields((prev) => ({
                      ...prev,
                      numberOfPassengers: true,
                    }))
                  }
                >
                  {[...Array(20)].map((_, i) => (
                    <MenuItem key={i + 1} value={i + 1}>
                      {i + 1}
                    </MenuItem>
                  ))}
                </Select>
                {shouldShowReservationError("numberOfPassengers") && (
                  <FormHelperText>
                    Number of passengers is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl
                fullWidth
                error={shouldShowReservationError("packageType")}
                sx={{
                  bgcolor: "white",
                  borderRadius: 1,
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: shouldShowReservationError("packageType")
                        ? "error.main"
                        : "#e0e0e0",
                    },
                  },
                }}
              >
                <InputLabel required>Package Type</InputLabel>
                <Select
                  value={reservationDetails.packageType || ""}
                  label="Package Type"
                  onChange={(e) => handlePackageSelection(e.target.value)}
                  onBlur={() =>
                    setTouchedFields((prev) => ({ ...prev, packageType: true }))
                  }
                >
                  {isLoading ? (
                    <MenuItem key="loading-state" disabled>
                      Loading packages...
                    </MenuItem>
                  ) : error ? (
                    <MenuItem key="error-state" disabled>
                      {error}
                    </MenuItem>
                  ) : packages && packages.length > 0 ? (
                    packages.map((pkg) => {
                      console.log("Package data:", pkg);

                      return (
                        <MenuItem key={pkg.id} value={pkg.id}>
                          {pkg.description}
                        </MenuItem>
                      );
                    })
                  ) : (
                    <MenuItem key="no-packages-state" disabled>
                      No packages available
                    </MenuItem>
                  )}
                </Select>
                {shouldShowReservationError("packageType") && (
                  <FormHelperText>Package type is required</FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="h6" gutterBottom>
                Add Ons:
              </Typography>
              <List>
                {addOns.map((addon) => (
                  <ListItem key={`addon-${addon.id}`} dense>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={reservationDetails.addOns.includes(addon.id)}
                          onChange={() => handleAddOnToggle(addon.id)}
                        />
                      }
                      label={`${addon.name} | RM ${addon.price}`}
                    />
                  </ListItem>
                ))}
              </List>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="h6" gutterBottom>
                Package Info
              </Typography>
              {isLoading ? (
                <Box sx={{ p: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <CircularProgress size={20} sx={{ mr: 2 }} />
                    <Typography variant="body2" color="text.secondary">
                      Loading package details...
                    </Typography>
                  </Box>
                  <Skeleton variant="text" width="60%" sx={{ mb: 1 }} />
                  <Skeleton variant="text" width="40%" sx={{ mb: 1 }} />
                  <Skeleton variant="text" width="70%" sx={{ mb: 1 }} />
                  <Skeleton variant="text" width="50%" sx={{ mb: 1 }} />
                </Box>
              ) : error ? (
                <Alert severity="error" sx={{ mt: 1 }}>
                  {error}
                </Alert>
              ) : !selectedPackage ? (
                <Typography color="text.secondary">
                  Please select a package to view details
                </Typography>
              ) : (
                renderPackageDetails(selectedPackage)
              )}
            </Grid>
          </Grid>

          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
            <Button
              onClick={handleNext}
              sx={{
                bgcolor: "#0384BD",
                color: "white",
                "&:hover": {
                  bgcolor: "#026890",
                },
              }}
            >
              Next
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default InquiryReservation;
