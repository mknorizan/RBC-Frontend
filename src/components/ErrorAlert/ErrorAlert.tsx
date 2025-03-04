import React from 'react';
import { Alert, AlertTitle, Button, Stack, Typography, Box } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import ReplayIcon from '@mui/icons-material/Replay';
import EmailIcon from '@mui/icons-material/Email';

export interface ErrorAlertProps {
  severity: 'recoverable' | 'semi-recoverable' | 'critical';
  message: string;
  onRetry?: () => void;
  onClose?: () => void;
  errorCode?: string;
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({
  severity,
  message,
  onRetry,
  onClose,
  errorCode,
}) => {
  const getAlertConfig = () => {
    switch (severity) {
      case 'recoverable':
        return {
          title: 'Temporary Error',
          color: 'warning',
          showRetry: true,
          showContact: false,
        };
      case 'semi-recoverable':
        return {
          title: 'Service Disruption',
          color: 'warning',
          showRetry: true,
          showContact: true,
        };
      case 'critical':
        return {
          title: 'System Error',
          color: 'error',
          showRetry: false,
          showContact: true,
        };
      default:
        return {
          title: 'Error',
          color: 'error',
          showRetry: false,
          showContact: true,
        };
    }
  };

  const config = getAlertConfig();

  return (
    <Alert
      severity={config.color as 'error' | 'warning'}
      onClose={onClose}
      sx={{
        '& .MuiAlert-message': {
          width: '100%'
        }
      }}
    >
      <AlertTitle sx={{ fontWeight: 'bold' }}>{config.title}</AlertTitle>
      
      <Stack spacing={2}>
        <Typography variant="body2">{message}</Typography>
        
        {errorCode && (
          <Typography variant="caption" color="text.secondary">
            Error Code: {errorCode}
          </Typography>
        )}

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {config.showRetry && onRetry && (
            <Button
              size="small"
              startIcon={<ReplayIcon />}
              onClick={onRetry}
              variant="contained"
              color="primary"
              sx={{ minWidth: 100 }}
            >
              Try Again
            </Button>
          )}
          
          {config.showContact && (
            <Button
              size="small"
              startIcon={<EmailIcon />}
              href="mailto:support@rhumuda.com"
              variant="outlined"
              color={config.color === 'error' ? 'error' : 'primary'}
              sx={{ minWidth: 100 }}
            >
              Contact Support
            </Button>
          )}
        </Box>
      </Stack>
    </Alert>
  );
};

export default ErrorAlert;
