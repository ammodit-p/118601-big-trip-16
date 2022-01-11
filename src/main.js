import MenuView from './view/menu-view';
import {generatePoint} from './mock/points';
import PointsModel from './model/points-model';
import FilterModel from './model/filter-model.js';
import {RenderPosition, render} from './render';
import {MenuItem} from './conts';
import StatisticPresenter from './presenter/statistic-presenter';

import TripPresenter from './presenter/trip-presenter';
import FilterPresenter from './presenter/filter-presenter.js';
import TripInfoPresenter from './presenter/trip-info-presenter';


const MAX_POINTS_COUNT = 30;

const tripPoints = Array.from({length: MAX_POINTS_COUNT}, generatePoint);

const filterModel = new FilterModel();
const pointsModel = new PointsModel();
pointsModel.points = tripPoints;

const tripInfoContainer = document.querySelector('.trip-main');
const tripInfoPresenter = new TripInfoPresenter(tripInfoContainer, pointsModel);
tripInfoPresenter.init();

const navigationContainerElement = document.querySelector('.trip-controls__navigation');
const menuItemVew =  new MenuView(MenuItem.TABLE);
render(navigationContainerElement, menuItemVew, RenderPosition.BEFOREEND);


const filtersContainerElement = document.querySelector('.trip-controls__filters');


const tripContainer = document.querySelector('.page-body__page-main .page-body__container');

const tripPresenter = new TripPresenter(tripContainer, pointsModel, filterModel);
const filterPresenter = new FilterPresenter(filtersContainerElement, filterModel);
const statisticPresenter = new StatisticPresenter(tripContainer, pointsModel);

tripPresenter.init();
filterPresenter.init();

const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.TABLE:
      tripPresenter.init();
      filterPresenter.init();
      statisticPresenter.destroy();
      break;

    case MenuItem.STATS:
      tripPresenter.destroy();
      filterPresenter.destroy();
      statisticPresenter.init();
      break;
  }
};

menuItemVew.setMenuClickHandler(handleSiteMenuClick);

document.querySelector('.trip-main__event-add-btn').addEventListener('click', (evt) => {
  evt.preventDefault();
  handleSiteMenuClick(MenuItem.TABLE);
  tripPresenter.createPoint();
});

