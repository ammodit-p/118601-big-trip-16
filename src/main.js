import {filtersView} from './view/filters-view';
import {menuView} from './view/menu-view';
import {sortingView} from './view/sorting-view';
import {editPointView} from './view/edit-point-view';
import {addNewPointView} from './view/add-new-point-view';
import {pointsListView} from './view/point-list-view';
import {pointView} from './view/point-view';

const tripPoints = [{
  id: 1,
  title: 'Taxi Amsterdam',
  // Будет тип, и по типу будем брать картинку
  type: 'img/icons/taxi.png',
  date: '2019-03-18',
  start:'2019-03-18T10:30',
  end: '2019-03-18T11:00',
  offers: [{
    title: 'Order Uber',
    price: '20'
  }],
  totalPrice: '20',
  isFavourite: false
},
{
  id: 2,
  title: 'Flight Chamonix',
  type: 'img/icons/flight.png',
  date: '2019-03-18',
  start:'2019-03-18T12:25',
  end: '2019-03-18T13:35',
  offers: [{
    title: 'Add luggage',
    price: '50'
  },{
    title: 'Switch to comfort',
    price: '80'
  }],
  totalPrice: '160',
  isFavourite: true
},
{
  id: 3,
  title: 'Drive Chamonix',
  type: 'img/icons/drive.png',
  date: '2019-03-18',
  start:'2019-03-18T14:30',
  end: '2019-03-18T16:05',
  offers: [{
    title: 'Rent a car',
    price: '200'
  }],
  // Подозреваю что это опечатка в верстке, общая цена меньше
  totalPrice: '160',
  isFavourite: false
}, ];

const RenderPosition = {
  BEFOREBEGIN: 'beforebegin',
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
  AFTEREND: 'afterend',
};


const render =(container, markup, position) => {
  container.insertAdjacentHTML(position, markup);
};

const navigationContainerElement = document.querySelector('.trip-controls__navigation');
render(navigationContainerElement, menuView(), RenderPosition.BEFOREEND);

const filtersContainerElement = document.querySelector('.trip-controls__filters');
render(filtersContainerElement, filtersView(), RenderPosition.BEFOREEND);


const eventsElementContainer = document.querySelector('.trip-events');
render(eventsElementContainer, sortingView(), RenderPosition.BEFOREEND);

const POINTS = [editPointView(), ...tripPoints.map((point)=>pointView(point)), addNewPointView()];
render(eventsElementContainer,pointsListView(POINTS),RenderPosition.BEFOREEND);


