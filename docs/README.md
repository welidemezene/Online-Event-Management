# EventSphere: Next-Generation Event Management 🌐

EventSphere is a modern, full-stack mobile application designed to completely revolutionize event discovery, ticket booking, and check-in management. Built as a comprehensive Senior Project, it bridges the gap between event organizers and attendees through a seamless, real-time digital experience

## 🎯 Project Motivation
The traditional event management industry relies heavily on fragmented systems, paper tickets, and manual verification, leading to slow queues, fraud, and poor user experiences. EventSphere was engineered to consolidate these processes into a single, high-performance mobile application that guarantees atomic ticket processing and instantaneous check-ins.

## ✨ Core Features & Capabilities

### 1. Secure Role-Based Authentication
EventSphere implements a robust email/password login system powered by Firebase Authentication. It features strict role-based access control, ensuring that standard users cannot access administrative capabilities. The first user to register on a fresh database is automatically granted 'Admin' privileges.

### 2. Real-time Event Discovery Engine
Attendees can effortlessly browse upcoming events. The system features dynamic category filtering (e.g., Tech, Music, Sports) and displays live availability metrics. As tickets are booked, the UI updates the remaining capacity across all devices globally in real-time.

### 3. Atomic Booking & Concurrency Control
One of the most complex engineering challenges solved in this application is race-condition prevention. Using Firebase Transactions, the booking engine guarantees that events are never overbooked, even if thousands of users attempt to purchase the final ticket at the exact same millisecond.

### 4. Digital QR Ticketing
Physical tickets are obsolete. EventSphere automatically generates a highly secure, unique QR code payload for every successful booking. These digital tickets are stored locally on the user's device for fast retrieval at the venue.