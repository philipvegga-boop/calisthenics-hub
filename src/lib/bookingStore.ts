// Simple in-memory booking store shared across components
export interface BookedClass {
  id: string;
  date: number;
  day: string;
  name: string;
  time: string;
  endTime: string;
}

const BOOKING_STORAGE_KEY = "poderestoico.bookings.v1";

const loadInitialBookings = (): BookedClass[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(BOOKING_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is BookedClass =>
        typeof item?.id === "string" &&
        typeof item?.date === "number" &&
        typeof item?.day === "string" &&
        typeof item?.name === "string" &&
        typeof item?.time === "string" &&
        typeof item?.endTime === "string"
    );
  } catch {
    return [];
  }
};

const persistBookings = (data: BookedClass[]) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(BOOKING_STORAGE_KEY, JSON.stringify(data));
};

let bookedClasses: BookedClass[] = loadInitialBookings();
let listeners: (() => void)[] = [];

export const bookingStore = {
  getBookings: () => [...bookedClasses],

  addBooking: (cls: BookedClass) => {
    if (!bookedClasses.find(b => b.id === cls.id)) {
      bookedClasses = [...bookedClasses, cls];
      persistBookings(bookedClasses);
      listeners.forEach(l => l());
    }
  },

  removeBooking: (id: string) => {
    bookedClasses = bookedClasses.filter(b => b.id !== id);
    persistBookings(bookedClasses);
    listeners.forEach(l => l());
  },

  isBooked: (id: string) => bookedClasses.some(b => b.id === id),

  subscribe: (listener: () => void) => {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  },
};
