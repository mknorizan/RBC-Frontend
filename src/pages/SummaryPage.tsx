import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Stack,
  Button,
  CircularProgress,
  Alert,
  Snackbar,
  Chip,
  Divider,
  Theme,
  IconButton
} from "@mui/material";
import dayjs from "dayjs";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import GroupsIcon from "@mui/icons-material/Groups";
import PaidIcon from "@mui/icons-material/Paid";
import DirectionsBoatIcon from "@mui/icons-material/DirectionsBoat";
import locationMap from "../assets/images/location-rhumuda.png";
import Description from "../components/Description";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
// import CompletionDialog from "../components/CompletionDialog";
import BookingEditDialog from "../components/BookingEditDialog";
import RefreshIcon from "@mui/icons-material/Refresh";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import SendIcon from "@mui/icons-material/Send";
import InfoIcon from "@mui/icons-material/Info";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import CancelIcon from "@mui/icons-material/Cancel";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import ErrorAlert from "../components/ErrorAlert/ErrorAlert";
import { getErrorConfig } from "../utils/errorUtils";
import { API_CONFIG, getApiUrl } from "../config/api";

// Import interfaces from InquiryPage
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

interface JettyPoint {
  id: number;
  name: string;
  isActive: boolean;
}

interface AddOn {
  id: number;
  name: string;
  price: number;
  isActive: boolean;
  perPerson: boolean;
}

interface PriceTier {
  id: number;
  ageMin: number | null;
  ageMax: number | null;
  price: number;
  type: string;
  label: string | null;
}

interface IncludedService {
  id: number;
  name?: string;
  serviceName?: string;
}

interface Package {
  id: number;
  name: string;
  description: string;
  basePrice: number;
  maxCapacity: number;
  duration: number;
  distanceMinKm: number | null;
  distanceMaxKm: number | null;
  durationMinutes: number | null;
  isActive: boolean;
  categoryId: number;
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

interface BookingData {
  bookingId: string;
  status: string;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  country: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  postalCode: string;
  jettyPoint: {
    id: number;
    name: string;
  };
  packageDetails: {
    id: number;
    name: string;
    description: string;
    basePrice: number;
    maxCapacity: number;
    durationMinutes: number;
    imageUrl: string;
    services: Array<{
      id: number;
      name: string;
    }>;
  };
  bookingDate: string;
  passengers: number;
  alternativeDate1: string | null;
  alternativeDate2: string | null;
  specialRemarks: string | null;
  addOns: Array<{
    id: number;
    name: string;
    price: number;
    perPerson: boolean;
  }>;
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = "rhumuda_inquiry_form";

const formatDate = (dateString: string | null) => {
  return dateString ? dayjs(dateString).format("DD/MM/YYYY") : "Not specified";
};

const SummaryPage: React.FC = () => {
  const [data, setData] = useState<StorageData | null>(null);
  const [jettyPoints, setJettyPoints] = useState<JettyPoint[]>([]);
  const [addOns, setAddOns] = useState<AddOn[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const navigate = useNavigate();
  const [completionDialogOpen, setCompletionDialogOpen] = useState(false);
  const [clearLocalStorage, setClearLocalStorage] = useState(false);
  const { bookingId } = useParams<{ bookingId: string }>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [booking, setBooking] = useState<BookingData | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  // const [showCompletionDialog, setShowCompletionDialog] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info' | 'warning';
  }>({
    open: false,
    message: '',
    severity: 'info'
  });

  const handleCloseSnackbar = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  const showNotification = (message: string, severity: 'success' | 'error' | 'info' | 'warning') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const handleContactSupport = () => {
    navigate('/contact');
    handleCloseSnackbar();
  };

  const fetchBookingData = async () => {
    if (!bookingId) {
      setError("No booking ID provided");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Fetch booking data and all packages from all categories
      const [bookingResponse, ...packageResponses] = await Promise.all([
        fetch(getApiUrl(API_CONFIG.ENDPOINTS.BOOKINGS) + `/${bookingId}`),
        fetch(getApiUrl(API_CONFIG.ENDPOINTS.PACKAGES, { categoryId: 1 })),
        fetch(getApiUrl(API_CONFIG.ENDPOINTS.PACKAGES, { categoryId: 2 })),
        fetch(getApiUrl(API_CONFIG.ENDPOINTS.PACKAGES, { categoryId: 3 })),
      ]);

      if (!bookingResponse.ok) {
        const errorData = await bookingResponse.json();
        throw new Error(errorData.message || "Failed to fetch booking data");
      }

      // Check if any package response failed
      const failedPackageResponse = packageResponses.find(
        (response) => !response.ok
      );
      if (failedPackageResponse) {
        throw new Error("Failed to fetch packages data");
      }

      const bookingData = await bookingResponse.json();
      const packagesData = (
        await Promise.all(packageResponses.map((r) => r.json()))
      ).flat();

      setBooking(bookingData);
      setPackages(packagesData);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err);
    } finally {
      setLoading(false);
      setIsInitialLoad(false);
    }
  };

