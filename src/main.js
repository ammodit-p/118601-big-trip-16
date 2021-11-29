import {filtersView} from './view/filters-view';
import {menuView} from './view/menu-view';
import {sortingView} from './view/sorting-view';
import {editablePointView} from './view/editable-point-view';
import {pointsListView} from './view/point-list-view';
import {pointView} from './view/point-view';
import {generatePoint} from './mock/points';
import {tripInfoTitleView} from './view/trip-info-title-view';


const RenderPosition = {
  BEFOREBEGIN: 'beforebegin',
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
  AFTEREND: 'afterend',
};

const MAX_POINTS_COUNT = 10;

const tripPoints = Array.from({length: MAX_POINTS_COUNT}, generatePoint).sort((a, b) => {
  if (a.startDate > b.startDate) {
    return 1;
  }

  if (a.startDate < b.startDate) {
    return -1;
  }

  return 0;
});

const render =(container, markup, position) => {
  container.insertAdjacentHTML(position, markup);
};

const tripInfoContainer = document.querySelector('.trip-main');
render(tripInfoContainer, tripInfoTitleView(tripPoints), RenderPosition.BEFOREEND);


const navigationContainerElement = document.querySelector('.trip-controls__navigation');
render(navigationContainerElement, menuView(), RenderPosition.BEFOREEND);

const filtersContainerElement = document.querySelector('.trip-controls__filters');
render(filtersContainerElement, filtersView(), RenderPosition.BEFOREEND);


const eventsElementContainer = document.querySelector('.trip-events');
render(eventsElementContainer, sortingView(), RenderPosition.BEFOREEND);

const POINTS = [editablePointView(tripPoints[0]), ...tripPoints.map((point)=>pointView(point)).slice(1, tripPoints.length)];
render(eventsElementContainer,pointsListView(POINTS),RenderPosition.BEFOREEND);
