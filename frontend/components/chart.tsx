import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { faker } from "@faker-js/faker";

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
    labels: props.timestamps.map((timestamp) =>
      new Date(timestamp * 1000).toLocaleDateString("it")
    ),
    datasets: [
      {
        label: "Mileages",
        data: props.mileages
          .toString()
          .split(",")
          .map((mileage) => parseInt(mileage)),
        borderColor: "#F5CB5C",
        backgroundColor: "rgba(255, 99, 132, 0)",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Chart.js Line Chart",
      },
    },
    scales: {
      y: {
        title: { display: true, text: "Mileages" },
      },
      x: {
        adapters: {
          date: { locale: "it" },
          type: "time",
          distribution: "linear",
          time: {
            parser: "DD/MM/YYYY",
            unit: "day",
          },
          title: {
            display: true,
            text: "Date",
          },
        },
      },
    },
  };

  return <Line options={options} data={data} />;
}
