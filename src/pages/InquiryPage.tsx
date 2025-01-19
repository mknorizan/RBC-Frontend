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
import { CheckCircleOutline, Home, Print } from "@mui/icons-material";

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
  status: string;
  message: string;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    addressLine1: string;
    addressLine2?: string;
    postalCode: string;
    city: string;
    country: string;
  };
  reservation: {
    jettyLocation: string;
    numberOfPassengers: number;
    bookingDate: string;
    packageType: string;
    packageDetails: {
      id: number;
      name: string;
      description: string;
      type: string;
      duration: string;
    } | null;
    addOns: string[];
  };
  otherOptions: {
    alternativeDate1?: string;
    alternativeDate2?: string;
    remarks?: string;
  };
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
      numberOfPassengers: 1,
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

  const [alternativeDate1AnchorEl, setAlternativeDate1AnchorEl] =
    useState<null | HTMLElement>(null);
  const [alternativeDate2AnchorEl, setAlternativeDate2AnchorEl] =
    useState<null | HTMLElement>(null);

  const [showThankYou, setShowThankYou] = useState(false);

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

  const handleAlternativeDateClick =
    (dateType: "alternativeDate1" | "alternativeDate2") =>
    (event: React.MouseEvent<HTMLElement>) => {
      if (dateType === "alternativeDate1") {
        setAlternativeDate1AnchorEl(event.currentTarget);
      } else {
        setAlternativeDate2AnchorEl(event.currentTarget);
      }
    };

  const handleAlternativeDateClose =
    (dateType: "alternativeDate1" | "alternativeDate2") => () => {
      if (dateType === "alternativeDate1") {
        setAlternativeDate1AnchorEl(null);
      } else {
        setAlternativeDate2AnchorEl(null);
      }
    };

  const handleAlternativeDateChange =
    (dateType: "alternativeDate1" | "alternativeDate2") =>
    (date: dayjs.Dayjs | null) => {
      if (date && dayjs.isDayjs(date)) {
        setOtherOptions((prev) => ({
          ...prev,
          [dateType]: date.format("YYYY-MM-DD"),
        }));
        handleAlternativeDateClose(dateType)();
      }
    };

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        console.log("Fetching packages...");
        const response = await axiosInstance.get("/api/packages");
        console.log("Raw packages response:", response.data);

        if (!response.data || !Array.isArray(response.data)) {
          console.error("Invalid packages data format:", response.data);
          setError("Failed to load packages: Invalid data format");
          return;
        }

        setPackages(response.data);
      } catch (err) {
        console.error("Error fetching packages:", err);
        setError(err?.response?.data?.message || "Failed to load packages");
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
    if (activeStep === 0 && !validateCustomerInfo()) {
      return;
    }
    if (activeStep === 1 && !validateReservationDetails()) {
      return;
    }
    if (activeStep === steps.length - 2) {
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
      setIsLoading(true);
      setError(null);

      const bookingData = {
        packageId: selectedPackage?.id.toString(),
        packageType: selectedPackage?.type || "",
        bookingDate: dayjs(reservationDetails.bookingDate).format("YYYY-MM-DD"),
        numberOfPassengers: reservationDetails.numberOfPassengers,
        jettyLocation: reservationDetails.jettyLocation,
        customerName: `${customerInfo.firstName} ${customerInfo.lastName}`,
        customerEmail: customerInfo.email,
        customerPhone: customerInfo.phoneNumber,
        specialRequests: otherOptions.remarks || "",
        addOns: Array.from(new Set(reservationDetails.addOns || [])),
        alternativeDate1: otherOptions.alternativeDate1
          ? dayjs(otherOptions.alternativeDate1).format("YYYY-MM-DD")
          : null,
        alternativeDate2: otherOptions.alternativeDate2
          ? dayjs(otherOptions.alternativeDate2).format("YYYY-MM-DD")
          : null,
        customerAddress: {
          addressLine1: customerInfo.addressLine1 || "",
          addressLine2: customerInfo.addressLine2 || "",
          postalCode: customerInfo.postalCode || "",
          city: customerInfo.city || "",
          country: customerInfo.country || "",
        },
      };

      console.log("Submitting booking data:", bookingData);
      const response = await axiosInstance.post("/api/bookings", bookingData);
      console.log("Booking response:", response.data);

      if (response.data && response.data.bookingId) {
        setBookingConfirmation(response.data);
        setActiveStep(steps.length);
        setShowThankYou(true);
        console.log("Setting booking confirmation:", response.data);
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (err: any) {
      console.error("Detailed error:", {
        message: err.message,
        response: err.response?.data,
        data: err.response?.data?.details || err.response?.data?.error,
      });
      setError(err.response?.data?.message || "Failed to submit booking");
    } finally {
      setIsLoading(false);
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
    console.log("Selected package ID:", packageId);
    console.log("Available packages:", packages);

    if (!packageId) {
      console.error("No package ID provided");
      return;
    }

    const selected = packages.find((pkg) => pkg.id === Number(packageId));
    console.log("Found selected package:", selected);

    if (selected) {
      setSelectedPackage(selected);
      setReservationDetails((prev) => ({
        ...prev,
        packageType: packageId,
      }));
    } else {
      console.error("Package not found with ID:", packageId);
    }
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
                <MenuItem key={`jetty-${location}`} value={location}>
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
              value={reservationDetails.bookingDate || ""}
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
                packages.map((pkg) => (
                  <MenuItem key={pkg.id} value={pkg.id}>
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
          <FormControl fullWidth sx={{ bgcolor: "white", borderRadius: 1 }}>
            <TextField
              label="Alternative Date 1"
              value={
                otherOptions.alternativeDate1
                  ? dayjs(otherOptions.alternativeDate1).format("DD/MM/YYYY")
                  : ""
              }
              placeholder="Select a date"
              helperText="Click to select a date"
              onClick={handleAlternativeDateClick("alternativeDate1")}
              InputProps={{
                readOnly: true,
                startAdornment: (
                  <CalendarTodayIcon sx={{ mr: 1, color: "action.active" }} />
                ),
              }}
            />
          </FormControl>
          <Popover
            open={Boolean(alternativeDate1AnchorEl)}
            anchorEl={alternativeDate1AnchorEl}
            onClose={handleAlternativeDateClose("alternativeDate1")}
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
                  otherOptions.alternativeDate1
                    ? dayjs(otherOptions.alternativeDate1)
                    : null
                }
                onChange={handleAlternativeDateChange("alternativeDate1")}
                minDate={dayjs()}
                views={["day"]}
              />
            </LocalizationProvider>
          </Popover>
        </Grid>

        <Grid item xs={12}>
          <FormControl fullWidth sx={{ bgcolor: "white", borderRadius: 1 }}>
            <TextField
              label="Alternative Date 2"
              value={
                otherOptions.alternativeDate2
                  ? dayjs(otherOptions.alternativeDate2).format("DD/MM/YYYY")
                  : ""
              }
              placeholder="Select a date"
              helperText="Click to select a date"
              onClick={handleAlternativeDateClick("alternativeDate2")}
              InputProps={{
                readOnly: true,
                startAdornment: (
                  <CalendarTodayIcon sx={{ mr: 1, color: "action.active" }} />
                ),
              }}
            />
          </FormControl>
          <Popover
            open={Boolean(alternativeDate2AnchorEl)}
            anchorEl={alternativeDate2AnchorEl}
            onClose={handleAlternativeDateClose("alternativeDate2")}
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
                  otherOptions.alternativeDate2
                    ? dayjs(otherOptions.alternativeDate2)
                    : null
                }
                onChange={handleAlternativeDateChange("alternativeDate2")}
                minDate={dayjs()}
                views={["day"]}
              />
            </LocalizationProvider>
          </Popover>
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
              {bookingConfirmation?.customer.firstName}{" "}
              {bookingConfirmation?.customer.lastName}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Package Type
            </Typography>
            <Typography variant="body1" gutterBottom>
              {bookingConfirmation?.reservation.packageDetails?.name}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Primary Booking Date
            </Typography>
            <Typography variant="body1" gutterBottom>
              {formatDisplayDate(bookingConfirmation?.reservation.bookingDate)}
            </Typography>
          </Grid>
          {bookingConfirmation?.otherOptions.alternativeDate1 && (
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="text.secondary">
                Alternative Date 1
              </Typography>
              <Typography variant="body1">
                {formatDisplayDate(
                  bookingConfirmation.otherOptions.alternativeDate1
                )}
              </Typography>
            </Grid>
          )}
          {bookingConfirmation?.otherOptions.alternativeDate2 && (
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="text.secondary">
                Alternative Date 2
              </Typography>
              <Typography variant="body1">
                {formatDisplayDate(
                  bookingConfirmation.otherOptions.alternativeDate2
                )}
              </Typography>
            </Grid>
          )}
          {bookingConfirmation?.otherOptions.remarks && (
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="text.secondary">
                Remarks
              </Typography>
              <Typography variant="body1">
                {bookingConfirmation.otherOptions.remarks}
              </Typography>
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
              <ListItem key={`service-${pkg.id}-${index}`} dense>
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
            <ListItem key={`service-${pkg.id}-${index}`} dense>
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

  const formatDisplayDate = (dateStr: string | null) => {
    if (!dateStr) return "";
    return dayjs(dateStr).format("YYYY-MM-DD");
  };

  const BookingConfirmationSection = ({
    confirmation,
  }: {
    confirmation: BookingConfirmation;
  }) => {
    console.log("Rendering confirmation section with:", confirmation);

    return (
      <Box sx={{ maxWidth: 800, mx: "auto", p: 3 }}>
        <Paper sx={{ p: 4, mb: 4 }}>
          <Typography variant="h4" gutterBottom color="primary" align="center">
            Thank You for Your Booking!
          </Typography>
          <Typography
            variant="subtitle1"
            gutterBottom
            align="center"
            sx={{ mb: 4 }}
          >
            Your booking reference number is:{" "}
            <strong>{confirmation.bookingId}</strong>
          </Typography>

          {/* Customer Information */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom color="primary">
              Customer Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography>
                  <strong>Name:</strong> {confirmation.customer.firstName}{" "}
                  {confirmation.customer.lastName}
                </Typography>
                <Typography>
                  <strong>Email:</strong> {confirmation.customer.email}
                </Typography>
                <Typography>
                  <strong>Phone:</strong> {confirmation.customer.phoneNumber}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography>
                  <strong>Address:</strong> {confirmation.customer.addressLine1}
                </Typography>
                {confirmation.customer.addressLine2 && (
                  <Typography>{confirmation.customer.addressLine2}</Typography>
                )}
                <Typography>
                  {confirmation.customer.postalCode}{" "}
                  {confirmation.customer.city}, {confirmation.customer.country}
                </Typography>
              </Grid>
            </Grid>
          </Paper>

          {/* Reservation Details */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom color="primary">
              Reservation Details
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography>
                  <strong>Jetty Location:</strong>{" "}
                  {confirmation.reservation.jettyLocation}
                </Typography>
                <Typography>
                  <strong>Number of Passengers:</strong>{" "}
                  {confirmation.reservation.numberOfPassengers}
                </Typography>
                <Typography>
                  <strong>Package Type:</strong>{" "}
                  {confirmation.reservation.packageType}
                </Typography>
                <Typography>
                  <strong>Booking Date:</strong>{" "}
                  {formatDisplayDate(confirmation.reservation.bookingDate)}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                {confirmation.reservation.packageDetails && (
                  <>
                    <Typography>
                      <strong>Package Name:</strong>{" "}
                      {confirmation.reservation.packageDetails.name}
                    </Typography>
                    <Typography>
                      <strong>Description:</strong>{" "}
                      {confirmation.reservation.packageDetails.description}
                    </Typography>
                  </>
                )}
              </Grid>
              {confirmation.reservation.addOns &&
                confirmation.reservation.addOns.length > 0 && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                      <strong>Selected Add-ons:</strong>
                    </Typography>
                    <List dense>
                      {confirmation.reservation.addOns.map((addon, index) => (
                        <ListItem key={index}>
                          <ListItemIcon>
                            <CheckCircleOutline color="primary" />
                          </ListItemIcon>
                          <ListItemText primary={addon} />
                        </ListItem>
                      ))}
                    </List>
                  </Grid>
                )}
            </Grid>
          </Paper>

          {/* Other Options */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom color="primary">
              Additional Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                {confirmation.otherOptions.alternativeDate1 && (
                  <Typography gutterBottom>
                    <strong>Alternative Date 1:</strong>{" "}
                    {formatDisplayDate(
                      confirmation.otherOptions.alternativeDate1
                    )}
                  </Typography>
                )}
                {confirmation.otherOptions.alternativeDate2 && (
                  <Typography gutterBottom>
                    <strong>Alternative Date 2:</strong>{" "}
                    {formatDisplayDate(
                      confirmation.otherOptions.alternativeDate2
                    )}
                  </Typography>
                )}
                {confirmation.otherOptions.remarks && (
                  <Typography>
                    <strong>Special Requests:</strong>{" "}
                    {confirmation.otherOptions.remarks}
                  </Typography>
                )}
              </Grid>
            </Grid>
          </Paper>

          {/* Action Buttons */}
          <Box
            sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 4 }}
          >
            <Button
              variant="contained"
              startIcon={<Home />}
              onClick={() => navigate("/")}
              sx={{
                bgcolor: "#0384BD",
                color: "white",
                "&:hover": {
                  bgcolor: "#026890",
                },
              }}
            >
              Return Home
            </Button>
            <Button
              variant="outlined"
              startIcon={<Print />}
              onClick={() => window.print()}
              sx={{
                color: "#0384BD",
                borderColor: "#0384BD",
                "&:hover": {
                  borderColor: "#026890",
                },
              }}
            >
              Print Details
            </Button>
          </Box>
        </Paper>
      </Box>
    );
  };

  useEffect(() => {
    console.log("Current booking confirmation:", bookingConfirmation);
  }, [bookingConfirmation]);

  const renderThankYouSection = () => {
    if (!bookingConfirmation) {
      console.log("No booking confirmation data available");
      return null;
    }

    return (
      <Box sx={{ maxWidth: 800, mx: "auto", p: 3 }}>
        <Paper sx={{ p: 4, mb: 4 }}>
          <Typography variant="h4" gutterBottom color="primary" align="center">
            Thank You for Your Booking!
          </Typography>
          <Typography
            variant="subtitle1"
            gutterBottom
            align="center"
            sx={{ mb: 4 }}
          >
            Your booking reference number is:{" "}
            <strong>{bookingConfirmation.bookingId}</strong>
          </Typography>

          {/* Customer Information */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom color="primary">
              Customer Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography>
                  <strong>Name:</strong>{" "}
                  {bookingConfirmation.customer.firstName}{" "}
                  {bookingConfirmation.customer.lastName}
                </Typography>
                <Typography>
                  <strong>Email:</strong> {bookingConfirmation.customer.email}
                </Typography>
                <Typography>
                  <strong>Phone:</strong>{" "}
                  {bookingConfirmation.customer.phoneNumber}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography>
                  <strong>Address:</strong>{" "}
                  {bookingConfirmation.customer.addressLine1}
                </Typography>
                {bookingConfirmation.customer.addressLine2 && (
                  <Typography>
                    {bookingConfirmation.customer.addressLine2}
                  </Typography>
                )}
                <Typography>
                  {bookingConfirmation.customer.postalCode}{" "}
                  {bookingConfirmation.customer.city},{" "}
                  {bookingConfirmation.customer.country}
                </Typography>
              </Grid>
            </Grid>
          </Paper>

          {/* Reservation Details */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom color="primary">
              Reservation Details
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography>
                  <strong>Jetty Location:</strong>{" "}
                  {bookingConfirmation.reservation.jettyLocation}
                </Typography>
                <Typography>
                  <strong>Number of Passengers:</strong>{" "}
                  {bookingConfirmation.reservation.numberOfPassengers}
                </Typography>
                <Typography>
                  <strong>Package Type:</strong>{" "}
                  {bookingConfirmation.reservation.packageType}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography>
                  <strong>Booking Date:</strong>{" "}
                  {formatDisplayDate(
                    bookingConfirmation.reservation.bookingDate
                  )}
                </Typography>
                {bookingConfirmation.reservation.packageDetails && (
                  <>
                    <Typography>
                      <strong>Package Name:</strong>{" "}
                      {bookingConfirmation.reservation.packageDetails.name}
                    </Typography>
                    <Typography>
                      <strong>Duration:</strong>{" "}
                      {bookingConfirmation.reservation.packageDetails.duration}
                    </Typography>
                  </>
                )}
              </Grid>
            </Grid>

            {/* Add-ons Section */}
            {bookingConfirmation.reservation.addOns &&
              bookingConfirmation.reservation.addOns.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    <strong>Selected Add-ons:</strong>
                  </Typography>
                  <List dense>
                    {bookingConfirmation.reservation.addOns.map(
                      (addon, index) => (
                        <ListItem key={index}>
                          <ListItemIcon>
                            <CheckCircleOutline color="primary" />
                          </ListItemIcon>
                          <ListItemText primary={addon} />
                        </ListItem>
                      )
                    )}
                  </List>
                </Box>
              )}
          </Paper>

          {/* Other Options */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom color="primary">
              Additional Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                {bookingConfirmation.otherOptions.alternativeDate1 && (
                  <Typography gutterBottom>
                    <strong>Alternative Date 1:</strong>{" "}
                    {formatDisplayDate(
                      bookingConfirmation.otherOptions.alternativeDate1
                    )}
                  </Typography>
                )}
                {bookingConfirmation.otherOptions.alternativeDate2 && (
                  <Typography gutterBottom>
                    <strong>Alternative Date 2:</strong>{" "}
                    {formatDisplayDate(
                      bookingConfirmation.otherOptions.alternativeDate2
                    )}
                  </Typography>
                )}
                {bookingConfirmation.otherOptions.remarks && (
                  <Typography>
                    <strong>Special Requests:</strong>{" "}
                    {bookingConfirmation.otherOptions.remarks}
                  </Typography>
                )}
              </Grid>
            </Grid>
          </Paper>

          {/* Action Buttons */}
          <Box
            sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 4 }}
          >
            <Button
              variant="contained"
              startIcon={<Home />}
              onClick={() => navigate("/")}
              sx={{
                bgcolor: "#0384BD",
                color: "white",
                "&:hover": {
                  bgcolor: "#026890",
                },
              }}
            >
              Return Home
            </Button>
            <Button
              variant="outlined"
              startIcon={<Print />}
              onClick={() => window.print()}
              sx={{
                color: "#0384BD",
                borderColor: "#0384BD",
                "&:hover": {
                  borderColor: "#026890",
                },
              }}
            >
              Print Details
            </Button>
          </Box>
        </Paper>
      </Box>
    );
  };

  useEffect(() => {
    if (bookingConfirmation) {
      console.log("Booking confirmation updated:", bookingConfirmation);
      console.log("Show thank you:", showThankYou);
      console.log("Active step:", activeStep);
    }
  }, [bookingConfirmation, showThankYou, activeStep]);

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

        {showThankYou && bookingConfirmation ? (
          <BookingConfirmationSection confirmation={bookingConfirmation} />
        ) : (
          <>
            <Stepper
              activeStep={activeStep}
              sx={{
                mb: 6,
                "& .MuiStepConnector-line": {
                  marginTop: "12px",
                },
              }}
            >
              {steps.map((label, index) => (
                <Step key={`step-${label}-${index}`}>
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
                        shouldShowError("firstName")
                          ? "First name is required"
                          : ""
                      }
                      onBlur={() =>
                        setTouchedFields((prev) => ({
                          ...prev,
                          firstName: true,
                        }))
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
                        shouldShowError("lastName")
                          ? "Last name is required"
                          : ""
                      }
                      onBlur={() =>
                        setTouchedFields((prev) => ({
                          ...prev,
                          lastName: true,
                        }))
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
                        setTouchedFields((prev) => ({
                          ...prev,
                          phoneNumber: true,
                        }))
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
                        setTouchedFields((prev) => ({
                          ...prev,
                          postalCode: true,
                        }))
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
                      helperText={
                        shouldShowError("city") ? "City is required" : ""
                      }
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

                <Box
                  sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}
                >
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
          </>
        )}
      </Container>
    </Box>
  );
};

export default InquiryPage;
