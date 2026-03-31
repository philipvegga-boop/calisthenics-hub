// Simple in-memory booking store shared across components
export interface BookedClass {
  id: string;
  date: number;
  day: string;
  name: string;
  time: string;
  endTime: string;
}

let bookedClasses: BookedClass[] = [];
let listeners: (() => void)[] = [];

export const bookingStore = {
  getBookings: () => [...bookedClasses],

  addBooking: (cls: BookedClass) => {
    if (!bookedClasses.find(b => b.id === cls.id)) {
      bookedClasses = [...bookedClasses, cls];
      listeners.forEach(l => l());
    }
  },

  removeBooking: (id: string) => {
    bookedClasses = bookedClasses.filter(b => b.id !== id);
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
