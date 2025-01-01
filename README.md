# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```

# Rhumuda Boat Charter Frontend System

## Overview
Rhumuda Boat Charter System is a comprehensive web-based booking platform designed for managing boat charter inquiries. The Phase 1 system implements a full inquiry-to-notification workflow, handling customer booking requests and administrative notifications through an automated system.

## Technical Stack Details
### Frontend
- React 18+ with TypeScript
- Vite as build tool and development server
- Bootstrap 5 for responsive UI components
- Axios for HTTP requests
- Environment configuration via .env files

## Detailed Features

### Booking System
1. Customer Inquiry Submission
   - Primary date selection with ISO-8601 datetime format
   - Multiple alternative dates (up to 2)
   - Departure time selection (24-hour format)
   - Party size specification:
     * Adults
     * Seniors
     * Children
     * Infants
   - Trip duration in hours
   - Jetty selection
   - Charter type selection

2. Contact Information
   - First name
   - Last name
   - Email address
   - Phone number
   - Optional additional comments
   - Newsletter opt-in option

3. Booking Management
   - Automatic booking ID generation (format: BK + UUID)
   - Status tracking (PENDING/CANCELLED)
   - Cancellation system with reason tracking
   - Creation timestamp recording

### Email Notifications
1. Customer Confirmation
   - Automatic sending upon successful booking
   - Includes booking details
   - Booking ID for reference

2. Admin Notifications
   - Instant notification of new bookings
   - Complete booking details
   - Customer contact information

## System Requirements

### Development Environment
- Node.js v14+
- npm v6+
- Java JDK 17
- Maven 3.6+
- MySQL 8.0+
- IDE with TypeScript and Java support

### Production Environment
#### Minimum Hardware
- CPU: 2 cores
- RAM: 2GB
- Storage: 1GB free space
- Network: Stable internet connection

#### Software Requirements
- JRE 17 or higher
- MySQL 8.0 or higher
- Modern web server (Nginx/Apache)
- SSL certificate for production

### Browser Support
- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

## Installation & Setup

### Frontend Setup
1. Clone the repository
2. Navigate to frontend directory:   ```bash
   cd frontend   ```
3. Install dependencies:   ```bash
   npm install   ```
4. Configure environment:
   Create `.env` file:   ```
   VITE_API_URL=http://localhost:8080   ```
5. Start development server:   ```bash
   npm run dev   ```

## Security Considerations
- CORS configured for development environment
- Email credentials protection
- SQL injection prevention via JPA
- Input validation on both frontend and backend

## Current Limitations
- No user authentication
- No admin interface
- Manual communication post-inquiry
- No payment processing
- No real-time availability checking
- Limited to single timezone (UTC)

## Error Handling
- Frontend axios error interceptors
- Backend global exception handling
- Email service failure handling
- Database constraint violation handling

## Monitoring and Logging
- Backend logging using SLF4J
- SQL query logging in development
- API request logging
- Email service activity logging

## Development Workflow
1. Frontend development server on port 5173

## Support
For technical support or inquiries:
- Email: mkn.norizan
- Documentation: [link to documentation]
- Issue tracking: [link to issue tracker]

## Contributing
[Contributing guidelines]

## License
[License details]

## Version History
- Current Version: 0.0.1-SNAPSHOT
- Release Date: [Date]
- Last Updated: [Date]

## Recent Updates

### Contact Page Implementation
- Added responsive contact information cards
- Implemented consistent styling with Material-UI
- Added three communication channels:
  * WhatsApp: Live chat support
  * Phone: Direct call support
  * Email: Email support
- Operating hours display for each channel
- Mobile-responsive layout

### Design System Updates
- Standardized typography hierarchy
- Consistent spacing system
- Unified card styling
- Responsive grid implementation

