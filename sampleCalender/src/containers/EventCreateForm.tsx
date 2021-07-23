import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

import { useStringForm } from '../hooks/useStringForm';
import { addEventAction } from '../store/event/actions';
import { Event } from '../store/event/types';

type Props = {
  style?: React.CSSProperties;
  onClick: () => void;
};

export const EventCreateForm: React.FC<Props> = props => {
  const parentRef = useRef<HTMLDivElement | null>(null);
  const dispatch = useDispatch();
  const title = useStringForm("");
  const location = useStringForm("");
  const description = useStringForm("");

  const [start, setStart] = useState<moment.Moment>(moment());
  const [end, setEnd] = useState<moment.Moment>(moment().add(1, "hour"));

  const clearForm = () => {
    title.reset();
    location.reset();
    description.reset();
    const Forms = Array.from(parentRef.current.getElementsByClassName("clearForm"));
    Forms.map((item: HTMLInputElement) => (item.value = ""));
  };

  const addEvent = () => {
    clearForm();
    dispatch(
      addEventAction({
        start,
        end,
        title: title.value,
        location: location.value,
        description: description.value,
      }),
    );
  };

  return (
    <Root>
      <Card>
        <InputRoot style={props.style} ref={parentRef}>
          <InputArea>
            <Label>title:</Label>
            <Input className="clearForm" onChange={title.onChange} />
          </InputArea>
          <InputArea>
            <Label>location:</Label>
            <Input className="clearForm" onChange={location.onChange} />
          </InputArea>
          <InputArea>
            <Label>description:</Label>
            <Input className="clearForm" onChange={description.onChange} />
          </InputArea>
          <InputArea>
            <Label>start:</Label>
            <Input className="clearForm"></Input>
          </InputArea>
          <InputArea>
            <Label>end:</Label>
            <Input className="clearForm"></Input>
          </InputArea>
        </InputRoot>
        <Button onClick={addEvent}>add</Button>
        <Button onClick={props.onClick}>Back</Button>
      </Card>
    </Root>
  );
};

const Root = styled.div`
  position: fixed;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.65);
`;

const Card = styled.div`
  background: white;
  font-size: 1.6rem;
`;

const InputRoot = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  & > * {
    margin: 1em;
  }
`;

const InputArea = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
`;
const Label = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Input = styled.input`
  font-size: 1.6rem;
  padding: 0.2em 0.5em;
  border: 1px solid lightgray;
  border-radius: 5px;
`;

const Button = styled.button`
  font-size: 1.6rem;
  padding: 0.7em 0.5em;
  background: lightcyan;
  border-radius: 5px;
  border: 1px solid lightgray;
`;
