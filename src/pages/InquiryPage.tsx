import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  Box,
  Stepper,
  Step,
  StepLabel,
  Grid,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Checkbox,
  FormControlLabel,
  Button,
  FormHelperText,
  Popover,
  IconButton,
  CircularProgress,
  Skeleton,
  Alert,
} from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle";
import axiosInstance from "../config/axios";
import Header from "../components/layout/Header";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import PersonIcon from "@mui/icons-material/Person";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import dayjs from "dayjs";

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

interface AddOn {
  id: string;
  name: string;
  price: number;
}

interface OtherOptions {
  alternativeDate1: string;
  alternativeDate2: string;
  remarks: string;
}

interface BookingConfirmation {
  bookingId: string;
  customerName: string;
  packageType: string;
  bookingDate: string;
  numberOfPassengers: number;
  addOns: string[];
  alternativeDates: string[];
}

interface PackageOption {
  packageId: string;
  title: string;
  packageType: string;
  description: string;
  duration: string;
  capacity: number;
  adultPrice?: number;
  kidPrice?: number;
  privateBoatPrice?: number;
  services: string[];
}

interface PackageServices {
  services: string[];
  techniques?: string[]; // For fishing packages
  distance?: string; // For fishing packages
}

const steps = [
  "Customer Info",
  "Reservation Details",
  "Other Option",
  "Confirmation",
];

const packageTypes = [
  "Day Trip Package 1",
  "Day Trip Package 2",
  "Day Trip Package 3",
];

const addOns: AddOn[] = [
  { id: "lifejacket", name: "Life jacket & Safety equipments", price: 10 },
  { id: "snorkeling", name: "Snorkeling in water garden", price: 10 },
  { id: "boattour", name: "Boat tour around Pulau Kapas", price: 25 },
  { id: "lunch", name: "Lunch Set", price: 10 },
  { id: "guide", name: "Tourist Guide", price: 10 },
];

const packageInfo = [
  "Return Trip",
  "Free Activity",
  "Life jacket and snorkeling",
  "Safety Equipment",
];

const jettyLocations = ["Rhumuda", "Kuala Terengganu"];

