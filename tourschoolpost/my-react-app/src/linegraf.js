import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const LineChart = ({ xValues, yValues, lineLabel, color }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    
    chartInstance.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: xValues,
        datasets: [{
            label: lineLabel,
          fill: false,
          lineTension: 0,
          backgroundColor: color,
          borderColor: color,
          data: yValues
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            min: 0,
            max: 50
          }
        }
      }
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [xValues, yValues]);

  return (
 
      <canvas className='staticregclass' ref={chartRef}  />

  );
};

export default LineChart;
