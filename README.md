# 🌐 EventSphere: The Ultimate Event Management Ecosystem

Welcome to **EventSphere**, a comprehensive solution for modern event discovery and management. This project features a **high-fidelity Web Platform** and a **cross-platform Mobile Application**, both powered by a unified Firebase backend.

---

## 🚀 Live Links
- **Web Platform:** [https://eventsphere-web-sepia.vercel.app](https://eventsphere-web-sepia.vercel.app)
- **Mobile APK:** https://expo.dev/accounts/welide/projects/EventSphere/builds/07c08f8a-097c-457f-9059-22200774a0eb
- **GitHub Repository:** [https://github.com/welidemezene/Online-Event-Management](https://github.com/welidemezene/Online-Event-Management)

---

## 📖 How to Use the Application

### 1. User Journey (Web & Mobile)
- **Discover:** Browse the curated list of events on the Home screen. Use the Search Bar or Category Filters (Tech, Music, Sports) to find what you love.
- **Join:** Click on an event to see rich details, including location, time, and ticket price.
- **Book:** Authenticate using the premium Split-Screen login flow. Once logged in, click "Book Ticket" to reserve your spot.
- **Access:** View your unique QR-coded tickets in the "My Tickets" section. This QR code is scanned at the event entrance for check-in.
- **Engage:** Leave comments on events to share your excitement with the community.

### 2. Admin Journey
- **Manage:** Access the Admin Dashboard to create new events or delete old ones.
- **Monitor:** Track venue capacity in real-time through the event detail analytics.

---

## 📂 Project Architecture & Key File Paths

This project is organized into two primary environments:

### 🌐 Web Platform (`/EventSphereWeb`)
Built with React 19 + Vite for a high-performance desktop experience.
- **`src/pages/`**: Main page views (HomePage, EventsPage, AuthPage, MyTicketsPage).
- **`src/components/`**: Reusable UI elements (Navbar, Footer, EventCard).
- **`src/context/`**: Global state management (AuthContext, EventContext).
- **`src/config/firebase.js`**: Backend connection settings.
- **`src/index.css`**: Global design tokens and 4K scaling variables.

### 📱 Mobile App (`/EventSphere`)
Built with React Native + Expo for iOS and Android.
- **`src/screens/`**: Mobile views (HomeScreen, EventDetailScreen, ProfileScreen).
- **`src/navigation/`**: AppNavigator for screen transitions.
- **`src/components/`**: Mobile-specific components (TicketCard, EventReviewCard).
- **`src/theme/`**: Unified color and typography system.

---

## 🛠 Technical Setup

### Web Setup
```bash
cd EventSphereWeb
npm install
npm run dev
```

### Mobile Setup
```bash
cd EventSphere
npm install
npx expo start
```

---

## ✨ Features at a Glance
- ✅ **Full-Stack Firebase Integration:** Real-time data sync and secure Auth.
- ✅ **4K UI Optimization:** Fluid scaling for the largest desktop monitors.
- ✅ **QR Code System:** Automated ticket generation and validation logic.
- ✅ **Cross-Platform:** Seamless experience whether you are on a phone or a PC.

---

## 🛠 Project Specifications & Developer Documentation

### 🏗 Architecture Overview
The system follows a **Decoupled Client-Server Architecture** using Firebase as a Serverless Backend.
- **State Management:** React Context API for global user and event state.
- **Service Layer:** Centralized Firebase services for Auth and Firestore operations to ensure consistency across Web and Mobile.
- **Styling System:** Unified design tokens for colors, spacing, and typography across both platforms.

### 📊 Database Schema (Firestore)
- **`events`**: `title`, `description`, `date`, `location`, `price`, `capacity`, `category`, `emoji`.
- **`bookings`**: `userId`, `eventId`, `bookingId`, `attended` (boolean), `timestamp`.
- **`users`**: `uid`, `email`, `displayName`, `role` (user/admin).

### 🧪 Quality Assurance & Testing
- **Manual Verification:** Comprehensive test suites for Auth flows, Ticket Booking, and Admin operations.
- **Responsive Audit:** Verified layout integrity on devices ranging from iPhone 13 up to 4K Desktop monitors.
- **Firebase Security Rules:** Implemented to ensure only authenticated users can book tickets and only admins can manage events.
.
### 📘 User Manual Highlights
1. **Registration:** Create an account to start exploring.
2. **Booking:** Select an event and confirm your booking.
3. **Check-in:** Present your unique QR code (found in My Tickets) at the event.
4. **Administration:** Admins can access the dashboard to keep the event list up-to-date.

---
*This documentation is part of the Senior Project deliverables.*
