
'use client';

import { initialEvents } from '../lib/data';
import { useState } from 'react';


export interface CampusEvent {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  imageUrl: string;
}

export function useEvents() {
    const [events, setEvents] = useState<CampusEvent[]>(initialEvents);

    const addEvent = (event: Omit<CampusEvent, 'id' | 'date'> & {date: Date}) => {
        setEvents(prev => [...prev, { ...event, id: `event-${Date.now()}`, date: event.date.toISOString() }]);
    };
    
    const removeEvent = (eventId: string) => {
        setEvents(prev => prev.filter(e => e.id !== eventId));
    };

    const updateEvent = (eventId: string, event: Omit<CampusEvent, 'id' | 'date'> & {date: Date}) => {
        setEvents(prev => prev.map(e => e.id === eventId ? { ...event, id: eventId, date: event.date.toISOString() } : e));
    };

  return {
    events: events,
    isEventsLoading: false,
    eventsError: null,
    addEvent,
    removeEvent,
    updateEvent,
    isInitialized: true,
  };
}
