import { removeElement, render, RenderPosition } from '../render';
import StatisticView from '../view/statistic-view';
import {Chart} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {sortByPrice} from '../utils/common';
import {getDiffTime, getDuration} from '../utils/dayjs';
import dayjs from 'dayjs';
import {UpdateType} from '../conts';

import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

const BAR_HEIGHT = 75;

export default class StatisticPresenter {
    #statisticComponent = null;
    #containerComponent = null;
    #pointsModel = null;
    #points = [];

    constructor(container, pointsModel) {
      this.#containerComponent = container;
      this.#pointsModel = pointsModel;
      this.#points = pointsModel.points;

      this.#pointsModel.addObserver(this.#handleModelEvent);
    }

    init = () => {
      this.#statisticComponent = new StatisticView();
      render(this.#containerComponent, this.#statisticComponent, RenderPosition.BEFOREEND);

      this.#generateMoneyChart();
      this.#generateTypeChart();
      this.#generateTimeChart();
    }

    #handleModelEvent = (updateType) => {
      switch(updateType) {
        case UpdateType.INIT:
          this.#points = this.#pointsModel.points;
      }
    }

    #chartFactory = ({
      ctx,
      labels,
      data,
      formatter,
      text
    }) => new Chart(ctx, {
      plugins: [ChartDataLabels],
      type: 'horizontalBar',
      data: {
        labels: [...labels],
        datasets: [{
          data: [ ...data],
          backgroundColor: '#ffffff',
          hoverBackgroundColor: '#ffffff',
          anchor: 'start',
          barThickness: 44,
          minBarLength: 80,
        }],
      },
      options: {
        responsive: false,
        plugins: {
          datalabels: {
            font: {
              size: 13,
            },
            color: '#000000',
            anchor: 'end',
            align: 'start',
            formatter: formatter,
          },
        },
        title: {
          display: true,
          text: text,
          fontColor: '#000000',
          fontSize: 23,
          position: 'left',
        },
        scales: {
          yAxes: [{
            ticks: {
              fontColor: '#000000',
              padding: 5,
              fontSize: 13,
            },
            gridLines: {
              display: false,
              drawBorder: false,
            },
          }],
          xAxes: [{
            ticks: {
              display: false,
              beginAtZero: true,
            },
            gridLines: {
              display: false,
              drawBorder: false,
            },
          }],
        },
        legend: {
          display: false,
        },
        tooltips: {
          enabled: false,
        },
      },
    })

    #generateMoneyChart = () => {
      const ctx = document.querySelector('#money');
      ctx.height = BAR_HEIGHT * this.#points.length;

      const sortedPoints = this.#points.sort(sortByPrice);
      const labels = [...sortedPoints.map((item) => item.type.toUpperCase())];
      const data = [ ...sortedPoints.map((item) => item.price)];
      const formatter = (val) => `€ ${val}`;
      const text = 'MONEY';

      return this.#chartFactory({ctx, labels, data, formatter, text});
    }

    #generateTypeChart = () => {
      const ctx = document.querySelector('#type');

      const countedTypes = this.#points.reduce((allTypes, {type}) => {
        if (type in allTypes) {
          allTypes[type]++;
        } else {
          allTypes[type] = 1;
        }

        return allTypes;
      }, {});

      const sorted = Object.entries(countedTypes).sort((a, b) => b[1] - a[1]);

      ctx.height = BAR_HEIGHT * sorted.length;

      const labels = [...sorted.map((item) => item[0].toUpperCase())];
      const data = [...sorted.map((item) => item[1])];
      const formatter = (val) => `${val}x`;
      const text = 'TYPE';


      return this.#chartFactory({ctx, labels, data, formatter, text});
    }

    #generateTimeChart = () => {
      const ctx = document.querySelector('#time');


      const countedTime = this.#points.reduce((allPoints, point) => {
        if(point.type in allPoints) {
          allPoints[point.type] += getDuration(point).asMilliseconds();
        } else {allPoints[point.type] = getDuration(point).asMilliseconds();}

        return allPoints;
      }, {});

      const sorted = Object.entries(countedTime).sort((a, b) => b[1] - a[1]);

      ctx.height = BAR_HEIGHT * sorted.length;

      const labels = [...sorted.map((item) => item[0].toUpperCase())];
      const data = [...sorted.map((item) => item[1])];

      const formatter = (val) => {
        const day = dayjs.duration(val);
        return getDiffTime(day);
      };

      const text = 'TIME';

      return this.#chartFactory({ctx, labels, data, formatter, text});
    }


    #clearStatistic = () => {
      removeElement(this.#statisticComponent);
      this.#statisticComponent = null;
    }

    destroy = () => {
      this.#clearStatistic();
    }
}
