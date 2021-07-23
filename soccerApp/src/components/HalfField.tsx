import React from 'react';
import styled from 'styled-components';

import { color, size } from '../conf';

type Props = {
  reverse?: boolean;
};

export const HalfField: React.FC<Props> = props => {
  const styleClass = props.reverse ? "reverse" : "";
  return (
    <Base className={styleClass} num={10}>
      <div className="penaltyArea"></div>
      <div className="goalArea"></div>
      <div className="penaltyArc"></div>
      <div className="centerCircle"></div>
      <div className="penaltyMark"></div>
      <div className="centerMark"></div>
    </Base>
  );
};

const Base = styled.div<{ num: number }>`
  position: relative;
  background-color: ${color.green};
  width: ${({ num }): number => size.width * num}px;
  height: ${({ num }): number => (size.height / 2) * num}px;
  border: 2px solid ${color.white};
  border-radius: 2px;
  z-index: 0;
  overflow: hidden;
  &.reverse {
    transform: rotate(180deg);
  }
  & + div {
    border-top: none;
  }
  & > div {
    position: absolute;
    border: 2px solid ${color.white};
    border-radius: 2px;
  }
  & .goalArea {
    width: ${({ num }): number => size.goalArea.width * num}px;
    height: ${({ num }): number => size.goalArea.height * num}px;
    bottom: 0;
    left: 50%;
    z-index: 3;
    transform: translateX(-50%);
    border-style: solid solid none solid;
  }
  & .penaltyArea {
    width: ${({ num }): number => size.penaltyArea.width * num}px;
    height: ${({ num }): number => size.penaltyArea.height * num}px;
    background-color: ${color.green};
    bottom: 0;
    left: 50%;
    z-index: 2;
    transform: translateX(-50%);
    border-style: solid solid none solid;
  }
  & .penaltyArc {
    width: ${({ num }): number => size.penaltyArc.radius * 2 * num}px;
    height: ${({ num }): number => size.penaltyArc.radius * 2 * num}px;
    border-radius: 50%;
    bottom: ${({ num }): number => size.penaltyMark.height * num}px;
    left: 50%;
    z-index: 1;
    transform: translate(-50%, 50%);
  }
  & .centerCircle {
    width: ${({ num }): number => size.centerCircle.radius * 2 * num}px;
    height: ${({ num }): number => size.centerCircle.radius * 2 * num}px;
    border-radius: 50%;
    top: 0;
    left: 50%;
    z-index: 1;
    transform: translate(-50%, -50%);
  }
  & .penaltyMark {
    width: 2px;
    height: 2px;
    border-radius: 50%;
    left: 50%;
    bottom: ${({ num }): number => size.penaltyMark.height * num}px;
    z-index: 3;
    transform: translateX(-50%);
  }
  & .centerMark {
    width: 3px;
    height: 3px;
    border-radius: 50%;
    left: 50%;
    top: 0;
    z-index: 3;
    transform: translate(-50%, -50%);
  }
`;
