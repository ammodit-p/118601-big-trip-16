import dayjs from 'dayjs';
import {OFFERS} from './mock/offers';

export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const isPointFuture = (date) => dayjs().isBefore(date, 'D');

export const getSelectedOffers = (offers = [], type) => offers.map((id) => (
  OFFERS.find((i) => i.type === type).offers.find((offer) => offer.id === id)
));
