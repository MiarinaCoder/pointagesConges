// "use client";

// import { useState, useEffect } from 'react';
// import api from '@/services/api';
// import styles from './Parametres.module.css';
// import ParametresForm from '../../components/forms/ParametresFrom';
// import Layout from '../../components/layout/Layout';

// const Parametres = () => {
//   const [params, setParams] = useState({
//     tempsDebutTravail: '',
//     dureeJourneeTravail: '',
//     seuilHeuresSupp: '',
//     montantPenalite: ''
//   });
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   useEffect(() => {
//     fetchParameters();
//   }, []);

//   const fetchParameters = async () => {
//     try {
//       const response = await api.get('/parametres');
//       setParams(response.data);
//     } catch (error) {
//       console.error("Erreur lors de la récupération des paramètres", error);
//     }
//   };

//   const handleChange = (e) => {
//     setParams({
//       ...params,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await api.post('/parametres', params);
//       alert('Paramètres mis à jour avec succès');
//       setIsModalOpen(false);
//       fetchParameters();
//     } catch (error) {
//       console.error("Erreur lors de la mise à jour des paramètres", error);
//       alert('Erreur lors de la mise à jour des paramètres');
//     }
//   };

//   return (
//     <Layout>
//       <div className={styles.container}>
//         <h1 className={styles.title}>Paramètres de Travail</h1>
//         <div className={styles.paramList}>
//           <h2>Paramètres actuels</h2>
//           <p><strong>Heure de Début:</strong> {params.tempsDebutTravail}</p>
//           <p><strong>Durée de la Journée:</strong> {params.dureeJourneeTravail} heures</p>
//           <p><strong>Seuil Heures Supplémentaires:</strong> {params.seuilHeuresSupp} heures</p>
//           <p><strong>Montant Pénalité:</strong> {params.montantPenalite} unités</p>
//           <button onClick={() => setIsModalOpen(true)} className={styles.button}>Modifier</button>
//         </div>

//         <ParametresForm isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
//           <h2>Modifier les paramètres</h2>
//           <form onSubmit={handleSubmit} className={styles.form}>
//             <div className={styles.formGroup}>
//               <label className={styles.label}>Heure de Début</label>
//               <input type="time" name="tempsDebutTravail" value={params.tempsDebutTravail} onChange={handleChange} className={styles.input} />
//             </div>
//             <div className={styles.formGroup}>
//               <label className={styles.label}>Durée de la Journée (heures)</label>
//               <input type="number" name="dureeJourneeTravail" value={params.dureeJourneeTravail} onChange={handleChange} className={styles.input} />
//             </div>
//             <div className={styles.formGroup}>
//               <label className={styles.label}>Seuil Heures Supplémentaires</label>
//               <input type="number" name="seuilHeuresSupp" value={params.seuilHeuresSupp} onChange={handleChange} className={styles.input} />
//             </div>
//             <div className={styles.formGroup}>
//               <label className={styles.label}>Montant Pénalité (en unité)</label>
//               <input type="number" name="montantPenalite" value={params.montantPenalite} onChange={handleChange} className={styles.input} />
//             </div>
//             <button type="submit" className={styles.button}>Mettre à jour</button>
//           </form>
//         </ParametresForm>
//       </div>
//     </Layout>
//   );
// };

// export default Parametres;


"use client";

import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/services/api';
import styles from './Parametres.module.css';
import ParametresForm from '../../components/forms/ParametresFrom';
import Layout from '../../components/layout/Layout';
import AuthContext from '@/context/authContext';

const Parametres = () => {
  const { user } = useContext(AuthContext);
  const router = useRouter();
  const [params, setParams] = useState({
    tempsDebutTravail: '',
    dureeJourneeTravail: '',
    seuilHeuresSupp: '',
    montantPenalite: '',
    heurePause: ''
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (user?.role !== 'administrateur') {
      router.push('/');
    } else {
      fetchParameters();
    }
  }, [user, router]);

  if (user?.role !== 'administrateur') return null;

  const fetchParameters = async () => {
    try {
      const response = await api.get('/parametres', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setParams(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des paramètres", error);
    }
  };

  const handleChange = (e) => {
    setParams({
      ...params,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
       await api.post('/parametres', params, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setIsModalOpen(false);
      fetchParameters();
    } catch (error) {
      console.error("Erreur lors de la mise à jour des paramètres", error);
      alert('Erreur lors de la mise à jour des paramètres');
    }
  };

  return (
    <Layout>
      <div className={styles.container}>
        <h1 className={styles.title}>Paramètres de Travail</h1>
        <div className={styles.paramList}>
          <h2>Paramètres actuels</h2>
          <p><strong>Heure de Début:</strong> {params.tempsDebutTravail}</p>
          <p><strong>Durée de la Journée:</strong> {params.dureeJourneeTravail} heures</p>
          <p><strong>Seuil Heures Supplémentaires:</strong> {params.seuilHeuresSupp} heures</p>
          <p><strong>Montant Pénalité:</strong> {params.montantPenalite} unités</p>
          <p><strong>Heure de Pause:</strong> {params.heurePause}</p>
          <button onClick={() => setIsModalOpen(true)} className={styles.button}>Modifier</button>
        </div>

        <ParametresForm isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <h2>Modifier les paramètres</h2>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Heure de Début</label>
              <input type="time" name="tempsDebutTravail" value={params.tempsDebutTravail} onChange={handleChange} className={styles.input} />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Durée de la Journée (heures)</label>
              <input type="number" name="dureeJourneeTravail" value={params.dureeJourneeTravail} onChange={handleChange} className={styles.input} />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Seuil Heures Supplémentaires</label>
              <input type="number" name="seuilHeuresSupp" value={params.seuilHeuresSupp} onChange={handleChange} className={styles.input} />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Montant Pénalité (en unité)</label>
              <input type="number" name="montantPenalite" value={params.montantPenalite} onChange={handleChange} className={styles.input} />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Heure de Pause</label>
              <input type="time" name="heurePause" value={params.heurePause} onChange={handleChange} className={styles.input} />
            </div>
            <button type="submit" className={styles.button}>Mettre à jour</button>
          </form>
        </ParametresForm>
      </div>
    </Layout>
  );
};

export default Parametres;
