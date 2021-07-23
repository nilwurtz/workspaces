import * as vscode from 'vscode';

import { formatDate } from './formatter';

export type Schedule = {
  hour: number;
  minute: number;
  showMessage: string;
  notified: boolean;
};

type configScheduleStyle = string[];

export const getSchedules = (
  config: vscode.WorkspaceConfiguration
): Schedule[] => {
  const schedules = config.get<configScheduleStyle>("schedules");
  const message = config.get<string>("displayMessage");
  if (!schedules) {
    return [makeSchedule("18:00", message)];
  }
  const validated = schedules.filter((item) => validateTime(item));
  return validated.map((time) => makeSchedule(time, message));
};

export const isTimePassed = (schedule: Schedule, now: Date) => {
  return now.getTime() >= toTime(schedule);
};

const toTime = (schedule: Schedule, now?: Date) => {
  const targetDate = now || new Date();
  targetDate.setHours(schedule.hour);
  targetDate.setMinutes(schedule.minute);
  return targetDate.getTime();
};

const makeSchedule = (time: string, message: string | undefined) => {
  const [hour, minute] = time.split(":");
  const displayMessage = message ? message : "It's [time] now!";
  return {
    hour: parseInt(hour),
    minute: parseInt(minute),
    showMessage: displayMessage,
    notified: false,
  };
};

const validateTime = (time: string): boolean => {
  const pattern = /^\d{1,2}:\d{1,2}$/;
  // format invalid
  if (!pattern.test(time)) {
    return false;
  }
  const [hour, minute] = time.split(":");
  // time invalid
  if (parseInt(hour) > 23 || parseInt(minute) > 59) {
    return false;
  }
  return true;
};

export const formatMessage = (schedule: Schedule) => {
  const displayTime =
    ("0" + schedule.hour.toString()).slice(-2) +
    ":" +
    ("0" + schedule.minute.toString()).slice(-2);
  return schedule.showMessage.replace(/\[time\]/g, displayTime);
};
