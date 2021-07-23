import moment from 'moment';

const calcThisMonth = (momentObj: moment.Moment) => {
  const daysInMonth = momentObj.daysInMonth();
  const daysArray = Array.from({ length: daysInMonth }, (v, k) => k);

  const dates = daysArray.map(v =>
    momentObj
      .clone()
      .startOf("month")
      .add(v, "days"),
  );
  return dates;
};

const calcPrevMonth = (dates: moment.Moment[]) => {
  if (dates[0].weekday() !== 0) {
    const prevMonthMoment = dates[0].clone().add(-1, "month");
    const prevMonthDays = dates[0].weekday();
    const prevMonthDaysArray = Array.from({ length: prevMonthDays }, (v, k) => k);
    const prevMonthDates = prevMonthDaysArray.map(v =>
      prevMonthMoment
        .clone()
        .endOf("month")
        .add(-v, "days")
        .startOf("day"),
    );
    return prevMonthDates.reverse();
  } else {
    return [];
  }
};

const calcNextMonth = (dates: moment.Moment[]) => {
  if (dates[dates.length - 1].weekday() !== 6) {
    const nextMonthMoment = dates[0].clone().add(1, "month");
    const nextMonthDays = 6 - dates[dates.length - 1].weekday();
    const nextMonthDaysArray = Array.from({ length: nextMonthDays }, (v, k) => k);
    const prevMonthDates = nextMonthDaysArray.map(v =>
      nextMonthMoment
        .clone()
        .startOf("month")
        .add(v, "days")
        .startOf("day"),
    );
    return prevMonthDates;
  } else {
    return [];
  }
};

export const calcMonth = (momentObj: moment.Moment) => {
  const thisMonth = calcThisMonth(momentObj);
  const prevMonth = calcPrevMonth(thisMonth);
  const nextMonth = calcNextMonth(thisMonth);
  const datesData = prevMonth.concat(thisMonth, nextMonth);
  return datesData;
};
