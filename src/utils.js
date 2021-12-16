import dayjs from 'dayjs';
import {OFFERS} from './mock/offers';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const isPointFuture = (date) => dayjs().isBefore(date, 'D');

export const getSelectedOffers = (offers = [], type) => offers.map((id) => (
  OFFERS.find((i) => i.type === type).offers.find((offer) => offer.id === id)
));

export const updateItem = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);

  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    update,
    ...items.slice(index + 1),
  ];
};

const getDuration = (point) => dayjs.duration(point.endDate - point.startDate);

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
