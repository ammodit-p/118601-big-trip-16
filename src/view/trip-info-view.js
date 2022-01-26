import AbstractView from './abstract-view';


const createTripInfoTitleView = (points) => {
  const startDate = points[0].startDate;
  const endDate = points[points.length - 1].endDate;
  const firstCity = points[0].destination.town;
  const lastCity = points[points.length - 1].destination.town;

  const generateCities = () => {

    switch(points.length) {
      case 0: {
        return '';
      }
      case 1: {
        return (`${firstCity}`);
      }

      case 2: {
        return (`${firstCity} &mdash; ${lastCity}`);
      }

      case 3: {
        return (`${firstCity} &mdash; ${points[1].destination.town} &mdash; ${lastCity}`);
      }

      default: {
        return (`${firstCity} &mdash; ... &mdash; ${lastCity}`);
      }
    }
  };

  const totalPrice = () => points.reduce((sum, point) => (sum + Number(point.price) + point.offers.reduce((s, offer) => (s + Number(offer.price)), 0)), 0);

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

const createEmptyTripInfoTitleView = () => ('');
export default class TripInfoView extends AbstractView {
  #points = null

  constructor(points) {
    super();
    this.#points = points;
  }

  get template() {
    if (!this.#points.length) {
      return createEmptyTripInfoTitleView();
    }
    return createTripInfoTitleView(this.#points);
  }
}

