import EditablePointView from '../view/editable-point-view';
import dayjs from 'dayjs';
import  { pointTypes } from '../conts';

import {removeElement, render, RenderPosition} from '../render';
import {UserAction, UpdateType} from '../conts';

export default class PointNewPresenter {
  #pointListContainer = null;
  #changeData = null;
  #pointEditComponent = null;
  #addEventButton = document.querySelector('.trip-main__event-add-btn');
  #emptyPoint = {
    id: '',
    type: pointTypes[0],
    startDate: dayjs(Date.now()),
    endDate: dayjs(Date.now()),
    price: '',
    isFavourite: false,
    offers: []
  }

  constructor(pointListContainer, changeData) {
    this.#pointListContainer = pointListContainer;
    this.#changeData = changeData;
  }

  init = (allOffers, towns) => {
    if (this.#pointEditComponent !== null) {
      return;
    }
    this.#pointEditComponent = new EditablePointView(this.#emptyPoint, allOffers, towns);
    this.#pointEditComponent.setFormSubmitHandler(this.#handleFormSubmit);
    this.#pointEditComponent.setPointCancelHandler(this.#handleDeleteClick);


    render(this.#pointListContainer, this.#pointEditComponent, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.#handleEscKeyDown);
  }

  setSaving = () => {
    this.#pointEditComponent.updateDataWithElement({
      isDisabled: true,
      isSaving: true,
    });
  }

  setAborting = () => {
    const resetFormState = () => {
      this.#pointEditComponent.updateDataWithElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#pointEditComponent.shake(resetFormState);
  }

  destroy = () => {
    if (this.#pointEditComponent === null) {
      return;
    }

    removeElement(this.#pointEditComponent);
    this.#pointEditComponent = null;

    document.removeEventListener('keydown', this.#handleEscKeyDown);
    this.#addEventButton.disabled = false;
  }

  #handleFormSubmit = (point) => {

    this.#changeData(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      point,
    );
  }

  #handleDeleteClick = () => {
    this.destroy();
  }

  #handleEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  }
}
