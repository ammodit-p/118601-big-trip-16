import  { PointTitleMap, pointTypes, TOWNS} from '../conts';
import {OFFERS} from '../mock/offers';
import {getSelectedOffers} from '../utils';
import AbstractView from './abstract-view';


const createEditablePointTemplate = ({id = '', type = '', town = '', info = '', img = '', startDate = '', endDate  = '', offers = [],  price = ''}) => {

  const availableOffers = OFFERS.find((i) => i.type === type).offers;

  const selectedOffers = getSelectedOffers(offers, type);

  const totalPrice = price + selectedOffers.reduce((sum, offer)=> sum + Number(offer.price), 0);


  return (
    `<li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/flight.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>

              ${pointTypes.map((p) => (`
                <div class="event__type-item">
                  <input id="event-type-${p}-${id}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${p}">
                  <label class="event__type-label  event__type-label--${p}" for="event-type-${p}-${id}">${PointTitleMap[p]}</label>
                </div>
              `)).join('')}

            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${PointTitleMap[type]}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${town}" list="destination-list-1">
          <datalist id="destination-list-1">
            ${TOWNS.map((t) => (`
              <option value="${t}"></option>
            `)).join('')}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-startDate-time-1">From</label>
          <input class="event__input  event__input--time" id="event-startDate-time-1" type="text" name="event-startDate-time" value="${startDate ? startDate.format('DD/MM/YYYY HH:MM') : ''}">
          &mdash;
          <label class="visually-hidden" for="event-endDate-time-1">To</label>
          <input class="event__input  event__input--time" id="event-endDate-time-1" type="text" name="event-endDate-time" value="${endDate ? endDate.format('DD/MM/YYYY HH:MM') : ''}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${totalPrice}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">${id ? 'Delete' : 'Cancel'}</button>
        ${id ? `
          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
      ` : ''}
      </header>
      <section class="event__details">
        ${availableOffers.length ? `<section class="event__section  event__section--offers">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>

          <div class="event__available-offers">
          ${availableOffers.map((offer) => (`
              <div class="event__offer-selector">
                <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.id}" type="checkbox" name="event-offer-${offer.id}" ${selectedOffers.some((o) => o.id === offer.id) ? 'checked' : ''}>
                <label class="event__offer-label" for="event-offer-${offer.id}">
                  <span class="event__offer-title">${offer.title}</span>
                  &plus;&euro;&nbsp;
                  <span class="event__offer-price">${offer.price}</span>
                </label>
              </div>
          `)).join('')}
          </div>
        </section>` : ''}

        <section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          <p class="event__destination-description">${info}</p>

          <div class="event__photos-container">
            <div class="event__photos-tape">
            ${img.map((i) => `
              <img class="event__photo" src="${i}" alt="Event photo">
            `).join('')}

            </div>
          </div>
        </section>
      </section>
    </form>
  </li>`
  );};

export default class EditablePointView extends AbstractView {
    #point = null

    constructor(point) {
      super();
      this.#point = point;
    }

    get template() {
      return createEditablePointTemplate(this.#point);
    }

    #formCloseHandler = (evt) => {
      evt.preventDefault();
      this._callback.formClose();
    }

    #formSubmitHandler = (evt) => {
      evt.preventDefault();
      this._callback.formSubmit(this.#point);
    }

    #deleteResethandler = (evt) => {
      evt.preventDefault();

      if (this.#point && this.#point.id) {
        this._callback.deleteClick();
        return;
      }

      this._callback.cancelClick();
    }


    setFormCloseHandler = (callback) => {
      this._callback.formClose = callback;
      this.element.querySelector('.event__rollup-btn').addEventListener('click',
        this.#formCloseHandler
      );
    }

    setFormSubmitHandler = (callback) => {
      this._callback.formSubmit = callback;
      this.element.querySelector('form').addEventListener('submit', this.#formSubmitHandler);
    }

    setPointDeleteHandler = (callback) => {
      this._callback.deleteClick = callback;
      this.element.querySelector('.event__reset-btn').addEventListener('click', this.#deleteResethandler);
    }

    setPointCancelHandler = (callback) => {
      this._callback.cancelClick = callback;
      this.element.querySelector('.event__reset-btn').addEventListener('click', this.#deleteResethandler);

    }
}
