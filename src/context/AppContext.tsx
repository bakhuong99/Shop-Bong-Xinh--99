import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut, User as FirebaseUser } from 'firebase/auth';
import { doc, onSnapshot, getDoc, setDoc, collection, query, where, limit } from 'firebase/firestore';
import { auth, db, googleProvider } from '../lib/firebase';
import { BabyProfile, User, Product } from '../types';
import { handleFirestoreError, OperationType } from '../lib/firestore-errors';

interface AppContextType {
  user: User | null;
  babyProfile: BabyProfile | null;
  setBabyProfile: (profile: BabyProfile | null) => void;
  isLoading: boolean;
  isAdmin: boolean;
  signIn: () => Promise<void>;
  logout: () => Promise<void>;
  compareItems: Product[];
  toggleCompare: (product: Product) => void;
  clearCompare: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [babyProfile, setBabyProfile] = useState<BabyProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [compareItems, setCompareItems] = useState<Product[]>([]);

  const toggleCompare = (product: Product) => {
    setCompareItems(prev => {
      const isAlreadyIn = prev.some(p => p.id === product.id);
      if (isAlreadyIn) {
        return prev.filter(p => p.id !== product.id);
      }
      if (prev.length >= 3) {
        alert("Ba mẹ chỉ có thể so sánh tối đa 3 sản phẩm cùng lúc nhé!");
        return prev;
      }
      return [...prev, product];
    });
  };

  const clearCompare = () => setCompareItems([]);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Sync user profile
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        let userDoc;
        try {
          userDoc = await getDoc(userDocRef);
        } catch (error) {
          handleFirestoreError(error, OperationType.GET, `users/${firebaseUser.uid}`);
          return;
        }
        
        let userData: User;
        if (!userDoc.exists()) {
          userData = {
            id: firebaseUser.uid,
            email: firebaseUser.email || '',
            name: firebaseUser.displayName || 'Người dùng',
            role: firebaseUser.email === 'bakhuong1010@gmail.com' ? 'admin' : 'customer',
            points: 0,
            createdAt: Date.now(),
          };
          try {
            await setDoc(userDocRef, userData);
          } catch (error) {
            handleFirestoreError(error, OperationType.WRITE, `users/${firebaseUser.uid}`);
          }
        } else {
          userData = userDoc.data() as User;
        }

        // Listen to live user updates (points/role changes)
        const unsubscribeUser = onSnapshot(userDocRef, (doc) => {
          if (doc.exists()) {
            setUser({ id: doc.id, ...doc.data() } as User);
          }
        }, (error) => {
          handleFirestoreError(error, OperationType.GET, `users/${firebaseUser.uid}`);
        });

        // Listen for baby profiles
        const babyQuery = query(
          collection(db, 'babyProfiles'),
          where('userId', '==', firebaseUser.uid),
          limit(1)
        );

        const unsubscribeBaby = onSnapshot(babyQuery, (snapshot) => {
          if (!snapshot.empty) {
            const doc = snapshot.docs[0];
            setBabyProfile({ id: doc.id, ...doc.data() } as BabyProfile);
          } else {
            setBabyProfile(null);
          }
          setIsLoading(false);
        }, (error) => {
          handleFirestoreError(error, OperationType.GET, 'babyProfiles');
        });

        return () => {
          unsubscribeBaby();
          unsubscribeUser();
        };
      } else {
        setUser(null);
        setBabyProfile(null);
        setIsLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const signIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Sign in failed:', error);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AppContext.Provider value={{ 
      user, babyProfile, setBabyProfile, isLoading, isAdmin, signIn, logout,
      compareItems, toggleCompare, clearCompare
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};
