import {OFFERS} from '../mock/offers';

export const getSelectedOffers = (offers = [], type) => offers.map((id) => (
  OFFERS.find((i) => i.type === type).offers.find((offer) => offer.id === id)
));

