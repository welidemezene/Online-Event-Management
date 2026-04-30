import { initializeApp } from 'firebase/app';
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

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Auth with AsyncStorage persistence (required for React Native)
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Initialize Realtime Database
export const database = getDatabase(app);

export default app;
