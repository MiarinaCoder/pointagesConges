import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import styles from './../../styles/components/AbsenceForm.module.css';

export default function AbsenceForm({ absence, onSubmit, onClose }) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: absence?{...absence,
         dateDebutAbsence: absence.dateDebutAbsence ? new Date(absence.dateDebutAbsence).toISOString().split('T')[0] : '',
         dateFinAbsence: absence.dateFinAbsence ? new Date(absence.dateFinAbsence).toISOString().split('T')[0] : ''} : {
      id_utilisateur: '',
      dateDebutAbsence: '',
      dateFinAbsence: '',
      motif: '',
      statut: 'en_attente',
      type: 'planifié'
    }
  });

  useEffect(() => {
    if (absence) {
        reset({
            ...absence,
            dateDebutAbsence: absence.dateDebutAbsence ? new Date(absence.dateDebutAbsence).toISOString().split('T')[0] : '',
            dateFinAbsence: absence.dateFinAbsence ? new Date(absence.dateFinAbsence).toISOString().split('T')[0] : ''
          });
    }
  }, [absence, reset]);

  const onSubmitForm = (data) => {
    if (new Date(data.dateFinAbsence) < new Date(data.dateDebutAbsence)) {
        alert("La date de fin doit être égale ou postérieure à la date de début.");
        return;
    }
    onSubmit(data);
    if (!absence) {
      reset();
    }
    onClose();
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className={styles.form}>
      <div className={styles.inputGroup}>
        <label htmlFor="id_utilisateur" className={styles.label}>ID Utilisateur</label>
        <input
          {...register("id_utilisateur", { required: "L'ID utilisateur est requis" })}
          type="number"
          id="id_utilisateur"
          className={styles.input}
        />
        {errors.id_utilisateur && <p className={styles.error}>{errors.id_utilisateur.message}</p>}
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="dateDebutAbsence" className={styles.label}>Date de début</label>
        <input
          {...register("dateDebutAbsence", { required: "La date de début est requise" })}
          type="date"
          id="dateDebutAbsence"
          className={styles.input}
        />
        {errors.dateDebutAbsence && <p className={styles.error}>{errors.dateDebutAbsence.message}</p>}
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="dateFinAbsence" className={styles.label}>Date de fin</label>
        <input
          {...register("dateFinAbsence")}
          type="date"
          id="dateFinAbsence"
          className={styles.input}
        />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="motif" className={styles.label}>Motif</label>
        <textarea
          {...register("motif")}
          id="motif"
          className={styles.input}
        />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="statut" className={styles.label}>Statut</label>
        <select
          {...register("statut")}
          id="statut"
          className={styles.input}
        >
          <option value="en_attente">En attente</option>
          <option value="approuvee">Approuvée</option>
          <option value="rejete">Rejetée</option>
        </select>
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="type" className={styles.label}>Type</label>
        <select
          {...register("type")}
          id="type"
          className={styles.input}
        >
          <option value="detecté">Détecté</option>
          <option value="planifié">Planifié</option>
        </select>
      </div>

      <button type="submit" className={styles.button}>
        {absence ? 'Mettre à jour' : 'Ajouter'}
      </button>
    </form>
  );
}
