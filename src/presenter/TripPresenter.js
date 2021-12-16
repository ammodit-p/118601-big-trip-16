
import SortingView from '../view/sorting-view';
import PointsListView from '../view/point-list-view';
import EmptyListView from '../view/empty-list-view';
import PointPresenter from './PointPresenter';

import {SortType} from '../conts';
import {updateItem} from '../utils';
import {RenderPosition, render} from '../render';

export default class TripPresenter {
  #tripContainer = null;

  #tripComponent = document.querySelector('.trip-events');
  #sortComponent = new SortingView();
  #pointListComponent = new PointsListView();
  #emptyListComponent = new EmptyListView();

  #points = []
  #pointPresenter = new Map()
  #currentSortType = SortType.DEFAULT
  #sourcePoints = []

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

  #renderSortComponent = () => {
    render(this.#tripComponent, this.#sortComponent, RenderPosition.AFTERBEGIN);
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
