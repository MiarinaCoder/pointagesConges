// import { useEffect, useState,useContext } from 'react';
// import { useForm } from 'react-hook-form';
// import styles from './../../styles/components/AbsenceForm.module.css';
// import AuthContext from '@/context/authContext';

// const congeTypes = {
//   'congé de maternité': 15,
//   'congé de paternité': 15,
//   'congé standard': 2.5,
//   '': 0
// };
// export default function CongeForm ({ absence, onSubmit, onClose }) {
//   const { user } = useContext(AuthContext);
//     const [selectedTypeDeConge, setSelectedTypeDeConge] = useState(absence?.type_de_conge || '');

//     const { register, handleSubmit, formState: { errors }, reset, watch, setValue } = useForm({
//       defaultValues: absence ? {
//         type_de_conge: absence.type_de_conge || '',
//         nombre_jour_conge: Number(absence.nombre_jour_conge) || 0,
//         dateDebutAbsence: absence.dateDebutAbsence ?
//           new Date(absence.dateDebutAbsence).toISOString().split('T')[0] : '',
//         dateFinAbsence: absence.dateFinAbsence ?
//           new Date(absence.dateFinAbsence).toISOString().split('T')[0] : '',
//         motif: absence.motif || ''
//       } : {
//         type_de_conge: '',
//         nombre_jour_conge: 0,
//         dateDebutAbsence: '',
//         dateFinAbsence: '',
//         motif: ''
//       }
//     });

//     const typeDeConge = watch('type_de_conge');

//     useEffect(() => {
//       if (typeDeConge) {
//         setValue('nombre_jour_conge', congeTypes[typeDeConge]);
//         // Calculate end date based on start date and number of days
//         const startDate = new Date(watch('dateDebutAbsence'));
//         if (startDate && !isNaN(startDate)) {
//           const endDate = new Date(startDate);
//           endDate.setDate(startDate.getDate() + congeTypes[typeDeConge]);
//           setValue('dateFinAbsence', endDate.toISOString().split('T')[0]);
//         }
//       }
//     }, [typeDeConge, setValue, watch]);

//     useEffect(() => {
//       if (absence) {
//         // Ensure dates are properly formatted
//         const formattedStartDate = absence.dateDebutAbsence ?
//           new Date(absence.dateDebutAbsence).toISOString().split('T')[0] : '';
//         const formattedEndDate = absence.dateFinAbsence ?
//           new Date(absence.dateFinAbsence).toISOString().split('T')[0] : '';

//         setSelectedTypeDeConge(absence.type_de_conge);
//         reset({
//           type_de_conge: absence.type_de_conge,
//           nombre_jour_conge: Number(absence.nombre_jour_conge),
//           dateDebutAbsence: formattedStartDate,
//           dateFinAbsence: formattedEndDate,
//           motif: absence.motif || ''
//         });
//       }
//     }, [absence, reset]);

//   const onSubmitForm = (data) => {
//     console.log("Type de congé sélectionné:", data.type_de_conge);
//     if (new Date(data.dateFinAbsence) < new Date(data.dateDebutAbsence)) {
//       alert("La date de fin doit être égale ou postérieure à la date de début.");
//       return;
//     }

//     // Assurez-vous que ces champs sont inclus dans les données envoyées au backend
//     const absenceData = {
//       ...data,
//       id_utilisateur: user.id,
//       type_de_conge: data.type_de_conge,
//       nombre_jour_conge: data.nombre_jour_conge
//     };

//     onSubmit(absenceData);
//     if (!absence) {
//       reset();
//     }
//     onClose();
//   };
//     return (
//     <form onSubmit={handleSubmit(onSubmitForm)} className={styles.form}>
//       <div className={styles.inputGroup}>
//         <label htmlFor="type_de_conge" className={styles.label}>Type de congé</label>
//         <select
//           {...register("type_de_conge", { required: "Le type de congé est requis" })}
//           id="type_de_conge"
//           className={styles.input}
//           value={selectedTypeDeConge}
//           onChange={(e) => {
//             setSelectedTypeDeConge(e.target.value);
//             setValue("type_de_conge", e.target.value);
//             // Automatically set nombre_jour_conge based on type
//             setValue("nombre_jour_conge", congeTypes[e.target.value]);
//           }}
//         >
//           <option value="">Sélectionnez un type de congé</option>
//           {Object.keys(congeTypes).map(type => (
//             <option key={type} value={type}>{type}</option>
//           ))}
//         </select>
//       </div>

