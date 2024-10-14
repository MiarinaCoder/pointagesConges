import React, { useContext, useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart, ArcElement } from 'chart.js'; // Importer ArcElement
import api from "@/services/api";
import AuthContext from "@/context/authContext";

// Enregistrer ArcElement
Chart.register(ArcElement);

const PieChart = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user && user.id) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/sessions/${user.id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      let sessions = response.data;
      if (sessions.ui && Array.isArray(sessions.ui)) {
        sessions = sessions.ui.flat();
      }
      
      if (!Array.isArray(sessions)) {
        throw new Error('Invalid data structure received from the API');
      }

      const users = {};
      sessions.forEach(session => {
        const userId = session.id_utilisateur;
        users[userId] = (users[userId] || 0) + 1;
      });

      setChartData({
        labels: Object.keys(users),
        datasets: [{
          data: Object.values(users),
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
        }],
      });
    } catch (error) {
      console.error('Error fetching or processing data:', error);
      setError("Failed to load chart data");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div>Please log in to view the chart.</div>;
  }

  if (loading) {
    return <div>Loading chart data...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!chartData) {
    return <div>No data available for the chart.</div>;
  }

  return (
    <div>
      <h3>Sessions par utilisateur</h3>
      <Pie data={chartData} />
    </div>
  );
};

export default PieChart;
