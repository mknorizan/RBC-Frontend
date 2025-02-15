import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

interface CompletionDialogProps {
  open: boolean;
  onClose: () => void;
}

const CompletionDialog: React.FC<CompletionDialogProps> = ({
  open,
  onClose,
}) => {
  const handleClose = () => {
    // Clear localStorage
    localStorage.removeItem("rhumuda_inquiry_form");
    onClose();
  };

  return (
    <Dialog
      open={open}
      PaperProps={{
        sx: {
          width: "400px",
          borderRadius: "12px",
        },
      }}
    >
      <DialogTitle
        sx={{
          bgcolor: "#0384BD",
          color: "white",
          py: 2,
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <CheckCircleOutlineIcon />
        Inquiry Sent Successfully
      </DialogTitle>
      <DialogContent sx={{ mt: 2, pb: 3 }}>
        <Typography variant="body1" gutterBottom>
          Thank you for your inquiry! We have sent a confirmation email to your
          registered email address.
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Please check your inbox (and spam folder) for the confirmation email.
          Our team will review your inquiry and get back to you shortly.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button
          variant="contained"
          onClick={handleClose}
          sx={{
            bgcolor: "#0384BD",
            "&:hover": { bgcolor: "rgba(3, 132, 189, 0.9)" },
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CompletionDialog;
