import moment from 'moment';
import { Action } from 'redux';

import { ActionTypes } from '../actionTypes';

// stateの型
export type Event = {
  start: moment.Moment;
  end: moment.Moment;
  title: string;
  location?: string;
  description: string;
};

type EventMeta = {
  id: number;
  lastUpdate: moment.Moment;
};

type EventWithMeta = EventMeta & Event;

export type Events = EventWithMeta[];

interface AddEventAction extends Action {
  type: typeof ActionTypes.addEvent;
  payload: Event;
  updateAt: moment.Moment;
}

interface EditEventAction extends Action {
  type: typeof ActionTypes.editEvent;
  payload: { event: Event; id: number };
  updateAt: moment.Moment;
}

interface DeleteEventAction extends Action {
  type: typeof ActionTypes.deleteEvent;
  payload: { id: number };
}

export type EventActionTypes = AddEventAction | EditEventAction | DeleteEventAction;
