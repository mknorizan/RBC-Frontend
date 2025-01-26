import React, { useState } from "react";
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
import InquirySteps from "../components/layout/InquirySteps";

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

const InquiryOptions = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { searchParams, customerInfo, reservationDetails } = location.state as {
    searchParams: SearchParams;
    customerInfo: CustomerInfo;
    reservationDetails: ReservationDetails;
  };

  const [otherOptions, setOtherOptions] = useState<OtherOptions>({
    alternativeDate1: "",
    alternativeDate2: "",
    specialRequests: "",
  });

  const handleInputChange =
    (field: keyof OtherOptions) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setOtherOptions((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
    };

  const handleNext = () => {
    navigate("/inquiry/summary", {
      state: {
        searchParams,
        customerInfo,
        reservationDetails,
        otherOptions: {
          alternativeDate1: otherOptions.alternativeDate1,
          alternativeDate2: otherOptions.alternativeDate2,
          specialRequests: otherOptions.specialRequests,
        },
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
        <InquirySteps activeStep={2} />

        <Typography
          variant="h4"
          gutterBottom
          align="center"
          sx={{
            fontFamily: "Playfair Display, serif",
            mb: 4,
          }}
        >
          Other Options
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
                fullWidth
                label="Alternative Date 1"
                type="date"
                value={otherOptions.alternativeDate1}
                onChange={handleInputChange("alternativeDate1")}
                InputLabelProps={{
                  shrink: true,
                }}
                sx={{
                  bgcolor: "white",
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#e0e0e0",
                    },
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Alternative Date 2"
                type="date"
                value={otherOptions.alternativeDate2}
                onChange={handleInputChange("alternativeDate2")}
                InputLabelProps={{
                  shrink: true,
                }}
                sx={{
                  bgcolor: "white",
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#e0e0e0",
                    },
                  },
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Special Requests"
                value={otherOptions.specialRequests}
                onChange={handleInputChange("specialRequests")}
                sx={{
                  bgcolor: "white",
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#e0e0e0",
                    },
                  },
                }}
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

export default InquiryOptions;
