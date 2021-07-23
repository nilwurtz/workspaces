import { NextPage } from 'next';
import React, { useState } from 'react';
import styled from 'styled-components';

import { CurrentMonth } from '../containers/CurrentMonth';
import { DateChanger } from '../containers/DateChanger';
import { EventCreateForm } from '../containers/EventCreateForm';
import { EventDisplay } from '../containers/EventDisplay';
import { MonthCalendar } from '../containers/MonthCalendar';

const Index: NextPage = () => {
  const [formDisplay, setFormDisplay] = useState(false);
  return (
    <Root>
      <CurrentMonth />
      <button onClick={() => setFormDisplay(true)}>AddEvent</button>
      {formDisplay ? <EventCreateForm onClick={() => setFormDisplay(false)} /> : null}
      <EventDisplay></EventDisplay>
      <DateChanger />
      <MonthCalendar />
    </Root>
  );
};

const Root = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

export default Index;
