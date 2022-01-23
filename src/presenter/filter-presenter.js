
import FiltersView from '../view/filters-view';
import {render, RenderPosition, replaceElements, removeElement} from '../render';
import {UpdateType} from '../const';
import {filters} from '../utils/filters';
import {FilterType} from '../const';

export default class FilterPresenter {
    #filterContainer = null;
    #filterModel = null;
    #pointsModel = null;

    #filterComponent = null;

    constructor(filterContainer, filterModel, pointsModel) {
      this.#filterContainer = filterContainer;
      this.#filterModel = filterModel;
      this.#pointsModel = pointsModel;

      this.#filterModel.addObserver(this.#handleModelEvent);
      this.#pointsModel.addObserver(this.#handleModelEvent);
    }

    init = () => {
      const prevFilterComponent = this.#filterComponent;
      const disabledFilteres = {
        future: !filters[FilterType.FUTURE](this.#pointsModel.points).length,
        past: !filters[FilterType.PAST](this.#pointsModel.points).length
      };

      this.#filterComponent = new FiltersView(this.#filterModel.filter, disabledFilteres);
      this.#filterComponent.sethandleFilterTypeChange(this.#handleFilterTypeChange);

      if (prevFilterComponent === null) {
        render(this.#filterContainer, this.#filterComponent, RenderPosition.BEFOREEND);
        return;
      }

      replaceElements(this.#filterComponent, prevFilterComponent);
      removeElement(prevFilterComponent);
    }

    destroy = () => {
      this.#clearFilter();
      this.#filterComponent = null;
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

    #clearFilter = () => {
      this.#filterModel.resetDefaultFilter();
      removeElement(this.#filterComponent);
    }
}
