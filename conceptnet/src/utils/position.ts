export const circlePosition = (itemNum: number, itemWidth: number): React.CSSProperties[] => {
  const deg = 360.0 / itemNum;
  const red = (deg * Math.PI) / 180.0;
  const props: React.CSSProperties[] = [];
  const circleR = itemWidth * 3.0;
  for (let i = 0; i < itemNum; i++) {
    const left = Math.cos(red * i) * circleR + circleR;
    const top = Math.sin(red * i) * circleR + circleR;
    props.push({
      left: `${left}px`,
      top: `${top}px`,
    });
  }
  return props;
};
