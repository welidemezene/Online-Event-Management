import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyBMrhspLHWAg5xA6-IxC9IFhbz5X8kjgUM",
  authDomain: "eventsphere-f3753.firebaseapp.com",
  databaseURL: "https://eventsphere-f3753-default-rtdb.firebaseio.com",
  projectId: "eventsphere-f3753",
  storageBucket: "eventsphere-f3753.firebasestorage.app",
  messagingSenderId: "927261410692",
  appId: "1:927261410692:web:cdbe05c760d4b70ec5c9d1",
};

// Prevent duplicate Firebase initialization
const app = getApps().length === 0
  ? initializeApp(firebaseConfig)
  : getApp();

// Initialize Firebase Authentication with persistent login
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Initialize Firebase Realtime Database service
export const database = getDatabase(app);

// Export Firebase app instance
export default app;