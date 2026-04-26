
import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const SalesChart = ({ data }) => {
  // Calculate percentage change
  const calculateTrend = () => {
    if (data.length < 2) return { change: 0, isPositive: false };
    const last = data[data.length - 1].totalSales;
    const prev = data[data.length - 2].totalSales;
    const change = prev !== 0 ? ((last - prev) / prev) * 100 : 0;
    return {
      change: Math.abs(change),
      isPositive: change >= 0
    };
  };

  const trend = calculateTrend();
  const lastValue = data.length > 0 ? data[data.length - 1].totalSales : 0;

  const chartData = {
    labels: data.map(item => item.month),
    datasets: [
      {
        label: 'Sales (Rs)',
        data: data.map(item => item.totalSales),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: data.map((_, i) => 
          i === data.length - 1 ? '#10B981' : 'rgb(59, 130, 246)'
        ),
        pointRadius: data.map((_, i) => 
          i === data.length - 1 ? 6 : 3
        ),
        pointHoverRadius: 8
      }
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `Sales: Rs. ${context.raw.toLocaleString()}`;
          },
          footer: (tooltipItems) => {
            if (tooltipItems.length > 0 && tooltipItems[0].dataIndex > 0) {
              const current = tooltipItems[0].raw;
              const previous = data[tooltipItems[0].dataIndex - 1].totalSales;
              const change = previous !== 0 ? 
                ((current - previous) / previous * 100).toFixed(2) : 
                0;
              return `Change: ${change}% ${change >= 0 ? '↑' : '↓'}`;
            }
            return '';
          }
        }
      },
      annotation: {
        annotations: {
          line1: {
            type: 'line',
            yMin: lastValue,
            yMax: lastValue,
            borderColor: '#10B981',
            borderWidth: 2,
            borderDash: [6, 6]
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          callback: function(value) {
            return 'Rs. ' + value.toLocaleString();
          }
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index'
    }
  };

  return (
    <div className="relative">
      <div className="absolute right-4 top-4 bg-white p-2 rounded-lg shadow-sm">
        <div className="flex items-center">
          <span className="text-sm font-medium text-gray-500 mr-2">Trend:</span>
          {trend.isPositive ? (
            <span className="text-green-500 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
              {trend.change.toFixed(1)}%
            </span>
          ) : (
            <span className="text-red-500 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
              {trend.change.toFixed(1)}%
            </span>
          )}
        </div>
        <div className="mt-1 text-sm">
          <span className="text-gray-500">Current: </span>
          <span className="font-semibold">Rs. {lastValue.toLocaleString()}</span>
        </div>
      </div>
      
      <Line data={chartData} options={options} />
      
      <div className="flex justify-between mt-4 text-sm text-gray-600">
        <div>
          <span className="font-medium">Peak: </span>
          <span>Rs. {Math.max(...data.map(d => d.totalSales)).toLocaleString()}</span>
        </div>
        <div>
          <span className="font-medium">Avg: </span>
          <span>Rs. {(data.reduce((a, b) => a + b.totalSales, 0) / data.length || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
        </div>
      </div>
    </div>
  );
};

export default SalesChart;