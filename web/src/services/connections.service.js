import { collection, addDoc, updateDoc, deleteDoc, doc, query, where, onSnapshot, serverTimestamp, } from 'firebase/firestore';
import { db } from '@/lib/firebase';
const COLLECTION = 'connections';
export const createConnection = (clientId, name) => addDoc(collection(db, COLLECTION), {
    clientId,
    name,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
}).then(() => undefined);
export const updateConnection = (id, name) => updateDoc(doc(db, COLLECTION, id), { name, updatedAt: serverTimestamp() });
export const deleteConnection = (id) => deleteDoc(doc(db, COLLECTION, id));
export const subscribeToConnections = (clientId, onData, onError) => {
    const q = query(collection(db, COLLECTION), where('clientId', '==', clientId));
    return onSnapshot(q, (snap) => onData(snap.docs.map((d) => ({ id: d.id, ...d.data() }))), onError);
};
