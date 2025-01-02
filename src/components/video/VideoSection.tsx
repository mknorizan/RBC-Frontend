import React from "react";
import { Box, Typography } from "@mui/material";

const VideoSection = () => {
  return (
    <Box sx={{ width: "100%", my: 8 }}>
      <Typography
        variant="h4"
        component="h2"
        align="center"
        sx={{
          mb: 4,
          fontFamily: "Playfair Display, serif",
        }}
      >
        Explore Pulau Kapas
      </Typography>

      <Box
        sx={{
          position: "relative",
          width: "100%",
          paddingTop: "56.25%", // 16:9 Aspect Ratio
          borderRadius: "20px",
          overflow: "hidden",
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
        }}
      >
        <iframe
          src="https://www.youtube.com/embed/iR8MHSyERTk"
          title="Explore Pulau Kapas"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            border: 0,
          }}
        />
      </Box>
    </Box>
  );
};

export default VideoSection;
