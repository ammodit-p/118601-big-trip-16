import SortingView from '../view/sorting-view';
import PointsListView from '../view/point-list-view';
import EmptyListView from '../view/empty-list-view';
import PointPresenter from './point-presenter';
import PointNewPresenter from './point-new-presenter';
import {filters} from '../utils/filters';

import { sortByPrice, sortByTime, sortByDate} from '../utils/common';
import {RenderPosition, render, removeElement} from '../render';
import { FilterType, SortType, UpdateType, UserAction } from '../conts';

export default class TripPresenter {
  #tripContainer = null;

  #tripComponent = document.querySelector('.trip-events');

  #sortComponent = null;
  #pointListComponent = new PointsListView();
  #emptyListComponent = null;

  #pointsModel = null;
  #filterModel = null;

  #pointPresenter = new Map();
  #pointNewPresenter = null;

  #currentSortType = SortType.DEFAULT;
  #filterType = FilterType.ALL


  constructor(tripContainer, pointsModel, filterModel) {
    this.#tripContainer = tripContainer;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;
    this.#pointNewPresenter = new PointNewPresenter(this.#pointListComponent, this.#handleViewAction);

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get points() {
    this.#filterType = this.#filterModel.filter;
    const points = this.#pointsModel.points;
    const filteredPoints = filters[this.#filterType](points);

    switch (this.#currentSortType) {
      case SortType.PRICE:
        return [...filteredPoints].sort(sortByPrice);

      case SortType.TIME:
        return [...filteredPoints].sort(sortByTime);

      case SortType.DEFAULT:
        return [...filteredPoints].sort(sortByDate);
    }
    return filteredPoints;
  }

  init = () => {
    render(this.#tripContainer, this.#tripComponent, RenderPosition.BEFOREEND);
    render(this.#tripComponent, this.#pointListComponent, RenderPosition.BEFOREEND);

    this.#renderTrip();
  }

  #handleModeChange = () => {
    this.#pointNewPresenter.destroy();
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  }

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointsModel.updatePoint(updateType,update);
        break;
      case UserAction.ADD_POINT:

        this.#pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this.#pointsModel.deletePoint(updateType, update);
        break;
    }
  }

  #handleModelEvent = (updateType, update) => {

    switch(updateType) {
      case UpdateType.PATCH:
        this.#pointPresenter.get(update.id).init(update);
        break;
      case UpdateType.MINOR:
        this.#clearTrip();
        this.#renderTrip();
        break;
      case UpdateType.MAJOR:
        this.#clearTrip({resetSortType: true});
        this.#renderTrip();
        break;
    }
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearPointsList();
    this.#renderPointsList();
  }

  #renderSortComponent = () => {
    this.#sortComponent = new SortingView(this.#currentSortType);
    render(this.#tripComponent, this.#sortComponent, RenderPosition.AFTERBEGIN);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
  }

  #renderPoint = (point) => {
    const pointPresenter = new PointPresenter(this.#pointListComponent, this.#handleViewAction, this.#handleModeChange);
    pointPresenter.init(point);
    this.#pointPresenter.set(point.id, pointPresenter);
  }

  #renderPointsList = () => {
    this.points.forEach((point) => {
      this.#renderPoint(point);});
  }

  #renderNoPoints = () => {
    this.#emptyListComponent = new EmptyListView(this.#filterType);
    render(this.#pointListComponent, this.#emptyListComponent, RenderPosition.AFTERBEGIN);
  }

  #clearPointsList = () => {
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();
  }

  #clearTrip = ({resetSortType = false} = {}) => {
    this.#clearPointsList();
    removeElement(this.#sortComponent);
    removeElement(this.#emptyListComponent);

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
  }

  #renderTrip = () => {
    if (!this.points.length) {
      this.#renderNoPoints();
      return;
    }

    this.#renderSortComponent();
    this.#renderPointsList();
  }

  createPoint = () => {
    this.#currentSortType = SortType.DEFAULT;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.ALL);
    this.#pointNewPresenter.init();
  }

  destroy = () => {
    this.#clearTrip({resetSortType: true});

    removeElement(this.#pointListComponent);
  }
}
