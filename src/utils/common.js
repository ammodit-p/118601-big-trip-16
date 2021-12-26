import {getDuration} from './dayjs';

export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const updateItem = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);

  if (index === -1) {
    return items;
  }

  return [
    ...items.splice(index, 1, update)
  ];
};

export const sortByPrice =(pointA, pointB) => (
  pointB.price - pointA.price
);


export const sortByTime = (pointA, pointB) => (getDuration(pointB).asMilliseconds() - getDuration(pointA).asMilliseconds());
