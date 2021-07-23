import { NextComponentType, NextPageContext } from 'next';
import React from 'react';
import styled from 'styled-components';
import { circleSize } from 'type';

import color from '../utils/color';

type Props = {
  size?: circleSize;
  style?: React.CSSProperties;
};

export const BaseCircle: NextComponentType<NextPageContext, {}, Props> = props => {
  const circleClass = ((): circleSize => {
    if (props.size === undefined) {
      return "md";
    } else {
      return props.size;
    }
  })();
  return (
    <Circle style={props.style} className={circleClass}>
      {props.children}
    </Circle>
  );
};

const Circle = styled.div`
  background: ${color.secondary.main};
  color: ${color.secondary.dark};
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  box-shadow: 0 0 10px 3px gray;
  word-wrap: break-word;

  &.lg {
    width: 200px;
    height: 200px;
    font-size: 4rem;
  }
  &.md {
    width: 150px;
    height: 150px;
    font-size: 3rem;
  }
  &.sm {
    width: 100px;
    height: 100px;
    font-size: 2rem;
  }
`;
