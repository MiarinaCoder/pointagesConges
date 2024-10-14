import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import styles from "./../../styles/components/PenaliteForm.module.css"; 
import api from "@/services/api";

export default function PenaliteForm({ penalite, onSubmit, onClose }) {
  const [employes, setEmployes] = useState([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: penalite || {
      id_utilisateur: "",
      montant: "",
      date: new Date().toISOString().split('T')[0],
      estApprouve: false,
    },
  });

  useEffect(() => {
    fetchEmployes();
    if (penalite) {
      reset({
        ...penalite,
        date: new Date(penalite.date).toISOString().split('T')[0],
      });
    }
  }, [penalite, reset]);

  const fetchEmployes = async () => {
    try {
      const response = await api.get('/users', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setEmployes(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des employés:', error);
    }
  };

  const onSubmitForm = (data) => {
    onSubmit({
      ...data,
      montant: parseFloat(data.montant),
      estApprouve: Boolean(data.estApprouve),
    });
    if (!penalite) {
      reset();
    }
    onClose();
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className={styles.form}>
      <div className={styles.formGrid}>
        <div className={styles.inputGroup}>
          <label htmlFor="id_utilisateur" className={styles.label}>
            Employé
          </label>
          <select
            {...register("id_utilisateur", { required: "L'employé est requis" })}
            id="id_utilisateur"
            className={styles.input}
          >
            <option value="">Sélectionnez un employé</option>
            {employes.map((employe) => (
              <option key={employe.id} value={employe.id}>
                {`${employe.nom} ${employe.prenom}`}
              </option>
            ))}
          </select>
          {errors.id_utilisateur && <p className={styles.error}>{errors.id_utilisateur.message}</p>}
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="montant" className={styles.label}>
            Montant
          </label>
          <input
            {...register("montant", {
              required: "Le montant est requis",
              min: { value: 0, message: "Le montant doit être positif" },
            })}
            type="number"
            step="0.01"
            id="montant"
            className={styles.input}
            placeholder="Entrez le montant"
          />
          {errors.montant && <p className={styles.error}>{errors.montant.message}</p>}
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="date" className={styles.label}>
            Date
          </label>
          <input
            {...register("date", { required: "La date est requise" })}
            type="date"
            id="date"
            className={styles.input}
          />
          {errors.date && <p className={styles.error}>{errors.date.message}</p>}
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="estApprouve" className={styles.label}>
            Approuvé
          </label>
          <input
            {...register("estApprouve")}
            type="checkbox"
            id="estApprouve"
            className={styles.checkbox}
          />
        </div>
      </div>

      <button type="submit" className={styles.button}>
        {penalite ? "Mettre à jour" : "Ajouter"}
      </button>
    </form>
  );
}
