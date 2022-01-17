import AbstractView from './abstract-view';

const createErrorTemplate = () => (
  '<p class="trip-events__msg">Something went wrong :(</p>'
);

export default class ErrorView extends AbstractView {
  get template() {
    return createErrorTemplate();
  }
}

