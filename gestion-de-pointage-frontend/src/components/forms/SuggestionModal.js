// import { useEffect } from "react";
// import { useForm } from "react-hook-form";
// import styles from "./EmployeeForm.module.css";

// export default function SuggestionForm({ conge, onSubmit, onClose }) {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     reset,
//     setValue,
//     watch
//   } = useForm({
//     defaultValues: {
//       dateDebutAbsence: conge?.dateDebutAbsence || "",
//       nombre_jour_conge: conge?.nombre_jour_conge || 0,
//       dateFinAbsence: conge?.dateFinAbsence || "",
//       id_utilisateur: conge?.id_utilisateur || "",
//       nom_utilisateur: conge?.nom_utilisateur || "",
//       prenom_utilisateur: conge?.prenom_utilisateur || ""
//     }
//   });

//   useEffect(() => {
//     if (conge) {
//       reset(conge);
//     }
//   }, [conge, reset]);

//   const onSubmitForm = (data) => {
//     const formattedData = {
//       ...data,
//       status: 'suggestion_pending',
//       suggestion: true
//     };
//     onSubmit(formattedData);
//   };

//   return (
//     <form onSubmit={handleSubmit(onSubmitForm)} className={styles.formContainer}>
//       <div className={styles.formGrid}>
//         <div className={styles.inputGroup}>
//           <label className={styles.label}>Employé</label>
//           <input
//             type="text"
//             value={`${conge?.nom_utilisateur} ${conge?.prenom_utilisateur}`}
//             className={styles.input}
//             disabled
//           />
//         </div>

//         <div className={styles.inputGroup}>
//           <label className={styles.label}>Nouvelle date de début</label>
//           <input
//             type="date"
//             {...register("dateDebutAbsence", { required: "Date requise" })}
//             className={styles.input}
//           />
//           {errors.dateDebutAbsence && (
//             <p className={styles.error}>{errors.dateDebutAbsence.message}</p>
//           )}
//         </div>

//         <div className={styles.inputGroup}>
//           <label className={styles.label}>Nombre de jours</label>
//           <input
//             type="number"
//             step="0.5"
//             {...register("nombre_jour_conge", { required: "Nombre de jours requis" })}
//             className={styles.input}
//           />
//           {errors.nombre_jour_conge && (
//             <p className={styles.error}>{errors.nombre_jour_conge.message}</p>
//           )}
//         </div>

//         <div className={styles.inputGroup}>
//           <label className={styles.label}>Date de fin (calculée)</label>
//           <input
//             type="date"
//             {...register("dateFinAbsence")}
//             className={styles.input}
//             readOnly
//           />
//         </div>
//       </div>

//       <button type="submit" className={styles.button}>
//         Envoyer la suggestion
//       </button>
//     </form>
//   );
// }


import { useEffect } from "react";
import { useForm } from "react-hook-form";
import styles from "./EmployeeForm.module.css";

export default function SuggestionForm({ conge, onSubmit, onClose }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm({
    defaultValues: conge ? {
      dateDebutAbsence: new Date(conge.dateDebutAbsence).toISOString().split('T')[0],
      nombre_jour_conge: Number(conge.nombre_jour_conge),
      dateFinAbsence: new Date(conge.dateFinAbsence).toISOString().split('T')[0],
      type_de_conge: conge.type_de_conge,
      motif: conge.motif
    } : {}
  });

  // Watch date and duration for automatic end date calculation
  const startDate = watch('dateDebutAbsence');
  const duration = watch('nombre_jour_conge');

  useEffect(() => {
    if (startDate && duration) {
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + Number(duration));
      setValue('dateFinAbsence', endDate.toISOString().split('T')[0]);
    }
  }, [startDate, duration, setValue]);

  // Add this helper function at the top of the component
const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date) 
      ? date.toISOString().split('T')[0]
      : '';
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.formContainer}>
      <h2 className={styles.title}>
        Suggestion pour {conge?.nom_utilisateur} {conge?.prenom_utilisateur}
      </h2>

      <div className={styles.formGrid}>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Date de début actuelle</label>
            <input
            type="date"
            value={formatDate(conge?.dateDebutAbsence)}
            // className={styles.input}
            disabled
            />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Nouvelle date de début suggérée</label>
          <input
            type="date"
            {...register("dateDebutAbsence", { required: "Date requise" })}
            // className={styles.input}
          />
          {errors.dateDebutAbsence && (
            <p className={styles.error}>{errors.dateDebutAbsence.message}</p>
          )}
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Nombre de jours suggéré</label>
          <input
            type="number"
            step="0.5"
            min="0.5"
            {...register("nombre_jour_conge", { 
              required: "Nombre de jours requis",
              min: 0.5
            })}
            // className={styles.input}
          />
          {errors.nombre_jour_conge && (
            <p className={styles.error}>{errors.nombre_jour_conge.message}</p>
          )}
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Nouvelle date de fin (calculée)</label>
          <input
            type="date"
            {...register("dateFinAbsence")}
            // className={styles.input}
            readOnly
          />
        </div>
      </div>

      <div className={styles.buttonContainer}>
        <button type="submit" className={styles.button}>
          Envoyer la suggestion
        </button>
      </div>
    </form>
  );
}
