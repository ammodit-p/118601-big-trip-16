export const pointView = ({title, date, start, end, offers, totalPrice, isFavourite, type}) => (`
  <div class="event">
    <time class="event__date" datetime="${date}">${new Date(date).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric'
  }).toUpperCase()}</time>
    <div class="event__type">
      <img class="event__type-icon" width="42" height="42" src="${type}" alt="Event type icon">
    </div>
    <h3 class="event__title">${title}</h3>
    <div class="event__schedule">
      <p class="event__time">
        <time class="event__start-time" datetime="${start}">${new Date(start).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  })}</time>
        &mdash;
        <time class="event__end-time" datetime="${end}">11:00</time>
      </p>
      <p class="event__duration">${new Date(new Date(start) - new Date(end)).getMinutes()}M</p>
    </div>
    <p class="event__price">
      &euro;&nbsp;<span class="event__price-value">${totalPrice}</span>
    </p>
    <h4 class="visually-hidden">Offers:</h4>
    <ul class="event__selected-offers">
        ${offers.map((offer) => (`
        <li class="event__offer">
          <span class="event__offer-title">${offer.title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${offer.price}</span>
        </li>
        `))}
    </ul>
    <button class="event__favorite-btn event__favorite-btn${isFavourite ? '--active': ''}" type="button">
      <span class="visually-hidden">Add to favorite</span>
      <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
        <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
      </svg>
    </button>
    <button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
    </button>
  </div>
`);
