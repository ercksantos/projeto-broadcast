import { Timestamp } from 'firebase/firestore';

export interface Connection {
  id: string;
  clientId: string;
  name: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Contact {
  id: string;
  clientId: string;
  connectionId: string;
  name: string;
  phone: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type MessageStatus = 'scheduled' | 'sent';

export interface Message {
  id: string;
  clientId: string;
  connectionId: string;
  contactIds: string[];
  content: string;
  status: MessageStatus;
  scheduledAt: Timestamp;
  sentAt: Timestamp | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
