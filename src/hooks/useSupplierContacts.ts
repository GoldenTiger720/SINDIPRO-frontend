import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getStoredToken } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';

// Types for event data
export interface EventData {
  title: string;
  eventType: string;
  dateTime: string;
  condominium: string;
  peopleInvolved: string[];
  comments: string;
}

export interface EventResponse {
  id: number;
  title: string;
  event_type: string;
  date_time: string;
  condominium: string;
  people_involved: string[];
  comments: string;
  created_at: string;
  updated_at: string;
}

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://sindipro-backend.onrender.com';

// API function to create event
const createEvent = async (eventData: EventData): Promise<EventResponse> => {
  const accessToken = getStoredToken('access');
  
  if (!accessToken) {
    throw new Error('No access token found. Please log in again.');
  }

  const url = `${API_BASE_URL}/api/contacts/event/`;
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      title: eventData.title,
      event_type: eventData.eventType,
      date_time: eventData.dateTime,
      condominium: eventData.condominium,
      people_involved: eventData.peopleInvolved,
      comments: eventData.comments,
    }),
  };

  // Debug logging
  console.log('Event Creation API Request:', {
    url,
    method: requestOptions.method,
    headers: requestOptions.headers,
    bodyData: eventData,
    hasBody: !!requestOptions.body
  });

  const response = await fetch(url, requestOptions);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    
    if (response.status === 401) {
      throw new Error('Authentication failed. Please log in again.');
    }
    
    throw new Error(errorData.message || errorData.detail || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// API function to fetch events
const fetchEvents = async (): Promise<EventResponse[]> => {
  const accessToken = getStoredToken('access');
  
  if (!accessToken) {
    throw new Error('No access token found. Please log in again.');
  }

  const url = `${API_BASE_URL}/api/contacts/event/`;
  
  // Debug logging
  console.log('Fetching events from:', url);
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    
    if (response.status === 401) {
      throw new Error('Authentication failed. Please log in again.');
    }
    
    throw new Error(errorData.message || errorData.detail || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// API function to update event
const updateEvent = async (eventId: string, eventData: Partial<EventData>): Promise<EventResponse> => {
  const accessToken = getStoredToken('access');
  
  if (!accessToken) {
    throw new Error('No access token found. Please log in again.');
  }

  const url = `${API_BASE_URL}/api/contacts/${eventId}/event`;
  
  // Debug logging
  console.log('Updating event at:', url);
  
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      ...(eventData.title && { title: eventData.title }),
      ...(eventData.eventType && { event_type: eventData.eventType }),
      ...(eventData.dateTime && { date_time: eventData.dateTime }),
      ...(eventData.condominium && { condominium: eventData.condominium }),
      ...(eventData.peopleInvolved && { people_involved: eventData.peopleInvolved }),
      ...(eventData.comments && { comments: eventData.comments }),
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    
    if (response.status === 401) {
      throw new Error('Authentication failed. Please log in again.');
    }
    
    throw new Error(errorData.message || errorData.detail || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// API function to delete event
const deleteEvent = async (eventId: string): Promise<void> => {
  const accessToken = getStoredToken('access');
  
  if (!accessToken) {
    throw new Error('No access token found. Please log in again.');
  }

  const url = `${API_BASE_URL}/api/contacts/${eventId}/event`;
  
  // Debug logging
  console.log('Deleting event at:', url);
  
  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    
    if (response.status === 401) {
      throw new Error('Authentication failed. Please log in again.');
    }
    
    throw new Error(errorData.message || errorData.detail || `HTTP error! status: ${response.status}`);
  }
};

// React Query hook for fetching events
export const useEvents = () => {
  return useQuery<EventResponse[], Error>({
    queryKey: ['supplier-events'],
    queryFn: fetchEvents,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });
};

// React Query hook for creating events
export const useCreateEvent = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation<EventResponse, Error, EventData>({
    mutationFn: createEvent,
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: "Event created successfully",
      });
      // Invalidate and refetch any related queries if needed
      queryClient.invalidateQueries({ queryKey: ['supplier-events'] });
    },
    onError: (error: Error) => {
      console.error('Error creating event:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create event. Please try again.",
        variant: "destructive",
      });
    },
  });
};

// React Query hook for updating events
export const useUpdateEvent = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation<EventResponse, Error, { eventId: string; eventData: Partial<EventData> }>({
    mutationFn: ({ eventId, eventData }) => updateEvent(eventId, eventData),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Event updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['supplier-events'] });
    },
    onError: (error: Error) => {
      console.error('Error updating event:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update event. Please try again.",
        variant: "destructive",
      });
    },
  });
};

// React Query hook for deleting events
export const useDeleteEvent = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: deleteEvent,
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Event deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['supplier-events'] });
    },
    onError: (error: Error) => {
      console.error('Error deleting event:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete event. Please try again.",
        variant: "destructive",
      });
    },
  });
};