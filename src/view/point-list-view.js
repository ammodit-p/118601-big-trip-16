export const pointsListView = (items) => (`
  <ul class="trip-events__list">
    ${items.map((item) => (`
      <li class="trip-events__item">
        ${item}
      </li>
    `)).join('')}
  </ul>
`);
