"use client";

import { useState, useEffect } from "react";
import styles from "../../styles/components/AbsencesStats.module.css";
import api from "../../services/api";
import { FaChevronLeft, FaChevronRight, FaCalendarAlt, FaSpinner } from "react-icons/fa";
import moment from "moment";
import "moment/locale/fr";

moment.locale('fr');

export default function AbsencesStats({userId}) {
  const [absences, setAbsences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("today");
  const [offset, setOffset] = useState(0);
  const [error, setError] = useState(null);

  const fetchAbsences = async () => {
    try {
      setLoading(true);
      setError(null);
      const endpoint = userId ? `/absence/period/${userId}` : `/absence/period`;

      const response = await api.post(
        endpoint,
        {
          period: activeTab,
          offset: parseInt(offset),
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (response.data) {
        setAbsences(response.data);
      }
    } catch (error) {
      setError("Une erreur est survenue lors du chargement des données");
      console.error(`Error fetching absences:`, error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAbsences();
  }, [activeTab, offset]);

  const getPeriodLabel = () => {
    switch (activeTab) {
      case "today":
        return moment().subtract(offset, "days").format("DD MMMM YYYY");
      case "week":
        return `Semaine du ${moment()
          .subtract(offset, "weeks")
          .startOf("week")
          .format("DD MMMM")} au ${moment()
          .subtract(offset, "weeks")
          .endOf("week")
          .format("DD MMMM YYYY")}`;
      case "month":
        return moment().subtract(offset, "months").format("MMMM YYYY");
      default:
        return "";
    }
  };

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p>{error}</p>
        <button onClick={fetchAbsences} className={styles.retryButton}>
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.tabs}>
        {[
          { id: "today", label: "Aujourd'hui" },
          { id: "week", label: "Cette Semaine" },
          { id: "month", label: "Ce Mois" },
        ].map((tab) => (
          <button
            key={tab.id}
            className={`${styles.tab} ${activeTab === tab.id ? styles.active : ""}`}
            onClick={() => {
              setActiveTab(tab.id);
              setOffset(0);
            }}
          >
            <FaCalendarAlt className={styles.tabIcon} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className={styles.periodNavigation}>
        <button 
          className={styles.navButton}
          onClick={() => setOffset(offset + 1)}
        >
          <FaChevronLeft /> Précédent
        </button>
        <span className={styles.periodLabel}>
          <FaCalendarAlt className={styles.calendarIcon} />
          {getPeriodLabel()}
        </span>
        <button
          className={styles.navButton}
          onClick={() => setOffset(Math.max(0, offset - 1))}
          disabled={offset === 0}
        >
          Suivant <FaChevronRight />
        </button>
      </div>

      <div className={styles.tableContainer}>
        {loading ? (
          <div className={styles.loading}>
            <FaSpinner className={styles.spinner} />
            Chargement des données...
          </div>
        ) : absences.length === 0 ? (
          <div className={styles.noData}>
            <FaCalendarAlt className={styles.noDataIcon} />
            <p>Aucune absence pour cette période</p>
          </div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Employé</th>
                <th>Date Début</th>
                <th>Date Fin</th>
                <th>Durée</th>
              </tr>
            </thead>
            <tbody>
              {absences.map((absence, index) => (
                <tr key={`${absence.idAbsence}-${absence.dateDebut}-${index}`}>
                  <td className={styles.employeeName}>
                    {`${absence.prenom} ${absence.nom}`}
                  </td>
                  <td>{moment(absence.dateDebutAbsence).format("DD MMMM YYYY")}</td>
                  <td>{moment(absence.dateFinAbsence).format("DD MMMM YYYY")}</td>
                  <td>
                    {moment(absence.dateFinAbsence).diff(
                      moment(absence.dateDebutAbsence),
                      'days'
                    ) + 1} jour(s)
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
