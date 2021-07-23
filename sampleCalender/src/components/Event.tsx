import React from 'react';
import styled from 'styled-components';

type Props = {
  title: string;
};

export const Event: React.FC<Props> = props => {
  return <Root>{props.title}</Root>;
};

const Root = styled.div`
  height: 30%;
  width: 90%;
  border-radius: 10%;
  background: lightblue;
  border: 1px solid gray;
  position: relative;
`;
