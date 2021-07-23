import { ActionTypes } from '../actionTypes';
import { DateActionTypes } from './types';

export const nextMonthAction = (): DateActionTypes => {
  return {
    type: ActionTypes.nextMonth,
  };
};

export const previousMonthAction = (): DateActionTypes => {
  return {
    type: ActionTypes.previousMonth,
  };
};
export const resetMonthAction = (): DateActionTypes => {
  return {
    type: ActionTypes.resetMonth,
  };
};
