import {isPointFuture} from '../utils';

export const pointToFilterMap = {
  everything: (points) =>points,
  future: (points) => points.filter((point) => isPointFuture(point.startDate)),
  past: (points) => points.filter((point) => !isPointFuture(point.startDate))
};
