import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { User, BabyProfile } from '../types';
import { handleFirestoreError, OperationType } from '../lib/firestore-errors';

const USERS_COLLECTION = 'users';

export const userService = {
  async getCurrentUserProfile(uid: string): Promise<User | null> {
    const path = `${USERS_COLLECTION}/${uid}`;
    try {
      const docRef = doc(db, USERS_COLLECTION, uid);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        return { id: snapshot.id, ...snapshot.data() } as User;
      }
      return null;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, path);
      return null;
    }
  },

  async createUserProfile(user: Partial<User>): Promise<void> {
    if (!user.id) return;
    const path = `${USERS_COLLECTION}/${user.id}`;
    try {
      const docRef = doc(db, USERS_COLLECTION, user.id);
      const userData = {
        ...user,
        role: user.role || 'customer',
        points: user.points || 0,
        createdAt: Date.now()
      };
      await setDoc(docRef, userData);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  async updatePoints(uid: string, pointsChange: number): Promise<void> {
    const path = `${USERS_COLLECTION}/${uid}`;
    try {
      const docRef = doc(db, USERS_COLLECTION, uid);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        const currentPoints = (snapshot.data() as User).points || 0;
        await updateDoc(docRef, {
          points: currentPoints + pointsChange
        });
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  }
};
