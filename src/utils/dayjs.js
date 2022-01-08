import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

export const isPointFuture = (date) => dayjs().isBefore(date, 'D');


export const getDuration = (point) => dayjs.duration(point.endDate.diff(point.startDate));

const MILLISECONDS_IN_HOUR = 3600000;

export const getDiffTime = (point) => {

  const diff = getDuration(point);
  const diffInHours = diff.asMilliseconds()/MILLISECONDS_IN_HOUR;

  const hours = diff.format('HH');
  const minutes = diff.format('mm');
  const days = diff.format('DD');

  if (diffInHours < 1) {
    return `${minutes}M`;
  }

  if (diffInHours < 24) {
    return `${hours}H ${minutes}M`;
  }

  if (diffInHours >= 24) {
    return `${days}D ${hours}H ${minutes}M`;
  }
};
