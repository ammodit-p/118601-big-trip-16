import {createElement} from '../render.js';
import {getSelectedOffers} from '../utils';

const createTripInfoTitleView = (points) => {

  const startDate = points[0].startDate;
  const endDate = points[points.length - 1].endDate;
  const firstCity = points[0].town;
  const lastCity = points[points.length - 1].town;

  const generateCities = () => {

    const town = new Set(points.map((i) => i.town).town);

    switch(town.size) {
      case 1: {
        return (`${firstCity}`);
      }

      case 2: {
        return (`${firstCity} &mdash; ${lastCity}`);
      }

      case 3: {
        return (`${firstCity} &mdash; ${points[1].town} &mdash; ${lastCity}`);
      }

      default: {
        return (`${firstCity} &mdash; ... &mdash; ${lastCity}`);
      }
    }
  };

  const selectedOffers = [...points.map(({offers, type}) => [...getSelectedOffers(offers, type)])].flat();


  const totalPrice = () => points.reduce((sum, point) => (sum + Number(point.price) + selectedOffers.reduce((s, offer) => (s + Number(offer.price)), 0)), 0);

  return (
    `<section class="trip-main__trip-info  trip-info">
      <div class="trip-info__main">
          <h1 class="trip-info__title">${generateCities()}</h1>
          <p class="trip-info__dates">${startDate.format('MMM D')}&nbsp;&mdash;&nbsp;${endDate.format('MMM D')}</p>
      </div>

      <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalPrice()}</span>
      </p>
    </section>`
  );
};

const createEmptyTripInfoTitleView = () => ('<section class="trip-main__trip-info  trip-info"></section>');
export default class TripInfoTitleView {
  #element = null
  #points = null

  constructor(points) {
    this.#points = points;
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    if (!this.#points.length) {
      return createEmptyTripInfoTitleView();
    } else {
      return createTripInfoTitleView(this.#points);
    }

  }

  removeElement() {
    this.#element = null;
  }
}

