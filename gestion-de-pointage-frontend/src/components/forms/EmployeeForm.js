import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { HiUser, HiMail, HiLockClosed, HiUserCircle } from "react-icons/hi";
import styles from "./EmployeeForm.module.css";

export default function EmployeeForm({ utilisateur, onSubmit, onClose }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: utilisateur || {
      prenom: "",
      nom: "",
      email: "",
      role: "",
      motDePasse: "",
      matriculation: "",
      fonction: "",
      statusMatrimoniale: "",
      adresse: "",
      genre: "",
    },
  });

  useEffect(() => {
    if (utilisateur) {
      reset(utilisateur);
    }
  }, [utilisateur, reset]);

  const onSubmitForm = (data) => {
    onSubmit(data);
    if (!utilisateur) {
      reset();
    }
    onClose();
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className={styles.formContainer}>
    <div className={styles.inputGroup}>
          <label htmlFor="matriculation" className={styles.label}>
            Matriculation
          </label>
          <div className={styles.inputWrapper}>
            <HiUserCircle className={styles.icon} />
            <input
              {...register("matriculation", {
                required: "La matriculation est requise",
              })}
              type="text"
              id="matriculation"
              className={styles.input}
              placeholder="Entrez la matriculation"
            />
          </div>
          {errors.matriculation && (
            <p className={styles.error}>{errors.matriculation.message}</p>
          )}
        </div>


      <div className={styles.formGrid}>
        <div className={styles.inputGroup}>
          <label htmlFor="nom" className={styles.label}>
            Nom
          </label>
          <div className={styles.inputWrapper}>
            <HiUser className={styles.icon} />
            <input
              {...register("nom", { required: "Le nom est requis" })}
              type="text"
              id="nom"
              className={styles.input}
              placeholder="Entrez le nom"
            />
          </div>
          {errors.nom && <p className={styles.error}>{errors.nom.message}</p>}
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="prenom" className={styles.label}>
            Prénoms
          </label>
          <div className={styles.inputWrapper}>
            <HiUser className={styles.icon} />
            <input
              {...register("prenom", { required: "Le prénom est requis" })}
              type="text"
              id="prenom"
              className={styles.input}
              placeholder="Entrez le prénom"
            />
          </div>
          {errors.prenom && (
            <p className={styles.error}>{errors.prenom.message}</p>
          )}
        </div>

        <div className={styles.inputGroup}>
        <label className={styles.label}>Genre</label>
        <div className={styles.radioGroup}>
          <div className={styles.radioOption}>
            <input
              {...register("genre", { required: "Le genre est requis" })}
              type="radio"
              value="masculin"
              id="masculin"
            />
            <label htmlFor="masculin">Masculin</label>
          </div>
          <div className={styles.radioOption}>
            <input
              {...register("genre", { required: "Le genre est requis" })}
              type="radio"
              value="féminin"
              id="féminin"
            />
            <label htmlFor="feminin">Féminin</label>
          </div>
        </div>
        {errors.genre && <p className={styles.error}>{errors.genre.message}</p>}
      </div>

      <div className={styles.inputGroup}>
          <label htmlFor="fonction" className={styles.label}>
            Fonction
          </label>
          <div className={styles.inputWrapper}>
            <HiUserCircle className={styles.icon} />
            <input
              {...register("fonction", { required: "La fonction est requise" })}
              type="text"
              id="fonction"
              className={styles.input}
              placeholder="Entrez la fonction"
            />
          </div>
          {errors.adresse && (
            <p className={styles.error}>{errors.adresse.message}</p>
          )}
        </div>
        {/* <div className={styles.inputGroup}>
          <label htmlFor="role" className={styles.label}>
            Rôle
          </label>
          <div className={styles.inputWrapper}>
            <HiUserCircle className={styles.icon} />
            <input
              {...register("role", { required: "Le rôle est requis" })}
              type="text"
              id="role"
              className={styles.input}
              placeholder="Entrez le rôle"
            />
          </div>
          {errors.role && <p className={styles.error}>{errors.role.message}</p>}
        </div> */}
        <div className={styles.inputGroup}>
          <label htmlFor="role" className={styles.label}>
            Rôle
          </label>
          <div className={styles.inputWrapper}>
            <HiUserCircle className={styles.icon} />
            <select
              {...register("role", { required: "Le rôle est requis" })}
              id="role"
              className={styles.input}
            >
              <option value="">Sélectionner un rôle</option>
              <option value="employe">Employé</option>
              <option value="administrateur">Administrateur</option>
              <option value="manager">Manager</option>
            </select>
          </div>
          {errors.role && <p className={styles.error}>{errors.role.message}</p>}
        </div>

        <div className={styles.inputGroup} style={{ gridColumn: "span 2" }}>
          <label htmlFor="email" className={styles.label}>
            Email
          </label>
          <div className={styles.inputWrapper}>
            <HiMail className={styles.icon} />
            <input
              {...register("email", {
                required: "L'email est requis",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Adresse email invalide",
                },
              })}
              type="email"
              id="email"
              className={styles.input}
              placeholder="Entrez l'email"
            />
          </div>
          {errors.email && (
            <p className={styles.error}>{errors.email.message}</p>
          )}
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="adresse" className={styles.label}>
            Adresse
          </label>
          <div className={styles.inputWrapper}>
            <HiUserCircle className={styles.icon} />
            <input
              {...register("adresse", { required: "L'adresse est requise" })}
              type="text"
              id="adresse"
              className={styles.input}
              placeholder="Entrez l'adresse"
            />
          </div>
          {errors.adresse && (
            <p className={styles.error}>{errors.adresse.message}</p>
          )}
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="statusMatrimoniale" className={styles.label}>
            Status Matrimoniale
          </label>
          <div className={styles.inputWrapper}>
            <HiUserCircle className={styles.icon} />
            <input
              {...register("statusMatrimoniale", {
                required: "Le status matrimoniale est requise",
              })}
              type="text"
              id="statusMatrimoniale"
              className={styles.input}
              placeholder="Entrez le status matrimoniale"
            />
          </div>
          {errors.statusMatrimoniale && (
            <p className={styles.error}>{errors.statusMatrimoniale.message}</p>
          )}
        </div>

        {!utilisateur && (
          <div className={styles.inputGroup}>
            <label htmlFor="motDePasse" className={styles.label}>
              Mot de passe
            </label>
            <div className={styles.inputWrapper}>
              <HiLockClosed className={styles.icon} />
              <input
                {...register("motDePasse", {
                  required: "Le mot de passe est requis",
                  minLength: {
                    value: 8,
                    message:
                      "Le mot de passe doit contenir au moins 8 caractères",
                  },
                  maxLength: {
                    value: 12,
                    message:
                      "Le mot de passe ne doit pas dépasser 12 caractères",
                  },
                })}
                type="password"
                id="motDePasse"
                className={styles.input}
                placeholder="Entrez le mot de passe"
              />
            </div>
            {errors.motDePasse && (
              <p className={styles.error}>{errors.motDePasse.message}</p>
            )}
          </div>
        )}
      </div>
      <button type="submit" className={styles.button}>
        {utilisateur ? "Mettre à jour" : "Ajouter"}
      </button>
    </form>
  );
}
