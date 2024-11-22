import React, { useContext, useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import AuthContext from "@/context/authContext";
import api from "@/services/api";

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = () => {
  const [attendanceStats, setAttendanceStats] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchAttendanceStats = async () => {
      try {
        const endpoint = user?.role === 'administrateur' 
          ? `/absence/statistique/global/today`
          : `/absence/statistique/user/${user?.id}`;
          
        const response = await api.get(endpoint, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        console.log(response.data);

      // Assuming response.data is an array with one object
      const stats = response.data[0];
      const total = parseFloat(stats.present_percentage) + parseFloat(stats.late_percentage);

      const parsedStats = {
        present_percentage: parseFloat(stats.present_percentage),
        absent_percentage: (parseFloat(stats.absent_percentage)==0)? (100 - total): parseFloat(stats.absent_percentage),
        late_percentage: parseFloat(stats.late_percentage),
        present_count: parseFloat(stats?.present_count),
        absent_count: parseFloat(stats?.absent_count),
        late_count: parseFloat(stats?.late_count)     
      };
        
        setAttendanceStats(parsedStats);
      } catch (error) {
        console.error('Error fetching attendance stats:', error);
      }
    };
    fetchAttendanceStats();
  }, [user]);

  const data = {
    labels: ['Présents', 'Absents', 'Présents mais en retard'],
    datasets: [{
      data: [
        attendanceStats?.present_percentage || 0,
        attendanceStats?.absent_percentage || 0,
        attendanceStats?.late_percentage || 0  , 
      ],
      backgroundColor: [
        '#4CAF50', // Green for present
        '#FF5252', // Red for absent
        '#FFC107'  // Yellow for late
      ],
      borderColor: '#ffffff',
      borderWidth: 2,
    }]
  };

  const options = {
    responsive: true,
    plugins: {

      //label lorsqu'on touche la couleur correspondant
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;

            if (user?.role === 'administrateur') {
              let exactNumber;
              if (label.includes('Présents') && !label.includes('retard')) {
                exactNumber = attendanceStats?.present_count;
                console.log(exactNumber);
              } else if (label.includes('Absents')) {
                exactNumber = attendanceStats?.absent_count;
              } else {
                exactNumber = attendanceStats?.late_count;
              }
              return `${label}: ${exactNumber} (${value.toFixed(1)}%)`;
            }
            return `${label}: ${value.toFixed(1)}%`;
          }
        }
      },
      //fin de label
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          font: { size: 14 },
          generateLabels: (chart) => {
            const datasets = chart.data.datasets;
            return chart.data.labels.map((label, i) => ({
              text: `${label}: ${datasets[0].data[i].toFixed(1)}%`,
              fillStyle: datasets[0].backgroundColor[i],
              hidden: false,
              lineWidth: 1,
              strokeStyle: datasets[0].backgroundColor[i],
            }));
          }
        }
      },
      title: {
        display: true,
        text: user?.role === 'administrateur' 
          ? 'Répartition des présences aujourd\'hui'
          : 'Mes statistiques de présence',
        font: { size: 16, weight: 'bold' }
      }
    },
    cutout: '60%'
  };

  return (
    <div className="chart-container">
      <Doughnut data={data} options={options} />
    </div>
  );
};

export default PieChart;
