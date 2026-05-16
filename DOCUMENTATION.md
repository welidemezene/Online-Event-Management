# EventSphere — What We Built, What We Used & How to Answer Questions

**Course:** Mobile Application Design and Development  
**University:** Adama Science and Technology University  
**Group 1** | May 2025

| Name | Student ID |
|---|---|
| Surafel Tesfaye | Ugr/35455/16 |
| Woldemedihn Mezene | Ugr/35559/16 |
| Betelhem Hailu | Ugr/34047/16 |
| Kidist Wubshet | Ugr/34754/16 |
| Frezer Getachew | Ugr/34472/16 |
| Bilal Usman | Ugr/30308/15 |

🌐 **Web App:** https://eventsphere-web-sepia.vercel.app  
🐙 **GitHub:** https://github.com/welidemezene/Online-Event-Management  
🎯 **Presentation:** https://eventsphere-presentation-drab.vercel.app

---

## SECTION 1: What is EventSphere?

EventSphere is a **cross-platform event management application** that allows users to:
- **Discover** events happening in their city (Tech, Music, Sports, Art, Business)
- **Book** tickets for those events (free or paid)
- **Pay** using Ethiopian payment methods (Telebirr, CBE Birr, Amole, Bank Transfer)
- **Receive** a digital QR code ticket after booking
- **Manage** their tickets from a personal dashboard

It has **two platforms that share the same database:**
1. **Mobile App** — built with React Native (runs on Android and iOS phones)
2. **Web Platform** — built with React (runs in any browser, deployed on the internet)

---

## SECTION 2: Everything We Used to Build EventSphere

### 2.1 Programming Languages

| Language | Where We Used It | Why |
|---|---|---|
| **JavaScript** | Everywhere — Mobile and Web | One language for both platforms, easy to learn, huge community |
| **JSX** | React and React Native files | Lets us write UI components that look like HTML inside JavaScript |
| **CSS** | Web platform styling | Controls colors, fonts, layout, animations on the website |
| **JSON** | Configuration files (app.json, package.json) | Standard format for settings and data |

### 2.2 Frameworks and Libraries

#### React Native (Mobile App)
- **What it is:** A framework by Facebook/Meta that lets you build mobile apps using JavaScript
- **Why we used it:** We write ONE codebase and it works on BOTH Android and iOS
- **How it works:** It compiles our JavaScript code into real native Android/iOS code
- **Alternative we could have used:** Flutter (uses Dart language), Swift (iOS only), Kotlin (Android only)

#### Expo (Mobile Tooling)
- **What it is:** A set of tools built on top of React Native that makes development easier
- **Why we used it:** It handles complex native setup automatically — camera, notifications, icons, splash screen
- **Key tools from Expo we used:**
  - `expo-linear-gradient` → for gradient colors on buttons and backgrounds
  - `expo-camera` → to access phone camera for QR code scanning
  - `expo-barcode-scanner` → to scan QR codes at event entrance
  - `Expo Go` → app used to test during development (scan QR = see app)
  - `EAS Build` → cloud service that builds our APK file

#### React (Web Platform)
- **What it is:** A JavaScript library for building user interfaces
- **Why we used it:** Component-based (reusable pieces), fast, industry standard
- **Version we used:** React 19 (latest)

#### Vite (Web Build Tool)
- **What it is:** A build tool that turns our React code into optimized files for the browser
- **Why we used it:** Extremely fast during development (instant updates when we save code)
- **What it produces:** `dist/` folder with HTML, CSS, and JS files for deployment

#### React Router (Web Navigation)
- **What it is:** Library for navigation between pages in a web app
- **Why we used it:** Our website is a Single Page Application (SPA) — pages change without full reload
- **Routes we created:**
  - `/` → Home Page
  - `/events` → Browse All Events
  - `/events/:id` → Single Event Detail
  - `/auth` → Login / Sign Up
  - `/tickets` → My Tickets
  - `/admin` → Admin Dashboard

#### React Navigation (Mobile Navigation)
- **What it is:** The standard navigation library for React Native apps
- **Why we used it:** Handles moving between screens, back button, tab bar
- **Types we used:**
  - **Stack Navigator** → pushing new screens on top (like going into an event detail)
  - **Bottom Tab Navigator** → the tab bar at the bottom (Home, Explore, Tickets, Profile)

### 2.3 Backend & Database: Firebase

Firebase is a service by Google that gives us a backend without building one from scratch.

