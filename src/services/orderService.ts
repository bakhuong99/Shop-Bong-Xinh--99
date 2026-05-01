import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  addDoc, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Order } from '../types';
import { handleFirestoreError, OperationType } from '../lib/firestore-errors';

const COLLECTION_NAME = 'orders';

export const orderService = {
  async getUserOrders(uid: string): Promise<Order[]> {
    try {
      const q = query(
        collection(db, COLLECTION_NAME), 
        where('userId', '==', uid),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, COLLECTION_NAME);
      return [];
    }
  },

  async createOrder(order: Omit<Order, 'id'>): Promise<string | null> {
    try {
      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        ...order,
        createdAt: Date.now()
      });
      return docRef.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, COLLECTION_NAME);
      return null;
    }
  }
};
