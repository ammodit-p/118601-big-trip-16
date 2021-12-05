import dayjs from 'dayjs';
import {PointTypeEnum, PointTitleMap} from '../conts';
import {getSelectedOffers} from '../utils';
import duration from 'dayjs/plugin/duration';
import {createElement} from '../render.js';

dayjs.extend(duration);


const imgTypeMap = {
  [PointTypeEnum.CHECK_IN]: 'img/icons/check-in.png',
  [PointTypeEnum.BUS]: 'img/icons/bus.png',
  [PointTypeEnum.DRIVE]: 'img/icons/drive.png',
  [PointTypeEnum.FLIGHT]: 'img/icons/flight.png',
  [PointTypeEnum.RESTAURANT]: 'img/icons/restaurant.png',
  [PointTypeEnum.SHIP]: 'img/icons/ship.png',
  [PointTypeEnum.SIGHTSEEING]: 'img/icons/sightseeing.png',
  [PointTypeEnum.TAXI]: 'img/icons/taxi.png',
  [PointTypeEnum.TRAIN]: 'img/icons/train.png',
};

const createPointTemplate = ({ type, town, startDate, endDate, offers, isFavourite, price}) => {

  const selectedOffers = getSelectedOffers(offers, type);

  const totalPrice = () => price + selectedOffers.reduce((sum, offer)=> sum + Number(offer.price), 0);

  const getDiffTime = () => {

    const diff = dayjs.duration(endDate - startDate);

    const hours = diff.format('HH');

    if (hours === 0) {

      return `${diff.format('mm')  }M`;
    }

    if (hours > 24) {
      return `${diff.format('DD')}D ${hours}H ${diff.format('mm')}M`;
    }

    if (hours < 24) {
      return `${hours}H ${diff.format('mm')}M`;
    }

  };


  return (
    `<li class="trip-events__item">
    <div class="event">
      <time class="event__date" datetime="${startDate.format('YYYY-MM-DD')}">${startDate.format('MMM D')}</time>
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="${imgTypeMap[type]}" alt="Event type icon">
      </div>
      <h3 class="event__title">${PointTitleMap[type]} ${town}</h3>
      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="${startDate.format('YYYY-MM-DDTHH:MM')}">${startDate.format('HH:mm')}</time>
          &mdash;
          <time class="event__end-time" datetime="${endDate.format('YYYY-MM-DDTHH:MM')}">${endDate.format('HH:mm')}</time>
        </p>
        <p class="event__duration">${getDiffTime()}</p>
      </div>
      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${totalPrice()}</span>
      </p>
      <h4 class="visually-hidden">Offers:</h4>
      <ul class="event__selected-offers">
          ${selectedOffers.map((offer) => (`
          <li class="event__offer">
            <span class="event__offer-title">${offer.title}</span>
            &plus;&euro;&nbsp;
            <span class="event__offer-price">${offer.price}</span>
          </li>
        `)).join('')}
      </ul>
      <button class="event__favorite-btn event__favorite-btn${isFavourite ? '--active': ''}" type="button">
        <span class="visually-hidden">Add to favorite</span>
        <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
          <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
        </svg>
      </button>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>
  </li>`
  );};

export default class PointView {
  #element = null
  #point = null

  constructor(point) {
    this.#point = point;
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createPointTemplate(this.#point);
  }

  removeElement() {
    this.#element = null;
  }
}
