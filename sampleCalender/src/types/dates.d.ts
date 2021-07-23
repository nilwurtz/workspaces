export type Event = {
  id: number;
  title: string;
  content: string;
};

export type Events = Event[];

export type SingleDay = {
  day: number;
  weekday: number;
  // events?: Events;
};

export type DaysOfMonth = SingleDay[];
