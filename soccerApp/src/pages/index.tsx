import { NextPage } from 'next';
import React from 'react';

import { StyledToggle } from '../components/Toggle';
import { Field } from '../containers/Field';
import { pageContext, useIndexContext } from '../contexts';

const Index: NextPage = () => {
  const pageCtx = useIndexContext();
  return (
    <pageContext.Provider value={pageCtx}>
      <div>
        <Field field={pageCtx.field} />
      </div>
      <StyledToggle />
    </pageContext.Provider>
  );
};

export default Index;
