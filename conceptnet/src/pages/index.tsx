import { NextPage } from 'next';
import React from 'react';
import styled, { keyframes } from 'styled-components';

import { LabelCircle } from '../components/LabelCircle';
import { FormCircle } from '../containers/FormCircle';
import { alignContext, useAlign } from '../contexts/align';
import { apiContext, useAPI } from '../contexts/api';

const Index: NextPage = () => {
  const ctx = useAlign();
  const apiCtx = useAPI();

  const edgeData = (() => {
    if (apiCtx.data !== null) {
      const circleSize = "md";
      const circleStyle: React.CSSProperties = { margin: "2rem" };
      return apiCtx.data.edges.map((item, key) => {
        return <LabelCircle style={circleStyle} size={circleSize} name={item.start.label} key={key} />;
      });
    } else {
      return null;
    }
  })();

  return (
    <alignContext.Provider value={ctx}>
      <apiContext.Provider value={apiCtx}>
        <Root className={edgeData ? "align" : ""}>{edgeData ? edgeData : <FormCircle />}</Root>
      </apiContext.Provider>
    </alignContext.Provider>
  );
};

const Root = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  & > div {
    margin: 0 auto;
    flex-shrink: 0;
  }
  &.align {
    justify-content: flex-start;
    align-items: flex-start;
    align-content: flex-start;
    flex-wrap: wrap;
  }
`;

const rotateAnimation1 = keyframes`
  from {
    transform: translateX(0));
  }
  to {
    transform: translateX(2000%);
  }
`;

const EdgeArea = styled.div`
  overflow-x: hidden;
  grid-row: 2/3;
  width: 100vw;
  display: flex;
  align-items: center;
  & > div {
    flex-shrink: 0;
    /* animation: ${rotateAnimation1} 15s linear infinite; */
  }
`;

export default Index;
