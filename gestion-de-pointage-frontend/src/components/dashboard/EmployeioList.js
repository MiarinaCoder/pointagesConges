// import { useState, useEffect } from 'react';
// import axios from 'axios';

// export default function EmployeeList() {
//   const [employees, setEmployees] = useState([]);

//   useEffect(() => {
//     const fetchEmployees = async () => {
//       try {
//         const response = await axios.get('http://localhost:5000/api/employes', {
//           headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//         });
//         setEmployees(response.data);
//       } catch (error) {
//         console.error('Erreur lors de la récupération des employés:', error);
//       }
//     };

//     fetchEmployees();
//   }, []);

//   return (
//     <div>
//       <h2>Liste des employés</h2>
//       <ul>
//         {employees.map(employee => (
//           <li key={employee.id_employe}>
//             {employee.prenom} {employee.nom} - {employee.email} ({employee.role})
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }


import { useState, useEffect } from 'react';
import axios from 'axios';
import EmployeeForm from '../forms/EmployeeForm';
import EmployeeItem from './EmployeeItem';

export default function EmployeeList() {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/employes', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setEmployees(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des employés:', error);
    }
  };

  const handleCreate = async (newEmployee) => {
    try {
      await axios.post('http://localhost:5000/api/employes', newEmployee, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchEmployees();
    } catch (error) {
      console.error('Erreur lors de la création de l\'employé:', error);
    }
  };

  const handleUpdate = async (updatedEmployee) => {
    try {
      await axios.put(`http://localhost:5000/api/employes/${updatedEmployee.id_employe}`, updatedEmployee, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchEmployees();
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'employé:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/employes/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchEmployees();
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'employé:', error);
    }
  };

  return (
    <div>
      <h2>Liste des employés</h2>
      <EmployeeForm onSubmit={handleCreate} />
      <ul>
        {employees.map(employee => (
          <EmployeeItem
            key={employee.id_employe}
            employee={employee}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
          />
        ))}
      </ul>
    </div>
  );
}
