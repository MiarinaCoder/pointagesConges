'use client';

import { useContext } from 'react';
import Layout from '../../components/layout/Layout';
// import AbsenceList from '../../components/absences_conges/AbsencesList';
import AbsencesStats from '../../components/absences_conges/AbsencesStats';
import AuthContext from '../../context/authContext';

export default function Absences() {
  const { user } = useContext(AuthContext);
  
  const userId = user?.id;

  return (
    <Layout>
      <h1>{user?.role === 'administrateur' ? 'Absences' : 'Mes Absences'}</h1>
      {/* <AbsenceList userId={user?.role === 'employe' ? user.id : null} /> */}
      <AbsencesStats userId={user?.role === 'employe' ? userId : null} />
    </Layout>
  );
}