//       <div className={styles.inputGroup}>
//         <label htmlFor="nombre_jour_conge" className={styles.label}>Nombre de jours de congé</label>
//         <input
//           {...register("nombre_jour_conge")}
//           type="number"
//           step="0.5"
//           id="nombre_jour_conge"
//           className={styles.input}
//           readOnly={typeDeConge !== 'congé standard'}
//           onChange={(e) => {
//             setValue("nombre_jour_conge", e.target.value);
//             // Calculate end date based on start date and number of days
//             const startDate = new Date(watch("dateDebutAbsence"));
//             if (startDate) {
//               const endDate = new Date(startDate);
//               endDate.setDate(startDate.getDate() + parseInt(e.target.value));
//               setValue("dateFinAbsence", endDate.toISOString().split('T')[0]);
//             }
//           }}
//         />
//       </div>

//       <div className={styles.inputGroup}>
//         <label htmlFor="dateDebutAbsence" className={styles.label}>Date de début</label>
//         <input
//           {...register("dateDebutAbsence", { required: "La date de début est requise" })}
//           type="date"
//           id="dateDebutAbsence"
//           className={styles.input}
//           onChange={(e) => {
//             setValue("dateDebutAbsence", e.target.value);
//             // Calculate end date when start date changes
//             const startDate = new Date(e.target.value);
//             const days = watch("nombre_jour_conge");
//             if (days) {
//               const endDate = new Date(startDate);
//               endDate.setDate(startDate.getDate() + parseInt(days));
//               setValue("dateFinAbsence", endDate.toISOString().split('T')[0]);
//             }
//           }}
//         />
//       </div>

//       <div className={styles.inputGroup}>
//         <label htmlFor="dateFinAbsence" className={styles.label}>Date de fin</label>
//         <input
//           {...register("dateFinAbsence")}
//           type="date"
//           id="dateFinAbsence"
//           className={styles.input}
//           readOnly
//         />
//       </div>

//       {typeDeConge === 'congé standard' && (
//         <div className={styles.inputGroup}>
//           <label htmlFor="motif" className={styles.label}>Motif</label>
//           <textarea
//             {...register("motif", {
//               required: typeDeConge === 'congé standard' ? "Le motif est requis" : false
//             })}
//             id="motif"
//             className={styles.input}
//           />
//         </div>
//       )}

//       <button type="submit" className={styles.button}>
//         {absence ? 'Mettre à jour' : 'Ajouter'}
//       </button>
//     </form>
// );          }

import { useEffect, useState, useContext } from "react";
import { useForm } from "react-hook-form";
import styles from "./../../styles/components/AbsenceForm.module.css";
import AuthContext from "@/context/authContext";

