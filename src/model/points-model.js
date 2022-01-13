import AbstractObservable from '../utils/abstract-observable';
import {UpdateType} from '../conts';
import Adapter from '../adapter';

export default class PointsModel extends AbstractObservable {
    #apiService = null;
    #points = [];
    #towns = []
    #allOffers = []
    #adapter = new Adapter()

    constructor(apiService) {
      super();
      this.#apiService = apiService;
    }


    get points() {
      return this.#points;
    }

    get allOffers() {
      return this.#allOffers;
    }

    get towns() {
      return this.#towns;
    }

    init = async () => {
      try {
        const pointsFromServer = await this.#apiService.points;
        this.#points = this.#adapter.convertPointsToClient(pointsFromServer);

        const townsFromServer = await this.#apiService.towns;
        this.#towns = this.#adapter.convertTownsToClient(townsFromServer);

        const allOffers = await this.#apiService.offers;
        this.#allOffers = allOffers;

      } catch (err) {
        this.#points = [];
        this._notify(UpdateType.ERROR);
      }

      this._notify(UpdateType.INIT);
    }

    updatePoint = async (updateType, update) => {
      const index = this.#points.findIndex((item) => item.id === update.id);

      if (index === -1) {
        throw new Error('Can\'t update unexisting task');
      }

      try {
        const response = await this.#apiService.updatePoint(update);
        const updatedPoint = this.#adapter.convertOnePointToClient(response);

        this.#points.splice(index, 1, updatedPoint);

        this._notify(updateType, updatedPoint);
      } catch(err) {
        throw new Error('Can\'t update point:', err);
      }

    }

    addPoint = async (updateType, update) => {
      try {
        const response = await this.#apiService.addPoint(update);
        const newPoint = this.#adapter.convertOnePointToClient(response);

        this.#points.unshift(newPoint);
        this._notify(updateType, newPoint);

      } catch (err) {
        throw new Error('Can\'t add task', err);
      }
    }

    deletePoint = async (updateType, update) => {
      const index = this.#points.findIndex((item) => item.id === update.id);

      if (index === -1) {
        throw new Error('Can\'t delete unexisting task');
      }

      try {
        await this.#apiService.deletePoint(update);

        this.#points.splice(index, 1);
        this._notify(updateType);
      } catch(err) {
        throw new Error('Can\'t delete task', err);
      }
    }

}
