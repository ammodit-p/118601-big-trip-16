import dayjs from 'dayjs';
import {getRandomInteger} from '../utils';
import {pointTypes, TOWNS} from '../conts';
import {OFFERS} from './offers';


export const generateDates = () => {

  const maxFirstDaysGap = 7;
  const daysGap = getRandomInteger(-maxFirstDaysGap, maxFirstDaysGap);

  const maxHoursGap = 10;
  const hoursGap = getRandomInteger(0, maxHoursGap);

  const dayGenerated = dayjs().add(daysGap, 'day');

  const startDate = dayGenerated;//.toDate()
  const endDate = dayGenerated.add(hoursGap, 'hour');//.toDate()

  return {startDate, endDate};
};

const generateImages = () => {
  const maxImagesCount = 10;
  const imagesCount = getRandomInteger(1, maxImagesCount);

  return Array.from({length: imagesCount}, () => `http://picsum.photos/248/152?r=${getRandomInteger(1, 100)}`);
};


export const generatePoint = () => {
  const type = pointTypes[getRandomInteger(0, pointTypes.length -1)];
  const {startDate, endDate} = generateDates();
  const offers = [...OFFERS.find((offer) => (offer.type === type)).offers];

  const TEXT_INFO = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.';
  const info = TEXT_INFO.split('.').slice(1, getRandomInteger(2, 4));
  const newoffers = [...offers.slice(0, getRandomInteger(0, offers.length - 1)).map((offer) => offer.id)];

  const points = {
    id: getRandomInteger(1, 100),
    type,
    town: TOWNS[getRandomInteger(0, TOWNS.length -1)],
    info,
    img: [...generateImages()],
    startDate,
    endDate,
    offers: newoffers,
    isFavourite: getRandomInteger(),
    price: `${getRandomInteger(20, 1000)}`
  };

  return points;
};


