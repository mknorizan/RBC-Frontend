import { createBrowserRouter } from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import AboutUsPage from "../pages/AboutUsPage";
import ContactUsPage from "../pages/ContactUsPage";
import ServicesPage from "../pages/services/ServicesPage";
import InquiryPage from "../pages/InquiryPage";
import InquiryInfo from "../pages/InquiryInfo";
import InquiryReservation from "../pages/InquiryReservation";
import InquiryOptions from "../pages/InquiryOptions";
import SummaryPage from "../pages/SummaryPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/about",
    element: <AboutUsPage />,
  },
  {
    path: "/contact",
    element: <ContactUsPage />,
  },
  {
    path: "/services/*",
    element: <ServicesPage />,
  },
  {
    path: "/inquiry",
    element: <InquiryPage />,
  },
  {
    path: "/inquiry/info",
    element: <InquiryInfo />,
  },
  {
    path: "/inquiry/reservation",
    element: <InquiryReservation />,
  },
  {
    path: "/inquiry/options",
    element: <InquiryOptions />,
  },
  {
    path: "/inquiry/summary",
    element: <SummaryPage />,
  },
]);
