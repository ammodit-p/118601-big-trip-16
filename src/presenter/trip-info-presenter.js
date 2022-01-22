import TripInfoView from '../view/trip-info-view';
import {render, RenderPosition, replaceElements, removeElement} from '../render';
import {  sortByDate} from '../utils/common';

export default class TripInfoPresenter {
    #tripInfoContainer = null;
    #tripInfoComponent = null;
    #pointsModel = null;
    #points = []

    constructor(tripInfoContainer, pointsModel) {
      this.#pointsModel = pointsModel;
      this.#tripInfoContainer = tripInfoContainer;
      this.#pointsModel.addObserver(this.#handleModelEvent);
    }

    init = () => {
      const prevTripInfoComponent = this.#tripInfoComponent;
      this.#points = this.#pointsModel.points.sort(sortByDate);

      if (!this.#points.length && prevTripInfoComponent === null) {return;}

      if (!this.#points.length && prevTripInfoComponent !== null) {
        removeElement(prevTripInfoComponent);
        return;
      }

      this.#tripInfoComponent = new TripInfoView(this.#points);

      if (prevTripInfoComponent === null) {
        render(this.#tripInfoContainer, this.#tripInfoComponent, RenderPosition.AFTERBEGIN);
        return;
      }

      replaceElements(this.#tripInfoComponent, prevTripInfoComponent);
      removeElement(prevTripInfoComponent);
    }

    #handleModelEvent = () => {
      this.init();
    }
}
