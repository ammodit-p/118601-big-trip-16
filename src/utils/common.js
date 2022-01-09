import {getDuration} from './dayjs';

export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const generateImages = () => {
  const maxImagesCount = 10;
  const imagesCount = getRandomInteger(1, maxImagesCount);

  return Array.from({length: imagesCount}, () => `http://picsum.photos/248/152?r=${getRandomInteger(1, 100)}`);
};

export const getTownImages = (town) => {
  //В будущем тут будем по городу получать картинки
  if (!town) {return [];}

  return [...generateImages()];

};


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
