'use client';

import { useContext } from 'react';
import Layout from '../../components/layout/Layout';
import CongeList from '../../components/absences_conges/CongesList';
import AuthContext from '../../context/authContext';

export default function Conges() {
  const { user } = useContext(AuthContext);

  return (
    <Layout>
      {/* <h1>{user?.role === 'administrateur' ? 'Gestion des Congés' : 'Mes Congés'}</h1> */}
      <CongeList userId={user?.role === 'employe' ? user.id : null} isAdmin={user?.role === 'administrateur'} />
    </Layout>
  );
}
