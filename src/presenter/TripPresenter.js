
import SortingView from '../view/sorting-view';
import PointsListView from '../view/point-list-view';
import EmptyListView from '../view/empty-list-view';
import PointPresenter from './PointPresenter';

import {updateItem, sortByPrice, sortByTime} from '../utils/common';
import {RenderPosition, render} from '../render';
import { SortType } from '../conts';

export default class TripPresenter {
  #tripContainer = null;

  #tripComponent = document.querySelector('.trip-events');
  #sortComponent = new SortingView();
  #pointListComponent = new PointsListView();
  #emptyListComponent = new EmptyListView();

  #points = []
  #pointPresenter = new Map()
  #sourcePoints = []

  #currentSortType = SortType.DEFAULT;


  constructor(tripContainer) {
    this.#tripContainer = tripContainer;
  }

  init = (tripPoints) => {
    this.#points = [...tripPoints];
    this.#sourcePoints = [...tripPoints];

    render(this.#tripContainer, this.#tripComponent, RenderPosition.BEFOREEND);
    render(this.#tripComponent, this.#pointListComponent, RenderPosition.BEFOREEND);

    this.#renderTrip();
  }

  #handleModeChange = () => {
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  }

  #handlePointChange = (updatedPoint) => {
    this.#points = updateItem(this.#points, updatedPoint);
    this.#sourcePoints = updateItem(this.#sourcePoints, updatedPoint);
    this.#pointPresenter.get(updatedPoint.id).init(updatedPoint);
  }

  #sortPoints = (sortType) => {

    switch (sortType) {
      case SortType.PRICE:
        this.#points.sort(sortByPrice);
        break;

      case SortType.TIME:
        this.#points.sort(sortByTime);
        break;

      default:
        this.#points = [...this.#sourcePoints];
    }

    this.#currentSortType = sortType;
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#sortPoints(sortType);
    this.#clearPointsList();
    this.#renderPointsList();
  }

  #renderSortComponent = () => {
    render(this.#tripComponent, this.#sortComponent, RenderPosition.AFTERBEGIN);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
  }

  #renderPoint = (point) => {
    const pointPresenter = new PointPresenter(this.#pointListComponent, this.#handlePointChange, this.#handleModeChange);
    pointPresenter.init(point);
    this.#pointPresenter.set(point.id, pointPresenter);
  }

  #renderPointsList = () => {
    this.#points.forEach((point) => {
      this.#renderPoint(point);});
  }

  #renderNoPoints = () => {
    render(this.#tripComponent, this.#emptyListComponent, RenderPosition.AFTERBEGIN);
  }

  #clearPointsList = () => {
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();
  }

  #renderTrip = () => {
    if (!this.#points.length) {
      this.#renderNoPoints();
      return;
    }

    this.#renderSortComponent();
    this.#renderPointsList();
  }
}
