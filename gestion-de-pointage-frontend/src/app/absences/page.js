'use client';

import Layout from '../../components/layout/Layout';
import AbsenceList from '../../components/absences/AbsencesList';

export default function Absences() {
  return (
    <Layout>
      <h1>Absences</h1>
      <AbsenceList />
    </Layout>
  );
}
