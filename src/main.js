import FiltersView from './view/filters-view';
import MenuView from './view/menu-view';
import {generatePoint} from './mock/points';
import TripInfoTitleView from './view/trip-info-title-view';

import {RenderPosition, render} from './render';

import TripPresenter from './presenter/TripPresenter';


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


const tripInfoContainer = document.querySelector('.trip-main');
render(tripInfoContainer, new TripInfoTitleView(tripPoints), RenderPosition.BEFOREEND);


const navigationContainerElement = document.querySelector('.trip-controls__navigation');
render(navigationContainerElement, new MenuView(), RenderPosition.BEFOREEND);

const filtersContainerElement = document.querySelector('.trip-controls__filters');
render(filtersContainerElement, new FiltersView(), RenderPosition.BEFOREEND);


const tripContainer = document.querySelector('.page-body__page-main .page-body__container');

const tripPresenter = new TripPresenter(tripContainer);

tripPresenter.init(tripPoints);

