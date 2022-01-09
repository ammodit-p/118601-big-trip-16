import MenuView from './view/menu-view';
import {generatePoint} from './mock/points';
import PointsModel from './model/points-model';
import FilterModel from './model/filter-model.js';
import {RenderPosition, render} from './render';

import TripPresenter from './presenter/trip-presenter';
import FilterPresenter from './presenter/filter-presenter.js';
import TripInfoPresenter from './presenter/trip-info-presenter';


const MAX_POINTS_COUNT = 5;

const tripPoints = Array.from({length: MAX_POINTS_COUNT}, generatePoint);

const filterModel = new FilterModel();
const pointsModel = new PointsModel();
pointsModel.points = tripPoints;

const tripInfoContainer = document.querySelector('.trip-main');
const tripInfoPresenter = new TripInfoPresenter(tripInfoContainer, pointsModel);
tripInfoPresenter.init();

const navigationContainerElement = document.querySelector('.trip-controls__navigation');
render(navigationContainerElement, new MenuView(), RenderPosition.BEFOREEND);

const filtersContainerElement = document.querySelector('.trip-controls__filters');


const tripContainer = document.querySelector('.page-body__page-main .page-body__container');

const tripPresenter = new TripPresenter(tripContainer, pointsModel, filterModel);
const filterPresenter = new FilterPresenter(filtersContainerElement, filterModel);

tripPresenter.init();
filterPresenter.init();

document.querySelector('.trip-main__event-add-btn').addEventListener('click', (evt) => {
  evt.preventDefault();
  tripPresenter.createPoint();
});

