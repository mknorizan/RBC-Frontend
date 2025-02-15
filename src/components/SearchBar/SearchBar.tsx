import React from "react";
import { useNavigate } from "react-router-dom";
import JettyPointDropdown from "../JettyPointDropdown";
import BookingDatePicker from "../BookingDatePicker";
import PassengerCounter from "../PassengerCounter";
import { Box, Paper, IconButton, Divider } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

interface SearchBarProps {
  isCompact?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ isCompact = false }) => {
  const navigate = useNavigate();
  const [searchValues, setSearchValues] = React.useState({
    jettyPoint: "",
    bookingDate: "",
    passengers: 1,
  });

  const handleSearch = () => {
    navigate("/inquiry", {
      state: searchValues,
    });
  };

  return (
    <Paper
      sx={{
        p: isCompact ? "6px 12px" : "8px",
        borderRadius: "40px",
        border: "1px solid black",
        width: isCompact ? "600px" : "750px",
        margin: "0 auto",
        height: isCompact ? "40px" : "50px",
        display: "flex",
        alignItems: "center",
        transition: "all 0.3s ease-in-out",
        backgroundColor: "white",
        position: "relative",
        boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
        "&:hover": {
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          width: "100%",
          px: isCompact ? 1 : 2,
          gap: isCompact ? 1 : 2,
        }}
      >
        <Box
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            minWidth: 0,
            px: isCompact ? 0.5 : 1,
          }}
        >
          <JettyPointDropdown
            value={searchValues.jettyPoint}
            onChange={(value) =>
              setSearchValues((prev) => ({
                ...prev,
                jettyPoint: value,
              }))
            }
            isCompact={isCompact}
          />
        </Box>
        <Divider
          orientation="vertical"
          flexItem
          sx={{
            height: isCompact ? "28px" : "35px",
            my: "auto",
            borderColor: "black",
            alignSelf: "center",
          }}
        />
        <Box sx={{ flex: 1 }}>
          <BookingDatePicker
            value={searchValues.bookingDate}
            onChange={(value: string) =>
              setSearchValues((prev) => ({
                ...prev,
                bookingDate: value,
              }))
            }
            isCompact={isCompact}
          />
        </Box>
        <Divider
          orientation="vertical"
          flexItem
          sx={{
            height: isCompact ? "28px" : "35px",
            my: "auto",
            borderColor: "black",
            alignSelf: "center",
          }}
        />
        <Box sx={{ flex: 1 }}>
          <PassengerCounter
            value={searchValues.passengers}
            onChange={(value) =>
              setSearchValues((prev) => ({
                ...prev,
                passengers: value,
              }))
            }
            isCompact={isCompact}
          />
        </Box>
      </Box>

      <IconButton
        onClick={handleSearch}
        sx={{
          backgroundColor: "#0384BD",
          color: "white",
          position: "absolute",
          right: isCompact ? "6px" : "8px",
          height: isCompact ? "35px" : "45px",
          width: isCompact ? "35px" : "45px",
          transition: "all 0.3s ease-in-out",
          "&:hover": {
            backgroundColor: "#026994",
          },
        }}
      >
        <SearchIcon sx={{ fontSize: isCompact ? "1.2rem" : "1.4rem" }} />
      </IconButton>
    </Paper>
  );
};

export default SearchBar;
