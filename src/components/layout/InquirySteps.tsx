import React from "react";
import { Stepper, Step, StepLabel, Box } from "@mui/material";

interface InquiryStepsProps {
  activeStep: number;
}

const steps = ["Customer Info", "Reservation Details", "Other Options"];

const InquirySteps = ({ activeStep }: InquiryStepsProps) => {
  return (
    <Box sx={{ mb: 6 }}>
      <Stepper
        activeStep={activeStep}
        sx={{
          "& .MuiStepConnector-line": {
            marginTop: "12px",
          },
        }}
      >
        {steps.map((label, index) => (
          <Step key={`step-${label}-${index}`}>
            <StepLabel
              StepIconProps={{
                sx: {
                  width: 40,
                  height: 40,
                  "& .MuiStepIcon-text": {
                    display: "none",
                  },
                  "&.Mui-active": {
                    color: "#0384BD",
                  },
                  "&.Mui-completed": {
                    color: "#0384BD",
                  },
                },
              }}
              sx={{
                flexDirection: "column",
                alignItems: "center",
                "& .MuiStepLabel-label": {
                  marginTop: 1,
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  mt: 1.5,
                  textAlign: "center",
                },
              }}
            >
              {label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
};

export default InquirySteps;
