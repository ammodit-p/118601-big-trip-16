export const pointTypes = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

export const TOWNS = ['Amsterdam', 'Geneva', 'Moscow'];


export const PointTypeEnum = {
  CHECK_IN: 'check-in',
  SIGHTSEEING: 'sightseeing',
  RESTAURANT: 'restaurant',
  TAXI: 'taxi',
  BUS: 'bus',
  TRAIN: 'train',
  SHIP: 'ship',
  DRIVE: 'drive',
  FLIGHT:'flight',
};

export const PointTitleMap = {
  [PointTypeEnum.TRAIN]: 'Train',
  [PointTypeEnum.TAXI]: 'Taxi',
  [PointTypeEnum.SIGHTSEEING]: 'Sightseeing',
  [PointTypeEnum.SHIP]: 'Ship',
  [PointTypeEnum.RESTAURANT]: 'Restaurant',
  [PointTypeEnum.FLIGHT]: 'Flight',
  [PointTypeEnum.DRIVE]: 'Drive',
  [PointTypeEnum.CHECK_IN]: 'Check-in',
  [PointTypeEnum.BUS]: 'Bus'
};
