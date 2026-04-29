import { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const checkUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('es_user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Error loading user", error);
      } finally {
        setLoading(false);
      }
    };
    checkUser();
  }, []);

  const login = async (email, password) => {
    // MOCK LOGIN FOR NOW
    if (email === 'admin@eventsphere.com') {
      const adminUser = { uid: 'admin1', name: 'Admin User', email, role: 'admin' };
      setUser(adminUser);
      await AsyncStorage.setItem('es_user', JSON.stringify(adminUser));
      return adminUser;
    }
    const regularUser = { uid: 'user1', name: 'Test User', email, role: 'user' };
    setUser(regularUser);
    await AsyncStorage.setItem('es_user', JSON.stringify(regularUser));
    return regularUser;
  };

  const register = async (name, email, password) => {
    // MOCK REGISTER
    const newUser = { uid: 'user' + Date.now(), name, email, role: 'user' };
    setUser(newUser);
    await AsyncStorage.setItem('es_user', JSON.stringify(newUser));
    return newUser;
  };

  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem('es_user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
