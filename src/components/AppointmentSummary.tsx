import React from "react";
import '../styles/Summary.css';
import { User } from '../utils/supabase';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface AppointmentSummaryProps {
  user?: User;
  fetching?: boolean;
}

function AppointmentSummary({ user, fetching }: AppointmentSummaryProps) {
    const data = {
        datasets: [
          {
            data: [29, 100], // Adjust the data to control the fill percentage
            backgroundColor: ['#41924a', '#d3d3d3'],
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
          <div className="appointment-summary-content">
            <h2>Appointment Summary</h2>
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
          <div className="appointment-summary-content">
              <h2>Appointment Summary</h2>
              <p>There are no upcoming appointments.</p>
              <div className="details">
                  <div className="chart-left">
                      <Doughnut data={data} options={options} />
                      <div className="inside-chart">
                          <div>Max</div>
                          <div className="due-in">in 21 days</div>
                      </div>
                  </div>
                  <div className="breakdown">

                  </div>
              </div>
          </div>
        </div>
    );
}

export default AppointmentSummary;