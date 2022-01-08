import TripInfoView from '../view/trip-info-view';
import {render, RenderPosition, replaceElements, removeElement} from '../render';
import {  sortByDate} from '../utils/common';

export default class TripInfoPresenter {
    #tripInfoContainer = null;
    #tripInfoComponent = null;
    #pointsModel = null;

    constructor(tripInfoContainer, pointsModel) {
      this.#pointsModel = pointsModel;
      this.#tripInfoContainer = tripInfoContainer;

      this.#pointsModel.addObserver(this.#handleModelEvent);
    }

    init = () => {
      const prevTripInfoComponent = this.#tripInfoComponent;
      this.#tripInfoComponent = new TripInfoView(this.#pointsModel.points.sort(sortByDate));

      if (prevTripInfoComponent === null) {
        render(this.#tripInfoContainer, this.#tripInfoComponent, RenderPosition.BEFOREEND);
        return;
      }

      replaceElements(this.#tripInfoComponent, prevTripInfoComponent);
      removeElement(prevTripInfoComponent);
    }

    #handleModelEvent = () => {
      this.init();
    }
}
