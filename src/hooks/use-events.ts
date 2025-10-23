
'use client';

import {
  collection,
  doc,
  Timestamp,
} from 'firebase/firestore';

import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { addDocumentNonBlocking, deleteDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';

export interface CampusEvent {
  id: string;
  title: string;
  date: string | Timestamp;
  location: string;
  description: string;
  imageUrl: string;
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

  const addEvent = (event: Omit<CampusEvent, 'id' | 'date'> & {date: Date}) => {
    if (!eventsCollection) return;
    addDocumentNonBlocking(eventsCollection, {
      ...event,
      date: Timestamp.fromDate(event.date),
    });
  };

  const removeEvent = (eventId: string) => {
    if (!firestore) return;
    const eventDoc = doc(firestore, 'events', eventId);
    deleteDocumentNonBlocking(eventDoc);
  };

  const updateEvent = (eventId: string, event: Omit<CampusEvent, 'id' | 'date'> & {date: Date}) => {
    if (!firestore) return;
    const eventDoc = doc(firestore, 'events', eventId);
    updateDocumentNonBlocking(eventDoc, {
        ...event,
        date: Timestamp.fromDate(event.date),
    });
    };

  return {
    events: events || [],
    isEventsLoading,
    eventsError,
    addEvent,
    removeEvent,
    updateEvent,
    isInitialized: !!firestore,
  };
}

    