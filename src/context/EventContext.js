import { createContext, useState, useEffect, useContext } from 'react';
import {
  ref,
  push,
  set,
  remove,
  onValue,
  update,
  get,
  runTransaction,
} from 'firebase/database';
import { database } from '../config/firebase';

export const EventContext = createContext();

// Seed data — only used if database is empty
const SEED_EVENTS = [
  {
    title: 'Tech Conference 2026',
    category: 'tech',
    emoji: '💻',
    description: 'The premier technology conference bringing together developers, designers, and innovators for three days of learning and networking.',
    date: new Date(Date.now() + 86400000 * 18).toISOString(),
    location: 'Silicon Hall, Addis Ababa',
    price: 500,
    capacity: 300,
    currentBookings: 0,
    organizer: 'TechEthiopia',
  },
  {
    title: 'Rock Music Festival',
    category: 'music',
    emoji: '🎸',
    description: 'Three days of non-stop live rock music from the best bands in East Africa.',
    date: new Date(Date.now() + 86400000 * 25).toISOString(),
    location: 'Meskel Square, Addis Ababa',
    price: 350,
    capacity: 5000,
    currentBookings: 0,
    organizer: 'Rhythm Events',
  },
  {
    title: 'Basketball Championship',
    category: 'sports',
    emoji: '🏀',
    description: 'Watch the top basketball teams compete for the national university championship title.',
    date: new Date(Date.now() + 86400000 * 20).toISOString(),
    location: 'National Sports Center, Addis Ababa',
    price: 100,
    capacity: 2000,
    currentBookings: 0,
    organizer: 'Sports Council',
  },
  {
    title: 'Digital Art Exhibition',
    category: 'art',
    emoji: '🎨',
    description: 'Experience the stunning intersection of technology and art through immersive digital installations.',
    date: new Date(Date.now() + 86400000 * 28).toISOString(),
    location: 'National Museum, Addis Ababa',
    price: 0,
    capacity: 500,
    currentBookings: 0,
    organizer: 'ArtTech Collective',
  },
  {
    title: 'Startup Pitch Night',
    category: 'business',
    emoji: '💼',
    description: 'Watch the best student startups pitch to real investors for seed funding.',
    date: new Date(Date.now() + 86400000 * 10).toISOString(),
    location: 'Innovation Hub, AAU Campus',
    price: 0,
    capacity: 150,
    currentBookings: 0,
    organizer: 'AAU Entrepreneurship Club',
  },
];

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Seed database with initial events if empty
    const seedIfEmpty = async () => {
      const eventsRef = ref(database, 'events');
      const snapshot = await get(eventsRef);
      if (!snapshot.exists()) {
        for (const event of SEED_EVENTS) {
          const newRef = push(eventsRef);
          await set(newRef, { ...event, eventId: newRef.key });
        }
      }
    };

    seedIfEmpty();

    // Real-time listener for events
    const eventsRef = ref(database, 'events');
    const unsubEvents = onValue(eventsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const eventsArray = Object.values(data);
        setEvents(eventsArray);
      } else {
        setEvents([]);
      }
    });

    // Real-time listener for bookings
    const bookingsRef = ref(database, 'bookings');
    const unsubBookings = onValue(bookingsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setBookings(Object.values(data));
      } else {
        setBookings([]);
      }
      setLoading(false);
    });

    return () => {
      unsubEvents();
      unsubBookings();
    };
  }, []);

  const bookEvent = async (userId, eventId) => {
    // 1. Check local state first (fast fail if obviously booked/full)
    const event = events.find(e => e.eventId === eventId);
    if (!event) throw new Error('Event not found');
    if (event.currentBookings >= event.capacity) throw new Error('Event is fully booked');

    const alreadyBooked = bookings.find(b => b.eventId === eventId && b.userId === userId);
    if (alreadyBooked) throw new Error('You have already booked this event');

    // 2. Perform Atomic Transaction on the Event document
    const eventRef = ref(database, `events/${eventId}`);
    
    const transactionResult = await runTransaction(eventRef, (currentData) => {
      if (currentData) {
        if (currentData.currentBookings >= currentData.capacity) {
          // Abort the transaction
          return; 
        }
        currentData.currentBookings = (currentData.currentBookings || 0) + 1;
      }
      return currentData;
    });

    if (!transactionResult.committed) {
      throw new Error('Sorry, the last ticket was just taken!');
    }

    // 3. Create the booking record only if transaction succeeded
    const bookingsRef = ref(database, 'bookings');
    const newBookingRef = push(bookingsRef);
    const newBooking = {
      bookingId: newBookingRef.key,
      userId,
      eventId,
      timestamp: new Date().toISOString(),
      attended: false,
    };
    await set(newBookingRef, newBooking);

    return newBooking;
  };

  const cancelBooking = async (bookingId) => {
    const booking = bookings.find(b => b.bookingId === bookingId);
    if (!booking) return;

    await remove(ref(database, `bookings/${bookingId}`));

    const event = events.find(e => e.eventId === booking.eventId);
    if (event) {
      await update(ref(database, `events/${booking.eventId}`), {
        currentBookings: Math.max(0, (event.currentBookings || 1) - 1),
      });
    }
  };

  const addEvent = async (eventData) => {
    const eventsRef = ref(database, 'events');
    const newRef = push(eventsRef);
    const newEvent = {
      eventId: newRef.key,
      ...eventData,
      currentBookings: 0,
      createdAt: new Date().toISOString(),
    };
    await set(newRef, newEvent);
  };

  const deleteEvent = async (eventId) => {
    await remove(ref(database, `events/${eventId}`));
  };

  const markAttended = async (bookingId) => {
    await update(ref(database, `bookings/${bookingId}`), { attended: true });
  };

  return (
    <EventContext.Provider value={{ events, bookings, loading, bookEvent, cancelBooking, addEvent, deleteEvent, markAttended }}>
      {children}
    </EventContext.Provider>
  );
};

export const useEvents = () => useContext(EventContext);
