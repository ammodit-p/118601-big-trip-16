import AbstractView from './abstract-view';
import {FilterType} from '../conts';


const createFiltersTemplate = (filter) =>
  (
    `<form class="trip-filters" action="#" method="get">
        <div class="trip-filters__filter">
          <input id="filter-everything" data-filter-type="${FilterType.ALL}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="everything" ${filter === FilterType.ALL ? 'checked' : ''}>
          <label class="trip-filters__filter-label" for="filter-everything">Everything</label>
        </div>

        <div class="trip-filters__filter">
          <input id="filter-future" data-filter-type="${FilterType.FUTURE}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="future"  ${filter === FilterType.FUTURE ? 'checked' : ''}>
          <label class="trip-filters__filter-label" for="filter-future">Future</label>
        </div>

        <div class="trip-filters__filter">
          <input id="filter-past" data-filter-type="${FilterType.PAST}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="past" ${filter === FilterType.PAST ? 'checked' : ''}>
          <label class="trip-filters__filter-label" for="filter-past">Past</label>
        </div>

        <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`
  );

export default class FiltersView extends AbstractView {
  #currentFilter = null

  constructor(filter) {
    super();
    this.#currentFilter = filter;
  }

  get template() {
    return createFiltersTemplate(this.#currentFilter);
  }

  #filterTypeChangeHandler = (evt) => {
    if(evt.target.tagName !== 'INPUT') {return;}

    this._callback.filterTypeChange(evt.target.dataset.filterType);
  }

  setFilterTypeChangeHandler = (callback) => {
    this._callback.filterTypeChange = callback;
    this.element.addEventListener('click', this.#filterTypeChangeHandler);
  }


}
