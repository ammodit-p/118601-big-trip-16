import AbstractView from './abstract-view';

const createloadingTemplate = () => (
  '<p class="trip-events__msg">Loading...</p>'
);

export default class LoadingView extends AbstractView {
  get template() {
    return createloadingTemplate();
  }
}

