import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

export const isPointFuture = (date) => dayjs().isBefore(date, 'D');


export const getDuration = (point) => dayjs.duration(point.endDate.diff(point.startDate));

export const getDiffTime = (point) => {

  const diff = getDuration(point);

  const hours = diff.format('HH');

  if (hours === 0) {

    return `${diff.format('mm')  }M`;
  }

  if (hours > 24) {
    return `${diff.format('DD')}D ${hours}H ${diff.format('mm')}M`;
  }

  if (hours < 24) {
    return `${hours}H ${diff.format('mm')}M`;
  }

};
