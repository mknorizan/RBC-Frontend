import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Grid,
  Container,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Stack,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  FormHelperText,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import GroupsIcon from "@mui/icons-material/Groups";
import PaidIcon from "@mui/icons-material/Paid";
import DirectionsBoatIcon from "@mui/icons-material/DirectionsBoat";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import InfoIcon from "@mui/icons-material/Info";
import { useLocation, useNavigate } from "react-router-dom";
import JettyPointDropdown from "../components/JettyPointDropdown";
import BookingDatePicker from "../components/BookingDatePicker";
import PassengerCounter from "../components/PassengerCounter";
import AddOnSelection from "../components/AddOnSelection";
import PackageDropdown from "../components/PackageDropdown";
import AlternativeDatePicker from "../components/AlternativeDatePicker";
import dayjs from "dayjs";
import ReservationDatePicker from "../components/ReservationDatePicker";
import ReservationJettyPoint from "../components/ReservationJettyPoint";
import ReservationPassengers from "../components/ReservationPassengers";
import { BOOKING_SELECTION_KEY, BookingSelection } from "../types/booking";
// import Description from "../components/Description";
import { Helmet } from 'react-helmet-async';
import { API_CONFIG, getApiUrl } from "../config/api";

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
  jettyPoint: string;
  bookingDate: string;
  passengers: number;
  packageId: string;
  addOns: string[];
}

interface OtherOptions {
  alternativeDate1: string;
  alternativeDate2: string;
  specialRemarks: string;
}

interface ValidationErrors {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  addressLine1: string;
  postalCode: string;
  city: string;
  country: string;
}

interface ClearSections {
  customerInfo: boolean;
  reservationDetails: boolean;
  otherOptions: boolean;
}

interface ReservationValidationErrors {
  packageId: string;
}

interface AddOn {
  id: number;
  name: string;
  price: number;
  isActive: boolean;
  perPerson: boolean;  // indicates if the price should be multiplied by number of passengers
}

interface IncludedService {
  name: string;
  id: number;
  serviceName: string;
  // description: string | null;
}

interface PriceTier {
  id: number;
  ageMin: number | null;
  ageMax: number | null;
  price: number;
  type: string;
  label: string | null;
}

interface Package {
  id: number;
  name: string;
  // description: string;
  basePrice: number;
  maxCapacity: number;
  duration: number;
  distanceMinKm: number | null;
  distanceMaxKm: number | null;
  durationMinutes: number | null;
  isActive: boolean;
  categoryId: number;
  includedServices: IncludedService[];
  priceTiers: PriceTier[];
  services: IncludedService[];
}

interface StorageData {
  customerInfo: CustomerInfo;
  activeSection: number;
  reservationDetails: ReservationDetails;
  otherOptions: OtherOptions;
  bookingId?: string;
}

const STORAGE_KEY = "rhumuda_inquiry_form";

const saveToLocalStorage = (data: StorageData) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

const loadFromLocalStorage = () => {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : null;
};

const generateBookingId = () => {
  const timestamp = new Date().getTime();
  const random = Math.floor(Math.random() * 1000);
  return `RHM${timestamp}${random}`;
};

const InquiryPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchValues = location.state || {
    jettyPoint: "",
    bookingDate: dayjs().add(1, "day").format("YYYY-MM-DD"),
    passengers: 1,
  };

  const [activeSection, setActiveSection] = React.useState<number>(
    (location.state as any)?.activeSection ?? 0
  );
  const [customerInfo, setCustomerInfo] = React.useState<CustomerInfo>({
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
    React.useState<ReservationDetails>({
      jettyPoint: searchValues.jettyPoint,
      bookingDate: searchValues.bookingDate,
      passengers: searchValues.passengers,
      packageId: "",
      addOns: [],
    });

  const [otherOptions, setOtherOptions] = React.useState<OtherOptions>({
    alternativeDate1: "",
    alternativeDate2: "",
    specialRemarks: "",
  });

  const [errors, setErrors] = React.useState<ValidationErrors>({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    addressLine1: "",
    postalCode: "",
    city: "",
    country: "",
  });

  const [reservationValidationErrors, setReservationValidationErrors] =
    useState<ReservationValidationErrors>({
      packageId: "",
    });

  const [clearDialogOpen, setClearDialogOpen] = useState(false);
  const [sectionsToDelete, setSectionsToDelete] = useState<ClearSections>({
    customerInfo: false,
    reservationDetails: false,
    otherOptions: false,
  });

  const [addOns, setAddOns] = useState<AddOn[]>([]);
  const [addOnsError, setAddOnsError] = useState<string | null>(null);
  const [packages, setPackages] = useState<Package[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number>(1); // Default to boat charter

  useEffect(() => {
    const fetchAddOns = async () => {
      try {
        const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.ADD_ONS));
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setAddOns(data);
      } catch (error) {
        console.error("Error fetching add-ons:", error);
        setAddOnsError("Failed to load add-ons");
      }
    };

    fetchAddOns();
  }, []);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await fetch(
          getApiUrl(API_CONFIG.ENDPOINTS.PACKAGES, {
            categoryId: selectedCategory,
          })
        );
        const data = await response.json();
        console.log("Raw Package Data:", data);
        setPackages(data);
      } catch (error) {
        console.error("Error fetching packages:", error);
      }
    };

    if (selectedCategory) {
      fetchPackages();
    }
  }, [selectedCategory]);

  useEffect(() => {
    const savedData = loadFromLocalStorage();
    if (savedData) {
      setCustomerInfo(savedData.customerInfo);
      setActiveSection(savedData.activeSection);
      setReservationDetails(savedData.reservationDetails);
      setOtherOptions(savedData.otherOptions);
    } else {
      // Initialize with search values and save to localStorage immediately
      const initialReservationDetails = {
        jettyPoint: searchValues.jettyPoint || "",
        bookingDate: searchValues.bookingDate || "",
        passengers: searchValues.passengers || 1,
        packageId: "",
        addOns: [],
      };
      setReservationDetails(initialReservationDetails);

      // Save initial state to localStorage
      saveToLocalStorage({
        customerInfo: {
          firstName: "",
          lastName: "",
          phoneNumber: "",
          email: "",
          addressLine1: "",
          addressLine2: "",
          postalCode: "",
          city: "",
          country: "",
        },
        activeSection: 0,
        reservationDetails: initialReservationDetails,
        otherOptions: {
          alternativeDate1: "",
          alternativeDate2: "",
          specialRemarks: "",
        },
      });
    }
  }, []);

  useEffect(() => {
    // Try router state first
    const routerSelection = location.state as BookingSelection;

    if (routerSelection?.categoryId && routerSelection?.packageId) {
      setSelectedCategory(routerSelection.categoryId);
      setReservationDetails((prev) => ({
        ...prev,
        packageId: routerSelection.packageId,
      }));
      return;
    }

    // Fallback to localStorage
    const storedSelection = localStorage.getItem(BOOKING_SELECTION_KEY);
    if (storedSelection) {
      const selection: BookingSelection = JSON.parse(storedSelection);

      // Check if data is not stale (24 hours)
      if (Date.now() - selection.timestamp < 24 * 60 * 60 * 1000) {
        setSelectedCategory(selection.categoryId);
        setReservationDetails((prev) => ({
          ...prev,
          packageId: selection.packageId,
        }));
      } else {
        localStorage.removeItem(BOOKING_SELECTION_KEY);
      }
    }
  }, []);

  const validateName = (name: string): string => {
    if (!name) return "This field is required";
    if (name.length < 2) return "Must be at least 2 characters";
    if (!/^[a-zA-Z\s]*$/.test(name)) return "Only letters and spaces allowed";
    return "";
  };

  const validatePhoneNumber = (phone: string): string => {
    if (!phone) return "This field is required";

    // Remove any potential spaces
    const cleanPhone = phone.replace(/\s/g, "");

    // Check for valid formats: +601234567890 or 01234567890
    const phoneRegex = /^(\+?60|0)\d{9,10}$/;

    if (!phoneRegex.test(cleanPhone)) {
      return "Invalid format. Use +601234567890 or 01234567890";
    }

    return "";
  };

  const validateEmail = (email: string): string => {
    if (!email) return "This field is required";

    // RFC 5322 standard email regex
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(email)) {
      return "Invalid email address";
    }

    return "";
  };

  const validateAddressLine1 = (address: string): string => {
    if (!address) return "This field is required";
    if (address.length < 5) return "Address must be at least 5 characters long";
    return "";
  };

  const validatePostalCode = (postalCode: string): string => {
    if (!postalCode) return "This field is required";

    // Check for exactly 5 digits
    const postalCodeRegex = /^\d{5}$/;

    if (!postalCodeRegex.test(postalCode)) {
      return "Invalid format. Must be 5 digits (e.g., 12345)";
    }

    return "";
  };

  const validateCity = (city: string): string => {
    if (!city) return "This field is required";
    if (city.length < 2) return "Must be at least 2 characters";
    if (!/^[a-zA-Z\s]*$/.test(city)) return "Only letters and spaces allowed";
    return "";
  };

  const validateCountry = (country: string): string => {
    if (!country) return "This field is required";
    if (country.length < 2) return "Must be at least 2 characters";
    if (!/^[a-zA-Z\s]*$/.test(country))
      return "Only letters and spaces allowed";
    return "";
  };

  const handleCustomerInfoChange =
    (field: keyof CustomerInfo) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setCustomerInfo((prev) => {
        const newInfo = {
          ...prev,
          [field]: value,
        };
        // Auto-save to localStorage
        saveToLocalStorage({
          customerInfo: newInfo,
          activeSection,
          reservationDetails,
          otherOptions,
        });
        return newInfo;
      });

      switch (field) {
        case "firstName":
        case "lastName":
          setErrors((prev) => ({
            ...prev,
            [field]: validateName(value),
          }));
          break;
        case "phoneNumber":
          setErrors((prev) => ({
            ...prev,
            phoneNumber: validatePhoneNumber(value),
          }));
          break;
        case "email":
          setErrors((prev) => ({
            ...prev,
            email: validateEmail(value),
          }));
          break;
        case "addressLine1":
          setErrors((prev) => ({
            ...prev,
            addressLine1: validateAddressLine1(value),
          }));
          break;
        case "postalCode":
          setErrors((prev) => ({
            ...prev,
            postalCode: validatePostalCode(value),
          }));
          break;
        case "city":
          setErrors((prev) => ({
            ...prev,
            city: validateCity(value),
          }));
          break;
        case "country":
          setErrors((prev) => ({
            ...prev,
            country: validateCountry(value),
          }));
          break;
      }
    };

  const handleReservationDetailsChange =
    (field: keyof ReservationDetails) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setReservationDetails((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
    };

  const handleAddOnChange = (addOnId: string) => {
    setReservationDetails((prev) => {
      const currentAddOns = prev.addOns || [];
      const newAddOns = currentAddOns.includes(addOnId)
        ? currentAddOns.filter((id) => id !== addOnId)
        : [...currentAddOns, addOnId];

      return {
        ...prev,
        addOns: newAddOns,
      };
    });
  };

  const handleOtherOptionsChange =
    (field: keyof OtherOptions) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setOtherOptions((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
    };

  const handleDateChange = (field: keyof OtherOptions) => (value: string) => {
    setOtherOptions((prev) => {
      const newOptions = {
        ...prev,
        [field]: value,
      };
      saveToLocalStorage({
        customerInfo,
        activeSection,
        reservationDetails,
        otherOptions: newOptions,
      });
      return newOptions;
    });
  };

  const handleNext = async () => {
    if (activeSection === 0) {
      const firstNameError = validateName(customerInfo.firstName);
      const lastNameError = validateName(customerInfo.lastName);
      const phoneNumberError = validatePhoneNumber(customerInfo.phoneNumber);
      const emailError = validateEmail(customerInfo.email);
      const addressLine1Error = validateAddressLine1(customerInfo.addressLine1);
      const postalCodeError = validatePostalCode(customerInfo.postalCode);
      const cityError = validateCity(customerInfo.city);
      const countryError = validateCountry(customerInfo.country);

      setErrors({
        firstName: firstNameError,
        lastName: lastNameError,
        phoneNumber: phoneNumberError,
        email: emailError,
        addressLine1: addressLine1Error,
        postalCode: postalCodeError,
        city: cityError,
        country: countryError,
      });

      if (
        firstNameError ||
        lastNameError ||
        phoneNumberError ||
        emailError ||
        addressLine1Error ||
        postalCodeError ||
        cityError ||
        countryError
      ) {
        return;
      }

      // Save to localStorage before proceeding
      saveToLocalStorage({
        customerInfo,
        activeSection: activeSection + 1,
        reservationDetails,
        otherOptions,
      });
    }

    if (activeSection === 1) {
      // Validate reservation details
      let hasErrors = false;
      const newErrors = { packageId: "" };

      if (!reservationDetails.packageId) {
        newErrors.packageId = "Please select a package";
        hasErrors = true;
      }

      setReservationValidationErrors(newErrors);

      if (hasErrors) {
        return;
      }

      // Save to localStorage before proceeding
      saveToLocalStorage({
        customerInfo,
        activeSection: activeSection + 1,
        reservationDetails,
        otherOptions,
      });
    }

    if (activeSection === 2) {
      try {
        const bookingId = await saveBooking();
        // Clear form data but keep bookingId
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ bookingId }));
        // Navigate to summary page with the booking ID
        navigate(`/summary/${bookingId}`);
      } catch (error) {
        // Handle error (you might want to show an error message to the user)
        console.error("Failed to save booking:", error);
        return;
      }
    } else {
      setActiveSection((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    setActiveSection((prev) => prev - 1);
  };

  const handleClearClick = () => {
    setClearDialogOpen(true);
  };

  const handleClearConfirm = () => {
    if (sectionsToDelete.customerInfo) {
      setCustomerInfo({
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
      // Clear localStorage if customer info is being cleared
      localStorage.removeItem(STORAGE_KEY);
    }

    if (sectionsToDelete.reservationDetails) {
      setReservationDetails({
        jettyPoint: "",
        bookingDate: "",
        passengers: 1,
        packageId: "",
        addOns: [],
      });
    }

    if (sectionsToDelete.otherOptions) {
      setOtherOptions({
        alternativeDate1: "",
        alternativeDate2: "",
        specialRemarks: "",
      });
    }

    // If all sections are being cleared, remove from localStorage
    if (
      sectionsToDelete.customerInfo &&
      sectionsToDelete.reservationDetails &&
      sectionsToDelete.otherOptions
    ) {
      localStorage.removeItem(STORAGE_KEY);
    }

    setClearDialogOpen(false);
    setSectionsToDelete({
      customerInfo: false,
      reservationDetails: false,
      otherOptions: false,
    });
  };

  const handleSectionChange =
    (section: keyof ClearSections) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSectionsToDelete((prev) => ({
        ...prev,
        [section]: event.target.checked,
      }));
    };

  const handleSelectAllSections = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newValue = event.target.checked;
    setSectionsToDelete({
      customerInfo: newValue,
      reservationDetails: newValue,
      otherOptions: newValue,
    });
  };

  const saveBooking = async () => {
    try {
      const bookingId = generateBookingId();

      const bookingData = {
        bookingId: bookingId,
        status: "INCOMPLETE", // Initial status when creating booking
        firstName: customerInfo.firstName,
        lastName: customerInfo.lastName,
        phoneNumber: customerInfo.phoneNumber,
        email: customerInfo.email,
        addressLine1: customerInfo.addressLine1,
        addressLine2: customerInfo.addressLine2,
        postalCode: customerInfo.postalCode,
        city: customerInfo.city,
        country: customerInfo.country,
        jettyPoint: reservationDetails.jettyPoint,
        packageId: reservationDetails.packageId,
        bookingDate: dayjs(reservationDetails.bookingDate).format("YYYY-MM-DD"),
        passengers: reservationDetails.passengers,
        addOns: reservationDetails.addOns,
        alternativeDate1: otherOptions.alternativeDate1 ? dayjs(otherOptions.alternativeDate1).format("YYYY-MM-DD") : null,
        alternativeDate2: otherOptions.alternativeDate2 ? dayjs(otherOptions.alternativeDate2).format("YYYY-MM-DD") : null,
        specialRemarks: otherOptions.specialRemarks || null,
      };

      console.log("Sending booking data:", bookingData);

      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.BOOKINGS), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });

      const responseData = await response.json();
      console.log("Server response:", responseData);

      if (!response.ok) {
        throw new Error(
          responseData.message ||
          (responseData.errors && responseData.errors.join(", ")) ||
          "Failed to save booking"
        );
      }

      return responseData.bookingId || bookingId;
    } catch (error) {
      console.error("Error saving booking:", error);
      throw error;
    }
  };

  const renderButtons = () => (
    <Box sx={{ mt: 3, display: "flex", justifyContent: "space-between" }}>
      {/* Clear button commented out
      <Button
        variant="outlined"
        onClick={handleClearClick}
        sx={{
          color: "#FF0000",
          borderColor: "#FF0000",
          "&:hover": {
            bgcolor: "rgba(255, 0, 0, 0.04)",
            borderColor: "#FF0000",
          },
        }}
      >
        Clear
      </Button>
      */}
      <div /> {/* Empty div to maintain spacing */}
      <Box sx={{ display: "flex", gap: 2 }}>
        {activeSection > 0 && (
          <Button
            variant="outlined"
            onClick={handlePrevious}
            sx={{ color: "#0384BD", borderColor: "#0384BD" }}
          >
            Previous
          </Button>
        )}
        {activeSection < 2 && (
          <Button
            variant="contained"
            onClick={handleNext}
            sx={{ bgcolor: "#0384BD", "&:hover": { bgcolor: "#026994" } }}
          >
            Next
          </Button>
        )}
        {activeSection === 2 && (
          <Button
            variant="contained"
            onClick={handleNext}
            sx={{ bgcolor: "#0384BD", "&:hover": { bgcolor: "#026994" } }}
          >
            Next
          </Button>
        )}
      </Box>
    </Box>
  );

  const renderCustomerInfo = () => (
    <Paper elevation={0} sx={{ p: 4, border: "1px solid #e0e0e0" }}>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Customer Information
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="First Name"
            value={customerInfo.firstName}
            onChange={handleCustomerInfoChange("firstName")}
            error={!!errors.firstName}
            helperText={errors.firstName}
            onBlur={() => {
              setErrors((prev) => ({
                ...prev,
                firstName: validateName(customerInfo.firstName),
              }));
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Last Name"
            value={customerInfo.lastName}
            onChange={handleCustomerInfoChange("lastName")}
            error={!!errors.lastName}
            helperText={errors.lastName}
            onBlur={() => {
              setErrors((prev) => ({
                ...prev,
                lastName: validateName(customerInfo.lastName),
              }));
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Phone Number"
            value={customerInfo.phoneNumber}
            onChange={handleCustomerInfoChange("phoneNumber")}
            error={!!errors.phoneNumber}
            helperText={errors.phoneNumber}
            placeholder="+601234567890"
            onBlur={() => {
              setErrors((prev) => ({
                ...prev,
                phoneNumber: validatePhoneNumber(customerInfo.phoneNumber),
              }));
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Email Address"
            value={customerInfo.email}
            onChange={handleCustomerInfoChange("email")}
            error={!!errors.email}
            helperText={errors.email}
            placeholder="example@email.com"
            onBlur={() => {
              setErrors((prev) => ({
                ...prev,
                email: validateEmail(customerInfo.email),
              }));
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Address Line 1"
            value={customerInfo.addressLine1}
            onChange={handleCustomerInfoChange("addressLine1")}
            error={!!errors.addressLine1}
            helperText={errors.addressLine1}
            onBlur={() => {
              setErrors((prev) => ({
                ...prev,
                addressLine1: validateAddressLine1(customerInfo.addressLine1),
              }));
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Address Line 2"
            value={customerInfo.addressLine2}
            onChange={handleCustomerInfoChange("addressLine2")}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Postal Code"
            value={customerInfo.postalCode}
            onChange={handleCustomerInfoChange("postalCode")}
            error={!!errors.postalCode}
            helperText={errors.postalCode}
            placeholder="12345"
            inputProps={{ maxLength: 5 }}
            onBlur={() => {
              setErrors((prev) => ({
                ...prev,
                postalCode: validatePostalCode(customerInfo.postalCode),
              }));
            }}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="City"
            value={customerInfo.city}
            onChange={handleCustomerInfoChange("city")}
            error={!!errors.city}
            helperText={errors.city}
            onBlur={() => {
              setErrors((prev) => ({
                ...prev,
                city: validateCity(customerInfo.city),
              }));
            }}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Country"
            value={customerInfo.country}
            onChange={handleCustomerInfoChange("country")}
            error={!!errors.country}
            helperText={errors.country}
            onBlur={() => {
              setErrors((prev) => ({
                ...prev,
                country: validateCountry(customerInfo.country),
              }));
            }}
          />
        </Grid>
      </Grid>

      {renderButtons()}
    </Paper>
  );

  const renderPackageInfo = () => {
    const selectedPackage = packages.find(
      (pkg) => pkg.id.toString() === reservationDetails.packageId
    );

    if (!selectedPackage) return null;

    return (
      <Box
        sx={{
          mt: 3,
          p: 3,
          border: "1px solid #e0e0e0",
          borderRadius: 2,
          bgcolor: "#E5F6FD",
          mb: 3,
          color: "#014361"
        }}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <InfoIcon sx={{ color: "#0384BD", fontSize: 24 }} />
            <span>Package Info</span>
          </Stack>
        </Typography>

        <Grid container spacing={3}>
          {/* Duration, Capacity, and Distance */}
          <Grid item xs={12} sm={4}>
            <Stack spacing={2}>
              <Stack direction="row" spacing={1} alignItems="center">
                <AccessTimeIcon sx={{ color: "#0384BD", fontSize: 20 }} />
                <Typography variant="body2">
                  Duration: {selectedPackage.durationMinutes} minutes
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <GroupsIcon sx={{ color: "#0384BD", fontSize: 20 }} />
                <Typography variant="body2">
                  Max Capacity: {selectedPackage.maxCapacity} persons
                </Typography>
              </Stack>
              {selectedPackage.distanceMinKm &&
                selectedPackage.distanceMaxKm && (
                  <Stack direction="row" spacing={1} alignItems="center">
                    <DirectionsBoatIcon
                      sx={{ color: "#0384BD", fontSize: 20 }}
                    />
                    <Typography variant="body2">
                      Distance: {selectedPackage.distanceMinKm} -{" "}
                      {selectedPackage.distanceMaxKm} km
                    </Typography>
                  </Stack>
                )}
            </Stack>
          </Grid>

          {/* Price Tiers */}
          <Grid item xs={12} sm={4}>
            <Stack spacing={2}>
              <Stack direction="row" spacing={1} alignItems="center">
                <PaidIcon sx={{ color: "#0384BD", fontSize: 20 }} />
                <Typography variant="body2">Pricing:</Typography>
              </Stack>
              <Stack spacing={0.5} sx={{ pl: 3.5 }}>
                {selectedPackage.priceTiers.map((tier) => (
                  <Typography
                    key={tier.id}
                    variant="body2"
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      color: tier.price === 0 ? '#00C853' : 'inherit',
                      lineHeight: 1.2
                    }}
                  >
                    {tier.price === 0 ? 'FREE' : `RM${tier.price}`} | {tier.label || tier.type}
                  </Typography>
                ))}
              </Stack>
            </Stack>
          </Grid>

          {/* Services Included */}
          <Grid item xs={12} sm={4}>
            <Stack spacing={2}>
              <Stack direction="row" spacing={1} alignItems="center">
                <CheckCircleIcon sx={{ color: "#0384BD", fontSize: 20 }} />
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  Services Included:
                </Typography>
              </Stack>
              <Stack spacing={0.5} sx={{ pl: 3.5 }}>
                {selectedPackage.services.map((service) => (
                  <Typography
                    key={service.id}
                    variant="body2"
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      lineHeight: 1.2,
                      fontWeight: 500
                    }}
                  >
                    {service.name || service.serviceName}
                  </Typography>
                ))}
              </Stack>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    );
  };

  const renderReservationDetails = () => (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Reservation Details
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={4}>
          <ReservationJettyPoint
            value={reservationDetails.jettyPoint}
            onChange={(value) =>
              setReservationDetails((prev) => ({
                ...prev,
                jettyPoint: value,
              }))
            }
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <ReservationDatePicker
            value={reservationDetails.bookingDate}
            onChange={(value) =>
              setReservationDetails((prev) => ({
                ...prev,
                bookingDate: value,
              }))
            }
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <ReservationPassengers
            value={reservationDetails.passengers}
            onChange={(value) =>
              setReservationDetails((prev) => ({
                ...prev,
                passengers: value,
              }))
            }
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value as number);
                setReservationDetails((prev) => ({
                  ...prev,
                  packageId: "",
                }));
              }}
              label="Category"
            >
              <MenuItem value={1}>Boat Charter</MenuItem>
              <MenuItem value={2}>Day Trip</MenuItem>
              <MenuItem value={3}>Fishing</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <PackageDropdown
            value={reservationDetails.packageId}
            onChange={(value) => {
              setReservationDetails((prev) => ({
                ...prev,
                packageId: value,
              }));
            }}
            error={reservationValidationErrors.packageId}
            categoryId={selectedCategory}
          />
        </Grid>
        <Grid item xs={12}>
          {renderPackageInfo()}
          <AddOnSelection
            selectedAddOns={reservationDetails.addOns}
            onAddOnChange={handleAddOnChange}
            passengers={reservationDetails.passengers}
          />
        </Grid>
      </Grid>

      {renderButtons()}
    </Paper>
  );

  const renderOtherOptions = () => (
    <Paper elevation={0} sx={{ p: 4, border: "1px solid #e0e0e0" }}>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Other Options
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <AlternativeDatePicker
            label="Alternative Booking Date 1"
            value={otherOptions.alternativeDate1}
            onChange={handleDateChange("alternativeDate1")}
            mainBookingDate={reservationDetails.bookingDate}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <AlternativeDatePicker
            label="Alternative Booking Date 2"
            value={otherOptions.alternativeDate2}
            onChange={handleDateChange("alternativeDate2")}
            mainBookingDate={reservationDetails.bookingDate}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Special Remarks/Requests"
            value={otherOptions.specialRemarks}
            onChange={handleOtherOptionsChange("specialRemarks")}
            variant="outlined"
            multiline
            rows={4}
            inputProps={{ maxLength: 500 }}
            helperText={`${otherOptions.specialRemarks.length}/500 characters`}
          />
        </Grid>
      </Grid>

      {renderButtons()}
    </Paper>
  );

  return (
    <>
      <Helmet>
        <title>Make an Inquiry | Rhumuda Boat Charter</title>
        <meta name="description" content="Book your boat charter experience with Rhumuda. Make an inquiry for our boat charter services, fishing trips, or island hopping adventures" />
      </Helmet>
      <Container maxWidth="lg">
        <Box sx={{ mt: 4, mb: 4 }}>
          <Typography variant="h4" component="h1" sx={{ mb: 4 }}>
            Booking Inquiry
          </Typography>

          {activeSection === 0 && renderCustomerInfo()}
          {activeSection === 1 && renderReservationDetails()}
          {activeSection === 2 && renderOtherOptions()}
        </Box>

        <Dialog
          open={clearDialogOpen}
          onClose={() => setClearDialogOpen(false)}
          PaperProps={{
            sx: {
              width: "400px",
              borderRadius: "12px",
            },
          }}
        >
          <DialogTitle
            sx={{
              bgcolor: "#0384BD",
              color: "white",
              py: 2,
            }}
          >
            Clear Sections
          </DialogTitle>
          <DialogContent sx={{ mt: 2 }}>
            <Typography sx={{ mb: 2 }}>
              Are you sure you want to clear your progress? Please select which
              section you want to clear:
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1,
                mb: 2,
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={sectionsToDelete.customerInfo}
                    onChange={handleSectionChange("customerInfo")}
                  />
                }
                label="Customer Information"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={sectionsToDelete.reservationDetails}
                    onChange={handleSectionChange("reservationDetails")}
                  />
                }
                label="Reservation Details"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={sectionsToDelete.otherOptions}
                    onChange={handleSectionChange("otherOptions")}
                  />
                }
                label="Other Options"
              />
            </Box>
            <Divider sx={{ my: 2 }} />
            <FormControlLabel
              control={
                <Checkbox
                  checked={
                    sectionsToDelete.customerInfo &&
                    sectionsToDelete.reservationDetails &&
                    sectionsToDelete.otherOptions
                  }
                  onChange={handleSelectAllSections}
                />
              }
              label="All of the above"
            />
          </DialogContent>
          <DialogActions sx={{ p: 2, gap: 1 }}>
            <Button
              onClick={() => setClearDialogOpen(false)}
              variant="outlined"
              sx={{ color: "#0384BD", borderColor: "#0384BD" }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleClearConfirm}
              variant="contained"
              sx={{ bgcolor: "#FF0000", "&:hover": { bgcolor: "#D32F2F" } }}
            >
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
};

export default InquiryPage;
