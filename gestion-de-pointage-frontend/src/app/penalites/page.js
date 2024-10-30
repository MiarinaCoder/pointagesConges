"use client";

import { useContext } from 'react';
import Layout from "@/components/layout/Layout";
import PenaliteList from "@/components/dashboard/PenaliteList";
import AuthContext from '@/context/authContext';

function Penalties() {
  const { user } = useContext(AuthContext);
  
  return (
    <Layout>
      <h1>{user?.role === 'administrateur' ? 'Pénalités' : 'Mes Pénalités'}</h1>
      <PenaliteList userId={user?.role === 'employe' ? user.id : null} />
    </Layout>
  );
}

export default Penalties;
