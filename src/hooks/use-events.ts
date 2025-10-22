
'use client';

import {
  collection,
  doc,
  Timestamp,
} from 'firebase/firestore';

import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { addDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase/non-blocking-updates';

export interface CampusEvent {
  id: string;
  title: string;
  date: string | Timestamp;
  location: string;
  description: string;
  longDescription?: string;
  imageId: string;
}

export function useEvents() {
  const firestore = useFirestore();

  const eventsCollection = useMemoFirebase(
    () => (firestore ? collection(firestore, 'events') : null),
    [firestore]
  );

  const {
    data: events,
    isLoading: isEventsLoading,
    error: eventsError,
  } = useCollection<CampusEvent>(eventsCollection);

  const addEvent = async (event: Omit<CampusEvent, 'id' | 'date'> & {date: Date}) => {
    if (!eventsCollection) return;
    addDocumentNonBlocking(eventsCollection, {
      ...event,
      date: Timestamp.fromDate(event.date),
    });
  };

  const removeEvent = async (eventId: string) => {
    if (!firestore) return;
    const eventDoc = doc(firestore, 'events', eventId);
    deleteDocumentNonBlocking(eventDoc);
  };

  return {
    events: events || [],
    isEventsLoading,
    eventsError,
    addEvent,
    removeEvent,
    isInitialized: !!firestore,
  };
}
