import { createContext, useContext, useState, useEffect } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { ref, get, set } from 'firebase/database';
import { auth, database } from '../config/firebase';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const snapshot = await get(ref(database, `users/${firebaseUser.uid}`));
          if (snapshot.exists()) {
            setUser({ uid: firebaseUser.uid, email: firebaseUser.email, ...snapshot.val() });
          } else {
            setUser({ uid: firebaseUser.uid, email: firebaseUser.email, name: firebaseUser.displayName || 'User', role: 'user' });
          }
        } catch {
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
    await updateProfile(result.user, { displayName: name });
    const usersSnapshot = await get(ref(database, 'users'));
    const isFirstUser = !usersSnapshot.exists();
    const role = (isFirstUser || email.toLowerCase() === 'admin@eventsphere.com') ? 'admin' : 'user';
    const profile = { name, email, role, createdAt: new Date().toISOString() };
    await set(ref(database, `users/${result.user.uid}`), profile);
    return { uid: result.user.uid, ...profile };
  };

  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
