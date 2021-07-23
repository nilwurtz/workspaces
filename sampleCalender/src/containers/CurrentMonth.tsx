import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import { RootState } from '../store';

export const CurrentMonth: React.FC = () => {
  const date = useSelector((state: RootState) => state.date);

  return (
    <Root>
      <h2>
        {date.displayMoment.year()}年{date.displayMoment.month() + 1}月
      </h2>
      <p>{date.currentMoment.format("YYYY年M月DD日")}</p>
    </Root>
  );
};

const Root = styled.div`
  font-size: 2rem;
`;
