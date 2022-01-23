import AbstractView from './abstract-view';
import {FilterType} from '../const';

const FilterToTextMap = {
  [FilterType.ALL]: 'Click New Event to create your first point',
  [FilterType.PAST]: 'There are no past events now',
  [FilterType.FUTURE]: 'There are no future events now',
};


const createEmptyListTemplate = (filterType) => {
  const text = FilterToTextMap[filterType];
  return (`<p class="trip-events__msg">${text}</p>`);};

export default class EmptyListView extends AbstractView {
  #filterType

  constructor(filterType) {
    super();
    this.#filterType = filterType;
  }

  get template() {
    return createEmptyListTemplate(this.#filterType);
  }
}
