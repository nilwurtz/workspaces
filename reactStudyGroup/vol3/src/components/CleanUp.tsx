import React, { useEffect, useState } from "react";

const WithTimeout: React.FC = () => {
  const [time, updateTime] = useState(new Date());

  // 1秒毎に時間を更新
  useEffect(() => {
    const timeoutId = setTimeout(() => updateTime(new Date()), 1000);
    return () => clearTimeout(timeoutId);
  }, [time]);

  return <div>Current Time: {time.toISOString()}</div>;
};

export const CleanUpParent: React.FC = () => {
  return (
    <>
      <WithTimeout />
    </>
  );
};
