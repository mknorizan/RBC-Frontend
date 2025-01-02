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
} from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle";
import axiosInstance from "../config/axios";

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

const InquiryPage = () => {
  const location = useLocation();
  const searchParams = location.state as SearchParams;
  const navigate = useNavigate();

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
      jettyLocation: searchParams?.jettyPoint || "",
      bookingDate: searchParams?.bookingDate || "",
      numberOfPassengers: searchParams?.passengers || 0,
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

  useEffect(() => {
    const fetchPackages = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axiosInstance.get("/api/packages");
        console.log("API Response:", response);

        if (!response.data) {
          throw new Error("No data received from server");
        }

        if (!Array.isArray(response.data)) {
          console.error("Received data:", response.data);
          throw new Error("Invalid data format: expected array");
        }

        setPackages(response.data);
      } catch (error) {
        console.error("Error fetching packages:", {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data,
          headers: error.response?.headers,
        });
        setError("Failed to load packages. Please try again later.");
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
    };

  const handleReservationChange =
    (field: keyof ReservationDetails) =>
    (event: React.ChangeEvent<{ value: unknown }>) => {
      setReservationDetails((prev) => ({
        ...prev,
        [field]: event.target.value,
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
      // Show error message
      return;
    }
    if (activeStep === 1 && !validateReservationDetails()) {
      // Show error message
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
    const required = [
      "firstName",
      "lastName",
      "email",
      "phoneNumber",
      "addressLine1",
      "postalCode",
      "city",
      "country",
    ];
    return required.every((field) => customerInfo[field as keyof CustomerInfo]);
  };

  const validateReservationDetails = () => {
    return (
      reservationDetails.jettyLocation &&
      reservationDetails.bookingDate &&
      reservationDetails.numberOfPassengers > 0 &&
      reservationDetails.packageType
    );
  };

  const renderReservationDetails = () => (
    <Paper elevation={0} sx={{ p: 4, border: "1px solid #e0e0e0" }}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Jetty Location"
            value={reservationDetails.jettyLocation}
            disabled
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="No of Passengers"
            value={reservationDetails.numberOfPassengers}
            disabled
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Booking Date"
            value={reservationDetails.bookingDate}
            disabled
          />
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Package Type</InputLabel>
            <Select
              value={reservationDetails.packageType}
              label="Package Type"
              onChange={handleReservationChange("packageType")}
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
          <List>
            {packageInfo.map((info, index) => (
              <ListItem key={index} dense>
                <ListItemIcon>
                  <CircleIcon sx={{ fontSize: 8 }} />
                </ListItemIcon>
                <ListItemText primary={info} />
              </ListItem>
            ))}
          </List>
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

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
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

      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {activeStep === 0 && (
        <Paper elevation={0} sx={{ p: 4, border: "1px solid #e0e0e0" }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="First Name"
                value={customerInfo.firstName}
                onChange={handleInputChange("firstName")}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Last Name"
                value={customerInfo.lastName}
                onChange={handleInputChange("lastName")}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Phone Number"
                value={customerInfo.phoneNumber}
                onChange={handleInputChange("phoneNumber")}
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
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Address Line 1"
                value={customerInfo.addressLine1}
                onChange={handleInputChange("addressLine1")}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address Line 2"
                value={customerInfo.addressLine2}
                onChange={handleInputChange("addressLine2")}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                required
                fullWidth
                label="Postal Code"
                value={customerInfo.postalCode}
                onChange={handleInputChange("postalCode")}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                required
                fullWidth
                label="City"
                value={customerInfo.city}
                onChange={handleInputChange("city")}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                required
                fullWidth
                label="Country"
                value={customerInfo.country}
                onChange={handleInputChange("country")}
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
  );
};

export default InquiryPage;
