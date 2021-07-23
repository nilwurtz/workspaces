import React from 'react';
import styled from 'styled-components';

export const WeekLabel: React.FC = () => {
  const weekList = ["日", "月", "火", "水", "木", "金", "土"];
  return (
    <Root>
      {weekList.map((item, idx) => (
        <span key={idx}>{item}</span>
      ))}
    </Root>
  );
};

const Root = styled.div`
  display: grid;
  grid-template-columns: repeat(7, minmax(50px, 1fr));
  width: 100%;
  text-align: center;
  font-size: 1.5rem;
`;
