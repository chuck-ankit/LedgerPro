import React, { useEffect, useRef } from 'react';
import { Chart, ChartData, ChartOptions, registerables } from 'chart.js';

// Register Chart.js components
Chart.register(...registerables);

interface DoughnutChartProps {
  data: number[];
  labels: string[];
  colors: string[];
}

const DoughnutChart: React.FC<DoughnutChartProps> = ({ data, labels, colors }) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (chartRef.current) {
      // Destroy existing chart if it exists
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const ctx = chartRef.current.getContext('2d');
      
      if (ctx) {
        const chartData: ChartData = {
          labels,
          datasets: [
            {
              data,
              backgroundColor: colors,
              borderWidth: 0,
              borderRadius: 4,
              hoverOffset: 5,
            },
          ],
        };

        const chartOptions: ChartOptions = {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '70%',
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  const label = context.label || '';
                  const value = context.formattedValue;
                  return `${label}: ${value}`;
                }
              }
            }
          },
          animation: {
            animateScale: true,
            animateRotate: true,
          },
        };

        // Create new chart
        chartInstance.current = new Chart(ctx, {
          type: 'doughnut',
          data: chartData,
          options: chartOptions,
        });
      }
    }

    // Cleanup on unmount
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data, labels, colors]);

  return <canvas ref={chartRef} />;
};

export default DoughnutChart;