  useEffect(() => {
    if (!bookingId) {
      setError("No booking ID provided");
      setLoading(false);
      return;
    }
    fetchBookingData();
  }, [bookingId]);

  useEffect(() => {
    const fetchJettyPoints = async () => {
      try {
        const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.JETTY_POINTS));
        const data = await response.json();
        setJettyPoints(data);
      } catch (error) {
        console.error("Error fetching jetty points:", error);
      }
    };

    fetchJettyPoints();
  }, []);

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
      }
    };

    fetchAddOns();
  }, []);

  const getJettyPointName = (jettyPoint: any) => {
    return jettyPoint?.name || "Unknown Jetty Point";
  };

  const getPackageName = (packageDetails: any) => {
    return packageDetails?.name || "Unknown Package";
  };

  const getCategoryName = (categoryId: number) => {
    switch (categoryId) {
      case 1:
        return "Boat Charter";
      case 2:
        return "Island Trip";
      case 3:
        return "Fishing Trip";
      default:
        return "Unknown Category";
    }
  };

  const getAddOnName = (id: string) => {
    const addon = addOns.find((a) => a.id.toString() === id);
    return addon ? addon.name : id;
  };

  const renderPackageInfo = (packageId: string) => {
    const selectedPackage = packages.find(
      (pkg) => pkg.id.toString() === packageId
    );

    if (!selectedPackage) return null;

    return (
      <Box sx={{ mt: 2 }}>
        <Grid container spacing={2}>
          {/* Package Description */}
          <Grid item xs={12}>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                <CircularProgress size={20} />
              </Box>
            ) : (
              <Description text={selectedPackage.description} />
            )}
          </Grid>

          {/* Duration, Capacity, and Distance */}
          <Grid item xs={12} sm={6}>
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
          <Grid item xs={12} sm={6}>
            <Stack spacing={2}>
              <Stack direction="row" spacing={1} alignItems="center">
                <PaidIcon sx={{ color: "#0384BD", fontSize: 20 }} />
                <Stack>
                  {selectedPackage.priceTiers?.map((tier) => (
                    <Typography key={tier.id} variant="body2">
                      {tier.price === 0 ? "FREE" : `RM${tier.price}`} |{" "}
                      {tier.type}
                    </Typography>
                  ))}
                </Stack>
              </Stack>
            </Stack>
          </Grid>

          {/* Included Services */}
          {selectedPackage.services && selectedPackage.services.length > 0 && (
            <Grid item xs={12}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Services Included:
              </Typography>
              <Stack spacing={0.5}>
                {selectedPackage.services.map((service) => (
                  <Typography
                    key={service.id}
                    variant="body2"
                    color="text.secondary"
                  >
                    {service.name || service.serviceName}
                  </Typography>
                ))}
              </Stack>
            </Grid>
          )}
        </Grid>
      </Box>
    );
  };

  const handleEditClick = () => {
    setEditDialogOpen(true);
  };

  const handleBookingUpdate = () => {
    setSuccessMessage("Booking updated successfully!");
    fetchBookingData();
  };

  const handleCloseSuccess = () => {
    setSuccessMessage(null);
  };

  useEffect(() => {
    if (clearLocalStorage) {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [clearLocalStorage]);

  const getStatusDetails = (status: string) => {
    switch (status?.toUpperCase()) {
      case "COMPLETE":
        return {
          label: "Booking Complete",
          color: "success" as const,
          icon: <CheckCircleIcon />,
          // description: 'Your booking has been approved by our team.'
        };
      case "PENDING":
        return {
          label: "Inquiry Sent",
          color: "warning" as const,
          icon: <HourglassEmptyIcon />,
          // description: 'Your inquiry has been sent and is awaiting approval from our team.'
        };
      case "CANCELLED":
        return {
          label: "Booking Cancelled",
          color: "error" as const,
          icon: <CancelIcon />,
          // description: 'This booking has been cancelled.'
        };
      case "INCOMPLETE":
      default:
        return {
          label: "Incomplete",
          color: "error" as const,
          icon: <ReportProblemIcon />,
          // description: 'Please review your booking details and click "Send Inquiry" to submit your booking.'
        };
    }
  };

  const handleSendInquiry = async () => {
    try {
      setLoading(true);

      // First, update the booking status
      const response = await fetch(
        getApiUrl(API_CONFIG.ENDPOINTS.BOOKINGS) + `/${bookingId}/submit`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit inquiry");
      }

      // setShowCompletionDialog(true);
      fetchBookingData(); // Refresh to get updated status
      showNotification('Your inquiry has been sent successfully! Please check your email for confirmation.', 'success');
    } catch (error: any) {
      let errorMessage = 'An error occurred while sending your inquiry.';
      
      if (error.name === 'TimeoutError') {
        errorMessage = 'Request timed out. Please try again.';
      } else if (error.name === 'NetworkError') {
        errorMessage = 'Network error. Please check your connection.';
      } else if (error.name === 'ServerError') {
        errorMessage = 'Server error. Please try again later.';
      } else if (error.name === 'DatabaseError') {
        errorMessage = 'Database error. Please try again later.';
      } else if (error.name === 'AuthError') {
        errorMessage = 'Authentication error. Please log in again.';
      } else if (error.name === 'RateLimitError') {
        errorMessage = 'Too many requests. Please try again later.';
      }
      
      showNotification(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  // const handleCloseDialog = () => {
  //   setShowCompletionDialog(false);
  //   setShowSuccessAlert(true); // Show the alert when dialog is closed
  // };

  const handleCloseAlert = () => {
    setShowSuccessAlert(false);
  };

  const renderActionButton = () => {
    switch (booking?.status) {
      case "PENDING":
        return (
          <Box sx={{ display: 'flex', width: '100%' }}>
            <Button
              variant="contained"
              disabled
              fullWidth
              sx={{
                bgcolor: "rgba(0, 0, 0, 0.12)",
                color: "rgba(0, 0, 0, 0.38)",
                py: 1.5,
                "&:hover": {
                  bgcolor: "rgba(0, 0, 0, 0.12)",
                },
              }}
            >
              INQUIRY SENT
            </Button>
          </Box>
        );
      case "INCOMPLETE":
      default:
        return (
          <Box sx={{ display: 'flex', width: '100%' }}>
            <Button
              variant="contained"
              fullWidth
              startIcon={<SendIcon />}
              onClick={handleSendInquiry}
              disabled={loading}
              sx={{
                bgcolor: "#0384BD",
                py: 1.5,
                "&:hover": {
                  bgcolor: "rgba(3, 132, 189, 0.9)",
                },
              }}
            >
              {loading ? <CircularProgress size={24} /> : "SEND INQUIRY"}
            </Button>
          </Box>
        );
    }
  };

  const handleRetry = async () => {
    setRetryCount((prev) => prev + 1);
    try {
      await fetchBookingData();
      showNotification('Data refreshed successfully', 'success');
    } catch (error) {
      showNotification('Failed to refresh data', 'error');
    }
  };

  const handleCloseError = () => {
    setError(null);
  };

  const shouldShowOnlyError = () => {
    if (!error) return false;
    const errorConfig = getErrorConfig(error);
    return isInitialLoad && errorConfig.severity === 'critical';
  };

  // Loading state
  if (loading && isInitialLoad) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ mt: 4, mb: 4, display: "flex", justifyContent: "center" }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  // Critical error during initial load
  if (shouldShowOnlyError()) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ mt: 4, mb: 4 }}>
          <ErrorAlert
            {...getErrorConfig(error)}
            onRetry={handleRetry}
            onClose={handleCloseError}
          />
        </Box>
      </Container>
    );
  }

  if (loading && !booking) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ mt: 4, mb: 4, display: "flex", justifyContent: "center" }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ mt: 4, mb: 4 }}>
          <ErrorAlert
            {...getErrorConfig(error)}
            onRetry={handleRetry}
            onClose={handleCloseError}
          />
        </Box>
      </Container>
    );
  }

  if (!booking) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ mt: 4, mb: 4 }}>
          <Typography variant="h6">No booking data found</Typography>
        </Box>
      </Container>
    );
  }

  // Add null checks for booking and packages
  const selectedPackage = booking?.packageDetails?.id
    ? packages.find((pkg) => pkg.id === booking.packageDetails.id)
    : null;

  if (!booking || !selectedPackage) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ mt: 4, mb: 4, display: "flex", justifyContent: "center" }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 2 }}>
      {error && (
        <Box sx={{ mb: 3 }}>
          <ErrorAlert
            {...getErrorConfig(error)}
            onRetry={handleRetry}
            onClose={handleCloseError}
          />
        </Box>
      )}
      {/* {showSuccessAlert && (
        <Alert
          severity="success"
          onClose={handleCloseAlert}
          sx={{
            mb: 3,
            borderRadius: 1,
            "& .MuiAlert-message": {
              fontSize: "0.875rem",
            },
          }}
        >
          Your inquiry has been sent successfully! Please check your email for
          confirmation.
        </Alert>
      )} */}
      {/* Main Content Grid */}
      <Grid container spacing={5}>
        {/* Left Column - 70% */}
        <Grid item xs={12} md={8}>
          {/* Booking ID and Package Name Section */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1, color: "#0384BD" }}>
              Booking ID: #{booking?.bookingId}
            </Typography>
            <Typography variant="h4" sx={{ mb: 1 }}>
              Category: {getCategoryName(selectedPackage?.categoryId)}
            </Typography>
            <Typography variant="h4" sx={{ mb: 2 }}>
              Package: {getPackageName(booking?.packageDetails)}
            </Typography>
            <Divider
              sx={{ borderColor: "rgba(0, 0, 0, 0.1)", borderWidth: 1 }}
            />
          </Box>

          {/* Package Description Section */}
          <Box sx={{ mb: 2 }}>
            {selectedPackage?.description && (
              <>
                {selectedPackage.description.split('\n\n').map((paragraph, index) => (
                  <Typography
                    key={index}
                    variant="body1"
                    sx={{
                      mb: 2,
                      fontSize: "1.1rem",
                      color: "black",
                      lineHeight: 1.7,
                    }}
                  >
                    {paragraph.trim()}
                  </Typography>
                ))}
                {/* <Divider
                  sx={{ borderColor: "rgba(0, 0, 0, 0.1)", borderWidth: 1 }}
                /> */}
              </>
            )}
          </Box>

          {/* Package Picture Section */}
          <Box sx={{ mb: 2 }}>
            {/* <Typography variant="h4" sx={{ mb: 2 }}>
              Package Picture
            </Typography> */}
            <Box
              sx={{
                width: "100%",
                height: "300px",
                position: "relative",
                borderRadius: "8px",
                overflow: "hidden",
                boxShadow: (theme) =>
                  `0 2px 12px 0 ${
                    theme.palette.mode === "dark"
                      ? "rgba(0,0,0,0.3)"
                      : "rgba(0,0,0,0.1)"
                  }`,
              }}
            >
              <img
                src={booking?.packageDetails?.imageUrl}
                alt={`${booking?.packageDetails?.name} Package`}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </Box>
            <Divider
              sx={{ borderColor: "rgba(0, 0, 0, 0.1)", borderWidth: 1, mt: 3 }}
            />
          </Box>

          {/* Customer Details Section */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="h4" sx={{ mb: 2 }}>
              Customer Details
            </Typography>
            <Box
              sx={{
                border: "1px solid rgba(0, 0, 0, 0.12)",
                borderRadius: "4px",
                p: 3,
                mb: 3,
              }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography sx={{ fontSize: "1rem", color: "black", mb: 1 }}>
                    <strong>Name:</strong>{" "}
                    {`${booking?.firstName} ${booking?.lastName}`}
                  </Typography>
                  <Typography sx={{ fontSize: "1rem", color: "black", mb: 1 }}>
                    <strong>Email:</strong> {booking?.email}
                  </Typography>
                  <Typography sx={{ fontSize: "1rem", color: "black", mb: 1 }}>
                    <strong>Phone:</strong> {booking?.phoneNumber}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography sx={{ fontSize: "1rem", color: "black", mb: 1 }}>
                    <strong>Address:</strong>{" "}
                    {`${booking?.addressLine1}${
                      booking?.addressLine2 ? ` ${booking.addressLine2}` : ""
                    }, ${booking?.postalCode} ${booking?.city}, ${
                      booking?.country
                    }`}
                  </Typography>
                </Grid>
              </Grid>
              <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                <Button
                  variant="contained"
                  onClick={handleEditClick}
                  disabled={booking?.status?.toUpperCase() !== "INCOMPLETE"}
                  sx={{
                    bgcolor: "#0384BD",
                    "&:hover": { bgcolor: "#026994" },
                    textTransform: "none",
                    borderRadius: "4px",
                    px: 3,
                  }}
                >
                  Edit Details
                </Button>
              </Box>
            </Box>
            <Divider
              sx={{ borderColor: "rgba(0, 0, 0, 0.1)", borderWidth: 1 }}
            />
          </Box>

          {/* Services Section */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="h4" sx={{ mb: 2 }}>
              Services
            </Typography>
            <Grid container spacing={1.5}>
              {/* Duration, Capacity, and Distance */}
              <Grid item xs={12} md={6}>
                <Stack spacing={2}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <AccessTimeIcon sx={{ color: "#0384BD", fontSize: 20 }} />
                    <Typography sx={{ fontSize: "1rem", color: "black" }}>
                      Duration: {selectedPackage?.durationMinutes || 0} minutes
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <GroupsIcon sx={{ color: "#0384BD", fontSize: 20 }} />
                    <Typography sx={{ fontSize: "1rem", color: "black" }}>
                      Max Capacity: {selectedPackage?.maxCapacity || 0} persons
                    </Typography>
                  </Stack>
                  {selectedPackage?.distanceMinKm &&
                    selectedPackage?.distanceMaxKm && (
                      <Stack direction="row" spacing={1} alignItems="center">
                        <DirectionsBoatIcon
                          sx={{ color: "#0384BD", fontSize: 20 }}
                        />
                        <Typography sx={{ fontSize: "1rem", color: "black" }}>
                          Distance: {selectedPackage.distanceMinKm} -{" "}
                          {selectedPackage.distanceMaxKm} km
                        </Typography>
                      </Stack>
                    )}
                  {(booking?.alternativeDate1 || booking?.alternativeDate2) && (
                    <Stack direction="row" spacing={1} alignItems="flex-start">
                      <AccessTimeIcon sx={{ color: "#0384BD", fontSize: 20, mt: 0.3 }} />
                      <Box>
                        <Typography sx={{ fontSize: "1rem", color: "black", mb: 0.5 }}>
                          Alternative Dates:
                        </Typography>
                        {booking?.alternativeDate1 && (
                          <Typography sx={{ fontSize: "1rem", color: "black", ml: 2 }}>
                            • {formatDate(booking.alternativeDate1)}
                          </Typography>
                        )}
                        {booking?.alternativeDate2 && (
                          <Typography sx={{ fontSize: "1rem", color: "black", ml: 2 }}>
                            • {formatDate(booking.alternativeDate2)}
                          </Typography>
                        )}
                      </Box>
                    </Stack>
                  )}
                  {booking?.specialRemarks && (
                    <Stack direction="row" spacing={1} alignItems="flex-start">
                      <InfoIcon sx={{ color: "#0384BD", fontSize: 20, mt: 0.3 }} />
                      <Box>
                        <Typography sx={{ fontSize: "1rem", color: "black", mb: 0.5 }}>
                          Special Remarks:
                        </Typography>
                        <Typography sx={{ fontSize: "1rem", color: "black", ml: 2 }}>
                          {booking.specialRemarks}
                        </Typography>
                      </Box>
                    </Stack>
                  )}
                </Stack>
              </Grid>

              {/* Included Services - Moved to right side */}
              <Grid item xs={12} md={6}>
                <Typography
                  sx={{
                    fontSize: "1rem",
                    color: "black",
                    fontWeight: "bold",
                    mb: 1,
                  }}
                >
                  Services Included:
                </Typography>
                <Stack spacing={0.5}>
                  {selectedPackage?.services?.map((service) => (
                    <Typography
                      key={service.id}
                      sx={{ fontSize: "1rem", color: "black" }}
                    >
                      {service.name || service.serviceName}
                    </Typography>
                  ))}
                </Stack>
              </Grid>
            </Grid>
            <Divider
              sx={{ borderColor: "rgba(0, 0, 0, 0.1)", borderWidth: 1, mt: 3 }}
            />
          </Box>

          {/* Location Section */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="h4" sx={{ mb: 2 }}>
              Location
            </Typography>
            <Box
              component="a"
              href="https://maps.app.goo.gl/vwFiMqMgWNzB9J8f9"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                display: "block",
                cursor: "pointer",
                width: "100%",
                "&:hover": {
                  opacity: 0.9,
                },
              }}
            >
              <img
                src={locationMap}
                alt="Location Map"
                style={{
                  width: "100%",
                  height: "auto",
                  borderRadius: "4px",
                  objectFit: "cover",
                }}
              />
            </Box>
            <Divider
              sx={{ borderColor: "rgba(0, 0, 0, 0.1)", borderWidth: 1, mt: 3 }}
            />
          </Box>

          {/* Cancellation Policy Section */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="h4" sx={{ mb: 2 }}>
              Cancellation Policy
            </Typography>
            <Typography sx={{ fontSize: "1rem", color: "black", mb: 2 }}>
              Full refund up to 7 days prior
            </Typography>
            {/* <Divider
              sx={{ borderColor: "rgba(0, 0, 0, 0.1)", borderWidth: 1 }}
            /> */}
          </Box>
        </Grid>

        {/* Right Column - 30% */}
        <Grid item xs={12} md={4}>
          {/* Combined Status and Cost Section */}
          <Paper
            sx={{
              p: 2,
              mb: 3,
              maxWidth: "400px",
              mx: "auto",
              position: "sticky",
              top: 88,
              zIndex: 10,
              bgcolor: 'background.paper',
              boxShadow: (theme) => `0 2px 12px 0 ${theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.1)'}`,
              '@media (max-width: 600px)': {
                top: 72
              }
            }}
          >
            {/* Booking Status */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              mb: 2,
              pb: 2,
              borderBottom: '1px solid rgba(0, 0, 0, 0.08)'
            }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                width: 40,
                height: 40,
                bgcolor: (theme: Theme) => `${theme.palette[getStatusDetails(booking?.status).color].main}15`
              }}>
                {React.cloneElement(getStatusDetails(booking?.status).icon, { 
                  sx: { 
                    fontSize: '24px',
                    color: (theme: Theme) => theme.palette[getStatusDetails(booking?.status).color].main
                  }
                })}
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ 
                  color: (theme: Theme) => theme.palette[getStatusDetails(booking?.status).color].main,
                  fontSize: '0.95rem',
                  lineHeight: 1.2
                }}>
                  {getStatusDetails(booking?.status).label}
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: 'text.secondary',
                  fontSize: '0.85rem',
                  mt: 0.5
                }}>
                  Submitted on {dayjs(booking?.createdAt).format("DD MMM YYYY")}
                </Typography>
              </Box>
            </Box>

            {/* Total Cost Display */}
            <Box sx={{ mb: 2 }}>
              <Typography
                variant="subtitle2"
                sx={{ 
                  mb: 0.75,
                  color: 'text.secondary',
                  fontSize: '0.875rem',
                  letterSpacing: '0.5px'
                }}
              >
                Estimated Cost
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 600,
                  color: 'text.primary',
                  fontSize: '1.75rem',
                  lineHeight: 1.2
                }}
              >
                MYR {(() => {
                  const hasFixedPrice = selectedPackage?.priceTiers.some(
                    (tier) => tier.type === "FIXED"
                  );

                  const baseCost = selectedPackage
                    ? hasFixedPrice
                      ? selectedPackage.basePrice
                      : selectedPackage.basePrice * (booking?.passengers || 0)
                    : 0;

                  const addOnsCost = booking?.addOns
                    ? booking.addOns.reduce((total, addon) => {
                        const basePrice = addon.price;
                        return total + (addon.perPerson ? basePrice * (booking?.passengers || 0) : basePrice);
                      }, 0)
                    : 0;

                  return (baseCost + addOnsCost).toFixed(2);
                })()}
              </Typography>
            </Box>

            {/* Details Grid */}
            <Box sx={{ mb: 2 }}>
              <Typography
                variant="subtitle2"
                sx={{ 
                  mb: 0.75,
                  color: 'text.secondary',
                  fontSize: '0.775rem',
                  letterSpacing: '0.5px'
                }}
              >
                Jetty Location
              </Typography>
              <Box
                sx={{
                  border: "1px solid rgba(0, 0, 0, 0.08)",
                  borderRadius: "6px",
                  p: "6px 10px",
                  minHeight: "20px",
                  display: "flex",
                  alignItems: "center",
                  mb: 1.5,
                  bgcolor: 'rgba(0, 0, 0, 0.02)',
                  fontSize: '0.775rem'
                }}
              >
                {getJettyPointName(booking?.jettyPoint)}
              </Box>

              <Grid container spacing={1.5}>
                <Grid item xs={6}>
                  <Typography
                    variant="subtitle2"
                    sx={{ 
                      mb: 0.75,
                      color: 'text.secondary',
                      fontSize: '0.775rem',
                      letterSpacing: '0.5px'
                    }}
                  >
                    Date
                  </Typography>
                  <Box
                    sx={{
                      border: "1px solid rgba(0, 0, 0, 0.08)",
                      borderRadius: "6px",
                      p: "6px 10px",
                      minHeight: "20px",
                      display: "flex",
                      alignItems: "center",
                      bgcolor: 'rgba(0, 0, 0, 0.02)',
                      fontSize: '0.775rem'
                    }}
                  >
                    {formatDate(booking?.bookingDate)}
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Typography
                    variant="subtitle2"
                    sx={{ 
                      mb: 0.75,
                      color: 'text.secondary',
                      fontSize: '0.775rem',
                      letterSpacing: '0.5px'
                    }}
                  >
                    Group Size
                  </Typography>
                  <Box
                    sx={{
                      border: "1px solid rgba(0, 0, 0, 0.08)",
                      borderRadius: "6px",
                      p: "6px 10px",
                      minHeight: "20px",
                      display: "flex",
                      alignItems: "center",
                      bgcolor: 'rgba(0, 0, 0, 0.02)',
                      fontSize: '0.775rem'
                    }}
                  >
                    {booking?.passengers} persons
                  </Box>
                </Grid>
              </Grid>
            </Box>

            {/* Add-ons List */}
            {booking?.addOns && booking.addOns.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 1,
                }}
              >
                <Typography variant="subtitle2" sx={{ fontSize: '0.775rem' }}>
                  Package Price{" "}
                  {(() => {
                    const hasFixedPrice = selectedPackage?.priceTiers.some(
                      (tier) => tier.type === "FIXED"
                    );

                    const baseCost = selectedPackage
                      ? hasFixedPrice
                        ? selectedPackage.basePrice
                        : selectedPackage.basePrice * (booking?.passengers || 0)
                      : 0;

                    return booking?.passengers === 1 
                      ? "(price starts)" 
                      // : `(${booking?.passengers} persons × RM${selectedPackage?.basePrice.toFixed(2)})`;
                      : `(RM${selectedPackage?.basePrice.toFixed(0)}/pax)`;
                  })()}
                </Typography>
                <Typography variant="subtitle2" sx={{ fontSize: '0.775rem' }}>
                  RM {(() => {
                    const hasFixedPrice = selectedPackage?.priceTiers.some(
                      (tier) => tier.type === "FIXED"
                    );
                    const baseCost = selectedPackage
                      ? hasFixedPrice
                        ? selectedPackage.basePrice
                        : selectedPackage.basePrice * (booking?.passengers || 0)
                      : 0;
                    return baseCost.toFixed(2);
                  })()}
                </Typography>
              </Box>
                <Typography
                  variant="subtitle2"
                  sx={{
                    mb: 1,
                    fontSize: "0.775rem",
                  }}
                >
                  Add On:
                </Typography>
                {[...booking.addOns]
                  .sort((a, b) => {
                    // Sort by perPerson (false comes first)
                    if (a.perPerson !== b.perPerson) {
                      return a.perPerson ? 1 : -1;
                    }
                    // If both have same perPerson value, sort by name
                    return a.name.localeCompare(b.name);
                  })
                  .map((addon) => (
                    <Box
                      key={addon.id}
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        mb: 1,
                      }}
                    >
                      <Box sx={{ 
                        display: "flex", 
                        justifyContent: "space-between",
                        alignItems: "flex-start"
                      }}>
                        <Typography
                          variant="body2"
                          sx={{ fontSize: "0.775rem" }}
                        >
                          {addon.name}{addon.perPerson ? " (per pax)" : ""}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ ml: 2, fontSize: "0.775rem" }}
                        >
                          {addon.perPerson ? (
                            <>RM {addon.price * booking.passengers}.00</>
                          ) : (
                            <>RM {addon.price}.00</>
                          )}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
              </Box>
            )}
            
            <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  borderTop: "1px solid rgba(0, 0, 0, 0.08)",
                  pt: 1.5,
                  mb: 1,
                }}
              ></Box>

            {/* Action Button */}
            <Box sx={{ display: 'flex' }}>
              {renderActionButton()}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Dialogs and Snackbars - Keep these outside the grid */}
      <BookingEditDialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        bookingId={booking?.bookingId || ""}
        onUpdate={handleBookingUpdate}
      />
      {/* <CompletionDialog
        open={showCompletionDialog}
        onClose={handleCloseDialog}
      /> */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={20000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{
          width: '100%',
          maxWidth: '600px',
          left: '50%',
          transform: 'translateX(-50%)'
        }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{
            width: '100%',
            '& .MuiAlert-message': {
              fontSize: '0.875rem'
            },
            boxShadow: 3
          }}
          action={
            <>
              {snackbar.severity === 'error' && (
                <Button
                  color="inherit"
                  size="small"
                  onClick={handleContactSupport}
                  sx={{ 
                    fontSize: '0.8125rem',
                    mr: 1,
                    textTransform: 'none'
                  }}
                >
                  Contact Support
                </Button>
              )}
              <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={handleCloseSnackbar}
                sx={{ 
                  ml: 1,
                  padding: '4px'
                }}
              >
                <CancelIcon fontSize="small" />
              </IconButton>
            </>
          }
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default SummaryPage;
