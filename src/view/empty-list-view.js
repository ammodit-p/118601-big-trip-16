import AbstractView from './abstract-view';


const createEmptyListTemplate = () => ('<p class="trip-events__msg">Click New Event to create your first point</p>');

export default class EmptyListView extends AbstractView {
  get template() {
    return createEmptyListTemplate();
  }
}
