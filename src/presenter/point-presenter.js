import EditablePointView from '../view/editable-point-view';
import PointView from '../view/point-view';
import {UserAction, UpdateType} from '../conts';

import {RenderPosition, render, replaceElements, removeElement} from '../render';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING'
};

export default class PointPresenter {
  #pointListContainer = null;
  #changeData = null;
  #changeMode = null;

  #pointComponent = null;
  #pointEditComponent = null;

  #point = null;
  #mode = Mode.DEFAULT;

  constructor(pointListContainer, changeData, changeMode) {
    this.#pointListContainer = pointListContainer;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
  }

  init = (point) => {
    this.#point = point;

    const prevPointComponent = this.#pointComponent;
    const prevEditComponent = this.#pointEditComponent;

    this.#pointComponent = new PointView(point);
    this.#pointEditComponent = new EditablePointView(point);

    this.#pointComponent.setEditClickHandler(this.#handleEditClick);
    this.#pointComponent.setFavouriteClickHandler(this.#handleFavouriteClick);
    this.#pointEditComponent.setPointDeleteHandler(this.#handleDelete);
    this.#pointEditComponent.setPointCancelHandler(this.#replaceFormToPoint);
    this.#pointEditComponent.setFormCloseHandler(this.#replaceFormToPoint);
    this.#pointEditComponent.setFormSubmitHandler(this.#handleFormSubmit);

    if (prevPointComponent === null && prevEditComponent === null) {
      render(this.#pointListContainer, this.#pointComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replaceElements(this.#pointComponent, prevPointComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replaceElements(this.#pointEditComponent, prevEditComponent);
    }

    removeElement(prevPointComponent);
    removeElement(prevEditComponent);
  }

  destroy = () => {
    removeElement(this.#pointEditComponent);
    removeElement(this.#pointComponent);
  }

  resetView = () => {
    if (this.#mode !== Mode.DEFAULT) {
      this.#pointEditComponent.reset(this.#point);
      this.#replaceFormToPoint();
    }
  }

  #replacePointToForm = () => {
    replaceElements(this.#pointEditComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#changeMode();
    this.#mode = Mode.EDITING;
  }

  #replaceFormToPoint = () => {
    replaceElements(this.#pointComponent, this.#pointEditComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      this.#pointEditComponent.reset(this.#point);
      evt.preventDefault();
      this.#replaceFormToPoint();
    }
  }

  #handleEditClick = () => {
    this.#replacePointToForm();
  }

  #handleFavouriteClick = () => {
    this.#changeData(UserAction.UPDATE_POINT, UpdateType.PATCH, {...this.#point, isFavourite: !this.#point.isFavourite});
  }

  #handleDelete = () => {
    this.#changeData(UserAction.DELETE_POINT, UpdateType.MINOR, this.#point);
  }

  #handleFormSubmit = (point) => {

    const isMinorChange = point.startDate !== this.#point.startDate
        || point.endDate !== this.#point.endDate
        || point.price !== this.#point.price;

    const updateType = isMinorChange ? UpdateType.MINOR : UpdateType.PATCH;

    this.#changeData(UserAction.UPDATE_POINT, updateType, point);
    this.#replaceFormToPoint();
  }
}
