// API Configuration
export const API_CONFIG = {
    BASE_URL: process.env.REACT_APP_API_URL,
    ENDPOINTS: {
        BOOKINGS: '/bookings',
        PACKAGES: '/packages',
        PACKAGE_CATEGORIES: '/package-categories',
        JETTY_POINTS: '/jettypoints',
        ADD_ONS: '/addons',
        TEST: '/test'
    }
};

// Helper function to build API URLs
export const getApiUrl = (endpoint: string, params?: Record<string, any>) => {
    let url = `${API_CONFIG.BASE_URL}${endpoint}`;
    
    // Add category ID if it exists
    if (params?.categoryId) {
        url += `/category/${params.categoryId}`;
    }
    
    return url;
};
