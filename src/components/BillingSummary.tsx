import React from "react";
import '../styles/Summary.css';
import { User } from '../utils/supabase';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface BillingSummaryProps {
  user?: User;
  fetching?: boolean;
}

function BillingSummary({ user, fetching }: BillingSummaryProps) {
    const data = {
        datasets: [
          {
            data: [100, 0], // Adjust the data to control the fill percentage
            backgroundColor: ['#41924a', '#d3d3d3'], // Black and light gray
            borderWidth: 0,
            cutout: '70%', // Adjust the inner circle size
            rotation: 0, // Start from the top
          },
        ],
      };
    
      const options = {
        plugins: {
          tooltip: { enabled: false }, // Disable tooltips
        },
        responsive: true,
        maintainAspectRatio: false,
      };
  
  if (fetching) {
    return (
      <div className="Summary">
      <div className="billing-summary-content">
        <h2>Billing Summary</h2>
        <p className="loading" style={{width: '250px'}}></p>
        <div className="details">
            <div className="chart-left">
              <div className="loading-circle"></div>
            </div>
            <div className="breakdown">

            </div>
        </div>
      </div>
    </div>
    )
  }

  return (
    <div className="Summary">
      <div className="billing-summary-content">
        <h2>Billing Summary</h2>
        <p>There are no outstanding bills.</p>
        <div className="details">
            <div className="chart-left">
                <Doughnut data={data} options={options} />
                <div className="inside-chart">
                    <div>$0</div>
                    <div className="due-in">Due in 13 days</div>
                </div>
            </div>
            <div className="breakdown">

            </div>
        </div>
      </div>
    </div>
  );
}

export default BillingSummary;