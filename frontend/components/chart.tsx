
import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { faker } from '@faker-js/faker';

interface Props {
    mileages: number[];
    timestamps: number[];
}

export default function Chart(props: Props) {
    ChartJS.register(
        CategoryScale,
        LinearScale,
        PointElement,
        LineElement,
        Title,
        Tooltip,
        Legend
    );

    const data = {
        labels: props.timestamps.map((timestamp) => new Date(timestamp * 1000).toLocaleDateString()),
        datasets: [
            {
                label: 'Mileages',
                data: props.mileages.toString().split(",").map((mileage) => parseInt(mileage)),
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
        ],
    };

    /*const config = {
        type: 'line',
        data: data,
        options: {
          plugins: {
            title: {
              text: 'Chart.js Time Scale',
              display: true
            }
          },
          scales: {
            x: {
              type: 'time',
              time: {
                // Luxon format string
                tooltipFormat: 'DD T'
              },
              title: {
                display: true,
                text: 'Date'
              }
            },
            y: {
              title: {
                display: true,
                text: 'value'
              }
            }
          },
        },
      };*/


    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Chart.js Line Chart',
            },
        },
        scales: {
            y: {
              title: {display: true, text: "Mileages"}
            },
            x: {
              adapters: {
                date: {locale: "it"},
                type: "time",
                distribution: "linear",
                time: {
                  parser: "DD/MM/YYYY",
                  unit: "day"
                },
                title: {
                  display: true,
                  text: "Date"
                }
              }
            }
          }, 
    };


    return <Line options={options} data={data} />;
}
