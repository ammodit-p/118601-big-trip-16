import {FilterType} from '../conts';
import {isPointFuture} from './dayjs';

export const filters = {
  [FilterType.ALL]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter((point) => isPointFuture(point.startDate)),
  [FilterType.PAST]: (points) => points.filter((point) => !isPointFuture(point.startDate))
};
