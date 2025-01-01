# Rhumuda Charter Service - Developer Documentation

## System Architecture

### Frontend Architecture
- Framework: React 18.2.0 with TypeScript 5.0.2
- Build Tool: Vite 4.4.5
- State Management: React Hooks (useState, useEffect)
- UI Framework: Material-UI v5
- Form Handling: React Hook Form 7.x
- HTTP Client: Axios 1.6.2
- Date/Time Handling: date-fns
- Development Port: 5173

#### Design System
- Theme: Material-UI custom theme
  * Custom palette with brand colors
  * Responsive typography scale
  * Consistent spacing units
  * Custom component variants
- Typography:
  * Primary: Playfair Display
  * Secondary: System UI
  * Heading scales: h1-h6 defined
- Spacing:
  * Base unit: 8px
  * Common multipliers: 0.5, 1, 2, 2.5, 3, 4
- Animations:
  * Transitions: 0.3s ease
  * Hover effects
  * Scroll animations

#### Key Frontend Components
1. Layout Components
   - Header
     * Minimizing header on scroll
     * Responsive navigation
     * Integrated search bar
     * Files: `src/components/layout/Header.tsx`
   - Footer
     * Copyright information
     * Social links
     * Files: `src/components/layout/Footer.tsx`

2. Search Components
   - SearchBar
     * Jetty selection
     * Date picker
     * Passenger counter
     * Files: `src/components/search/SearchBar.tsx`
   - CharterTypeSelector
     * Toggle between recreation/fishing
     * Custom icon buttons
     * Files: `src/components/search/CharterTypeSelector.tsx`

3. Package Components
   - PackageCard
     * Price display
     * Service details
     * Booking action
     * Files: `src/components/packages/PackageCard.tsx`
   - PackageGrid
     * Responsive layout
     * Filtering options
     * Files: `src/components/packages/PackageGrid.tsx`

4. Page Components
   - AboutUsPage
     * Company information
     * Service highlights
     * Files: `src/pages/AboutUsPage.tsx`
   - ContactPage
     * Contact methods
     * Operating hours
     * Files: `src/pages/ContactPage.tsx`

### Backend Architecture
- Framework: Spring Boot 3.2.2
- Java Version: 17
- Build Tool: Maven 3.6+
- Database: MySQL 8.0
- ORM: Hibernate (JPA)
- Email: JavaMail with Gmail SMTP
- Development Port: 8080

#### Key Components

1. Entity Models
   - Booking.java
     * Primary entity for booking data
     * Contains all booking fields
     * Implements one-to-many relationship with AlternativeDate
   - AlternativeDate.java
     * Secondary entity for alternative dates
     * Contains foreign key to Booking

2. Database Schema   ```sql
   CREATE TABLE bookings (
       id INT AUTO_INCREMENT PRIMARY KEY,
       booking_id VARCHAR(255) UNIQUE,
       first_name VARCHAR(255),
       last_name VARCHAR(255),
       email VARCHAR(255),
       phone VARCHAR(255),
       duration INT,
       primary_date DATETIME(6),
       departure_time TIME(6),
       adults INT,
       seniors INT,
       children INT,
       infants INT,
       additional_comments TEXT,
       newsletter_opt_in BIT,
       status ENUM('PENDING', 'CANCELLED'),
       cancellation_reason TEXT,
       created_at DATETIME(6),
       jetty VARCHAR(255),
       charter_type VARCHAR(255)
   );

   CREATE TABLE alternative_dates (
       id INT AUTO_INCREMENT PRIMARY KEY,
       booking_id INT,
       alternative_date DATETIME(6),
       FOREIGN KEY (booking_id) REFERENCES bookings(id)
   );   ```

3. Service Layer Implementation
   - BookingService.java
     * Handles booking creation logic
     * Generates unique booking IDs (format: BK + 8 char UUID)
     * Manages booking status transitions
     * Coordinates with EmailService
   - EmailService.java
     * Handles email notifications
     * Uses templates for customer and admin emails
     * Manages SMTP connection and retries

4. Controller Layer
   - BookingController.java
     * Endpoint: POST /api/bookings
     * Endpoint: POST /api/bookings/{bookingId}/cancel
     * Implements error handling
     * Logs all requests

