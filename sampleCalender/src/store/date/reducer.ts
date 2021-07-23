import moment from 'moment';

import { calcMonth } from '../../utils/date';
import { ActionTypes } from '../actionTypes';
import { DateActionTypes, Dates } from './types';

const initialState: Dates = {
  displayMoment: moment(),
  currentMoment: moment(),
  daysData: calcMonth(moment()),
};

export const dateReducer = (state = initialState, action: DateActionTypes): Dates => {
  switch (action.type) {
    case ActionTypes.nextMonth:
      const nextMonth = state.displayMoment.clone().add(1, "months");
      const nextDaysData = calcMonth(nextMonth);
      return {
        ...state,
        daysData: nextDaysData,
        displayMoment: nextMonth,
      };
    case ActionTypes.previousMonth:
      const previousMonth = state.displayMoment.clone().add(-1, "months");
      const previousDaysData = calcMonth(previousMonth);
      return {
        ...state,
        daysData: previousDaysData,
        displayMoment: previousMonth,
      };
    case ActionTypes.resetMonth:
      return {
        ...state,
        displayMoment: moment(),
        currentMoment: moment(),
        daysData: calcMonth(moment()),
      };
    default:
      const _: never = action;
      return state;
  }
};
