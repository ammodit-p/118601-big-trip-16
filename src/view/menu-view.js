import SmartView from './smart-view';
import {MenuItem} from '../conts';

const createMenuTemplate = (menuItem) =>
  (
    `<nav class="trip-controls__trip-tabs  trip-tabs">
      ${Object.values(MenuItem).map((item) => (
      `<a class="trip-tabs__btn${menuItem === item ? ' trip-tabs__btn--active' : ''}" data-menu-item=${item} href="#">${item}</a>`
    )).join('')}
    </nav>`
  );

export default class MenuView extends SmartView {
  #currentMenuItem = MenuItem.TABLE
  constructor(menuItem) {
    super();
    this.#currentMenuItem = menuItem || MenuItem.TABLE;
  }

  get template() {
    return createMenuTemplate(this.#currentMenuItem);
  }

  restoreHandlers = () => {
    this.element.addEventListener('click', this.#menuClickHandler);
  }

  setMenuClickHandler = (callback) => {
    this._callback.menuClick = callback;
    this.element.addEventListener('click', this.#menuClickHandler);
  }

  setMenuItem = (menuItem) => {
    this.#currentMenuItem = menuItem;
    this.updateElement();
  }

  #menuClickHandler = (evt) => {
    evt.preventDefault();
    if (evt.target.tagName !== 'A') {
      return;
    }
    this._callback.menuClick(evt.target.dataset.menuItem);
    this.setMenuItem(evt.target.dataset.menuItem);
  }
}
