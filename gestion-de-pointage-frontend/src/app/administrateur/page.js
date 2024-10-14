'use client';

import Layout from '../../components/layout/Layout';
import EmployeeList from '../../components/dashboard/EmployeList';

export default function Employees() {
  return (
    <Layout>
      <h1>Utilisateurs</h1>
      <EmployeeList />
    </Layout>
  );
}