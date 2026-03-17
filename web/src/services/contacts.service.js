import { collection, addDoc, updateDoc, deleteDoc, doc, query, where, onSnapshot, serverTimestamp, } from 'firebase/firestore';
import { db } from '@/lib/firebase';
const COLLECTION = 'contacts';
export const createContact = (clientId, connectionId, data) => addDoc(collection(db, COLLECTION), {
    clientId,
    connectionId,
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
}).then(() => undefined);
export const updateContact = (id, data) => updateDoc(doc(db, COLLECTION, id), { ...data, updatedAt: serverTimestamp() });
export const deleteContact = (id) => deleteDoc(doc(db, COLLECTION, id));
export const subscribeToContacts = (clientId, connectionId, onData, onError) => {
    const q = query(collection(db, COLLECTION), where('clientId', '==', clientId), where('connectionId', '==', connectionId));
    return onSnapshot(q, (snap) => onData(snap.docs.map((d) => ({ id: d.id, ...d.data() }))), onError);
};
