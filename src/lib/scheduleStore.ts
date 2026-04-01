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

const SCHEDULE_STORAGE_KEY = "poderestoico.schedule.v1";

const loadInitialSlots = (): TimeSlot[] => {
  if (typeof window === "undefined") return [...defaultSlots];
  try {
    const raw = window.localStorage.getItem(SCHEDULE_STORAGE_KEY);
    if (!raw) return [...defaultSlots];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [...defaultSlots];
    const valid = parsed.filter(
      (item): item is TimeSlot =>
        typeof item?.time === "string" &&
        typeof item?.endTime === "string"
    );
    return valid.length > 0 ? valid : [...defaultSlots];
  } catch {
    return [...defaultSlots];
  }
};

const persistSlots = (data: TimeSlot[]) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(SCHEDULE_STORAGE_KEY, JSON.stringify(data));
};

let slots: TimeSlot[] = loadInitialSlots();
let listeners: (() => void)[] = [];
let slotsSnapshot: TimeSlot[] = slots;

export const scheduleStore = {
  getSlots: () => slotsSnapshot,

  addSlot: (slot: TimeSlot) => {
    slots = [...slots, slot].sort((a, b) => a.time.localeCompare(b.time));
    slotsSnapshot = slots;
    persistSlots(slots);
    listeners.forEach(l => l());
  },

  removeSlot: (time: string) => {
    slots = slots.filter(s => s.time !== time);
    slotsSnapshot = slots;
    persistSlots(slots);
    listeners.forEach(l => l());
  },

  subscribe: (listener: () => void) => {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  },
};
