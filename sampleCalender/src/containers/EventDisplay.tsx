import React from 'react';
import { useSelector } from 'react-redux';

import { RootState } from '../store';

export const EventDisplay: React.FC = () => {
  const eventStates = useSelector((state: RootState) => state.event);

  return (
    <div style={{ display: "block" }}>
      {eventStates.map(item => (
        <div key={item.id}>{JSON.stringify(item)}</div>
      ))}
    </div>
  );
};
