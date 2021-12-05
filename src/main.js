import FiltersView from './view/filters-view';
import MenuView from './view/menu-view';
import SortingView from './view/sorting-view';
import EditablePointView from './view/editable-point-view';
import PointsListView from './view/point-list-view';
import PointView from './view/point-view';
import {generatePoint} from './mock/points';
import TripInfoTitleView from './view/trip-info-title-view';
import EmptyListView from './view/empty-list-view';

import {RenderPosition, render} from './render';


const MAX_POINTS_COUNT = 22;

const tripPoints = Array.from({length: MAX_POINTS_COUNT}, generatePoint).sort((a, b) => {
  if (a.startDate > b.startDate) {
    return 1;
  }

  if (a.startDate < b.startDate) {
    return -1;
  }

  return 0;
});


const renderPoints = (pointListElement, point) => {
  const pointComponent = new PointView(point);
  const pointEditComponent = new EditablePointView(point);

  const replacePointToForm = () => {
    pointListElement.replaceChild(pointEditComponent.element, pointComponent.element);
  };

  const replaceFormToPoint = () => {
    pointListElement.replaceChild(pointComponent.element, pointEditComponent.element);
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      replaceFormToPoint();
      document.removeEventListener('keydown', onEscKeyDown);
    }
  };

  pointComponent.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
    replacePointToForm();
    document.addEventListener('keydown', onEscKeyDown);
  });

  pointEditComponent.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
    replaceFormToPoint();
    document.addEventListener('keydown', onEscKeyDown);
  });

  pointEditComponent.element.querySelector('form').addEventListener('submit', (evt) => {
    evt.preventDefault();
    replaceFormToPoint();
    document.removeEventListener('keydown', onEscKeyDown);
  });

  render(pointListElement, pointComponent.element, RenderPosition.BEFOREEND);
};

const renderPointsList = (container, points) => {
  const pointsList = new PointsListView();
  const sortingElement = new SortingView();

  if (!points.length) {
    render(container, new EmptyListView().element, RenderPosition.AFTERBEGIN);
  } else {

    render(container, pointsList.element, RenderPosition.AFTERBEGIN);

    render(container, sortingElement.element, RenderPosition.AFTERBEGIN);

    points.forEach((point) => renderPoints(pointsList.element, point));
  }


};


const tripInfoContainer = document.querySelector('.trip-main');
render(tripInfoContainer, new TripInfoTitleView(tripPoints).element, RenderPosition.BEFOREEND);


const navigationContainerElement = document.querySelector('.trip-controls__navigation');
render(navigationContainerElement, new MenuView().element, RenderPosition.BEFOREEND);

const filtersContainerElement = document.querySelector('.trip-controls__filters');
render(filtersContainerElement, new FiltersView().element, RenderPosition.BEFOREEND);


const eventsElementContainer = document.querySelector('.trip-events');

const pointsListContainer = new PointsListView().element;

render(eventsElementContainer, pointsListContainer, RenderPosition.BEFOREEND);

renderPointsList(pointsListContainer, tripPoints);

