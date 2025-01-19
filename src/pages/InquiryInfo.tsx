import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  TextField,
  Button,
} from "@mui/material";
import Header from "../components/layout/Header";

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

const InquiryInfo = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = location.state as SearchParams;

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

  const [touchedFields, setTouchedFields] = useState<{
    [key: string]: boolean;
  }>({});

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

  const shouldShowError = (field: string) => {
    return touchedFields[field] && !customerInfo[field as keyof CustomerInfo];
  };

  const textFieldSx = (field: string) => ({
    bgcolor: "white",
    borderRadius: 1,
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: shouldShowError(field) ? "#d32f2f" : "#e0e0e0",
      },
    },
  });

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

    const newTouchedFields = { ...touchedFields };
    requiredFields.forEach((field) => {
      newTouchedFields[field] = true;
    });
    setTouchedFields(newTouchedFields);

    return requiredFields.every((field) => customerInfo[field]);
  };

  const handleNext = () => {
    if (!validateCustomerInfo()) {
      return;
    }

    // Navigate to reservation details page with both search params and customer info
    navigate("/inquiry/reservation", {
      state: {
        searchParams,
        customerInfo,
      },
    });
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
          Customer Information
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
                  shouldShowError("lastName") ? "Last name is required" : ""
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
                label="Email"
                value={customerInfo.email}
                onChange={handleInputChange("email")}
                error={shouldShowError("email")}
                helperText={shouldShowError("email") ? "Email is required" : ""}
                onBlur={() =>
                  setTouchedFields((prev) => ({
                    ...prev,
                    email: true,
                  }))
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
                  shouldShowError("postalCode") ? "Postal code is required" : ""
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
                helperText={shouldShowError("city") ? "City is required" : ""}
                onBlur={() =>
                  setTouchedFields((prev) => ({
                    ...prev,
                    city: true,
                  }))
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
                  setTouchedFields((prev) => ({
                    ...prev,
                    country: true,
                  }))
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
      </Container>
    </Box>
  );
};

export default InquiryInfo;
