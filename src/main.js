import MenuView from './view/menu-view';
import PointsModel from './model/points-model';
import FilterModel from './model/filter-model.js';
import {RenderPosition, render} from './render';
import {MenuItem} from './const';
import StatisticPresenter from './presenter/statistic-presenter';

import TripPresenter from './presenter/trip-presenter';
import FilterPresenter from './presenter/filter-presenter.js';
import TripInfoPresenter from './presenter/trip-info-presenter';
import ApiService from './api-service.js';


const AUTHORIZATION = 'Basic bgt6y78ijhbvfrt567yu';
const END_POINT = 'https://16.ecmascript.pages.academy/big-trip/';

const pointsModel = new PointsModel(new ApiService(END_POINT, AUTHORIZATION));
const filterModel = new FilterModel();

const tripMainElement = document.querySelector('.trip-main');

const navigationContainerElement = document.querySelector('.trip-controls__navigation');
const filtersContainerElement = document.querySelector('.trip-controls__filters');
const tripContainerElement = document.querySelector('.page-body__page-main .page-body__container');
const addEventButtonElement = document.querySelector('.trip-main__event-add-btn');

const menuItemVew =  new MenuView(MenuItem.TABLE);

const tripPresenter = new TripPresenter(tripContainerElement, pointsModel, filterModel);
const filterPresenter = new FilterPresenter(filtersContainerElement, filterModel, pointsModel);
const statisticPresenter = new StatisticPresenter(tripContainerElement, pointsModel);

tripPresenter.init();
filterPresenter.init();

const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.TABLE:
      tripPresenter.init();
      filterPresenter.init();
      statisticPresenter.destroy();
      addEventButtonElement.disabled = false;
      break;

    case MenuItem.STATS:
      tripPresenter.destroy();
      filterPresenter.destroy();
      statisticPresenter.init();
      addEventButtonElement.disabled = true;
      break;
  }
};

menuItemVew.sethandleMenuClick(handleSiteMenuClick);


addEventButtonElement.addEventListener('click', (evt) => {
  evt.preventDefault();
  addEventButtonElement.disabled = true;
  tripPresenter.createPoint();
});


pointsModel.init().finally(() => {
  const tripInfoPresenter = new TripInfoPresenter(tripMainElement, pointsModel);
  tripInfoPresenter.init();
  render(navigationContainerElement, menuItemVew, RenderPosition.BEFOREEND);
});

