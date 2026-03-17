import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  onSnapshot,
  serverTimestamp,
  type Unsubscribe,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Connection } from '@/types';

const COLLECTION = 'connections';

export const createConnection = (clientId: string, name: string): Promise<void> =>
  addDoc(collection(db, COLLECTION), {
    clientId,
    name,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  }).then(() => undefined);

export const updateConnection = (id: string, name: string): Promise<void> =>
  updateDoc(doc(db, COLLECTION, id), { name, updatedAt: serverTimestamp() });

export const deleteConnection = (id: string): Promise<void> => deleteDoc(doc(db, COLLECTION, id));

export const subscribeToConnections = (
  clientId: string,
  onData: (connections: Connection[]) => void,
  onError: (error: Error) => void,
): Unsubscribe => {
  const q = query(collection(db, COLLECTION), where('clientId', '==', clientId));
  return onSnapshot(
    q,
    (snap) => onData(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Connection, 'id'>) }))),
    onError,
  );
};
