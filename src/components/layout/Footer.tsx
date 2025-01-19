import React from "react";
import { Box, Typography, Container, IconButton, Divider } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TikTokIcon from "@mui/icons-material/MusicNote"; // We'll use MusicNote as TikTok icon for now

const Footer = () => {
  return (
    <>
      <Divider sx={{ borderColor: "#000" }} />
      <Container maxWidth="lg">
        <Box
          sx={{
            py: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* Copyright Text */}
          <Typography sx={{ fontSize: "0.9rem" }}>
            © 2025 Rhumuda Boat Charter
          </Typography>

          {/* Social Media Icons */}
          <Box>
            <IconButton
              href="https://www.facebook.com/rhumudaboatcharter"
              target="_blank"
              rel="noopener noreferrer"
              size="small"
              sx={{ color: "#000" }}
            >
              <FacebookIcon />
            </IconButton>
            <IconButton
              href="https://www.instagram.com/rhumudaboatcharter"
              target="_blank"
              rel="noopener noreferrer"
              size="small"
              sx={{ color: "#000" }}
            >
              <InstagramIcon />
            </IconButton>
            <IconButton
              href="https://www.tiktok.com/@rhumudaboatcharter"
              target="_blank"
              rel="noopener noreferrer"
              size="small"
              sx={{ color: "#000" }}
            >
              <TikTokIcon />
            </IconButton>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default Footer;
