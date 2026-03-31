// Admin-editable schedule store
export interface TimeSlot {
  time: string;
  endTime: string;
}

const defaultSlots: TimeSlot[] = [
  { time: "09:00", endTime: "10:00" },
  { time: "18:00", endTime: "19:00" },
  { time: "19:00", endTime: "20:00" },
  { time: "20:00", endTime: "21:00" },
];

let slots: TimeSlot[] = [...defaultSlots];
let listeners: (() => void)[] = [];

export const scheduleStore = {
  getSlots: () => [...slots],

  addSlot: (slot: TimeSlot) => {
    slots = [...slots, slot].sort((a, b) => a.time.localeCompare(b.time));
    listeners.forEach(l => l());
  },

  removeSlot: (time: string) => {
    slots = slots.filter(s => s.time !== time);
    listeners.forEach(l => l());
  },

  subscribe: (listener: () => void) => {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  },
};
