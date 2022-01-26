import { removeElement, render, RenderPosition } from '../render';
import StatisticView from '../view/statistic-view';
import {Chart} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {getDiffTime, getDuration} from '../utils/dayjs';
import dayjs from 'dayjs';
import {UpdateType} from '../const';

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

    destroy = () => {
      this.#clearStatistic();
    }

    #handleModelEvent = (updateType) => {
      switch(updateType) {
        case UpdateType.INIT:
          this.#points = this.#pointsModel.points;
      }
    }

    #getChart = ({
      ctx,
      labels,
      values,
      getFormattedValue,
      text
    }) => new Chart(ctx, {
      plugins: [ChartDataLabels],
      type: 'horizontalBar',
      data: {
        labels: [...labels],
        datasets: [{
          data: [ ...values],
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
            formatter: getFormattedValue,
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

    #getDataLabelsCtx = (pointCounter, querySelector) => {
      const countedPoints = this.#points.reduce((allPoints, point) => {
        if (point.type in allPoints) {
          allPoints[point.type] += pointCounter(point);
          return allPoints;
        }

        allPoints[point.type] = pointCounter(point);
        return allPoints;
      }, {});

      const sortedPoints = Object.entries(countedPoints).sort((a, b) => b[1] - a[1]);

      const labels = [...sortedPoints.map((item) => item[0].toUpperCase())];
      const values = [...sortedPoints.map((item) => item[1])];

      const ctx = document.querySelector(querySelector);
      ctx.height = BAR_HEIGHT * labels.length;

      return {labels, values, ctx};
    }

    #generateMoneyChart = () => {

      const getPointPrice = (point) => point.price;

      const {values, labels, ctx} = this.#getDataLabelsCtx(getPointPrice, '#money');

      const getFormattedValue = (val) => `€ ${val}`;
      const text = 'MONEY';

      return this.#getChart({ctx, labels, values, getFormattedValue, text});
    }

    #generateTypeChart = () => {

      const {values, labels, ctx} = this.#getDataLabelsCtx(() => 1, '#type');

      const getFormattedValue = (val) => `${val}x`;
      const text = 'TYPE';

      return this.#getChart({ctx, labels, values, getFormattedValue, text});
    }

    #generateTimeChart = () => {

      const getDurationInMilliseconds = (point) =>  getDuration(point).asMilliseconds();

      const {values, labels, ctx} = this.#getDataLabelsCtx(getDurationInMilliseconds, '#time');

      const getFormattedValue = (val) => {
        const day = dayjs.duration(val);
        return getDiffTime(day);
      };
      const text = 'TIME';

      return this.#getChart({ctx, labels, values, getFormattedValue, text});
    }


    #clearStatistic = () => {
      removeElement(this.#statisticComponent);
      this.#statisticComponent = null;
    }
}
