import React, { useContext, useState } from 'react';
import styled from 'styled-components';

import { BaseCircle } from '../components/BaseCircle';
import { alignContext } from '../contexts/align';
import { apiContext } from '../contexts/api';
import { getApiData } from '../utils/api';
import color from '../utils/color';

export const FormCircle: React.FC = () => {
  const [value, setValue] = useState<string>("");
  const [disable, setDisable] = useState<boolean>(false);
  const ctx = useContext(alignContext);
  const apiCtx = useContext(apiContext);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setValue(e.target.value);
  };

  const submit = async (): Promise<void> => {
    setDisable(true);
    setTimeout(() => setDisable(false), 1000);
    const resJson = await getApiData(value);
    if (resJson) {
      apiCtx.setCurrentData(resJson);
      ctx.setCurrentAlign(true);
    } else {
      console.log("an error occurred");
    }
  };

  return (
    <BaseCircle size="lg">
      <Input onChange={handleInput} />
      <Button disabled={disable} onClick={submit}>
        Submit!
      </Button>
    </BaseCircle>
  );
};

const Input = styled.input`
  font-size: 1.7rem;
  background: transparent;
  border-bottom: 3px solid ${color.secondary.dark};
  color: black;
  width: 80%;
  padding: 0.5em;
  margin: 1em;
  & :focus {
    outline: none;
  }
`;

const Button = styled.button`
  border-radius: 5px;
  font-size: 1.5rem;
  padding: 0.5em 1em;
  background-color: ${color.secondary.dark};
  color: ${color.white};
  border-bottom: solid 4px rgba(0, 0, 0, 0.2);
  &:disabled {
    margin-bottom: 4px;
    transform: translateY(4px);
    box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.2);
    border-bottom: none;
  }
`;
