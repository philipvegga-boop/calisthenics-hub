// Admin-editable "next class" info, persisted in localStorage
export interface NextClassInfo {
  day: string;
  time: string;
  location: string;
  instructor: string;
  topic: string;
}

const STORAGE_KEY = "poderestoico.nextclass.v1";

const defaults: NextClassInfo = {
  day: "Lunes 31 Mar",
  time: "18:00 hrs",
  location: "Parque Araucano",
  instructor: "Coach Martín",
  topic: "Pull Day — Front Lever Progressions",
};

const load = (): NextClassInfo => {
  if (typeof window === "undefined") return defaults;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaults;
    return { ...defaults, ...JSON.parse(raw) };
  } catch {
    return defaults;
  }
};

const persist = (data: NextClassInfo) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

let current: NextClassInfo = load();
let snapshot: NextClassInfo = current;
let listeners: (() => void)[] = [];

export const nextClassStore = {
  get: () => snapshot,

  update: (partial: Partial<NextClassInfo>) => {
    current = { ...current, ...partial };
    snapshot = current;
    persist(current);
    listeners.forEach((l) => l());
  },

  subscribe: (listener: () => void) => {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  },
};
