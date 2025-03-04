import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  TextField,
  Grid,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Stack,
  Tabs,
  Tab,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  Snackbar,
  Alert,
  ListSubheader,
  FormHelperText
} from "@mui/material";
import {
  AdapterDayjs
} from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import GroupIcon from "@mui/icons-material/Group";
import PaidIcon from "@mui/icons-material/Paid";
import CheckIcon from "@mui/icons-material/Check";

import { API_CONFIG, getApiUrl } from "../config/api";

interface BookingEditDialogProps {
  open: boolean;
  onClose: () => void;
  bookingId: string;
  onUpdate: () => void; // Callback to refresh parent data
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface AddOn {
  id: number;
  name: string;
  price: number;
  isActive: boolean;
  perPerson: boolean;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`edit-booking-tabpanel-${index}`}
      aria-labelledby={`edit-booking-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `edit-booking-tab-${index}`,
    "aria-controls": `edit-booking-tabpanel-${index}`,
  };
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

interface ReservationValidationErrors {
  jettyPoint: string;
  bookingDate: string;
  passengers: string;
  packageId: string;
}

const BookingEditDialog: React.FC<BookingEditDialogProps> = ({
  open,
  onClose,
  bookingId,
  onUpdate,
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>(null);
  const [jettyPoints, setJettyPoints] = useState<any[]>([]);
  const [packages, setPackages] = useState<any[]>([]);
  const [addOns, setAddOns] = useState<AddOn[]>([]);
  const [saving, setSaving] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    addressLine1: "",
    postalCode: "",
    city: "",
    country: "",
  });
  const [reservationValidationErrors, setReservationValidationErrors] = useState<ReservationValidationErrors>({
    jettyPoint: "",
    bookingDate: "",
    passengers: "",
    packageId: "",
  });

  const validateName = (name: string): string => {
    if (!name) return "This field is required";
    if (name.length < 2) return "Must be at least 2 characters";
    if (!/^[a-zA-Z\s]*$/.test(name)) return "Only letters and spaces allowed";
    return "";
  };

  const validatePhoneNumber = (phone: string): string => {
    if (!phone) return "This field is required";
    const cleanPhone = phone.replace(/\s/g, "");
    const phoneRegex = /^(\+?60|0)\d{9,10}$/;
    if (!phoneRegex.test(cleanPhone)) {
      return "Invalid format. Use +601234567890 or 01234567890";
    }
    return "";
  };

  const validateEmail = (email: string): string => {
    if (!email) return "This field is required";
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
    if (!/^[a-zA-Z\s]*$/.test(country)) return "Only letters and spaces allowed";
    return "";
  };

  const validateReservationDetails = (): boolean => {
    const errors: ReservationValidationErrors = {
      jettyPoint: !formData.jettyPoint?.id ? "Please select a jetty point" : "",
      bookingDate: !formData.bookingDate ? "Please select a booking date" : "",
      passengers: !formData.passengers ? "Please enter number of passengers" : 
                 formData.passengers < 1 ? "Must have at least 1 passenger" : 
                 formData.passengers > formData.packageDetails?.maxCapacity ? `Maximum ${formData.packageDetails?.maxCapacity} passengers allowed` : "",
      packageId: !formData.packageDetails?.id ? "Please select a package" : "",
    };

    setReservationValidationErrors(errors);
    return !Object.values(errors).some(error => error !== "");
  };

  const validateForm = (): boolean => {
    if (activeTab === 0) {
      const errors: ValidationErrors = {
        firstName: validateName(formData.firstName),
        lastName: validateName(formData.lastName),
        phoneNumber: validatePhoneNumber(formData.phoneNumber),
        email: validateEmail(formData.email),
        addressLine1: validateAddressLine1(formData.addressLine1),
        postalCode: validatePostalCode(formData.postalCode),
        city: validateCity(formData.city),
        country: validateCountry(formData.country),
      };

      setValidationErrors(errors);
      return !Object.values(errors).some(error => error !== "");
    } else if (activeTab === 1) {
      return validateReservationDetails();
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }
    setSaving(true);
    setError(null);
    
    try {
      // Ensure all required fields are present
      if (!formData) {
        throw new Error("No form data available");
      }

      // Log the original form data for debugging
      console.log("Original form data:", formData);

      // Prepare the update data - only include fields that can be updated
      const updateData = {
        bookingId: bookingId,
        firstName: formData.firstName?.trim(),
        lastName: formData.lastName?.trim(),
        phoneNumber: formData.phoneNumber?.trim(),
        email: formData.email?.trim(),
        addressLine1: formData.addressLine1?.trim(),
        addressLine2: formData.addressLine2?.trim() || null,
        postalCode: formData.postalCode?.trim(),
        city: formData.city?.trim(),
        country: formData.country?.trim(),
        jettyPoint: formData.jettyPoint?.id,
        packageId: formData.packageDetails?.id || formData.packageId,
        bookingDate: formData.bookingDate,
        passengers: Number(formData.passengers) || 1,
        addOns: Array.isArray(formData.addOns) 
          ? formData.addOns.map((addon: AddOn | number) => 
              typeof addon === 'number' ? addon : addon.id
            )
          : [],
        alternativeDate1: formData.alternativeDate1 || null,
        alternativeDate2: formData.alternativeDate2 || null,
        specialRemarks: formData.specialRemarks?.trim() || null,
        status: formData.status || "PENDING"
      };

      // Log the prepared update data
      console.log("Sending update data:", updateData);

      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.BOOKINGS), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      const responseData = await response.json();
      console.log("Server response:", responseData);

      if (!response.ok) {
        const errorMessage = responseData.message || responseData.error || "Failed to update booking";
        throw new Error(errorMessage);
      }

      // Close dialog and notify parent
      onClose();
      onUpdate();

    } catch (err) {
      console.error("Error updating booking:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to save changes. Please try again.";
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  // Fetch booking data when dialog opens
  useEffect(() => {
    if (open && bookingId) {
      fetchBookingData();
    }
  }, [open, bookingId]);

  const fetchBookingData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch all required data in parallel
      const [bookingResponse, jettyResponse, packagesResponses, addOnsResponse] = await Promise.all([
        fetch(getApiUrl(API_CONFIG.ENDPOINTS.BOOKINGS) + `/${bookingId}`),
        fetch(getApiUrl(API_CONFIG.ENDPOINTS.JETTY_POINTS)),
        Promise.all([
          fetch(getApiUrl(API_CONFIG.ENDPOINTS.PACKAGES, { categoryId: 1 })),
          fetch(getApiUrl(API_CONFIG.ENDPOINTS.PACKAGES, { categoryId: 2 })),
          fetch(getApiUrl(API_CONFIG.ENDPOINTS.PACKAGES, { categoryId: 3 })),
        ]),
        fetch(getApiUrl(API_CONFIG.ENDPOINTS.ADD_ONS))
      ]);

      const bookingData = await bookingResponse.json();
      const jettyData = await jettyResponse.json();
      const packagesData = (await Promise.all(packagesResponses.map(r => r.json()))).flat();
      const addOnsData = await addOnsResponse.json();

      setFormData(bookingData);
      setJettyPoints(jettyData);
      setPackages(packagesData);
      setAddOns(addOnsData);
    } catch (err) {
      setError("Failed to load booking data. Please try again.");
      console.error("Error fetching booking data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle dialog close
  const handleClose = () => {
    setError(null);
    onClose();
  };

  if (loading) {
    return (
      <Dialog open={open} onClose={onClose}>
        <DialogContent>
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        </DialogContent>
      </Dialog>
    );
  }

  if (error) {
    return (
      <Dialog open={open} onClose={onClose}>
        <DialogContent>
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography color="error" gutterBottom>{error}</Typography>
            <Button onClick={fetchBookingData}>Retry</Button>
          </Box>
        </DialogContent>
      </Dialog>
    );
  }

  if (!formData) {
    return null;
  }

  return (
    <>
      <Dialog 
        open={open} 
        onClose={handleClose}
        maxWidth="md" 
        fullWidth
        disableEscapeKeyDown={saving}
      >
        <DialogTitle>Edit Booking Details</DialogTitle>
        <DialogContent>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs value={activeTab} onChange={handleTabChange}>
              <Tab label="Customer Info" {...a11yProps(0)} />
              <Tab label="Reservation Details" {...a11yProps(1)} />
              <Tab label="Additional Options" {...a11yProps(2)} />
            </Tabs>
          </Box>

          {/* Customer Info Tab */}
          <TabPanel value={activeTab} index={0}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  error={!!validationErrors.firstName}
                  helperText={validationErrors.firstName}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  error={!!validationErrors.lastName}
                  helperText={validationErrors.lastName}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  error={!!validationErrors.email}
                  helperText={validationErrors.email}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                  error={!!validationErrors.phoneNumber}
                  helperText={validationErrors.phoneNumber}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address Line 1"
                  value={formData.addressLine1}
                  onChange={(e) => handleInputChange("addressLine1", e.target.value)}
                  error={!!validationErrors.addressLine1}
                  helperText={validationErrors.addressLine1}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address Line 2"
                  value={formData.addressLine2 || ""}
                  onChange={(e) => handleInputChange("addressLine2", e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Postal Code"
                  value={formData.postalCode}
                  onChange={(e) => handleInputChange("postalCode", e.target.value)}
                  error={!!validationErrors.postalCode}
                  helperText={validationErrors.postalCode}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="City"
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  error={!!validationErrors.city}
                  helperText={validationErrors.city}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Country"
                  value={formData.country}
                  onChange={(e) => handleInputChange("country", e.target.value)}
                  error={!!validationErrors.country}
                  helperText={validationErrors.country}
                />
              </Grid>
            </Grid>
          </TabPanel>

          {/* Reservation Details Tab */}
          <TabPanel value={activeTab} index={1}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant="outlined" error={!!reservationValidationErrors.jettyPoint}>
                  <InputLabel id="jetty-point-label">Jetty Point</InputLabel>
                  <Select
                    labelId="jetty-point-label"
                    label="Jetty Point"
                    value={formData.jettyPoint.id.toString()}
                    onChange={(e: any) =>
                      handleInputChange("jettyPoint", {
                        id: parseInt(e.target.value),
                        name: jettyPoints.find(jp => jp.id.toString() === e.target.value)?.name
                      })
                    }
                  >
                    {jettyPoints.map((point) => (
                      <MenuItem key={point.id} value={point.id.toString()}>
                        {point.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {reservationValidationErrors.jettyPoint && (
                    <FormHelperText>{reservationValidationErrors.jettyPoint}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Booking Date"
                    value={dayjs(formData.bookingDate)}
                    onChange={(newValue) =>
                      handleInputChange(
                        "bookingDate",
                        newValue ? newValue.format("YYYY-MM-DD") : null
                      )
                    }
                    sx={{ width: "100%" }}
                    slotProps={{
                      textField: {
                        error: !!reservationValidationErrors.bookingDate,
                        helperText: reservationValidationErrors.bookingDate
                      }
                    }}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Passengers"
                  value={formData.passengers}
                  onChange={(e) =>
                    handleInputChange("passengers", parseInt(e.target.value))
                  }
                  InputProps={{ inputProps: { min: 1 } }}
                  error={!!reservationValidationErrors.passengers}
                  helperText={reservationValidationErrors.passengers}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant="outlined" error={!!reservationValidationErrors.packageId}>
                  <InputLabel id="package-label">Package</InputLabel>
                  <Select
                    labelId="package-label"
                    label="Package"
                    value={formData.packageDetails.id.toString()}
                    onChange={(e: any) => {
                      const selectedPackage = packages.find(p => p.id.toString() === e.target.value);
                      if (selectedPackage) {
                        handleInputChange("packageDetails", {
                          id: selectedPackage.id,
                          name: selectedPackage.name,
                          description: selectedPackage.description,
                          basePrice: selectedPackage.basePrice,
                          maxCapacity: selectedPackage.maxCapacity,
                          durationMinutes: selectedPackage.durationMinutes,
                          services: selectedPackage.services
                        });
                      }
                    }}
                  >
                    <ListSubheader 
                      sx={{ 
                        bgcolor: '#e3f2fd', 
                        lineHeight: '32px', 
                        fontWeight: 'bold',
                        color: '#0384BD',
                        borderTop: '1px solid #90caf9',
                        borderBottom: '1px solid #90caf9',
                        fontSize: '0.95rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}
                    >
                      Boat Charter
                    </ListSubheader>
                    {packages
                      .filter(pkg => pkg.categoryId === 1)
                      .map((pkg) => (
                        <MenuItem key={pkg.id} value={pkg.id.toString()}>
                          {pkg.name}
                        </MenuItem>
                    ))}
                    
                    <ListSubheader 
                      sx={{ 
                        bgcolor: '#e3f2fd', 
                        lineHeight: '32px', 
                        fontWeight: 'bold',
                        color: '#0384BD',
                        borderTop: '1px solid #90caf9',
                        borderBottom: '1px solid #90caf9',
                        fontSize: '0.95rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}
                    >
                      Island Trip
                    </ListSubheader>
                    {packages
                      .filter(pkg => pkg.categoryId === 2)
                      .map((pkg) => (
                        <MenuItem key={pkg.id} value={pkg.id.toString()}>
                          {pkg.name}
                        </MenuItem>
                    ))}
                    
                    <ListSubheader 
                      sx={{ 
                        bgcolor: '#e3f2fd', 
                        lineHeight: '32px', 
                        fontWeight: 'bold',
                        color: '#0384BD',
                        borderTop: '1px solid #90caf9',
                        borderBottom: '1px solid #90caf9',
                        fontSize: '0.95rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}
                    >
                      Fishing Trip
                    </ListSubheader>
                    {packages
                      .filter(pkg => pkg.categoryId === 3)
                      .map((pkg) => (
                        <MenuItem key={pkg.id} value={pkg.id.toString()}>
                          {pkg.name}
                        </MenuItem>
                    ))}
                  </Select>
                  {reservationValidationErrors.packageId && (
                    <FormHelperText>{reservationValidationErrors.packageId}</FormHelperText>
                  )}
                </FormControl>
              </Grid>

              {/* Package Info */}
              {formData.packageDetails && (
                <Grid item xs={12}>
                  <Paper variant="outlined" sx={{ p: 2, mt: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      Package Info
                    </Typography>
                    <Box sx={{ display: "flex", gap: 4, mb: 2 }}>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          <AccessTimeIcon
                            sx={{ fontSize: "small", verticalAlign: "middle", mr: 0.5 }}
                          />
                          Duration: {formData.packageDetails.durationMinutes} minutes
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          <GroupIcon
                            sx={{ fontSize: "small", verticalAlign: "middle", mr: 0.5 }}
                          />
                          Max Capacity: {formData.packageDetails.maxCapacity} persons
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          <PaidIcon
                            sx={{ fontSize: "small", verticalAlign: "middle", mr: 0.5 }}
                          />
                          RM{formData.packageDetails.basePrice}
                        </Typography>
                      </Box>
                    </Box>

                    <Typography variant="subtitle2" gutterBottom>
                      Services Included:
                    </Typography>
                    <List dense>
                      {formData.packageDetails.services?.map((service: any) => (
                        <ListItem key={service.id} sx={{ py: 0 }}>
                          <ListItemIcon sx={{ minWidth: 32 }}>
                            <CheckIcon sx={{ fontSize: "small" }} />
                          </ListItemIcon>
                          <ListItemText primary={service.name} />
                        </ListItem>
                      ))}
                    </List>
                  </Paper>
                </Grid>
              )}
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Add-ons
                </Typography>
                <FormGroup>
                  {[...addOns]
                    .sort((a, b) => {
                      // Sort by perPerson (false comes first)
                      if (a.perPerson !== b.perPerson) {
                        return a.perPerson ? 1 : -1;
                      }
                      // If both have same perPerson value, sort by name
                      return a.name.localeCompare(b.name);
                    })
                    .map((addon) => (
                      <FormControlLabel
                        key={addon.id}
                        control={
                          <Checkbox
                            checked={formData.addOns.some((a: any) => a.id === addon.id)}
                            onChange={(e) => {
                              const isChecked = e.target.checked;
                              setFormData((prev: any) => ({
                                ...prev,
                                addOns: isChecked
                                  ? [...prev.addOns, { id: addon.id, name: addon.name, price: addon.price, perPerson: addon.perPerson }]
                                  : prev.addOns.filter((a: any) => a.id !== addon.id),
                              }));
                            }}
                          />
                        }
                        label={`${addon.name}${addon.perPerson ? ' (RM10/pax)' : ' (RM10)'}`}
                      />
                    ))}
                </FormGroup>
              </Grid>
            </Grid>
          </TabPanel>

          {/* Additional Options Tab */}
          <TabPanel value={activeTab} index={2}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Alternative Date 1"
                    value={formData.alternativeDate1 ? dayjs(formData.alternativeDate1) : null}
                    onChange={(newValue) =>
                      handleInputChange(
                        "alternativeDate1",
                        newValue ? newValue.format("YYYY-MM-DD") : null
                      )
                    }
                    sx={{ width: "100%" }}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Alternative Date 2"
                    value={formData.alternativeDate2 ? dayjs(formData.alternativeDate2) : null}
                    onChange={(newValue) =>
                      handleInputChange(
                        "alternativeDate2",
                        newValue ? newValue.format("YYYY-MM-DD") : null
                      )
                    }
                    sx={{ width: "100%" }}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Special Remarks"
                  value={formData.specialRemarks || ""}
                  onChange={(e) => handleInputChange("specialRemarks", e.target.value)}
                />
              </Grid>
            </Grid>
          </TabPanel>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={saving}>Cancel</Button>
          <Button 
            onClick={handleSave} 
            variant="contained" 
            disabled={saving}
            startIcon={saving ? <CircularProgress size={20} /> : null}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Error notification */}
      <Snackbar
        open={!!error}
        autoHideDuration={5000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{ position: 'fixed', top: 24 }}
      >
        <Alert 
          onClose={() => setError(null)} 
          severity="error" 
          variant="filled"
          sx={{ width: '100%' }}
        >
          {error}
        </Alert>
      </Snackbar>
    </>
  );
};

export default BookingEditDialog;