5. Configuration
   - WebConfig.java: CORS configuration
   - JacksonConfig.java: JSON serialization
   - application.properties: All system properties

### Data Flow
1. Booking Creation Flow   ```mermaid
   sequenceDiagram
       Frontend->>+Backend: POST /api/bookings
       Backend->>+Database: Save Booking
       Database-->>-Backend: Return Saved Entity
       Backend->>+EmailService: Send Notifications
       EmailService-->>-Backend: Notification Status
       Backend-->>-Frontend: Booking Confirmation   ```

2. Booking Cancellation Flow   ```mermaid
   sequenceDiagram
       Frontend->>+Backend: POST /api/bookings/{id}/cancel
       Backend->>+Database: Update Status
       Database-->>-Backend: Return Updated Entity
       Backend->>+EmailService: Send Cancellation Notices
       EmailService-->>-Backend: Notification Status
       Backend-->>-Frontend: Cancellation Confirmation   ```

### Error Handling
1. Frontend Error Handling   ```typescript
   try {
       const response = await axios.post(`${API_URL}/api/bookings`, inquiry);
   } catch (error) {
       if (axios.isAxiosError(error)) {
           // Handle specific error types
       }
   }   ```

2. Backend Error Handling   ```java
   @ExceptionHandler(Exception.class)
   public ResponseEntity<String> handleException(Exception e) {
       logger.error("Error occurred: ", e);
       return ResponseEntity.internalServerError().build();
   }   ```

### Testing
1. Frontend Tests
   - Jest for unit testing
   - React Testing Library for component testing
   - Cypress for E2E testing

2. Backend Tests
   - JUnit 5 for unit testing
   - MockMvc for controller testing
   - TestContainers for integration testing

### Development Environment Setup
1. Required Software
   - Node.js 14+
   - Java JDK 17
   - Maven 3.6+
   - MySQL 8.0
   - IDE (VS Code/IntelliJ IDEA)
   - Git

2. Environment Variables   ```properties
   # Frontend (.env)
   VITE_API_URL=http://localhost:8080

   # Backend (application.properties)
   spring.application.name=charter-service
   spring.datasource.url=jdbc:mysql://localhost:3306/rhumuda_db?useSSL=false&serverTimezone=UTC
   spring.datasource.username=root
   spring.datasource.password=
   spring.jpa.hibernate.ddl-auto=update
   spring.jpa.show-sql=true
   spring.web.cors.allowed-origins=http://localhost:5173
   spring.mail.host=smtp.gmail.com
   spring.mail.port=587
   spring.mail.username=your-email@gmail.com
   spring.mail.password=your-app-specific-password
   admin.email=admin@example.com   ```

### Deployment
1. Frontend Build   ```bash
   npm run build
   # Outputs to dist/ directory   ```

2. Backend Build   ```bash
   mvn clean package
   # Outputs to target/charter-service-0.0.1-SNAPSHOT.jar   ```

### Known Issues & Limitations
1. Time Handling
   - All dates stored in UTC
   - Frontend converts to local timezone
   - Potential DST transition issues

2. Email Service
   - No retry mechanism
   - Simple text emails only
   - Gmail SMTP limitations

3. Database
   - No table partitioning
   - No soft delete implementation
   - No audit logging

### Future Improvements
1. Technical Debt
   - Implement proper error handling
   - Add comprehensive logging
   - Implement request validation
   - Add API documentation (Swagger)

2. Features
   - Authentication system
   - Admin dashboard
   - Payment integration
   - Real-time availability
   - Automated testing

### Monitoring & Debugging
1. Logging Locations
   - Frontend: Console logs
   - Backend: /logs/charter-service.log
   - Database: MySQL error log

2. Monitoring Points
   - API response times
   - Database query performance
   - Email delivery status
   - Error rates and types

### Security Considerations
1. Current Implementation
   - CORS configuration
   - SQL injection prevention
   - Input validation
   - Email credential protection

2. Missing Security Features
   - API authentication
   - Rate limiting
   - Request validation
   - XSS protection
``` 