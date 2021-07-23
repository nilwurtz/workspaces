import moment from 'moment';

import { ActionTypes } from '../actionTypes';
import { EventActionTypes, Events } from './types';

const initialState: Events = [];

export const eventReducer = (state = initialState, action: EventActionTypes): Events => {
  const latestEventId = state.length;
  switch (action.type) {
    case ActionTypes.addEvent:
      const addMeta = { id: latestEventId + 1, lastUpdate: action.updateAt };
      return [...state, Object.assign(action.payload, addMeta)];
    case ActionTypes.editEvent:
      const editMeta = { id: action.payload.id, lastUpdate: action.updateAt };
      const unEditEvents = state.filter(event => event.id !== action.payload.id);
      unEditEvents.push(Object.assign(action.payload.event, editMeta));
      return unEditEvents;
    case ActionTypes.deleteEvent:
      const filteredEvents = state.filter(event => event.id !== action.payload.id);
      return filteredEvents;
    default:
      const _: never = action;
      return state;
  }
};
