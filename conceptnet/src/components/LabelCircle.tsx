import { NextComponentType, NextPageContext } from 'next';
import React from 'react';
import { circleSize } from 'type';

import { BaseCircle } from '../components/BaseCircle';

type Props = {
  name: string;
  size?: circleSize;
  style?: React.CSSProperties;
};

export const LabelCircle: NextComponentType<NextPageContext, {}, Props> = props => {
  return (
    <BaseCircle style={props.style} size={props.size}>
      <span>{props.name}</span>
    </BaseCircle>
  );
};
