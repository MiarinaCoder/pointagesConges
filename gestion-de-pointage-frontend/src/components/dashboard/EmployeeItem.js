import { useState } from 'react';
import EmployeeForm from '../forms/EmployeeForm';

export default function EmployeeItem({ employee, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);

  const handleUpdate = (updatedEmployee) => {
    onUpdate(updatedEmployee);
    setIsEditing(false);
  };

  return (
    <li>
      {isEditing ? (
        <EmployeeForm employee={employee} onSubmit={handleUpdate} />
      ) : (
        <>
          {employee.prenom} {employee.nom} - {employee.email} ({employee.role})
          <button onClick={() => setIsEditing(true)}>Modifier</button>
          <button onClick={() => onDelete(employee.id_employe)}>Supprimer</button>
        </>
      )}
    </li>
  );
}
