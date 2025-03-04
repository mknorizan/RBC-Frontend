import React from "react";
import { Box } from "@mui/material";
import { SYSTEM_PADDING } from "../../constants/layout";
import Footer from "../Footer";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh'
      }}
    >
      <Box sx={{ px: SYSTEM_PADDING.x, flex: 1 }}>
        {children}
      </Box>
      <Footer />
    </Box>
  );
};

export default Layout;