**We used 2 Firebase services:**

#### Firebase Authentication
- **What it does:** Manages user accounts — sign up, login, logout, password reset
- **How it works in our app:**
  - User enters email + password → Firebase creates or verifies account
  - Firebase returns a unique `uid` (user ID) for each person
  - We save that uid to know who booked what ticket
- **Admin system:** If email is `admin@eventsphere.com` → gets admin role with extra permissions

#### Firebase Firestore
- **What it is:** A real-time cloud database (NoSQL — stores data as documents, not tables)
- **Why we used it:** Data updates automatically on ALL devices when anything changes
- **How it is organized in our app:**

```
Database Structure:
├── events/           (collection)
│   └── eventId/      (document)
│       ├── title: "Startup Pitch Night"
│       ├── description: "..."
│       ├── date: "2025-05-30"
│       ├── location: "Skylight Hotel, Addis Ababa"
│       ├── price: 150
│       ├── capacity: 200
│       ├── currentBookings: 47
│       ├── category: "tech"
│       └── emoji: "🚀"
│
├── bookings/         (collection)
│   └── bookingId/    (document)
│       ├── userId: "abc123"
│       ├── eventId: "xyz789"
│       ├── attended: false
│       └── timestamp: "2025-05-16"
│
└── users/            (collection)
    └── userId/       (document)
        ├── email: "user@gmail.com"
        ├── displayName: "Abebe"
        └── role: "user" or "admin"
```

- **NoSQL vs SQL:** NoSQL stores flexible documents (like JSON objects). SQL stores rows in tables. We chose NoSQL because our event data has different fields and Firestore is very fast.

### 2.4 Deployment & Hosting

#### Vercel (Web Deployment)
- **What it is:** A cloud hosting platform for websites
- **Why we used it:** Free, fast, automatic deployment from our code
- **How it works:** We run `vercel --prod` → our code uploads → website goes live globally
- **Our web app URL:** https://eventsphere-web-sepia.vercel.app

#### EAS Build (Mobile Deployment)
- **What it is:** Expo's cloud build service
- **Why we used it:** Builds an Android APK without needing Android Studio or a Mac
- **Command we used:** `eas build -p android --profile preview`
- **Result:** A `.apk` file that can be installed on any Android phone

#### GitHub
- **What it is:** A platform for storing and sharing code using Git version control
- **Why we used it:** Allows all 6 team members to work on the code simultaneously
- **Our repo:** https://github.com/welidemezene/Online-Event-Management

---

## SECTION 3: What We Actually Built (Features)

### Mobile App Features

#### 1. Home Screen
- Shows featured events with category filtering (Tech, Music, Sports, Art)
- Live search bar that filters events in real-time
- Each event shows: emoji, title, date, location, price, category badge
- Pulls all data from Firebase in real-time

#### 2. Events Screen
- Full list of all events with search and filter
- Filter by category tabs at the top
- Sort by price or date

#### 3. Event Detail Screen
- Full event information page
- **Countdown Timer** — live ticking clock showing time until event starts
- **Capacity bar** — shows how many seats are left (turns red when almost full)
- **User Avatar Group** — shows profile pictures of people attending
- **Discussion section** — users can post comments about the event
- **"Book Now" button** — for free events = instant booking. For paid events = goes to Checkout

