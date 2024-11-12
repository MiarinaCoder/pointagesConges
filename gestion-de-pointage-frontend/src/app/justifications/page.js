"use client";

import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import JustificationForm from '@/components/justification/JustificationForm';
import JustificationList from '@/components/justification/JustificationList';
import api from '@/services/api';

export default function JustificationsPage() {
  const [justifications, setJustifications] = useState([]);

  const fetchJustifications = async () => {
    try {
      const response = await api.get('/justifications', {
        'Accept': 'application/json',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      console.log("Fetched data:", response.data);
      setJustifications(response.data);
    } catch (error) {
      console.error('Error fetching justifications:', error);
    }
  };

  useEffect(() => {
    fetchJustifications();
  }, []);

  const handleSuccess = () => {
    fetchJustifications();
  };

  const handleDelete = (deletedId) => {
    setJustifications(prev => prev.filter(j => j.idJustification !== deletedId));
  };

  return (
    <Layout>
      <div className="container">
        <h1>Justifications d'absence</h1>
        <JustificationForm onSuccess={handleSuccess} />
        <JustificationList 
          justifications={justifications}
          onDelete={handleDelete}
        />
      </div>
    </Layout>
  );
}
