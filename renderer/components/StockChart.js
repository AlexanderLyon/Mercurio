import { useEffect } from 'react';
import Chart from 'chart.js';

export const StockChart = ({ data, isNegative, identifier }) => {
  const labels = data.map((minute) => minute.label);
  const values = data.map((minute) => minute.average);
  const red = 'rgba(233, 128, 122, 0.2)';
  const green = 'rgba(88, 173, 142, 0.2)';

  const renderChart = () => {
    var ctx = document.getElementById(`myChart-${identifier}`).getContext('2d');
    var myChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Price',
            data: values,
            pointRadius: 0,
            backgroundColor: isNegative ? red : green,
            borderColor: isNegative ? red : green,
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          display: false,
        },
        scales: {
          scaleLabel: {
            display: false,
            fontSize: 7,
          },
          yAxes: [
            {
              ticks: {
                beginAtZero: false,
              },
            },
          ],
        },
      },
    });
  };

  useEffect(renderChart, []);

  return <canvas id={`myChart-${identifier}`} style={{ height: '300px', width: '100%' }}></canvas>;
};
