import {nanoid} from 'nanoid';
import {getRandomInteger} from '../utils/common';
import {PointTypeEnum} from '../conts';
import {pointTypes} from '../conts';


const offerTitles = {
  [PointTypeEnum.BUS]: [],
  [PointTypeEnum.CHECK_IN]: ['Add breakfast', 'Add Coffee', 'Add Lunch'],
  [PointTypeEnum.DRIVE] :['Rent a car', 'Take a Driver'],
  [PointTypeEnum.FLIGHT] :['Add luggage', 'Switch to comfort', 'Add meal', 'Choose seats'],
  [PointTypeEnum.RESTAURANT] :[],
  [PointTypeEnum.SHIP] :[],
  [PointTypeEnum.SIGHTSEEING] :['Book tickets', 'Lunch in city', 'Sth else', 'Sth else more'],
  [PointTypeEnum.TAXI] :['Order Uber', 'Order comfort', 'Order business'],
  [PointTypeEnum.TRAIN] :[],
};

const generateOffers = (type) => offerTitles[type].map((title) => ({
  id: nanoid(),
  title,
  price: `${getRandomInteger(10, 100)}`
}));

export const OFFERS = pointTypes.map((type) => ({
  type,
  offers: [...generateOffers(type)]
}));
