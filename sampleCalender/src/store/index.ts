import { combineReducers, createStore } from 'redux';

import { dateReducer } from './date/reducer';
import { eventReducer } from './event/reducer';

const rootReducer = combineReducers({
  date: dateReducer,
  event: eventReducer,
});

// states type
export type RootState = ReturnType<typeof rootReducer>;

// store
const store = createStore(rootReducer);

export default store;
