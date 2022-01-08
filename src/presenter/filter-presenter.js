
import FiltersView from '../view/filters-view';
import {render, RenderPosition, replaceElements, removeElement} from '../render';
import { UpdateType} from '../conts';

export default class FilterPresenter {
    #filterContainer = null;
    #filterModel = null;

    #filterComponent = null;

    constructor(filterContainer, filterModel) {
      this.#filterContainer = filterContainer;
      this.#filterModel = filterModel;

      this.#filterModel.addObserver(this.#handleModelEvent);
    }


    init = () => {
      const prevFilterComponent = this.#filterComponent;
      this.#filterComponent = new FiltersView(this.#filterModel.filter);
      this.#filterComponent.setFilterTypeChangeHandler(this.#handleFilterTypeChange);

      if (prevFilterComponent === null) {
        render(this.#filterContainer, this.#filterComponent, RenderPosition.BEFOREEND);
        return;
      }

      replaceElements(this.#filterComponent, prevFilterComponent);
      removeElement(prevFilterComponent);
    }

    #handleModelEvent = () => {
      this.init();
    }

    #handleFilterTypeChange = (filterType) => {
      if (this.#filterModel.filter === filterType) {
        return;
      }

      this.#filterModel.setFilter(UpdateType.MAJOR, filterType);
    }

}
