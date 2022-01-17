import {getDuration} from './dayjs';

export const sortByPrice =(pointA, pointB) => (
  pointB.price - pointA.price
);


export const sortByTime = (pointA, pointB) => (getDuration(pointB).asMilliseconds() - getDuration(pointA).asMilliseconds());

export const sortByDate = (pointA, pointB) => {
  if (pointA.startDate > pointB.startDate) {
    return 1;
  }

  if (pointA.startDate < pointB.startDate) {
    return -1;
  }

  return 0;
};
