import React from "react";
import { Box, Container, Typography, Grid, Paper } from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

const ContactUsPage = () => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.default",
      }}
    >
      <Header />
      <Container maxWidth="lg" sx={{ py: 3, flex: 1 }}>
        <Typography
          variant="h4"
          component="h1"
          align="center"
          gutterBottom
          sx={{
            mb: 3,
            fontFamily: "Playfair Display, serif",
          }}
        >
          Reach out to us with any questions, we'll try to help!
        </Typography>

        <Grid container spacing={3}>
          {/* WhatsApp */}
          <Grid item xs={12} md={4}>
            {/* https://create.wa.link/ - WhatsApp Link Generator */}
            <Paper
              component="a"
              href="https://wa.link/zfhxeq"
              target="_blank"
              rel="noopener noreferrer"
              elevation={0}
              sx={{
                p: 4,
                minHeight: "300px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "#f5f5f5",
                borderRadius: 4,
                textDecoration: "none",
                color: "inherit",
                cursor: "pointer",
                transition: "transform 0.2s ease-in-out",
                "&:hover": {
                  transform: "scale(1.02)",
                },
              }}
            >
              <WhatsAppIcon
                sx={{ fontSize: 48, mb: 2.5, color: "primary.main" }}
              />
              <Typography variant="h6" align="center" sx={{ mb: 1 }}>
                +6013-631 1100
              </Typography>
              <Typography
                variant="h5"
                component="h3"
                align="center"
                sx={{ mb: 2 }}
              >
                Live Chat Hours
              </Typography>
              <Typography align="center" sx={{ mb: 0.5 }}>
                Monday - Sunday
              </Typography>
              <Typography align="center">6:00 AM - 9:00 PM</Typography>
            </Paper>
          </Grid>

          {/* Phone */}
          <Grid item xs={12} md={4}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                minHeight: "300px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "#f5f5f5",
                borderRadius: 4,
              }}
            >
              <PhoneIcon
                sx={{ fontSize: 48, mb: 2.5, color: "primary.main" }}
              />
              <Typography variant="h6" align="center" sx={{ mb: 1 }}>
                +609 618 6140
              </Typography>
              <Typography
                variant="h5"
                component="h3"
                align="center"
                sx={{ mb: 2 }}
              >
                Phone Call Hours
              </Typography>
              <Typography align="center" sx={{ mb: 0.5 }}>
                Monday - Friday
              </Typography>
              <Typography align="center">6:00 AM - 9:00 PM</Typography>
            </Paper>
          </Grid>

          {/* Email */}
          <Grid item xs={12} md={4}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                minHeight: "300px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "#f5f5f5",
                borderRadius: 4,
              }}
            >
              <EmailIcon
                sx={{ fontSize: 48, mb: 2.5, color: "primary.main" }}
              />
              <Typography variant="h6" align="center" sx={{ mb: 1 }}>
                rhumudaboatcharter@gmail.com
              </Typography>
              <Typography
                variant="h5"
                component="h3"
                align="center"
                sx={{ mb: 2 }}
              >
                Email Hours
              </Typography>
              <Typography align="center" sx={{ mb: 0.5 }}>
                Monday - Sunday
              </Typography>
              <Typography align="center">6:00 AM - 9:00 PM</Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </Box>
  );
};

export default ContactUsPage;
