# Rhumuda Boat Charter - Frontend Documentation

## Overview

Rhumuda Boat Charter's frontend is a React-based single-page application built with TypeScript and Material-UI. The system handles boat charter inquiries through an intuitive user interface with real-time validation and responsive design.

## Technical Stack

### Core Technologies
- React 18.2.0
- TypeScript 5.0.2
- Vite 4.4.5 (Build tool)
- Material-UI v5 (Component library)
- React Router v6 (Routing)
- Axios (HTTP client)
- DayJS (Date handling)

### Development Tools
- ESLint (Code linting)
- Prettier (Code formatting)
- TypeScript ESLint Parser
- Vite Plugin React (HMR support)

## Project Structure
```bash
typescript
src/
├── assets/ # Static assets
│ ├── icons/ # SVG icons and icon assets
│ └── images/ # Image files (.png, .jpg, .webp)
├── components/ # Reusable components
│ ├── layout/ # Layout components
│ │ ├── Header.tsx # Main navigation header
│ │ ├── Footer.tsx # Site footer
│ │ └── MenuDropdown.tsx # Navigation menu
│ ├── search/ # Search-related components
│ │ ├── SearchBar.tsx # Main search interface
│ │ └── CharterTypeSelector.tsx # Charter type toggle
│ └── packages/ # Package display components
│ ├── PackageCard.tsx # Individual package display
│ └── PackageGrid.tsx # Package listing grid
├── pages/ # Page components
│ ├── HomePage.tsx # Landing page
│ ├── AboutUsPage.tsx # About page
│ ├── ContactPage.tsx # Contact information
│ └── ServicesPage.tsx # Services listing
├── theme/ # Theme configuration
│ └── theme.ts # MUI theme customization
├── routes/ # Routing configuration
│ └── routes.tsx # Route definitions
├── services/ # API services
│ └── api.ts # Axios configuration
├── types/ # TypeScript type definitions
│ └── index.ts # Shared types
└── utils/ # Utility functions
├── dateUtils.ts # Date handling
└── validation.ts # Form validation
```

## Component Architecture

### Layout Components

#### Header (`Header.tsx`)
- Responsive navigation bar
- Sticky positioning with scroll behavior
- Collapsible menu for mobile
- Integrated search bar
- Props:
  - `elevation?: number`
  - `position?: "fixed" | "sticky"`

#### Footer (`Footer.tsx`)
- Social media links
- Copyright information
- Contact links
- Responsive layout

### Search Components

#### SearchBar (`SearchBar.tsx`)
- Jetty location selector
- Date picker integration
- Passenger counter
- Search submission handler
- Props:
  - `onSearch: (params: SearchParams) => void`
  - `defaultLocation?: string`

#### CharterTypeSelector (`CharterTypeSelector.tsx`)
- Toggle between recreation/fishing
- Custom styled buttons
- Visual feedback
- Props:
  - `selected: CharterType`
  - `onChange: (type: CharterType) => void`

### Package Components

#### PackageCard (`PackageCard.tsx`)
- Package information display
- Price formatting
- Service list
- Booking action button
- Props:
  - `package: PackageType`
  - `onBook: (id: string) => void`

#### PackageGrid (`PackageGrid.tsx`)
- Responsive grid layout
- Filtering capabilities
- Sorting options
- Props:
  - `packages: PackageType[]`
  - `filters: FilterOptions`

## Theme Configuration

### Color Palette
```bash
typescript
palette: {
primary: {
main: '#1976d2',
light: '#42a5f5',
dark: '#1565c0'
},
secondary: {
main: '#9c27b0',
light: '#ba68c8',
dark: '#7b1fa2'
}
}
```

### Typography
- Font Family: 'Inter', sans-serif
- Scale:
  - h1: 2.5rem
  - h2: 2rem
  - h3: 1.75rem
  - body1: 1rem
  - body2: 0.875rem

### Breakpoints
- xs: 0px
- sm: 600px
- md: 900px
- lg: 1200px
- xl: 1536px

## API Integration

### Endpoints
- GET `/api/packages`: Fetch available packages
- POST `/api/bookings`: Submit booking inquiry
- GET `/api/locations`: Fetch jetty locations

### Error Handling
- Network errors
- Validation errors
- Server errors
- Timeout handling

## State Management
- Local component state using useState
- Context API for theme/auth
- Props drilling minimized
- Custom hooks for shared logic

## Form Handling
- Material-UI form components
- Real-time validation
- Error messaging
- Submit handling

## Responsive Design
- Mobile-first approach
- Breakpoint-specific layouts
- Flexible grids
- Touch-friendly interfaces

## Performance Optimization
- Lazy loading for routes
- Image optimization
- Code splitting
- Bundle size optimization

## Development Setup

1. Install dependencies:
```bash
npm install
```

2. Environment setup:
```bash
cp .env.example .env
```

3. Configure environment variables:
```bash
env
VITE_API_URL=http://localhost:8080
VITE_GOOGLE_MAPS_KEY=your_key_here
```

4. Start development server:
```bash
npm run dev
```

## Build Process

1. Production build:
```bash
npm run build
```

2. Serve production build:
```bash
npm run preview
```

2. Preview build:
```bash
npm run preview
```

## Testing

1. Run tests:
```bash
npm run test
```

2. Coverage report:
```bash
npm run test:coverage
```

## Code Style

- ESLint configuration
- Prettier settings
- TypeScript strict mode
- Import ordering
- Component naming conventions

## Deployment

1. Build the application
2. Verify environment variables
3. Deploy static files
4. Configure routing

## Browser Support
- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)

## Known Issues
1. Date picker mobile responsiveness
2. Safari form autofill styling
3. IE11 not supported

## Contributing
1. Fork repository
2. Create feature branch
3. Follow code style
4. Submit pull request

## License
MIT License

## Contact
For technical support or queries:
- Email: support@rhumuda.com
- Documentation: [Internal Wiki]