import React from 'react';

import { FullField } from '../components/FullField';
import { HalfField } from '../components/HalfField';

type Props = {
  field: "half" | "full";
};

export const Field: React.FC<Props> = props => {
  const fields = props.field === "half" ? <HalfField /> : <FullField />;
  return <>{fields}</>;
};
