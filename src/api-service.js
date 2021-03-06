import Adapter from './adapter';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE'
};

export default class ApiService {
    #endPoint = null;
    #authorization = null;
    #adapter = new Adapter();

    constructor(endPoint, authorization) {
      this.#endPoint = endPoint;
      this.#authorization = authorization;
    }

    get points() {
      return this.#load({url: 'points'})
        .then(this.#parseResponse);
    }

    get towns() {
      return this.#load({url:'destinations'})
        .then(this.#parseResponse);
    }

    get offers() {
      return this.#load({url:'offers'})
        .then(this.#parseResponse);
    }

    updatePoint = async (point) => {
      const response = await this.#load({
        url: `points/${point.id}`,
        method: Method.PUT,
        body: JSON.stringify(this.#adapter.convertPointToServer(point)),
        headers: new Headers({'Content-Type': 'application/json'}),
      });

      const parsedResponse = await this.#parseResponse(response);

      return parsedResponse;
    }

    addPoint = async (point) => {
      const response = await this.#load({
        url: 'points',
        method: Method.POST,
        body: JSON.stringify(this.#adapter.convertPointToServer(point)),
        headers: new Headers({'Content-Type': 'application/json'}),
      });

      const parsedResponse = await this.#parseResponse(response);
      return parsedResponse;

    }

    deletePoint = async ({id}) => {
      const response = await this.#load({
        url: `points/${id}`,
        method: Method.DELETE
      });
      return response;
    }

    #load = async ({
      url,
      method = Method.GET,
      body = null,
      headers = new Headers(),
    }) => {
      headers.append('Authorization', this.#authorization);

      const response = await fetch(
        `${this.#endPoint}/${url}`,
        {method, body, headers},
      );

      try {
        ApiService.checkStatus(response);
        return response;
      } catch (err) {
        ApiService.catchError(err);
      }
    }

    #parseResponse = async (response) => {
      const data = await response.json();
      return data;
    }

    static checkStatus = (response) => {
      if (!response.ok) {
        throw new Error(`${response.status}: ${response.statusText}`);
      }
    }

    static catchError = (err) => {
      throw err;
    }
}