#### 4. Checkout Screen (Payment)
- Shows event name and total price in ETB
- **4 payment methods to choose from:**
  - 📱 Telebirr (*127#)
  - 🏦 CBE Birr (*847#)
  - 💳 Amole (App)
  - 🏛️ Bank Transfer
- Instructions appear for whichever method is selected
- User enters their payment reference number
- Confirm button → 2-second processing animation → Success screen → ticket created

#### 5. My Tickets Screen
- Shows all events the user has booked
- Each ticket shows: event name, date, location, status badge
- **QR code** on each ticket for event check-in

#### 6. Profile Screen
- User info display
- Logout button
- Admin users see extra management options

#### 7. Admin Dashboard
- Create new events (fill in all event details)
- Edit existing events
- Delete events
- See all bookings
- Track capacity

### Web Platform Features

#### 1. Home Page
- Big hero section with "Discover Events in Your City" headline
- Live countdown to the next featured event
- "How it Works" section explaining the 3-step process
- Newsletter signup at the bottom

#### 2. Events Page
- Search bar, category filter tabs, sort options
- Event cards in a grid layout
- Real-time search — results update as you type

#### 3. Event Detail Page
- Split layout: main content on left, booking card on right
- Payment modal pops up for paid events (same 4 methods as mobile)

#### 4. Auth Page
- Split screen: brand panel on left, form on right
- Toggle between Login and Sign Up

#### 5. My Tickets Page
- Shows booked tickets with QR codes

#### 6. Admin Dashboard
- Create/Edit/Delete events
- View all bookings and capacity statistics

---

## SECTION 4: Custom Components We Built

These are reusable pieces of UI we created specifically for EventSphere:

| Component | File | What it does |
|---|---|---|
| **EventCard** | `EventCard.js` | The card showing each event in lists |
| **TicketCard** | `TicketCard.js` | Digital ticket with QR code display |
| **PulseLoader** | `PulseLoader.js` | Animated loading indicator (pulsing circles) |
| **CountdownTimer** | `CountdownTimer.js` | Live ticking clock to event start |
| **NotificationBanner** | `NotificationBanner.js` | Slide-down notification messages |
| **SearchBar** | `SearchBar.js` | Search input with icon |
| **CategoryFilter** | `CategoryFilter.js` | Row of category filter buttons |
| **UserAvatarGroup** | `UserAvatarGroup.js` | Stack of attendee profile pictures |
| **EventReviewCard** | `EventReviewCard.js` | User review/comment display |

---

## SECTION 5: Design Decisions — Why It Looks the Way It Does

### Color Theme: Dark Mode with Purple/Indigo
- **Why dark?** Easier on eyes at night (most events happen in evenings), saves battery on OLED screens, makes gradient colors pop
- **Why purple/indigo (#6366f1)?** Associated with creativity and events industry (concerts, tech events, festivals)
- **Why gradients?** Gives a premium, modern feel that users associate with high-quality apps

### Design System (Colors + Fonts)
We created a central theme file so all screens use the same colors and fonts:
```javascript
// src/theme/colors.js - one place for all colors
// src/theme/fonts.js  - one place for all text sizes
// src/theme/spacing.js - one place for all spacing values
```
This means if we want to change the primary color, we change it in ONE place and it updates everywhere.

### Animations
- **PulseLoader:** Shows something is loading without freezing the UI
- **CountdownTimer:** Creates urgency — users feel more motivated to book when they see time running out
- **Slide-down notifications:** Less disruptive than a popup — user can still see what is happening

---

## SECTION 6: Architecture — How the App is Organized

### State Management (How Data Flows)
We use **React Context API** — two "global stores" that any screen can access:

**AuthContext** — manages who is logged in
- When the app opens → checks Firebase if user is already logged in
- Provides: `user` object, `login()`, `register()`, `logout()` functions to ALL screens

**EventContext** — manages all event data
- Connects to Firestore and listens for ANY changes in real-time
- Provides: `events[]`, `bookings[]`, `bookEvent()`, `addComment()` to ALL screens
- When a new event is added in admin → EventContext automatically updates → all screens refresh

### Folder Structure
```
EventSphere/ (Mobile App)
├── App.js                    ← Entry point, sets up navigation
├── src/
│   ├── screens/              ← Full pages (HomeScreen, EventsScreen, etc.)
│   ├── components/           ← Reusable pieces (EventCard, PulseLoader, etc.)
│   ├── context/              ← Global data stores (AuthContext, EventContext)
│   ├── navigation/           ← How screens connect (AppNavigator)
│   ├── config/               ← Firebase connection setup
│   └── theme/                ← Colors, fonts, spacing

EventSphereWeb/ (Web App)
├── src/
│   ├── pages/                ← Full pages (HomePage, EventsPage, etc.)
│   ├── components/           ← Reusable pieces (Navbar, Footer, EventCard)
│   ├── context/              ← Same concept as mobile
│   └── config/               ← Firebase connection setup
```

---

## SECTION 7: Likely Teacher Questions & How to Answer Them

### "Why did you use React Native instead of building separate Android and iOS apps?"
> React Native lets us write ONE codebase in JavaScript that compiles to both Android and iOS. Building separately would mean writing the same app twice in two different languages (Kotlin for Android, Swift for iOS), which doubles the work and time.

### "What is Firebase and why did you choose it?"
> Firebase is a Backend-as-a-Service (BaaS) by Google. We chose it because it gives us authentication, a real-time database, and cloud storage without building a backend server from scratch. Firestore's real-time listeners mean when admin adds an event, all users see it immediately without refreshing.

### "What is the difference between your mobile app and web app?"
> Both connect to the same Firebase database, so data is always in sync. The mobile app is built with React Native for Android/iOS phones and uses phone-specific features like the camera for QR codes. The web app is built with React/Vite for browsers and is deployed at a public URL anyone can visit.

### "How does your authentication work?"
> We use Firebase Authentication. When a user registers, Firebase creates an account and returns a unique user ID. We then save extra info (name, role) in Firestore. The app checks the user's role — if it's "admin", they see the Admin Dashboard. We use React Context to make the user's info available to every screen without passing it manually.

### "Explain your database design."
> We use Firebase Firestore, a NoSQL document database. We have 3 collections: events (each document is one event with title, date, price, etc.), bookings (each document links a userId to an eventId), and users (stores name, email, and role). When someone books an event, we create a booking document and increase the event's currentBookings counter.

### "What design principles did you follow?"
> We followed several UI/UX principles: (1) Consistency — same colors, fonts, and spacing everywhere using a theme file. (2) Feedback — every action shows a response (loading spinner, success message, error alert). (3) Hierarchy — most important information is biggest and brightest. (4) Simplicity — tabs for navigation, clear labels, no clutter. We also used dark mode to reduce eye strain and save battery.

### "How does the payment system work?"
> We built a payment flow that supports Ethiopian payment methods: Telebirr, CBE Birr, Amole, and Bank Transfer. When a user clicks "Book" on a paid event, a payment modal opens. They select their payment method, pay through the USSD code or app, then enter their transaction reference number. Our app simulates verification (in a real product, we would connect to the Telebirr or CBE Birr API), then creates the booking and generates a QR ticket.

### "Why did you use Context API instead of Redux?"
> Redux is more powerful but requires much more setup code. Our app has two simple global states — who is logged in and what events exist. Context API is built into React, has no extra installation needed, and is sufficient for our use case.

### "What is a QR code ticket and how does it work?"
> When a booking is confirmed, we generate a QR code containing the booking ID, user ID, and event ID. This is displayed on the My Tickets screen. At the event, the admin scans this QR code using the phone camera. The app reads the code, finds the booking in Firebase, and marks the user as attended. It's the same system airlines and cinemas use for digital tickets.

### "How did you deploy your application?"
> For the web app, we used Vercel — we run one command (`vercel --prod`) and it uploads our built code to Vercel's global CDN (Content Delivery Network), making it accessible worldwide in seconds. For the mobile app, we used EAS Build — Expo's cloud build service that creates an Android APK file without needing Android Studio installed. The APK can be installed on any Android phone.

### "What is version control and how did you use it?"
> We used Git and GitHub. Git is a version control system that tracks every change made to the code. GitHub is the online platform where we stored the shared codebase. All 6 team members could work on different features simultaneously and then merge our work. The repository is at github.com/welidemezene/Online-Event-Management.

### "What is the difference between a native app and a cross-platform app?"
> A native app is built specifically for one platform using that platform's official language (Swift for iOS, Kotlin for Android). A cross-platform app is built once and runs on both. Native apps can be faster and have deeper system access, but cross-platform is faster to develop and easier to maintain. React Native (which we used) is a cross-platform framework that gets very close to native performance.

---

## SECTION 8: Technology Summary Table

| Technology | Type | Why We Used It |
|---|---|---|
| **JavaScript** | Language | Works on both mobile and web |
| **React Native** | Mobile Framework | Cross-platform (Android + iOS) |
| **Expo** | Mobile Tooling | Camera, build, easy setup |
| **React** | Web Library | Fast, component-based UI |
| **Vite** | Web Build Tool | Fast development server |
| **React Router** | Web Navigation | SPA page routing |
| **React Navigation** | Mobile Navigation | Screen transitions + tab bar |
| **Firebase Auth** | Authentication | User accounts and login |
| **Firebase Firestore** | Database | Real-time cloud database |
| **Context API** | State Management | Global data sharing between screens |
| **Vercel** | Web Hosting | Deploy website to the internet |
| **EAS Build** | APK Builder | Build Android app without Android Studio |
| **GitHub** | Version Control | Team collaboration on code |
| **CSS (Vanilla)** | Web Styling | No extra library needed, full control |
| **LinearGradient** | Animation | Gradient colors on buttons/cards |
| **Animated API** | Mobile Animation | Smooth 60fps animations on phone |

---

*EventSphere — Group 1, Adama Science and Technology University, May 2025*
