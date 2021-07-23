import moment from 'moment';
import { Action } from 'redux';

import { ActionTypes } from '../actionTypes';

// stateの型
export type Dates = {
  currentMoment: moment.Moment;
  displayMoment: moment.Moment;
  daysData: moment.Moment[];
};

interface NextMonthAction extends Action {
  type: typeof ActionTypes.nextMonth;
}

interface PreviousMonthAction extends Action {
  type: typeof ActionTypes.previousMonth;
}

interface ResetMonthAction extends Action {
  type: typeof ActionTypes.resetMonth;
}

export type DateActionTypes = NextMonthAction | PreviousMonthAction | ResetMonthAction;
