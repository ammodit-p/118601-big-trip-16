import MenuView from './view/menu-view';
import PointsModel from './model/points-model';
import FilterModel from './model/filter-model.js';
import {RenderPosition, render} from './render';
import {MenuItem} from './conts';
import StatisticPresenter from './presenter/statistic-presenter';

import TripPresenter from './presenter/trip-presenter';
import FilterPresenter from './presenter/filter-presenter.js';
import TripInfoPresenter from './presenter/trip-info-presenter';
import ApiService from './api-service.js';


const AUTHORIZATION = 'Basic bgt6y78ijhbvfrt567yu';
const END_POINT = 'https://16.ecmascript.pages.academy/big-trip/';

const pointsModel = new PointsModel(new ApiService(END_POINT, AUTHORIZATION));
const filterModel = new FilterModel();

const tripInfoContainer = document.querySelector('.trip-main');


const navigationContainerElement = document.querySelector('.trip-controls__navigation');
const menuItemVew =  new MenuView(MenuItem.TABLE);
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
  tripPresenter.createPoint();
});


pointsModel.init().finally(() => {
  const tripInfoPresenter = new TripInfoPresenter(tripInfoContainer, pointsModel);
  tripInfoPresenter.init();
  render(navigationContainerElement, menuItemVew, RenderPosition.BEFOREEND);});

