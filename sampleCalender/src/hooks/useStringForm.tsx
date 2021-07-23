import React, { useRef, useState } from 'react';
import styled from 'styled-components';

export const useStringForm = (initialValue: string) => {
  const [value, setValue] = useState<string>(initialValue);
  const onChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setValue(e.target.value);
  };
  const reset = () => {
    setValue(initialValue);
  };

  return { value, onChange, reset };
};
