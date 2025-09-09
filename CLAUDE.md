# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

VentureFi is an Angular-based financial management platform designed specifically for freelancers and autonomous workers. This is a visual design prototype focusing exclusively on the frontend interface and user experience, with no backend functionality or real authentication.

### Key Features
- **Website Institucional**: Marketing pages (home, features, pricing, about, contact)
- **Platform Dashboard**: Interactive financial dashboard with mock data
- **Em Busca do Sonho**: Goal-setting and tracking feature for financial objectives
- **Visual Design System**: Complete UI components with VentureFi branding

## Development Commands

### Building and Running
- `npm start` - Start development server (runs on http://localhost:4200)
- `npm run build` - Build for production
- `npm run watch` - Build in watch mode for development
- `npm test` - Run unit tests (if implemented)

### Development Workflow
- `ng serve` - Alternative way to start development server
- `ng build --watch --configuration development` - Build and watch for changes
- `ng generate component <name>` - Generate new components
- `ng generate service <name>` - Generate new services

## Architecture and Structure

### Project Structure
```
src/app/
├── components/           # Shared components
│   ├── header/          # Navigation header
│   └── footer/          # Site footer
├── pages/               # Page components
│   ├── home/           # Marketing home page
│   ├── features/       # Features showcase
│   ├── pricing/        # Pricing plans
│   ├── about/          # About us page
│   ├── contact/        # Contact form
│   ├── login/          # Login interface (mock)
│   ├── dashboard/      # Financial dashboard
│   └── dream-pursuit/  # Goal tracking feature
├── shared/             # Shared utilities and services
├── app.routes.ts       # Route configuration
├── app.ts              # Root component
└── app.html           # Main app template
```

### Component Architecture
- **Standalone Components**: All components use Angular's standalone component approach
- **Lazy Loading**: Pages are lazy-loaded for better performance
- **Responsive Design**: Mobile-first approach with CSS Grid and Flexbox
- **Component Communication**: Uses Angular services and @Input/@Output patterns

### Styling Architecture
- **Global Styles**: Defined in `src/styles.scss` with CSS custom properties
- **Component Styles**: Scoped styles within each component
- **Color System**: VentureFi brand colors defined as CSS variables
- **Typography**: Montserrat for headings, Open Sans for body text
- **Utility Classes**: Common classes for layout and spacing

## Key Technical Decisions

### Frontend Framework
- **Angular 20+**: Latest Angular version with standalone components
- **TypeScript**: Strict type checking enabled
- **SCSS**: For advanced styling features and variables
- **Chart.js**: For financial data visualization (installed but mock implementation)
- **Angular Material**: For UI components (installed but minimal usage)

### Design System
- **Colors**: Security Blue (#1E3A5F), Innovation Green (#2ECC71), Professional Light Gray (#F5F5F5)
- **Layout**: CSS Grid for major layouts, Flexbox for component layouts
- **Icons**: Emoji-based icons for simplicity and visual appeal
- **Cards**: Consistent card design pattern throughout the application
- **Forms**: Standardized form styling with focus states and validation

### Data Management
- **Mock Data**: All financial data is hardcoded for demonstration purposes
- **No Backend**: This is a frontend-only prototype
- **Local State**: Component-level state management only
- **No Authentication**: Login flow is simulated with routing

## Important Implementation Notes

### Security Disclaimer
- This is a **DESIGN PROTOTYPE ONLY**
- No real authentication or security implementation
- All security indicators are purely visual/aesthetic
- No actual financial data processing or storage

### Mock Functionality
- Login process redirects to dashboard without validation
- Financial calculations are client-side only for demonstration
- Goal tracking stores data in component state (resets on refresh)
- Contact forms show success messages but don't send emails
- All charts and data visualizations use static/mock data

### Responsive Behavior
- Mobile-first responsive design
- Sidebar navigation collapses on mobile devices
- Form layouts stack vertically on smaller screens
- Charts and data visualizations adapt to screen size
- Touch-friendly interface elements

## Development Guidelines

### Adding New Features
1. Create components in appropriate directory (`pages/` or `components/`)
2. Use standalone component architecture
3. Follow existing naming conventions
4. Implement responsive design patterns
5. Use established color scheme and typography
6. Add mock data that demonstrates functionality

### Styling Guidelines
- Use CSS custom properties for colors
- Follow BEM-like naming for CSS classes
- Ensure accessibility with proper focus states
- Test on mobile devices/responsive views
- Use consistent spacing and typography scales

### Code Standards
- Use TypeScript strict mode
- Follow Angular style guide conventions
- Use meaningful component and variable names
- Add comments for complex business logic
- Keep components focused and single-purpose

## Visual Identity

### Brand Elements
- **Logo**: Text-based "VentureFi" logo in Security Blue
- **Primary Actions**: Innovation Green for success states and CTAs
- **Data Visualization**: Multiple colors for charts and progress indicators
- **Professional Feel**: Clean, modern design with subtle shadows and rounded corners

### User Experience Patterns
- **Dashboard Cards**: Financial summary cards with icons and trend indicators
- **Progress Bars**: Visual progress tracking for goals and metrics
- **Modal Overlays**: For creating new goals and detailed forms
- **Notification Cards**: Color-coded alerts and smart suggestions
- **Navigation**: Sidebar navigation for dashboard, top navigation for marketing site

## Common Workflows

### Running the Development Server
```bash
cd venturefi
npm start
```

### Making Style Changes
1. Global styles: Edit `src/styles.scss`
2. Component styles: Edit component's `styles` array
3. Colors: Update CSS custom properties in `src/styles.scss`

### Adding New Pages
1. Create component in `src/app/pages/`
2. Add route to `src/app/app.routes.ts`
3. Update navigation in header component if needed

### Testing Changes
- View in browser at http://localhost:4200
- Test responsive behavior with browser dev tools
- Check all navigation flows work correctly
- Verify visual consistency across pages

This project serves as a comprehensive demonstration of modern web application design focused on financial management for freelancers and autonomous workers, implemented as a complete frontend prototype using Angular and modern web technologies.