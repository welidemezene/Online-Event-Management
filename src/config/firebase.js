import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyBMrhspLHWAg5xA6-IxC9IFhbz5X8kjgUM",
  authDomain: "eventsphere-f3753.firebaseapp.com",
  databaseURL: "https://eventsphere-f3753-default-rtdb.firebaseio.com",
  projectId: "eventsphere-f3753",
  storageBucket: "eventsphere-f3753.firebasestorage.app",
  messagingSenderId: "927261410692",
  appId: "1:927261410692:web:cdbe05c760d4b70ec5c9d1",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app);
export default app;
