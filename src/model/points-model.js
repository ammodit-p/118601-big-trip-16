import AbstractObservable from '../utils/abstract-observable';


export default class PointsModel extends AbstractObservable {
    #points = []

    set points(points) {
      this.#points = [...points];
    }

    get points() {
      return this.#points;
    }

    updatePoint = (updateType, update) => {
      const index = this.#points.findIndex((item) => item.id === update.id);

      if (index === -1) {
        throw new Error('Can\'t update unexisting task');
      }

      this.#points.splice(index, 1, update);

      this._notify(updateType, update);
    }

    addPoint = (updateType, update) => {
      this.#points.unshift(update);

      this._notify(updateType, update);
    }

    deletePoint = (updateType, update) => {
      const index = this.#points.findIndex((item) => item.id === update.id);

      if (index === -1) {
        throw new Error('Can\'t update unexisting task');
      }

      this.#points.splice(index, 1);
      this._notify(updateType);
    }

}
