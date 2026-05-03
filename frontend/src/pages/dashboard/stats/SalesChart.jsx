import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const SalesChart = ({ data = [] }) => {
  const safeData = Array.isArray(data) ? data : [];

  // -------------------------
  // SAFE CALCULATIONS
  // -------------------------
  const lastValue =
    safeData.length > 0 ? safeData[safeData.length - 1].totalSales : 0;

  const peakValue =
    safeData.length > 0
      ? Math.max(...safeData.map((d) => Number(d.totalSales || 0)))
      : 0;

  const avgValue =
    safeData.length > 0
      ? safeData.reduce((a, b) => a + Number(b.totalSales || 0), 0) /
        safeData.length
      : 0;

  const chartData = {
    labels: safeData.map((item) => item.month),
    datasets: [
      {
        label: "Sales (Rs)",
        data: safeData.map((item) => Number(item.totalSales || 0)),

        // 🎨 BAR COLORS
        backgroundColor: "rgba(37, 99, 235, 0.7)",
        borderColor: "rgb(37, 99, 235)",
        borderWidth: 1,

        borderRadius: 8,
        barThickness: 30,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) =>
            `Sales: Rs. ${Number(context.raw).toLocaleString()}`,
        },
      },
    },

    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0,0,0,0.05)",
        },
        ticks: {
          callback: (value) => `Rs. ${value}`,
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="w-full">

      {/* TOP INFO BOX */}
      <div className="flex justify-between mb-4 text-sm text-gray-600">
        <div>
          <span className="font-medium">Peak:</span>{" "}
          Rs. {Number(peakValue).toLocaleString()}
        </div>

        <div>
          <span className="font-medium">Avg:</span>{" "}
          Rs. {Number(avgValue).toLocaleString(undefined, {
            maximumFractionDigits: 0,
          })}
        </div>

        <div>
          <span className="font-medium">Latest:</span>{" "}
          Rs. {Number(lastValue).toLocaleString()}
        </div>
      </div>

      {/* BAR CHART */}
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default SalesChart;