export default function CongeForm({ conge, onSubmit, onClose }) {
  const { user } = useContext(AuthContext);
  const [selectedTypeDeConge, setSelectedTypeDeConge] = useState(
    conge?.type_de_conge || ""
  );

  // Initialize congeTypes based on user gender
  const getInitialCongeTypes = () => {
    const types = {
      "congé standard": 2.5,
    };
    
    if (user?.genre === 'féminin') {
      types["congé de maternité"] = 98;
    }
    if (user?.genre === 'masculin') {
      types["congé de paternité"] = 15;
    }
    return types;
  };

  const [congeTypes, setCongeTypes] = useState(getInitialCongeTypes());

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm({
    defaultValues: {
      type_de_conge: conge?.type_de_conge || "",
      nombre_jour_conge: conge?.nombre_jour_conge || 0,
      // nombre_jour_conge: conge?.type_de_conge === "congé standard" ? 2.5 : (conge?.nombre_jour_conge || 0),
      dateDebutAbsence: conge?.dateDebutAbsence
        ? new Date(conge.dateDebutAbsence).toISOString().split("T")[0]
        : "",
      dateFinAbsence: conge?.dateFinAbsence
        ? new Date(conge.dateFinAbsence).toISOString().split("T")[0]
        : "",
      motif: conge?.motif || "",
    },
  });

  const typeDeConge = watch("type_de_conge");
  const dateDebut = watch("dateDebutAbsence");
  const nombreJourConge = watch("nombre_jour_conge");

  const calculateEndDate = (startDate, days) => {
    if (!startDate || !days) return "";
    const date = new Date(startDate);
    date.setDate(date.getDate() + Number(days));
    return date.toISOString().split("T")[0];
  };

  // useEffect(() => {
  //   if (typeDeConge && dateDebut) {
  //     const jours = congeTypes[typeDeConge];
  //     setValue("nombre_jour_conge", jours);
  //     const newEndDate = calculateEndDate(dateDebut, jours);
  //     if (newEndDate) setValue("dateFinAbsence", newEndDate);
  //   }
  // }, [typeDeConge, dateDebut, setValue, congeTypes]);

  useEffect(() => {
    if (typeDeConge && dateDebut) {
      const jours = typeDeConge === "congé standard" ? nombreJourConge : congeTypes[typeDeConge];
      const newEndDate = calculateEndDate(dateDebut, jours);
      if (newEndDate) setValue("dateFinAbsence", newEndDate);
    }
  }, [typeDeConge, dateDebut, nombreJourConge, setValue, congeTypes]);

  // Update congeTypes when user changes
  useEffect(() => {
    setCongeTypes(getInitialCongeTypes());
  }, [user?.genre]);

  useEffect(() => {
    if (typeDeConge && congeTypes[typeDeConge] !== undefined) {
      setValue("nombre_jour_conge", congeTypes[typeDeConge]);
    }
  }, [typeDeConge, setValue, congeTypes]);

  const handleFormSubmit = (data) => {
    const formattedData = {
      id_utilisateur: user.id,
      type_de_conge: data.type_de_conge,
      nombre_jour_conge: Number(data.nombre_jour_conge),
      dateDebutAbsence: new Date(data.dateDebutAbsence).toISOString(),
      dateFinAbsence: new Date(data.dateFinAbsence).toISOString(),
      motif: data.motif || ''
    };
    
    onSubmit(formattedData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className={styles.form}>
      <div className={styles.inputGroup}>
        <label className={styles.label}>Type de congé</label>
        <select
          {...register("type_de_conge", { required: true })}
          className={styles.input}
          onChange={(e) => {
            setSelectedTypeDeConge(e.target.value);
            setValue("type_de_conge", e.target.value);
          }}
        >
          <option value="">Sélectionnez un type de congé</option>
          {Object.entries(congeTypes).map(([type, days]) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.inputGroup}>
        <label className={styles.label}>Date de début</label>
        <input
          type="date"
          {...register("dateDebutAbsence", { required: true })}
          className={styles.input}
        />
      </div>

      <div className={styles.inputGroup}>
        <label className={styles.label}>Nombre de jours</label>
        <input
          type="number"
          step="0.5"
          {...register("nombre_jour_conge")}
          className={styles.input}
          readOnly={typeDeConge !== "congé standard"}
        />
      </div>

      <div className={styles.inputGroup}>
        <label className={styles.label}>Date de fin</label>
        <input
          type="date"
          {...register("dateFinAbsence")}
          className={styles.input}
          readOnly
        />
      </div>

      {typeDeConge === "congé standard" && (
        <div className={styles.inputGroup}>
          <label className={styles.label}>Motif</label>
          <textarea
            {...register("motif", { required: true })}
            className={styles.input}
          />
        </div>
      )}

      <div className={styles.buttonContainer}>
        <button type="submit" className={styles.button}>
          {conge ? "Modifier" : "Ajouter"}
        </button>
      </div>
    </form>
  );
}
