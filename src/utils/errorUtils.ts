interface ErrorConfig {
  severity: 'recoverable' | 'semi-recoverable' | 'critical';
  message: string;
  errorCode?: string;
}

export const getErrorConfig = (error: any): ErrorConfig => {
  // Network errors
  if (error.name === 'TimeoutError' || error.message?.includes('timeout')) {
    return {
      severity: 'recoverable',
      message: 'The request timed out. Please check your internet connection and try again.',
      errorCode: 'TIMEOUT_001'
    };
  }

  if (!navigator.onLine || error.message?.includes('offline')) {
    return {
      severity: 'recoverable',
      message: 'You appear to be offline. Please check your internet connection and try again.',
      errorCode: 'NETWORK_001'
    };
  }

  // Server errors
  if (error.status === 503 || error.message?.includes('service unavailable')) {
    return {
      severity: 'semi-recoverable',
      message: 'Our service is temporarily unavailable. We are working to restore it. Please try again in a few minutes.',
      errorCode: 'SERVER_001'
    };
  }

  if (error.status === 500 || error.message?.includes('internal server error')) {
    return {
      severity: 'critical',
      message: 'We encountered an unexpected error. Our team has been notified. Please contact support if this persists.',
      errorCode: 'SERVER_002'
    };
  }

  // Database errors
  if (error.message?.includes('database') || error.message?.includes('sql')) {
    return {
      severity: 'critical',
      message: 'We are experiencing database issues. Our team has been notified. Please try again later or contact support.',
      errorCode: 'DB_001'
    };
  }

  // Authentication errors
  if (error.status === 401 || error.message?.includes('unauthorized')) {
    return {
      severity: 'recoverable',
      message: 'Your session has expired. Please refresh the page and try again.',
      errorCode: 'AUTH_001'
    };
  }

  // Rate limiting
  if (error.status === 429 || error.message?.includes('too many requests')) {
    return {
      severity: 'semi-recoverable',
      message: 'Too many requests. Please wait a moment before trying again.',
      errorCode: 'RATE_001'
    };
  }

  // Default error
  return {
    severity: 'critical',
    message: 'An unexpected error occurred. Please try again or contact support if the issue persists.',
    errorCode: 'GEN_001'
  };
};

export const isRetryableError = (error: any): boolean => {
  const config = getErrorConfig(error);
  return ['recoverable', 'semi-recoverable'].includes(config.severity);
};
