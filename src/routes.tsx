import { createBrowserRouter, Outlet, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import AboutUsPage from "./pages/AboutUsPage";
import ContactUsPage from "./pages/ContactUsPage";
import ServicesPage from "./pages/services/ServicesPage";

const RootLayout = () => {
  return <Outlet />;
};

export const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Navigate to="/rhumuda" replace />,
    },
    {
      path: "/rhumuda",
      element: <RootLayout />,
      children: [
        {
          index: true,
          element: <LandingPage />,
        },
        {
          path: "about",
          element: <AboutUsPage />,
        },
        {
          path: "contact",
          element: <ContactUsPage />,
        },
        {
          path: "services/*",
          element: <ServicesPage />,
        },
      ],
    },
  ],
  {
    basename: "/",
  }
);
