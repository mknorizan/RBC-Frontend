import React from "react";
import { Box } from "@mui/material";
import { SYSTEM_PADDING } from "../../constants/layout";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return <Box sx={{ px: SYSTEM_PADDING.x }}>{children}</Box>;
};

export default Layout;