const InquiryPage = () => {
  const location = useLocation();
  const searchParams = location.state as SearchParams;
  const navigate = useNavigate();

  console.log("Received search params:", searchParams);

  const [activeStep, setActiveStep] = useState(0);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    addressLine1: "",
    addressLine2: "",
    postalCode: "",
    city: "",
    country: "",
  });

  const [reservationDetails, setReservationDetails] =
    useState<ReservationDetails>({
      jettyLocation: "",
      bookingDate: "",
      numberOfPassengers: 0,
      packageType: "",
      addOns: [],
    });

  const [otherOptions, setOtherOptions] = useState<OtherOptions>({
    alternativeDate1: "",
    alternativeDate2: "",
    remarks: "",
  });

  const [bookingConfirmation, setBookingConfirmation] =
    useState<BookingConfirmation | null>(null);

  const [packages, setPackages] = useState<PackageOption[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [touchedFields, setTouchedFields] = useState<{
    [key: string]: boolean;
  }>({});

  const [passengerAnchorEl, setPassengerAnchorEl] =
    useState<null | HTMLElement>(null);
  const [dateAnchorEl, setDateAnchorEl] = useState<null | HTMLElement>(null);

  const [selectedPackage, setSelectedPackage] = useState<PackageOption | null>(
    null
  );

  useEffect(() => {
    if (location.state) {
      const params = location.state as SearchParams;
      console.log("Setting reservation details with:", params);

      const matchedLocation = jettyLocations.find(
        (loc) =>
          loc.toLowerCase() ===
          params.jettyPoint.toLowerCase().replace(/-/g, " ")
      );

      let formattedDate = "";
      if (params.bookingDate) {
        const [day, month, year] = params.bookingDate.split("/");
        formattedDate = `${year}-${month}-${day}`;
      }

      if (matchedLocation) {
        setReservationDetails((prev) => ({
          ...prev,
          jettyLocation: matchedLocation,
          bookingDate: formattedDate,
          numberOfPassengers: Number(params.passengers) || 0,
        }));
      } else {
        console.error(
          "Received jetty location does not match available options:",
          {
            received: params.jettyPoint,
            available: jettyLocations,
          }
        );
      }

      console.log("Formatted date:", {
        original: params.bookingDate,
        formatted: formattedDate,
      });
    }
  }, [location.state]);

  const handlePassengerClick = (event: React.MouseEvent<HTMLElement>) => {
    setPassengerAnchorEl(event.currentTarget);
  };

  const handlePassengerClose = () => {
    setPassengerAnchorEl(null);
  };

  const handlePassengerChange = (change: number) => {
    const newValue = reservationDetails.numberOfPassengers + change;
    if (newValue >= 0 && newValue <= 20) {
      setReservationDetails((prev) => ({
        ...prev,
        numberOfPassengers: newValue,
      }));
    }
  };

  const handleDateClick = (event: React.MouseEvent<HTMLElement>) => {
    setDateAnchorEl(event.currentTarget);
  };

  const handleDateClose = () => {
    setDateAnchorEl(null);
  };

  const handleDateChange = (date: dayjs.Dayjs | null) => {
    if (date) {
      setReservationDetails((prev) => ({
        ...prev,
        bookingDate: date.format("YYYY-MM-DD"),
      }));
      handleDateClose();
    }
  };

  useEffect(() => {
    const fetchPackages = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axiosInstance.get("/api/packages");
        if (!response.data) {
          throw new Error("No data received from server");
        }
        setPackages(response.data);
      } catch (error) {
        console.error("Error fetching packages:", error);
        setError("Failed to load packages");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPackages();
  }, []);

  const handleInputChange =
    (field: keyof CustomerInfo) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setCustomerInfo((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
      setTouchedFields((prev) => ({
        ...prev,
        [field]: true,
      }));
    };

  const handleReservationChange =
    (field: keyof ReservationDetails) =>
    (event: React.ChangeEvent<HTMLInputElement | { value: unknown }>) => {
      const value = event.target.value;
      setReservationDetails((prev) => ({
        ...prev,
        [field]: value,
      }));
      setTouchedFields((prev) => ({
        ...prev,
        [field]: true,
      }));
    };

  const handleAddOnToggle = (addOnId: string) => {
    setReservationDetails((prev) => ({
      ...prev,
      addOns: prev.addOns.includes(addOnId)
        ? prev.addOns.filter((id) => id !== addOnId)
        : [...prev.addOns, addOnId],
    }));
  };

  const handleNext = () => {
    let isValid = true;

    if (activeStep === 0) {
      isValid = validateCustomerInfo();
    } else if (activeStep === 1) {
      isValid = validateReservationDetails();
    }

    if (!isValid) {
      // Optionally show an error message
      return;
    }

    if (activeStep === 2) {
      handleSubmit();
      return;
    }

    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleOtherOptionsChange =
    (field: keyof OtherOptions) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setOtherOptions((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
    };

  const handleSubmit = async () => {
    try {
      // Create the request payload matching our backend structure
      const bookingRequest = {
        packageId: reservationDetails.packageType, // We should map this to actual package IDs
        packageType: "DAYTRIP", // Hardcoded for now since we're only handling day trips
        bookingDate: new Date(reservationDetails.bookingDate).toISOString(),
        numberOfPassengers: reservationDetails.numberOfPassengers,
        jettyLocation: reservationDetails.jettyLocation,
        customerName: `${customerInfo.firstName} ${customerInfo.lastName}`,
        customerEmail: customerInfo.email,
        customerPhone: customerInfo.phoneNumber,
        specialRequests: otherOptions.remarks,
        addOns: reservationDetails.addOns,
        alternativeDate1: otherOptions.alternativeDate1
          ? new Date(otherOptions.alternativeDate1).toISOString()
          : null,
        alternativeDate2: otherOptions.alternativeDate2
          ? new Date(otherOptions.alternativeDate2).toISOString()
          : null,
        customer: {
          firstName: customerInfo.firstName,
          lastName: customerInfo.lastName,
          email: customerInfo.email,
          phoneNumber: customerInfo.phoneNumber,
          addressLine1: customerInfo.addressLine1,
          addressLine2: customerInfo.addressLine2,
          postalCode: customerInfo.postalCode,
          city: customerInfo.city,
          country: customerInfo.country,
        },
      };

      const response = await axiosInstance.post(
        "/api/bookings",
        bookingRequest
      );

      // Update booking confirmation with response data
      setBookingConfirmation({
        bookingId: response.data.bookingId,
        customerName: `${customerInfo.firstName} ${customerInfo.lastName}`,
        packageType: reservationDetails.packageType,
        bookingDate: reservationDetails.bookingDate,
        numberOfPassengers: reservationDetails.numberOfPassengers,
        addOns: reservationDetails.addOns,
        alternativeDates: [
          otherOptions.alternativeDate1,
          otherOptions.alternativeDate2,
        ].filter(Boolean),
      });

      setActiveStep(3); // Move to confirmation step
    } catch (error) {
      console.error("Error submitting booking:", error);
      // TODO: Add error handling UI feedback
    }
  };

  const validateCustomerInfo = () => {
    const requiredFields: (keyof CustomerInfo)[] = [
      "firstName",
      "lastName",
      "phoneNumber",
      "email",
      "addressLine1",
      "postalCode",
      "city",
      "country",
    ];

    // Mark all fields as touched when validating
    const newTouchedFields = requiredFields.reduce(
      (acc, field) => ({
        ...acc,
        [field]: true,
      }),
      {}
    );

    setTouchedFields(newTouchedFields);

    return requiredFields.every((field) => customerInfo[field]);
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

  const shouldShowError = (field: string) => {
    return touchedFields[field] && !customerInfo[field];
  };

  const textFieldSx = (field: string) => ({
    bgcolor: "white",
    borderRadius: 1,
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: shouldShowError(field) ? "error.main" : "#e0e0e0",
      },
      "&:hover fieldset": {
        borderColor: shouldShowError(field) ? "error.light" : "#bdbdbd",
      },
    },
    "& .MuiFormLabel-root": {
      color: shouldShowError(field) ? "error.main" : "inherit",
    },
  });

  const shouldShowReservationError = (field: keyof ReservationDetails) => {
    return touchedFields[field] && !reservationDetails[field];
  };

  const getPackageServices = (packageId: string): string[] => {
    // If packages haven't loaded yet, return empty array
    if (!packages || packages.length === 0) {
      return [];
    }

    const selectedPackage = packages.find((pkg) => pkg.packageId === packageId);

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

  const handlePackageSelection = (packageId: string) => {
    const selected = packages.find((pkg) => pkg.packageId === packageId);
    setSelectedPackage(selected || null);
    handleReservationChange("packageType")({ target: { value: packageId } });
  };

  const renderReservationDetails = () => (
    <Paper
      elevation={0}
      sx={{ p: 4, border: "1px solid #e0e0e0", bgcolor: "#f5f5f5" }}
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
                setTouchedFields((prev) => ({ ...prev, jettyLocation: true }))
              }
            >
              {jettyLocations.map((location) => (
                <MenuItem key={location} value={location}>
                  {location}
                </MenuItem>
              ))}
            </Select>
            {shouldShowReservationError("jettyLocation") && (
              <FormHelperText>Jetty location is required</FormHelperText>
            )}
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl
            fullWidth
            error={shouldShowReservationError("numberOfPassengers")}
            sx={{
              bgcolor: "white",
              borderRadius: 1,
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: shouldShowReservationError("numberOfPassengers")
                    ? "error.main"
                    : "#e0e0e0",
                },
              },
            }}
          >
            <TextField
              required
              fullWidth
              label="Passengers"
              value={`${reservationDetails.numberOfPassengers} Passenger(s)`}
              onClick={handlePassengerClick}
              InputProps={{
                readOnly: true,
                startAdornment: (
                  <PersonIcon sx={{ mr: 1, color: "action.active" }} />
                ),
              }}
              error={shouldShowReservationError("numberOfPassengers")}
              helperText={
                shouldShowReservationError("numberOfPassengers")
                  ? "Number of passengers is required"
                  : ""
              }
            />
          </FormControl>
          <Popover
            open={Boolean(passengerAnchorEl)}
            anchorEl={passengerAnchorEl}
            onClose={handlePassengerClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            PaperProps={{
              sx: {
                p: 2,
                width: "300px",
              },
            }}
          >
            <Typography variant="h6" sx={{ mb: 2 }}>
              Group Size
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 2,
              }}
            >
              <IconButton
                onClick={() => handlePassengerChange(-1)}
                disabled={reservationDetails.numberOfPassengers <= 0}
              >
                <RemoveIcon />
              </IconButton>
              <Typography variant="h6">
                {reservationDetails.numberOfPassengers}
              </Typography>
              <IconButton
                onClick={() => handlePassengerChange(1)}
                disabled={reservationDetails.numberOfPassengers >= 20}
              >
                <AddIcon />
              </IconButton>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Maximum 20 passengers allowed
            </Typography>
          </Popover>
        </Grid>
        <Grid item xs={12}>
          <FormControl
            fullWidth
            error={shouldShowReservationError("bookingDate")}
            sx={{
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
            <TextField
              required
              fullWidth
              label="Booking Date"
              value={
                reservationDetails.bookingDate
                  ? dayjs(reservationDetails.bookingDate).format("DD/MM/YYYY")
                  : ""
              }
              onClick={handleDateClick}
              InputProps={{
                readOnly: true,
                startAdornment: (
                  <CalendarTodayIcon sx={{ mr: 1, color: "action.active" }} />
                ),
              }}
              error={shouldShowReservationError("bookingDate")}
              helperText={
                shouldShowReservationError("bookingDate")
                  ? "Booking date is required"
                  : ""
              }
            />
          </FormControl>
          <Popover
            open={Boolean(dateAnchorEl)}
            anchorEl={dateAnchorEl}
            onClose={handleDateClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            PaperProps={{
              sx: { p: 2 },
            }}
          >
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateCalendar
                value={
                  reservationDetails.bookingDate
                    ? dayjs(reservationDetails.bookingDate)
                    : null
                }
                onChange={handleDateChange}
                minDate={dayjs()}
                views={["day"]}
                sx={{
                  "& .MuiPickersDay-root.Mui-selected": {
                    backgroundColor: "#0384BD",
                    "&:hover": {
                      backgroundColor: "#026890",
                    },
                  },
                }}
              />
            </LocalizationProvider>
          </Popover>
        </Grid>
        <Grid item xs={12}>
          <FormControl
            fullWidth
            sx={{
              bgcolor: "white",
              borderRadius: 1,
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#e0e0e0",
                },
              },
            }}
          >
            <InputLabel>Package Type</InputLabel>
            <Select
              value={reservationDetails.packageType}
              label="Package Type"
              onChange={(e) => handlePackageSelection(e.target.value)}
            >
              {isLoading ? (
                <MenuItem disabled>Loading packages...</MenuItem>
              ) : error ? (
                <MenuItem disabled>{error}</MenuItem>
              ) : packages.length === 0 ? (
                <MenuItem disabled>No packages available</MenuItem>
              ) : (
                packages.map((pkg) => (
                  <MenuItem key={pkg.packageId} value={pkg.packageId}>
                    <Box>
                      <Typography variant="subtitle1">{pkg.title}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {pkg.description} | Duration: {pkg.duration} | Capacity:{" "}
                        {pkg.capacity} |{" "}
                        {pkg.privateBoatPrice
                          ? `RM${pkg.privateBoatPrice} (Private)`
                          : pkg.adultPrice
                          ? `From RM${pkg.adultPrice}`
                          : "Price varies"}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Typography variant="h6" gutterBottom>
            Add Ons:
          </Typography>
          <List>
            {addOns.map((addon) => (
              <ListItem key={addon.id} dense>
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

      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
        <Button
          onClick={handleBack}
          sx={{
            bgcolor: "#e0e0e0",
            color: "black",
            "&:hover": {
              bgcolor: "#d0d0d0",
            },
          }}
        >
          Previous
        </Button>
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
  );

  const renderOtherOptions = () => (
    <Paper elevation={0} sx={{ p: 4, border: "1px solid #e0e0e0" }}>
      <Typography variant="body1" gutterBottom>
        Provide other preference date if your date is flexible and you have
        other different options
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            type="date"
            label="Other Preference Date 1"
            value={otherOptions.alternativeDate1}
            onChange={handleOtherOptionsChange("alternativeDate1")}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            type="date"
            label="Other Preference Date 2"
            value={otherOptions.alternativeDate2}
            onChange={handleOtherOptionsChange("alternativeDate2")}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            Booking Remarks
          </Typography>
          <Typography variant="body2" gutterBottom color="text.secondary">
            Do you have any specific request for your booking?
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            value={otherOptions.remarks}
            onChange={handleOtherOptionsChange("remarks")}
          />
        </Grid>
      </Grid>

      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
        <Button
          onClick={handleBack}
          sx={{
            bgcolor: "#e0e0e0",
            color: "black",
            "&:hover": {
              bgcolor: "#d0d0d0",
            },
          }}
        >
          Previous
        </Button>
        <Button
          onClick={handleSubmit}
          sx={{
            bgcolor: "#0384BD",
            color: "white",
            "&:hover": {
              bgcolor: "#026890",
            },
          }}
        >
          Submit
        </Button>
      </Box>
    </Paper>
  );

  const renderConfirmation = () => (
    <Paper elevation={0} sx={{ p: 4, border: "1px solid #e0e0e0" }}>
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ color: "#0384BD" }}>
          Thank You for Your Booking!
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Your booking has been successfully submitted.
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          One of our agents will contact you within the next 24 hours to confirm
          your booking details.
        </Typography>
      </Box>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Booking Details
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Booking Reference
            </Typography>
            <Typography variant="body1" gutterBottom>
              {bookingConfirmation?.bookingId}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Customer Name
            </Typography>
            <Typography variant="body1" gutterBottom>
              {bookingConfirmation?.customerName}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Package Type
            </Typography>
            <Typography variant="body1" gutterBottom>
              {bookingConfirmation?.packageType}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Primary Booking Date
            </Typography>
            <Typography variant="body1" gutterBottom>
              {bookingConfirmation?.bookingDate}
            </Typography>
          </Grid>
          {bookingConfirmation?.alternativeDates.length > 0 && (
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="text.secondary">
                Alternative Dates
              </Typography>
              {bookingConfirmation.alternativeDates.map((date, index) => (
                <Typography key={index} variant="body1">
                  Option {index + 1}: {date}
                </Typography>
              ))}
            </Grid>
          )}
        </Grid>
      </Box>

      <Box sx={{ mt: 4, textAlign: "center" }}>
        <Button
          variant="contained"
          onClick={() => navigate("/")}
          sx={{
            bgcolor: "#0384BD",
            color: "white",
            "&:hover": {
              bgcolor: "#026890",
            },
          }}
        >
          Return to Home
        </Button>
      </Box>
    </Paper>
  );

  const renderPackageDetails = (pkg: PackageOption) => {
    if (pkg.packageType === "FISHING") {
      return (
        <Box>
          <Typography>
            Price from RM{pkg.priceMin} - RM{pkg.priceMax}
          </Typography>
          <Typography>Rent up to {pkg.duration}</Typography>
          <Typography>{pkg.capacity} persons max capacity</Typography>
          <Typography variant="h6" sx={{ mt: 2 }}>
            Service Includes:
          </Typography>
          <List>
            {pkg.services.map((service, index) => (
              <ListItem key={index} dense>
                <ListItemIcon>
                  <CircleIcon sx={{ fontSize: 8 }} />
                </ListItemIcon>
                <ListItemText primary={service} />
              </ListItem>
            ))}
          </List>
        </Box>
      );
    }

    return (
      <Box>
        {pkg.privateBoatPrice ? (
          <Typography>RM{pkg.privateBoatPrice} | Private boat</Typography>
        ) : (
          <>
            <Typography>RM{pkg.adultPrice} | Adult</Typography>
            {pkg.kidPrice && (
              <Typography>RM{pkg.kidPrice} | Kids (4-11)</Typography>
            )}
            <Typography>FREE | Kids (0-3)</Typography>
          </>
        )}
        <Typography variant="h6" sx={{ mt: 2 }}>
          Service Includes:
        </Typography>
        <List>
          {pkg.services.map((service, index) => (
            <ListItem key={index} dense>
              <ListItemIcon>
                <CircleIcon sx={{ fontSize: 8 }} />
              </ListItemIcon>
              <ListItemText primary={service} />
            </ListItem>
          ))}
        </List>
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
          Booking Details
        </Typography>

        <Stepper
          activeStep={activeStep}
          sx={{
            mb: 6,
            "& .MuiStepConnector-line": {
              marginTop: "12px",
            },
          }}
        >
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel
                StepIconProps={{
                  sx: {
                    width: 40,
                    height: 40,
                    "& .MuiStepIcon-text": {
                      display: "none",
                    },
                    "&.Mui-active": {
                      color: "#0384BD",
                    },
                    "&.Mui-completed": {
                      color: "#0384BD",
                    },
                  },
                }}
                sx={{
                  flexDirection: "column",
                  alignItems: "center",
                  "& .MuiStepLabel-label": {
                    marginTop: 1,
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    mt: 1.5,
                    textAlign: "center",
                  },
                }}
              >
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>

        {activeStep === 0 && (
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
                <TextField
                  required
                  fullWidth
                  label="First Name"
                  value={customerInfo.firstName}
                  onChange={handleInputChange("firstName")}
                  error={shouldShowError("firstName")}
                  helperText={
                    shouldShowError("firstName") ? "First name is required" : ""
                  }
                  onBlur={() =>
                    setTouchedFields((prev) => ({ ...prev, firstName: true }))
                  }
                  sx={textFieldSx("firstName")}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Last Name"
                  value={customerInfo.lastName}
                  onChange={handleInputChange("lastName")}
                  error={shouldShowError("lastName")}
                  helperText={
                    shouldShowError("lastName") ? "Last name is required" : ""
                  }
                  onBlur={() =>
                    setTouchedFields((prev) => ({ ...prev, lastName: true }))
                  }
                  sx={textFieldSx("lastName")}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Phone Number"
                  value={customerInfo.phoneNumber}
                  onChange={handleInputChange("phoneNumber")}
                  error={shouldShowError("phoneNumber")}
                  helperText={
                    shouldShowError("phoneNumber")
                      ? "Phone number is required"
                      : ""
                  }
                  onBlur={() =>
                    setTouchedFields((prev) => ({ ...prev, phoneNumber: true }))
                  }
                  sx={textFieldSx("phoneNumber")}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  type="email"
                  label="Email Address"
                  value={customerInfo.email}
                  onChange={handleInputChange("email")}
                  error={shouldShowError("email")}
                  helperText={
                    shouldShowError("email") ? "Email is required" : ""
                  }
                  onBlur={() =>
                    setTouchedFields((prev) => ({ ...prev, email: true }))
                  }
                  sx={textFieldSx("email")}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Address Line 1"
                  value={customerInfo.addressLine1}
                  onChange={handleInputChange("addressLine1")}
                  error={shouldShowError("addressLine1")}
                  helperText={
                    shouldShowError("addressLine1")
                      ? "Address line 1 is required"
                      : ""
                  }
                  onBlur={() =>
                    setTouchedFields((prev) => ({
                      ...prev,
                      addressLine1: true,
                    }))
                  }
                  sx={textFieldSx("addressLine1")}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address Line 2"
                  value={customerInfo.addressLine2}
                  onChange={handleInputChange("addressLine2")}
                  sx={{
                    bgcolor: "white",
                    borderRadius: 1,
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "#e0e0e0",
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  required
                  fullWidth
                  label="Postal Code"
                  value={customerInfo.postalCode}
                  onChange={handleInputChange("postalCode")}
                  error={shouldShowError("postalCode")}
                  helperText={
                    shouldShowError("postalCode")
                      ? "Postal code is required"
                      : ""
                  }
                  onBlur={() =>
                    setTouchedFields((prev) => ({ ...prev, postalCode: true }))
                  }
                  sx={textFieldSx("postalCode")}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  required
                  fullWidth
                  label="City"
                  value={customerInfo.city}
                  onChange={handleInputChange("city")}
                  error={shouldShowError("city")}
                  helperText={shouldShowError("city") ? "City is required" : ""}
                  onBlur={() =>
                    setTouchedFields((prev) => ({ ...prev, city: true }))
                  }
                  sx={textFieldSx("city")}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  required
                  fullWidth
                  label="Country"
                  value={customerInfo.country}
                  onChange={handleInputChange("country")}
                  error={shouldShowError("country")}
                  helperText={
                    shouldShowError("country") ? "Country is required" : ""
                  }
                  onBlur={() =>
                    setTouchedFields((prev) => ({ ...prev, country: true }))
                  }
                  sx={textFieldSx("country")}
                />
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
        )}
        {activeStep === 1 && renderReservationDetails()}
        {activeStep === 2 && renderOtherOptions()}
        {activeStep === 3 && renderConfirmation()}
      </Container>
    </Box>
  );
};

export default InquiryPage;
