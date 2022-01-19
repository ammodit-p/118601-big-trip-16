import dayjs from 'dayjs';
export default class Adapter {

  convertPointsToClient = (points) => points.map((item)=> this.#pointToClient(item))

  convertOnePointToClient = (point) => this.#pointToClient(point)

  convertPointToServer = (point) => this.#pointToServer(point)

  convertTownsToClient = (towns) => towns.map(this.#townToClient)

  #townToClient = (town) => ({
    town: town.name,
    info: town.description,
    img: town.pictures
  })

  #pointToClient = (point) => ({
    id: point.id,
    type: point.type,
    destination: {
      town: point.destination.name,
      info: point.destination.description,
      img: point.destination.pictures
    },
    startDate: dayjs(point['date_from']),
    endDate: dayjs(point['date_to']),
    offers: point.offers,
    isFavourite: point['is_favorite'],
    price: point['base_price']
  })

  #pointToServer = (point) => ({
    id: point.id,
    type: point.type,
    ['base_price']: Number(point.price),
    ['date_from']: new Date(point.startDate.format()).toISOString(),
    ['date_to']: new Date(point.endDate.format()).toISOString(),
    destination: {
      description: point.destination.info,
      name: point.destination.town,
      pictures: point.destination.img
    },
    ['is_favorite']: point.isFavourite,
    offers: point.offers
  })
}
