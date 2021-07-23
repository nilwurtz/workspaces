import moment from 'moment';
import { NextComponentType, NextPageContext } from 'next';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import { Day } from '../components/Day';
import { WeekLabel } from '../components/WeekLabel';
import { RootState } from '../store';

export const MonthCalendar: NextComponentType<NextPageContext, {}, {}> = () => {
  const date = useSelector((state: RootState) => state.date);
  const [isCurrentMonth, setIsCurrentMonth] = useState(true);

  useEffect(() => {
    setIsCurrentMonth(moment(date.displayMoment).isSame(date.currentMoment, "month"));
  }, [date.displayMoment]);

  const days = date.daysData.map(item => {
    const position: React.CSSProperties = {
      gridColumn: `${item.weekday() + 1}/${item.weekday() + 2}`,
    };
    // 表示と現在の月が同じなら今日かどうかの判定を行う
    if (isCurrentMonth) {
      return (
        <Day
          style={position}
          key={`${item.month()}-${item.date()}`}
          currentMoment={date.currentMoment}
          dayMoment={item}
          thisMonth={isCurrentMonth}></Day>
      );
    } else {
      return (
        <Day
          style={position}
          key={`${item.month()}-${item.date()}`}
          currentMoment={date.currentMoment}
          dayMoment={item}></Day>
      );
    }
  });
  return (
    <>
      <WeekLabel />
      <Root>{days}</Root>
    </>
  );
};

const Root = styled.div`
  display: grid;
  grid-template-columns: repeat(7, minmax(50px, 1fr));
  grid-auto-rows: calc(85vh / 6);
  overflow: auto;
  width: 100%;
`;
