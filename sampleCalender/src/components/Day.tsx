import moment from 'moment';
import React from 'react';
import styled from 'styled-components';

type Props = {
  style?: React.CSSProperties;
  thisMonth?: boolean;
  currentMoment: moment.Moment;
  dayMoment: moment.Moment;
};

export const Day: React.FC<Props> = props => {
  const weekDayClass = () => {
    if (props.dayMoment.weekday() === 0) {
      return "sunday";
    } else if (props.dayMoment.weekday() === 6) {
      return "saturday";
    } else {
      return "";
    }
  };
  const isToday = props.currentMoment.isSame(props.dayMoment, "date");

  return (
    <Root
      className={`${isToday ? "today" : ""} ${props.thisMonth ? "" : "notCurrent"} ${weekDayClass()}`}
      style={props.style}>
      <ContentArea>
        <Label>{props.dayMoment.date()}</Label>
        <Content>{props.children}</Content>
      </ContentArea>
    </Root>
  );
};

const Root = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border: 0.5px solid silver;
  &.today {
    background: lightpink;
  }
  &.notCurrent {
    opacity: 0.75;
  }
  &.sunday {
    color: red;
  }
  &.saturday {
    color: blue;
  }
`;

const ContentArea = styled.div`
  height: 100%;
  display: grid;
  grid-template-rows: 20px minmax(30px, 60px);
`;

const Label = styled.div`
  font-size: 1.7rem;
  grid-row: 1/2;
`;

const Content = styled.div`
  font-size: 1.5rem;
  word-break: break-all;
  grid-row: 2/3;
  color: black;
`;
