import EditablePointView from '../view/editable-point-view';
import dayjs from 'dayjs';
import  { pointTypes } from '../conts';

import {nanoid} from 'nanoid';
import {removeElement, render, RenderPosition} from '../render';
import {UserAction, UpdateType} from '../conts';

export default class PointNewPresenter {
  #pointListContainer = null;
  #changeData = null;
  #pointEditComponent = null;
  #emptyPoint = {
    id: '',
    type: pointTypes[0],
    town: '',
    info: '',
    img: [],
    startDate: dayjs(Date.now()),
    endDate: dayjs(Date.now()),
    price: ''}

  constructor(pointListContainer, changeData) {
    this.#pointListContainer = pointListContainer;
    this.#changeData = changeData;
  }

  init = () => {
    if (this.#pointEditComponent !== null) {
      return;
    }
    this.#pointEditComponent = new EditablePointView(this.#emptyPoint);
    this.#pointEditComponent.setFormSubmitHandler(this.#handleFormSubmit);
    this.#pointEditComponent.setPointCancelHandler(this.#handleDeleteClick);


    render(this.#pointListContainer, this.#pointEditComponent, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  destroy = () => {
    if (this.#pointEditComponent === null) {
      return;
    }

    removeElement(this.#pointEditComponent);
    this.#pointEditComponent = null;

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #handleFormSubmit = (point) => {

    this.#changeData(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      {...point, id: nanoid()},
    );
    this.destroy();
  }

  #handleDeleteClick = () => {
    this.destroy();
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  }
}
