export const pointTypes = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

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
  [PointTypeEnum.BUS]: 'Bus',
};

export const SortType = {
  DEFAULT: 'default',
  PRICE: 'price',
  TIME: 'time',
};

export const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT',
};

export const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
};

export const FilterType = {
  ALL: 'ALL',
  FUTURE: 'FUTURE',
  PAST: 'PAST',
};

export const MenuItem = {
  TABLE: 'Table',
  STATS: 'Stats',
};
