import { createContext, useState, useEffect, useContext } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { ref, set, get } from 'firebase/database';
import { auth, database } from '../config/firebase';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for Firebase auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch extra profile data from database (name, role)
        try {
          const snapshot = await get(ref(database, `users/${firebaseUser.uid}`));
          if (snapshot.exists()) {
            setUser({ uid: firebaseUser.uid, email: firebaseUser.email, ...snapshot.val() });
          } else {
            setUser({ uid: firebaseUser.uid, email: firebaseUser.email, name: firebaseUser.displayName || 'User', role: 'user' });
          }
        } catch (e) {
          setUser({ uid: firebaseUser.uid, email: firebaseUser.email, name: 'User', role: 'user' });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    const snapshot = await get(ref(database, `users/${result.user.uid}`));
    const profile = snapshot.exists() ? snapshot.val() : {};
    return { uid: result.user.uid, email: result.user.email, ...profile };
  };

  const register = async (name, email, password) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);

    // Update Firebase Auth display name
    await updateProfile(result.user, { displayName: name });

    // Determine role: first user gets admin, everyone else is regular user
    const usersSnapshot = await get(ref(database, 'users'));
    const isFirstUser = !usersSnapshot.exists();
    const role = isFirstUser ? 'admin' : 'user';

    // Save profile to Realtime Database
    const profile = {
      name,
      email,
      role,
      createdAt: new Date().toISOString(),
    };
    await set(ref(database, `users/${result.user.uid}`), profile);

    return { uid: result.user.uid, ...profile };
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
