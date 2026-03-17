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
  Timestamp,
  writeBatch,
  getDocs,
  type Unsubscribe,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Message, MessageStatus } from '@/types';

const COLLECTION = 'messages';

export interface MessageData {
  connectionId: string;
  contactIds: string[];
  content: string;
  scheduledAt: Date;
}

/** Calcula status com base no horário de agendamento. Função pura. */
const resolveStatus = (scheduledAt: Timestamp): MessageStatus =>
  scheduledAt.toMillis() <= Date.now() ? 'sent' : 'scheduled';

export const createMessage = (clientId: string, data: MessageData): Promise<void> => {
  const scheduledAt = Timestamp.fromDate(data.scheduledAt);
  const status = resolveStatus(scheduledAt);
  return addDoc(collection(db, COLLECTION), {
    clientId,
    connectionId: data.connectionId,
    contactIds: data.contactIds,
    content: data.content,
    status,
    scheduledAt,
    sentAt: status === 'sent' ? serverTimestamp() : null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  }).then(() => undefined);
};

export const updateMessage = (
  id: string,
  data: Omit<MessageData, 'connectionId'>,
): Promise<void> => {
  const scheduledAt = Timestamp.fromDate(data.scheduledAt);
  const status = resolveStatus(scheduledAt);
  return updateDoc(doc(db, COLLECTION, id), {
    contactIds: data.contactIds,
    content: data.content,
    scheduledAt,
    status,
    sentAt: status === 'sent' ? serverTimestamp() : null,
    updatedAt: serverTimestamp(),
  });
};

export const deleteMessage = (id: string): Promise<void> => deleteDoc(doc(db, COLLECTION, id));

export const subscribeToMessages = (
  clientId: string,
  connectionId: string,
  statusFilter: MessageStatus | 'all',
  onData: (messages: Message[]) => void,
  onError: (error: Error) => void,
): Unsubscribe => {
  const constraints = [
    where('clientId', '==', clientId),
    where('connectionId', '==', connectionId),
    ...(statusFilter !== 'all' ? [where('status', '==', statusFilter)] : []),
  ];
  const q = query(collection(db, COLLECTION), ...constraints);
  return onSnapshot(
    q,
    (snap) => onData(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Message, 'id'>) }))),
    onError,
  );
};

/**
 * Busca mensagens 'scheduled' com scheduledAt no passado e
 * as atualiza para 'sent' em batch. Chamada pelo useMessageDispatcher.
 */
export const dispatchDueMessages = async (clientId: string): Promise<number> => {
  const now = Timestamp.now();
  const snap = await getDocs(
    query(
      collection(db, COLLECTION),
      where('clientId', '==', clientId),
      where('status', '==', 'scheduled'),
      where('scheduledAt', '<=', now),
    ),
  );

  if (snap.empty) return 0;

  const batch = writeBatch(db);
  snap.docs.forEach((d) => {
    batch.update(d.ref, { status: 'sent', sentAt: now, updatedAt: now });
  });

  await batch.commit();
  return snap.size;
};
