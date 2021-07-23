import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

import { nextMonthAction, previousMonthAction, resetMonthAction } from '../store/date/actions';

export const DateChanger: React.FC = () => {
  const dispatch = useDispatch();
  const moveToNextMonth = useCallback(() => dispatch(nextMonthAction()), [dispatch]);
  const moveCurrentMonth = useCallback(() => dispatch(resetMonthAction()), [dispatch]);
  const moveToPreviousMonth = useCallback(() => dispatch(previousMonthAction()), [dispatch]);

  return (
    <Root>
      <Button onClick={moveToPreviousMonth}>前の月</Button>
      <Button onClick={moveCurrentMonth}>今月</Button>
      <Button onClick={moveToNextMonth}>次の月</Button>
    </Root>
  );
};

const Root = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Button = styled.button`
  background: darkorange;
  padding: 0.5em 1em;
  border-radius: 0.5em;
  font-size: 1.6rem;
  border: 1px solid rgba(0, 0, 0, 0.4);
  margin: 0 0.5em;
`;
