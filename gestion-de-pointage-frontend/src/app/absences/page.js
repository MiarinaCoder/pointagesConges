'use client';

import { useContext } from 'react';
import Layout from '../../components/layout/Layout';
import AbsenceList from '../../components/absences_conges/AbsencesList';
import AuthContext from '../../context/authContext';

export default function Absences() {
  const { user } = useContext(AuthContext);
  
  return (
    <Layout>
      <h1>{user?.role === 'administrateur' ? 'Absences' : 'Mes Absences'}</h1>
      <AbsenceList userId={user?.role === 'employe' ? user.id : null} />
    </Layout>
  );
}
