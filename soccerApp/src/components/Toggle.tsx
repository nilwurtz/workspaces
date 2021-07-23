import { NextComponentType, NextPageContext } from 'next';
import React, { useContext } from 'react';
import styled from 'styled-components';

import { pageContext } from '../contexts';

type Props = {
  className?: string;
};
export const ToggleBase: NextComponentType<NextPageContext, {}, Props> = props => {
  const ctx = useContext(pageContext);
  return (
    <div className={props.className}>
      <input id="toggle" type="checkbox" onClick={ctx.update} />
      <label htmlFor="toggle" />
      <span></span>
    </div>
  );
};

export const StyledToggle = styled(ToggleBase)`
  position: relative;
  width: 75px;
  height: 42px;
  margin: auto;
  input {
    display: none;
  }
  label {
    width: 75px;
    height: 42px;
    background: #ccc;
    position: relative;
    display: inline-block;
    border-radius: 46px;
    transition: 0.4s;
    box-sizing: border-box;
  }

  input:checked {
    + label {
      background-color: #4bd865;
    }
  }
  label {
    &:after {
      content: "";
      position: absolute;
      width: 42px;
      height: 42px;
      border-radius: 100%;
      left: 0;
      top: 0;
      z-index: 2;
      background: #fff;
      box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
      transition: 0.4s;
      cursor: pointer;
    }
  }

  input:checked {
    + label {
      &:after {
        left: 40px;
      }
    }
  }
`;
