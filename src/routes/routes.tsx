import { createBrowserRouter } from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import AboutUsPage from '../pages/AboutUsPage';
import ContactUsPage from '../pages/ContactUsPage';
import ServicesPage from '../pages/services/ServicesPage';

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: '/about',
    element: <AboutUsPage />,
  },
  {
    path: '/contact',
    element: <ContactUsPage />,
  },
  {
    path: '/services/*',
    element: <ServicesPage />,
  }
]);