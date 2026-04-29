import { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const EventContext = createContext();

// Mock Initial Data
const MOCK_EVENTS = [
  { eventId: 'e1', title: 'Tech Conference 2026', category: 'tech', emoji: '💻', description: 'The premier technology conference.', date: new Date(Date.now() + 86400000 * 18).toISOString(), location: 'Silicon Hall, Addis Ababa', price: 500, capacity: 300, currentBookings: 150, organizer: 'TechEthiopia' },
  { eventId: 'e2', title: 'Rock Music Festival', category: 'music', emoji: '🎸', description: 'Three days of non-stop live rock music.', date: new Date(Date.now() + 86400000 * 25).toISOString(), location: 'Meskel Square, Addis Ababa', price: 350, capacity: 5000, currentBookings: 4900, organizer: 'Rhythm Events' },
  { eventId: 'e3', title: 'Basketball Championship', category: 'sports', emoji: '🏀', description: 'Watch the top basketball teams compete.', date: new Date(Date.now() + 86400000 * 20).toISOString(), location: 'National Sports Center, Addis Ababa', price: 100, capacity: 2000, currentBookings: 2000, organizer: 'Sports Council' },
  { eventId: 'e4', title: 'Digital Art Exhibition', category: 'art', emoji: '🎨', description: 'Experience the intersection of tech and art.', date: new Date(Date.now() + 86400000 * 28).toISOString(), location: 'National Museum, Addis Ababa', price: 150, capacity: 500, currentBookings: 120, organizer: 'ArtTech Collective' },
];

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const storedEvents = await AsyncStorage.getItem('es_events');
        const storedBookings = await AsyncStorage.getItem('es_bookings');
        
        if (storedEvents) {
          setEvents(JSON.parse(storedEvents));
        } else {
          setEvents(MOCK_EVENTS);
          await AsyncStorage.setItem('es_events', JSON.stringify(MOCK_EVENTS));
        }

        if (storedBookings) {
          setBookings(JSON.parse(storedBookings));
        }
      } catch (error) {
        console.error("Error loading data", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const bookEvent = async (userId, eventId) => {
    const event = events.find(e => e.eventId === eventId);
    if (!event) throw new Error('Event not found');
    if (event.currentBookings >= event.capacity) throw new Error('Event is fully booked');

    const newBooking = {
      bookingId: 'b_' + Date.now().toString(36),
      userId,
      eventId,
      timestamp: new Date().toISOString(),
      attended: false,
    };

    const newBookings = [...bookings, newBooking];
    setBookings(newBookings);
    await AsyncStorage.setItem('es_bookings', JSON.stringify(newBookings));

    const updatedEvents = events.map(e => e.eventId === eventId ? { ...e, currentBookings: e.currentBookings + 1 } : e);
    setEvents(updatedEvents);
    await AsyncStorage.setItem('es_events', JSON.stringify(updatedEvents));

    return newBooking;
  };

  const cancelBooking = async (bookingId) => {
    const booking = bookings.find(b => b.bookingId === bookingId);
    if (!booking) return;

    const newBookings = bookings.filter(b => b.bookingId !== bookingId);
    setBookings(newBookings);
    await AsyncStorage.setItem('es_bookings', JSON.stringify(newBookings));

    const updatedEvents = events.map(e => e.eventId === booking.eventId ? { ...e, currentBookings: Math.max(0, e.currentBookings - 1) } : e);
    setEvents(updatedEvents);
    await AsyncStorage.setItem('es_events', JSON.stringify(updatedEvents));
  };
  
  const addEvent = async (eventData) => {
    const newEvent = {
        eventId: 'e_' + Date.now().toString(36),
        ...eventData,
        currentBookings: 0,
        createdAt: new Date().toISOString()
    };
    const updatedEvents = [...events, newEvent];
    setEvents(updatedEvents);
    await AsyncStorage.setItem('es_events', JSON.stringify(updatedEvents));
  }

  const deleteEvent = async (eventId) => {
    const updatedEvents = events.filter(e => e.eventId !== eventId);
    setEvents(updatedEvents);
    await AsyncStorage.setItem('es_events', JSON.stringify(updatedEvents));
  }

  return (
    <EventContext.Provider value={{ events, bookings, loading, bookEvent, cancelBooking, addEvent, deleteEvent }}>
      {children}
    </EventContext.Provider>
  );
};

export const useEvents = () => useContext(EventContext);
