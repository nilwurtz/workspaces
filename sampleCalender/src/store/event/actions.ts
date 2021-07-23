import moment from 'moment';

import { ActionTypes } from '../actionTypes';
import { Event, EventActionTypes } from './types';

export const addEventAction = (event: Event): EventActionTypes => {
  return {
    type: ActionTypes.addEvent,
    payload: event,
    updateAt: moment(),
  };
};

export const editEventAction = (event: Event, id: number): EventActionTypes => {
  return {
    type: ActionTypes.editEvent,
    payload: { event, id },
    updateAt: moment(),
  };
};

export const deleteEventAction = (id: number): EventActionTypes => {
  return {
    type: ActionTypes.deleteEvent,
    payload: { id },
  };
};
