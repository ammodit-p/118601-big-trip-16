import dayjs from 'dayjs';
import  { PointTitleMap, pointTypes} from '../conts';
import SmartView from './smart-view';
import flatpickr from 'flatpickr';

import '../../node_modules/flatpickr/dist/flatpickr.min.css';

const createEditablePointTemplate = ({
  availableOffers=[],
  offers = [],
  towns = [],
  id = '',
  type = '',
  destination: {
    town = '',
    info = '',
    img = [],
  },
  isSaveButtonDisabled,
  isDisabled,
  isSaving,
  isDeleting,
  startDate = dayjs(Date.now),
  endDate  = dayjs(Date.now),
  price = ''}) => {
  const isNewPoint = !id;
  const getDeletCancelButtonText = () => {
    if (isNewPoint) {return 'Cancel';}
    if (!isNewPoint && isDeleting) {return 'Deleting...';}
    if (!isNewPoint && !isDeleting) {return 'Delete';}
    return '';
  };

  return(
    `<li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/flight.png" alt="Event type icon">
          </label>
          <input ${isDisabled ? 'disabled' : ''} class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

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
          <input class="event__input  event__input--destination" id="event-destination-${id}" type="text" name="event-destination" value="${town}" list="destination-list-${id}" ${isDisabled ? 'disabled' : ''}>
          <datalist id="destination-list-${id}">
            ${towns.map((item) => (`
              <option value="${item.town}"></option>
            `)).join('')}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-startDate-time-1">From</label>
          <input ${isDisabled ? 'disabled' : ''} class="event__input  event__input--time" id="event-startDate-time-${id}" type="text" name="event-startDate-time" value="${startDate ? startDate.format('DD/MM/YYYY HH:MM') : ''}">
          &mdash;
          <label class="visually-hidden" for="event-endDate-time-1">To</label>
          <input ${isDisabled ? 'disabled' : ''} class="event__input  event__input--time" id="event-endDate-time-${id}" type="text" name="event-endDate-time" value="${endDate ? endDate.format('DD/MM/YYYY HH:MM') : ''}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input ${isDisabled ? 'disabled' : ''} class="event__input  event__input--price" id="event-price-${id}" type="number" name="event-price" value="${price}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit" ${isSaveButtonDisabled || isDisabled ? 'disabled' : ''}>${isSaving ? 'Saving...' : 'Save'}</button>
        <button class="event__reset-btn" type="reset" ${isDisabled ? 'disabled' : ''}>${getDeletCancelButtonText()}</button>
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
                <input ${isDisabled ? 'disabled' : ''} class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.id}" type="checkbox" name="event-offer-${offer.id}" ${offers?.some((o) => o.id === offer.id) ? 'checked' : ''}>
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
              <img class="event__photo" src="${i.src}" alt="${i.description}">
            `).join('')}

            </div>
          </div>
        </section>
      </section>
    </form>
  </li>`
  );};

export default class EditablePointView extends SmartView {
    #datepicker = []
    #allOffers = []
    #towns = []

    constructor(point, allOffers, towns) {
      super();
      this.#towns = towns;
      this.#allOffers = allOffers;

      this._data = this.#parsePointToData(point);

      this.#setInnerHandlers();
      this.#setDatepicker();
    }

    get template() {
      return createEditablePointTemplate(this._data);
    }

    setFormCloseHandler = (callback) => {
      this._callback.formClose = callback;
      this.element.querySelector('.event__rollup-btn').addEventListener('click',
        this.#handleFormClose
      );
    }

    setFormSubmitHandler = (callback) => {
      this._callback.formSubmit = callback;
      this.element.querySelector('form').addEventListener('submit', this.#handleFormSubmit);
    }

    setPointDeleteHandler = (callback) => {
      this._callback.deleteClick = callback;
      this.element.querySelector('.event__reset-btn').addEventListener('click', this.#handleDeleteReset);
    }

    setPointCancelHandler = (callback) => {
      this._callback.cancelClick = callback;
      this.element.querySelector('.event__reset-btn').addEventListener('click', this.#handleDeleteReset);

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
        this.#parsePointToData(point)
      );
    }

    #parsePointToData = (point) => {
      if (!point) {return {};}

      if (!point.destination) {
        point.destination = this.#towns[0];
      }

      const availableOffers = this.#getAvailableOffers(point.type);
      const towns = this.#towns;
      const isDisabled = point.isDisabled ? point.isDisabled : false;
      const isSaveButtonDisabled = this.#checkIsSaveButtonDisabled({...point, isDisabled});
      return {
        ...point,
        availableOffers,
        isSaveButtonDisabled,
        towns,
        isDisabled,
        isSaving: false,
        isDeleting: false
      };
    }

    #getAvailableOffers = (type) => this.#allOffers?.find((item) => item.type === type)?.offers

    #parseDataToPoint = (data) => {
      const point = {...data};

      delete point.availableOffers;
      delete point.isSaveButtonDisabled;
      delete point.towns;
      delete point.isDisabled;
      delete point.isSaving;
      delete point.isDeleting;

      return point;
    }

    #checkIsSaveButtonDisabled = (point) => !this.#towns?.some((item) => item.town === point.destination.town) || Number(point.price) < 1 || point.isDisabled

    #setInnerHandlers = () => {
      this.element.querySelector('.event__type-group')
        .addEventListener('click', this.#handlePointTypeChange);

      this.element.querySelector('.event__input--destination')
        .addEventListener('change', this.#handleTownChange);

      this.element.querySelector('.event__input--price')
        .addEventListener('change', this.#handlePriceChange);

      this.element.querySelector('.event__details')
        .addEventListener('click', this.#handleOfferChange);
    }

    #setDatepicker = () => {
      const startDatepicker = flatpickr(
        this.element.querySelector(`#event-startDate-time-${this._data.id}`),
        {
          enableTime: true,
          dateFormat: 'd/m/Y H:i',
          defaultDate: this._data.startDate.toDate() || Date.now(),
          onChange: this.#handleStartDateChange,
        },
      );

      const endDatepicker = flatpickr(
        this.element.querySelector(`#event-endDate-time-${this._data.id}`),
        {
          enableTime: true,
          dateFormat: 'd/m/Y H:i',
          defaultDate:  this._data.endDate.toDate() ||Date.now(),
          onChange: this.#handleEndDateChange,
        },

      );

      this.#datepicker.push(startDatepicker);
      this.#datepicker.push(endDatepicker);


    }

    #handleStartDateChange = ([date], _, instance) => {
      const startDate = dayjs(date);
      this.updateData({startDate});
      instance.close();
    }

    #handleEndDateChange = ([date], _, instance) => {
      const endDate = dayjs(date);
      this.updateData({endDate});
      instance.close();
    }

    #handlePointTypeChange = (evt) => {
      if (evt.target.tagName !== 'LABEL') {return;}

      const type = evt.target.dataset.pointType;

      if (type === this._data.type) {return;}

      this.updateDataWithElement({type, availableOffers: this.#getAvailableOffers(type),  offers: []});
    }

    #handleTownChange = (evt) => {
      if (evt.target.tagName !== 'INPUT') {return;}
      evt.preventDefault();
      const town = evt.target.value;

      if (town === this._data.destination.town) {return;}
      const isSaveButtonDisabled = this.#checkIsSaveButtonDisabled({...this._data, destination: {town}});
      const destination = this.#towns.find((item) => item.town === town);
      this.updateDataWithElement({town, destination, isSaveButtonDisabled});

    }

    #handlePriceChange = (evt) => {
      const price = evt.target.value;
      const isSaveButtonDisabled = this.#checkIsSaveButtonDisabled({...this._data, price});
      this.updateDataWithElement({price, isSaveButtonDisabled});
    }

    #handleOfferChange = (evt) => {
      if( evt.target.tagName === 'SPAN' || evt.target.tagName === 'LABEL') {

        if (this._data.isDisabled) {return;}

        const offerId = Number(evt.target.dataset.offerId);
        const isOfferSelected = this._data.offers.some((offer) => offer.id === offerId);


        if (isOfferSelected) {
          this._data.offers = [...this._data.offers.filter((item) =>  item.id !== offerId)];
        }
        if (!isOfferSelected) {
          const offer = this._data.availableOffers.find((item) => item.id === offerId);
          this._data.offers.push(offer);
        }

        this.updateElement();
      }

    }

    #handleFormClose = (evt) => {
      evt.preventDefault();
      this._callback.formClose();
    }

    #handleFormSubmit = (evt) => {
      evt.preventDefault();
      this._callback.formSubmit(this.#parseDataToPoint(this._data));
    }

    #handleDeleteReset = (evt) => {
      evt.preventDefault();

      if (this._data && this._data.id) {
        this._callback.deleteClick();
        return;
      }

      this._callback.cancelClick();
    }
}
