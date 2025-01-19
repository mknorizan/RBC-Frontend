import React, { useState, useEffect } from "react";
import { Box, Container } from "@mui/material";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import SearchBar from "../components/search/SearchBar";
import CharterTypeSelector from "../components/search/CharterTypeSelector";
import PackageGrid from "../components/packages/PackageGrid";
import FishingPackageGrid from "../components/packages/FishingPackageGrid";
import BoatPackageGrid from "../components/packages/BoatPackageGrid";
import VideoSection from "../components/video/VideoSection";
import ServicesOffered from "../components/services/ServicesOffered";

const LandingPage = () => {
  const [selectedType, setSelectedType] = useState<
    "recreation" | "fishing" | "boat"
  >("boat");

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
      <Container
        maxWidth="lg"
        sx={{
          py: 4,
          flex: 1,
          position: "relative",
          zIndex: 1,
        }}
      >
        <CharterTypeSelector
          selectedType={selectedType}
          onTypeChange={setSelectedType}
        />
        {selectedType === "recreation" ? (
          <PackageGrid type="recreation" />
        ) : selectedType === "fishing" ? (
          <FishingPackageGrid />
        ) : (
          <BoatPackageGrid />
        )}

        <VideoSection />
        <ServicesOffered />
      </Container>
      <Footer />
    </Box>
  );
};

export default LandingPage;
