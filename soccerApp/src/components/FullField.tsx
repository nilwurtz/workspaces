import React from 'react';

import { HalfField } from './HalfField';

export const FullField: React.FC = () => {
  return (
    <>
      <HalfField reverse />
      <HalfField />
    </>
  );
};
