import dayjs from 'dayjs';
import  { PointTitleMap, pointTypes, TOWNS} from '../conts';
import {OFFERS} from '../mock/offers';
import {getSelectedOffers} from '../utils/points';
import SmartView from './smart-view';
import flatpickr from 'flatpickr';
import { getTownImages} from '../utils/common';

import '../../node_modules/flatpickr/dist/flatpickr.min.css';

const getAvailableOffers = (type) => OFFERS.find((i) => i.type === type).offers;

const checkIsDisabled = (town) => !TOWNS.some((item) => item === town);

const createEditablePointTemplate = ({
  availableOffers=[],
  selectedOffers=[],
  id = '',
  type = '',
  town = '',
  info = '',
  img = [],
  isDisabled,
  startDate = dayjs(Date.now),
  endDate  = dayjs(Date.now),
  price = ''}) => (
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
                  <label data-point-type=${p} class="event__type-label  event__type-label--${p}" for="event-type-${p}-${id}">${PointTitleMap[p]}</label>
                </div>
              `)).join('')}

            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${PointTitleMap[type]}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-${id}" type="text" name="event-destination" value="${town}" list="destination-list-${id}">
          <datalist id="destination-list-${id}">
            ${TOWNS.map((t) => (`
              <option value="${t}"></option>
            `)).join('')}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-startDate-time-1">From</label>
          <input class="event__input  event__input--time" id="event-startDate-time-${id}" type="text" name="event-startDate-time" value="${startDate ? startDate.format('DD/MM/YYYY HH:MM') : ''}">
          &mdash;
          <label class="visually-hidden" for="event-endDate-time-1">To</label>
          <input class="event__input  event__input--time" id="event-endDate-time-${id}" type="text" name="event-endDate-time" value="${endDate ? endDate.format('DD/MM/YYYY HH:MM') : ''}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-${id}" type="number" name="event-price" value="${price}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabled ? 'disabled' : ''}>Save</button>
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
                <input  class="event__offer-checkbox  visually-hidden" id="event-offer-1" type="checkbox" name="event-offer-${offer.id}" ${selectedOffers.some((o) => o.id === offer.id) ? 'checked' : ''}>
                <label data-offer-id="${offer.id}" class="event__offer-label" for="event-offer-${offer.id}">
                  <span  data-offer-id="${offer.id}" class="event__offer-title">${offer.title}</span>
                  &plus;&euro;&nbsp;
                  <span  data-offer-id="${offer.id}" class="event__offer-price">${offer.price}</span>
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
);

export default class EditablePointView extends SmartView {
    #datepicker = []

    constructor(point) {
      super();
      this._data = EditablePointView.parsePointToData(point);

      this.#setInnerHandlers();
      this.#setDatepicker();
    }

    get template() {
      return createEditablePointTemplate(this._data);
    }

    static parsePointToData = (point) => {
      if (!point) {return {};}
      const availableOffers = getAvailableOffers(point.type);
      const selectedOffers = getSelectedOffers(point.offers, point.type);
      const img = getTownImages(point.town);
      const isDisabled = checkIsDisabled(point.town);
      return {...point, availableOffers, selectedOffers, img, isDisabled};
    }

    static parseDataToPoint = (data) => {
      const point = {...data};
      point.offers = [...data.selectedOffers.map((offer) => offer.id)];
      delete point.availableOffers;
      delete point.selectedOffers;
      delete point.isDisabled;

      return point;
    }

    #setInnerHandlers = () => {
      this.element.querySelector('.event__type-group')
        .addEventListener('click', this.#pointTypeChangeHandler);

      this.element.querySelector('.event__input--destination')
        .addEventListener('change', this.#townChangeHandler);

      this.element.querySelector('.event__input--price')
        .addEventListener('change', this.#priceChangeHandler);

      this.element.querySelector('.event__details')
        .addEventListener('click', this.#offerChangeHandler);
    }

    #setDatepicker = () => {
      const startDatepicker = flatpickr(
        this.element.querySelector(`#event-startDate-time-${this._data.id}`),
        {
          enableTime: true,
          dateFormat: 'd/m/Y H:i',
          defaultDate: this._data.startDate.toDate() || Date.now(),
          onChange: this.#startDateChangeHandler,
        },
      );

      const endDatepicker = flatpickr(
        this.element.querySelector(`#event-endDate-time-${this._data.id}`),
        {
          enableTime: true,
          dateFormat: 'd/m/Y H:i',
          defaultDate:  this._data.endDate.toDate() ||Date.now(),
          onChange: this.#endDateChangeHandler,
        },

      );

      this.#datepicker.push(startDatepicker);
      this.#datepicker.push(endDatepicker);


    }

    #startDateChangeHandler = ([date], _, instance) => {
      const startDate = dayjs(date);
      this.updateData({startDate});
      instance.close();
    }

    #endDateChangeHandler = ([date], _, instance) => {
      const endDate = dayjs(date);
      this.updateData({endDate});
      instance.close();
    }

    #pointTypeChangeHandler = (evt) => {
      if (evt.target.tagName !== 'LABEL') {return;}

      const type = evt.target.dataset.pointType;

      if (type === this._data.type) {return;}

      this.updateDataWithElement({type, availableOffers: getAvailableOffers(type),  selectedOffers: []});
    }

    #townChangeHandler = (evt) => {
      if (evt.target.tagName !== 'INPUT') {return;}
      evt.preventDefault();
      const town = evt.target.value;

      if (town === this._data.town) {return;}
      const isDisabled = checkIsDisabled(town);
      const img = getTownImages(town);
      this.updateDataWithElement({town, img, isDisabled});

    }

    #priceChangeHandler = (evt) => {
      const price = evt.target.value;
      this.updateData({price});
    }

    #offerChangeHandler = (evt) => {
      if( evt.target.tagName === 'SPAN' || evt.target.tagName === 'LABEL') {

        const offerId = evt.target.dataset.offerId;
        const offer = this._data.availableOffers.find((item) => item.id === offerId);
        const isOfferSelected = this._data.selectedOffers.includes(offer);

        if (isOfferSelected) {
          this._data.selectedOffers = [...this._data.selectedOffers.filter((item) =>  item.id !== offerId)];
        }
        if (!isOfferSelected) {
          this._data.selectedOffers.push(offer);
        }

        this.updateElement();
      }

    }


    #formCloseHandler = (evt) => {
      evt.preventDefault();
      this._callback.formClose();
    }

    #formSubmitHandler = (evt) => {
      evt.preventDefault();
      this._callback.formSubmit(EditablePointView.parseDataToPoint(this._data));
    }

    #deleteResethandler = (evt) => {
      evt.preventDefault();

      if (this._data && this._data.id) {
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

    removeElement =() =>{
      super.removeElement();

      if (this.#datepicker) {
        this.#datepicker.forEach((item) => item.destroy());
        this.#datepicker = [];
      }
    }

    restoreHandlers = () => {
      this.#setInnerHandlers();
      this.#setDatepicker();
      this.setFormSubmitHandler(this._callback.formSubmit);
    }

    reset = (point) => {
      this.updateDataWithElement(
        EditablePointView.parsePointToData(point)
      );
    }
}
