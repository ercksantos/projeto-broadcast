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
import type { Contact } from '@/types';

const COLLECTION = 'contacts';

export interface ContactData {
  name: string;
  phone: string;
}

export const createContact = (
  clientId: string,
  connectionId: string,
  data: ContactData,
): Promise<void> =>
  addDoc(collection(db, COLLECTION), {
    clientId,
    connectionId,
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  }).then(() => undefined);

export const updateContact = (id: string, data: ContactData): Promise<void> =>
  updateDoc(doc(db, COLLECTION, id), { ...data, updatedAt: serverTimestamp() });

export const deleteContact = (id: string): Promise<void> => deleteDoc(doc(db, COLLECTION, id));

export const subscribeToContacts = (
  clientId: string,
  connectionId: string,
  onData: (contacts: Contact[]) => void,
  onError: (error: Error) => void,
): Unsubscribe => {
  const q = query(
    collection(db, COLLECTION),
    where('clientId', '==', clientId),
    where('connectionId', '==', connectionId),
  );
  return onSnapshot(
    q,
    (snap) => onData(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Contact, 'id'>) }))),
    onError,
  );
};
