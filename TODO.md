# QuikRaft Website Fixes - Prioritized Roadmap

## 1. Fix Login/Register Modal Validation + Security (High Priority)
- [ ] Add client-side validation for email, password (min 6 chars), confirm password match
- [ ] Add focus trap for keyboard accessibility
- [ ] Add aria attributes (role="dialog", aria-modal="true", aria-labelledby)
- [ ] Implement unique email enforcement (client-side check, backend needed for full security)
- [ ] Add password hashing note (backend required)

## 2. Add Alt Text on Images + Meta Tags (SEO & Accessibility)
- [ ] Add alt text to all partner logos (Delhivery, Rivigo, etc.)
- [ ] Add meta description, OpenGraph tags in <head>
- [ ] Add lang="en-IN" to <html>

## 3. Implement PDF Bilty Generator
- [ ] Add html2pdf library
- [ ] Modify billbook functions to generate PDF from invoice preview
- [ ] Add print CSS for bilty

## 4. Improve Responsiveness (Navbar, Spacing, Typography)
- [ ] Add hamburger menu for mobile navbar
- [ ] Adjust back button position (margin-top or top)
- [ ] Improve line-height, max-width on text blocks
- [ ] Add container max-width: 1100px, line-height 1.6 for p, 1.2 for h1/h2

## 5. Add Real-Time Tracking Map (Later)
- [ ] Integrate Google Maps or Mapbox for vehicle tracking
- [ ] Add ETA display
- [ ] Mock GPS data for demo

## Additional Fixes
- [ ] Remove placeholder testimonials or add real ones
- [ ] Add lazy loading to images
- [ ] Minify CSS/JS (defer scripts)
- [ ] Add CSP, HSTS notes (hosting level)
- [ ] Sanitize inputs (client-side)
