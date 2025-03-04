import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Box,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import completeImg from "../assets/images/complete-img.png";

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
          Thank you for your inquiry! We have sent a confirmation email to your registered email address.
        </Typography>

        <Box 
          sx={{ 
            my: 2,
            display: 'flex',
            justifyContent: 'center',
            width: '100%'
          }}
        >
          <Box
            component="img"
            src={completeImg}
            alt="Inquiry Complete"
            sx={{
              width: '100%',
              height: 'auto',
              maxHeight: '200px',
              objectFit: 'cover',
              borderRadius: 1
            }}
          />
        </Box>

        <Typography variant="body1">
          Please check your inbox (and spam folder) for the confirmation email. Our team will review your inquiry and get back to you shortly.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          onClick={handleClose}
          variant="contained"
          sx={{
            bgcolor: "#0384BD",
            "&:hover": {
              bgcolor: "#026994",
            },
          }}
        >
          CLOSE
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CompletionDialog;
