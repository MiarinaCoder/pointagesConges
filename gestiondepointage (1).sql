-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le : jeu. 26 sep. 2024 à 09:11
-- Version du serveur : 8.3.0
-- Version de PHP : 8.2.18

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `gestiondepointage`
--

DELIMITER $$
--
-- Procédures
--
DROP PROCEDURE IF EXISTS `ajouterJustificationAbsence`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `ajouterJustificationAbsence` (IN `p_idAbsence` INT, IN `p_nomFichier` VARCHAR(255), IN `p_fichierJustificatif` LONGBLOB)   BEGIN
    INSERT INTO JustificationAbsence (idAbsence, nomFichier, fichierJustificatif)
    VALUES (p_idAbsence, p_nomFichier, p_fichierJustificatif);

    -- Log the action in the Journal
    INSERT INTO Journal (action, idUtilisateur, details)
    SELECT 'Justification d\'absence ajoutée', idEmploye,
    CONCAT('Justification d\'absence pour la période du ', dateDebutAbsence, ' au ', dateFinAbsence, ' a été ajoutée.')
    FROM Absence WHERE idAbsence = p_idAbsence;
END$$

DROP PROCEDURE IF EXISTS `connecterUtilisateur`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `connecterUtilisateur` (IN `p_id` INT, IN `p_ip` VARCHAR(45), IN `p_navigateur` VARCHAR(255), IN `p_systeme` VARCHAR(255))   BEGIN
    INSERT INTO Connexion (idUtilisateur, adresseIP, navigateur, systemeExploitation)
    VALUES (p_id, p_ip, p_navigateur, p_systeme);
    
    INSERT INTO Journal (action, idUtilisateur, details)
    VALUES ('Connexion', p_id, CONCAT("Connexion réussie depuis l\'adresse IP: ", p_ip));
END$$

DROP PROCEDURE IF EXISTS `creerAbsence`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `creerAbsence` (IN `p_idEmploye` INT, IN `p_dateDebut` DATE, IN `p_dateFin` DATE, IN `p_motif` VARCHAR(255))   BEGIN
    INSERT INTO Absence (idEmploye, dateDebutAbsence, dateFinAbsence, motif)
    VALUES (p_idEmploye, p_dateDebut, p_dateFin, p_motif);

    -- Log the action in the Journal
    INSERT INTO Journal (action, idUtilisateur, details)
    VALUES ('Demande d\'absence', p_idEmploye, CONCAT('Absence demandée du ', p_dateDebut, ' au ', p_dateFin, '.'));
END$$

DROP PROCEDURE IF EXISTS `deconnecterUtilisateur`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `deconnecterUtilisateur` (IN `p_idConnexion` INT)   BEGIN
    UPDATE Connexion
    SET horodatageDeconnexion = CURRENT_TIMESTAMP
    WHERE idConnexion = p_idConnexion;

    INSERT INTO Journal (action, idUtilisateur, details)
    SELECT 'Déconnexion', idUtilisateur, 'Déconnexion réussie'
    FROM Connexion WHERE idConnexion = p_idConnexion;
END$$

DROP PROCEDURE IF EXISTS `gererAbsence`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `gererAbsence` (IN `p_idAbsence` INT, IN `p_statut` ENUM('approuvee','rejete'))   BEGIN
    UPDATE Absence
    SET statut = p_statut
    WHERE idAbsence = p_idAbsence;

    -- Log the approval or rejection in the Journal
    INSERT INTO Journal (action, idUtilisateur, details)
    SELECT CASE WHEN p_statut = 'approuvee' THEN 'Absence approuvée' ELSE 'Absence rejetée' END, idEmploye,
    CONCAT('L\'absence du ', dateDebutAbsence, ' au ', dateFinAbsence, ' a été ', p_statut, '.')
    FROM Absence WHERE idAbsence = p_idAbsence;
END$$

DROP PROCEDURE IF EXISTS `modifierParametresTravail`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `modifierParametresTravail` (IN `p_tempsDebut` TIME, IN `p_dureeJournee` FLOAT, IN `p_seuilHeuresSupp` FLOAT, IN `p_montantPenalite` FLOAT)   BEGIN
    UPDATE ParametresTravail
    SET tempsDebutTravail = p_tempsDebut,
        dureeJourneeTravail = p_dureeJournee,
        seuilHeuresSupp = p_seuilHeuresSupp,
        montantPenalite = p_montantPenalite;

    INSERT INTO Journal (action, idUtilisateur, details)
    VALUES ('Modification paramètres', 1, 'Les paramètres de travail ont été modifiés.');
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Structure de la table `absence`
--

DROP TABLE IF EXISTS `absence`;
CREATE TABLE IF NOT EXISTS `absence` (
  `idAbsence` int NOT NULL AUTO_INCREMENT,
  `idEmploye` int NOT NULL,
  `dateDebutAbsence` date NOT NULL,
  `dateFinAbsence` date DEFAULT NULL,
  `motif` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `statut` enum('en_attente','approuvee','rejete') COLLATE utf8mb4_unicode_ci DEFAULT 'en_attente',
  `horodatageCreation` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`idAbsence`),
  KEY `idEmploye` (`idEmploye`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déclencheurs `absence`
--
DROP TRIGGER IF EXISTS `log_creation_absence`;
DELIMITER $$
CREATE TRIGGER `log_creation_absence` AFTER INSERT ON `absence` FOR EACH ROW BEGIN
    INSERT INTO Journal (action, idUtilisateur, details)
    VALUES ("Création d'absence", NEW.idEmploye, CONCAT('Absence demandée du ', NEW.dateDebutAbsence, ' au ', NEW.dateFinAbsence));
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Structure de la table `bacrecyclage`
--

DROP TABLE IF EXISTS `bacrecyclage`;
CREATE TABLE IF NOT EXISTS `bacrecyclage` (
  `idBac` int NOT NULL AUTO_INCREMENT,
  `contenuBac` json NOT NULL,
  PRIMARY KEY (`idBac`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `connexion`
--

DROP TABLE IF EXISTS `connexion`;
CREATE TABLE IF NOT EXISTS `connexion` (
  `idConnexion` int NOT NULL AUTO_INCREMENT,
  `idUtilisateur` int NOT NULL,
  `horodatageConnexion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `horodatageDeconnexion` timestamp NULL DEFAULT NULL,
  `adresseIP` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `navigateur` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `systemeExploitation` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`idConnexion`),
  KEY `idUtilisateur` (`idUtilisateur`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déclencheurs `connexion`
--
DROP TRIGGER IF EXISTS `log_connexion`;
DELIMITER $$
CREATE TRIGGER `log_connexion` AFTER INSERT ON `connexion` FOR EACH ROW BEGIN
    INSERT INTO Journal (action, idUtilisateur, details)
    VALUES ('Connexion', NEW.idUtilisateur, CONCAT("Connexion réussie depuis l'adresse IP:" , NEW.adresseIP));
END
$$
DELIMITER ;
DROP TRIGGER IF EXISTS `log_deconnexion`;
DELIMITER $$
CREATE TRIGGER `log_deconnexion` AFTER UPDATE ON `connexion` FOR EACH ROW BEGIN
    IF OLD.horodatageDeconnexion IS NULL AND NEW.horodatageDeconnexion IS NOT NULL THEN
        INSERT INTO Journal (action, idUtilisateur, details)
        VALUES ('Déconnexion', NEW.idUtilisateur, 'Déconnexion réussie');
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Structure de la table `journal`
--

DROP TABLE IF EXISTS `journal`;
CREATE TABLE IF NOT EXISTS `journal` (
  `idLog` int NOT NULL AUTO_INCREMENT,
  `horodatage` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `action` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `idUtilisateur` int NOT NULL,
  `details` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`idLog`),
  KEY `idUtilisateur` (`idUtilisateur`)
) ENGINE=MyISAM AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `journal`
--

INSERT INTO `journal` (`idLog`, `horodatage`, `action`, `idUtilisateur`, `details`) VALUES
(1, '2024-09-25 12:59:48', 'Modification', 1, 'Utilisateur Miarina a été modifié.'),
(2, '2024-09-25 13:31:52', 'Modification', 1, 'Utilisateur Miarina a été modifié.'),
(3, '2024-09-25 14:22:24', 'Nouvelle session de travail', 0, 'Nouvelle session de travail commencée à 2024-09-25 16:22:24'),
(4, '2024-09-25 14:26:56', 'Nouvelle session de travail', 1, 'Nouvelle session de travail commencée à 2024-09-25 16:26:57'),
(5, '2024-09-25 14:27:25', 'Nouvelle session de travail', 1, 'Nouvelle session de travail commencée à 2024-09-25 16:27:25'),
(6, '2024-09-25 14:43:35', 'Modification', 1, 'Utilisateur Miarina a été modifié.'),
(7, '2024-09-25 14:45:23', 'Modification', 1, 'Utilisateur Miarina a été modifié.'),
(8, '2024-09-25 14:48:04', 'Modification', 1, 'Utilisateur Miarina a été modifié.'),
(9, '2024-09-25 14:48:10', 'Nouvelle session de travail', 1, 'Nouvelle session de travail commencée à 2024-09-25 16:48:10'),
(10, '2024-09-25 14:49:20', 'Nouvelle session de travail', 1, 'Nouvelle session de travail commencée à 2024-09-25 16:49:20'),
(11, '2024-09-25 14:51:46', 'Nouvelle session de travail', 1, 'Nouvelle session de travail commencée à 2024-09-25 16:51:47'),
(12, '2024-09-26 07:29:53', 'Nouvelle session de travail', 1, 'Nouvelle session de travail commencée à 2024-09-26 09:29:54'),
(13, '2024-09-26 07:29:54', 'Nouvelle session de travail', 1, 'Nouvelle session de travail commencée à 2024-09-26 09:29:54'),
(14, '2024-09-26 07:31:31', 'Nouvelle session de travail', 1, 'Nouvelle session de travail commencée à 2024-09-26 09:31:31'),
(15, '2024-09-26 08:19:21', 'Nouvelle session de travail', 1, 'Nouvelle session de travail commencée à 2024-09-26 10:19:21'),
(16, '2024-09-26 08:19:48', 'Nouvelle session de travail', 1, 'Nouvelle session de travail commencée à 2024-09-26 10:19:49');

-- --------------------------------------------------------

--
-- Structure de la table `justificationabsence`
--

DROP TABLE IF EXISTS `justificationabsence`;
CREATE TABLE IF NOT EXISTS `justificationabsence` (
  `idJustification` int NOT NULL AUTO_INCREMENT,
  `idAbsence` int NOT NULL,
  `fichierJustificatif` longblob NOT NULL,
  `nomFichier` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `dateAjout` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`idJustification`),
  KEY `idAbsence` (`idAbsence`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déclencheurs `justificationabsence`
--
DROP TRIGGER IF EXISTS `log_ajout_justification`;
DELIMITER $$
CREATE TRIGGER `log_ajout_justification` AFTER INSERT ON `justificationabsence` FOR EACH ROW BEGIN
    INSERT INTO Journal (action, idUtilisateur, details)
    SELECT 'Ajout de justification', a.idEmploye,
    CONCAT('Justification ajoutée pour l'absence du ', a.dateDebutAbsence, ' au ', a.dateFinAbsence)
    FROM Absence a WHERE a.idAbsence = NEW.idAbsence;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Structure de la table `notification`
--

DROP TABLE IF EXISTS `notification`;
CREATE TABLE IF NOT EXISTS `notification` (
  `idNotification` int NOT NULL AUTO_INCREMENT,
  `idUtilisateur` int NOT NULL,
  `message` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `horodatage` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `lue` tinyint(1) DEFAULT '0',
  `estDelai` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`idNotification`),
  KEY `idUtilisateur` (`idUtilisateur`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `parametressecurite`
--

DROP TABLE IF EXISTS `parametressecurite`;
CREATE TABLE IF NOT EXISTS `parametressecurite` (
  `authFacteur` tinyint(1) NOT NULL DEFAULT '0',
  `historiqueConnexion` json DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `parametrestravail`
--

DROP TABLE IF EXISTS `parametrestravail`;
CREATE TABLE IF NOT EXISTS `parametrestravail` (
  `tempsDebutTravail` time NOT NULL,
  `dureeJourneeTravail` float NOT NULL,
  `seuilHeuresSupp` float NOT NULL,
  `montantPenalite` float NOT NULL,
  `tauxPayeRapide` float NOT NULL,
  `tauxPayeNormal` float NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `penalite`
--

DROP TABLE IF EXISTS `penalite`;
CREATE TABLE IF NOT EXISTS `penalite` (
  `idPenalite` int NOT NULL AUTO_INCREMENT,
  `idEmploye` int NOT NULL,
  `montant` float NOT NULL,
  `date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `estApprouve` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`idPenalite`),
  KEY `idEmploye` (`idEmploye`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déclencheurs `penalite`
--
DROP TRIGGER IF EXISTS `log_penalite`;
DELIMITER $$
CREATE TRIGGER `log_penalite` AFTER INSERT ON `penalite` FOR EACH ROW BEGIN
    INSERT INTO Journal (action, idUtilisateur, details)
    VALUES ('Penalité', NEW.idEmploye, CONCAT('Penalité de ', NEW.montant, ' attribuée le ', NEW.date));
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Structure de la table `permissions`
--

DROP TABLE IF EXISTS `permissions`;
CREATE TABLE IF NOT EXISTS `permissions` (
  `id_premissions` int NOT NULL AUTO_INCREMENT,
  `nom_permission` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id_premissions`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `preferencesnotification`
--

DROP TABLE IF EXISTS `preferencesnotification`;
CREATE TABLE IF NOT EXISTS `preferencesnotification` (
  `idUtilisateur` int NOT NULL,
  `activerEmailNotifications` tinyint(1) DEFAULT '1',
  `activerPushNotifications` tinyint(1) DEFAULT '0',
  `typesNotification` json DEFAULT NULL,
  PRIMARY KEY (`idUtilisateur`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `recuperation`
--

DROP TABLE IF EXISTS `recuperation`;
CREATE TABLE IF NOT EXISTS `recuperation` (
  `idRecuperation` int NOT NULL AUTO_INCREMENT,
  `idEmploye` int NOT NULL,
  `heuresRecuperees` float NOT NULL,
  `date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `estApprouve` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`idRecuperation`),
  KEY `idEmploye` (`idEmploye`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `role_permissions`
--

DROP TABLE IF EXISTS `role_permissions`;
CREATE TABLE IF NOT EXISTS `role_permissions` (
  `id_role_permissions` int NOT NULL,
  `role_name` enum('employe','manager','administrateur') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `id_permissions` int NOT NULL,
  PRIMARY KEY (`id_role_permissions`),
  KEY `role_name` (`role_name`),
  KEY `id_permissions` (`id_permissions`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `sessiontravail`
--

DROP TABLE IF EXISTS `sessiontravail`;
CREATE TABLE IF NOT EXISTS `sessiontravail` (
  `idSession` int NOT NULL AUTO_INCREMENT,
  `heureDebut` datetime NOT NULL,
  `heureFin` datetime DEFAULT NULL,
  `idEmploye` int NOT NULL,
  `heuresTravaillees` float DEFAULT '0',
  `estDelai` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`idSession`),
  KEY `idEmploye` (`idEmploye`)
) ENGINE=MyISAM AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `sessiontravail`
--

INSERT INTO `sessiontravail` (`idSession`, `heureDebut`, `heureFin`, `idEmploye`, `heuresTravaillees`, `estDelai`) VALUES
(1, '2024-09-25 16:22:24', NULL, 0, 0, 0),
(2, '2024-09-25 16:26:57', NULL, 1, 0, 0),
(3, '2024-09-25 16:27:25', NULL, 1, 0, 0),
(4, '2024-09-25 16:48:10', NULL, 1, 0, 0),
(5, '2024-09-25 16:49:20', NULL, 1, 0, 0),
(6, '2024-09-25 16:51:47', NULL, 1, 0, 0),
(7, '2024-09-26 09:29:54', NULL, 1, 0, 0),
(8, '2024-09-26 09:29:54', NULL, 1, 0, 0),
(9, '2024-09-26 09:31:31', NULL, 1, 0, 0),
(10, '2024-09-26 10:19:21', NULL, 1, 0, 0),
(11, '2024-09-26 10:19:49', NULL, 1, 0, 0);

--
-- Déclencheurs `sessiontravail`
--
DROP TRIGGER IF EXISTS `log_nouvelle_session_travail`;
DELIMITER $$
CREATE TRIGGER `log_nouvelle_session_travail` AFTER INSERT ON `sessiontravail` FOR EACH ROW BEGIN
    INSERT INTO Journal (action, idUtilisateur, details)
    VALUES ('Nouvelle session de travail', NEW.idEmploye, CONCAT('Nouvelle session de travail commencée à ', NEW.heureDebut));
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Structure de la table `utilisateur`
--

DROP TABLE IF EXISTS `utilisateur`;
CREATE TABLE IF NOT EXISTS `utilisateur` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nom` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `motDePasse` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('employe','administrateur','manager') COLLATE utf8mb4_unicode_ci NOT NULL,
  `actif` tinyint(1) DEFAULT '1',
  `preferencesNotification` json DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `utilisateur`
--

INSERT INTO `utilisateur` (`id`, `nom`, `email`, `motDePasse`, `role`, `actif`, `preferencesNotification`) VALUES
(1, 'Miarina', 'mimi@gmail.com', '$2a$12$58/LtyRcC0iOrPsUtdUfKOdy/xbhY2CO50bSyrg4cHFp.XXPTDsiO', 'employe', 0, '{\"pushNotifications\": false, \"typesNotification\": [\"alerte\", \"rappel\"], \"emailNotifications\": true}'),
(2, 'Richie', 'richie@gmail.com', '$2a$12$58/LtyRcC0iOrPsUtdUfKOdy/xbhY2CO50bSyrg4cHFp.XXPTDsiO', 'administrateur', 1, '{\"pushNotifications\": false, \"typesNotification\": [\"alerte\", \"rappel\"], \"emailNotifications\": true}');

--
-- Déclencheurs `utilisateur`
--
DROP TRIGGER IF EXISTS `log_modification_utilisateur`;
DELIMITER $$
CREATE TRIGGER `log_modification_utilisateur` AFTER UPDATE ON `utilisateur` FOR EACH ROW BEGIN
    INSERT INTO Journal (action, idUtilisateur, details)
    VALUES ('Modification', NEW.id, CONCAT('Utilisateur ', NEW.nom, ' a été modifié.'));
END
$$
DELIMITER ;
DROP TRIGGER IF EXISTS `log_suppression_utilisateur`;
DELIMITER $$
CREATE TRIGGER `log_suppression_utilisateur` BEFORE DELETE ON `utilisateur` FOR EACH ROW BEGIN
    INSERT INTO Journal (action, idUtilisateur, details)
    VALUES ('Suppression', OLD.id, CONCAT('Utilisateur ', OLD.nom, ' a été supprimé.'));
    
    INSERT INTO BacRecyclage (contenuBac)
    VALUES (JSON_OBJECT('id', OLD.id, 'nom', OLD.nom, 'role', OLD.role, 'email', OLD.email));
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Doublure de structure pour la vue `vue_absences_avec_justifications`
-- (Voir ci-dessous la vue réelle)
--
DROP VIEW IF EXISTS `vue_absences_avec_justifications`;
CREATE TABLE IF NOT EXISTS `vue_absences_avec_justifications` (
`dateAjout` timestamp
,`dateDebutAbsence` date
,`dateFinAbsence` date
,`idAbsence` int
,`motif` varchar(255)
,`nom` varchar(255)
,`nomFichier` varchar(255)
,`statut` enum('en_attente','approuvee','rejete')
);

-- --------------------------------------------------------

--
-- Doublure de structure pour la vue `vue_actions_utilisateur`
-- (Voir ci-dessous la vue réelle)
--
DROP VIEW IF EXISTS `vue_actions_utilisateur`;
CREATE TABLE IF NOT EXISTS `vue_actions_utilisateur` (
`action` varchar(255)
,`details` text
,`horodatage` timestamp
,`idLog` int
,`nom` varchar(255)
);

-- --------------------------------------------------------

--
-- Doublure de structure pour la vue `vue_connexions_recents`
-- (Voir ci-dessous la vue réelle)
--
DROP VIEW IF EXISTS `vue_connexions_recents`;
CREATE TABLE IF NOT EXISTS `vue_connexions_recents` (
`adresseIP` varchar(45)
,`horodatageConnexion` timestamp
,`horodatageDeconnexion` timestamp
,`idConnexion` int
,`navigateur` varchar(255)
,`nom` varchar(255)
);

-- --------------------------------------------------------

--
-- Structure de la vue `vue_absences_avec_justifications`
--
DROP TABLE IF EXISTS `vue_absences_avec_justifications`;

DROP VIEW IF EXISTS `vue_absences_avec_justifications`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vue_absences_avec_justifications`  AS SELECT `a`.`idAbsence` AS `idAbsence`, `u`.`nom` AS `nom`, `a`.`dateDebutAbsence` AS `dateDebutAbsence`, `a`.`dateFinAbsence` AS `dateFinAbsence`, `a`.`motif` AS `motif`, `a`.`statut` AS `statut`, `j`.`nomFichier` AS `nomFichier`, `j`.`dateAjout` AS `dateAjout` FROM ((`absence` `a` left join `justificationabsence` `j` on((`a`.`idAbsence` = `j`.`idAbsence`))) join `utilisateur` `u` on((`a`.`idEmploye` = `u`.`id`))) ORDER BY `a`.`horodatageCreation` DESC ;

-- --------------------------------------------------------

--
-- Structure de la vue `vue_actions_utilisateur`
--
DROP TABLE IF EXISTS `vue_actions_utilisateur`;

DROP VIEW IF EXISTS `vue_actions_utilisateur`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vue_actions_utilisateur`  AS SELECT `j`.`idLog` AS `idLog`, `u`.`nom` AS `nom`, `j`.`action` AS `action`, `j`.`details` AS `details`, `j`.`horodatage` AS `horodatage` FROM (`journal` `j` join `utilisateur` `u` on((`j`.`idUtilisateur` = `u`.`id`))) ORDER BY `j`.`horodatage` DESC ;

-- --------------------------------------------------------

--
-- Structure de la vue `vue_connexions_recents`
--
DROP TABLE IF EXISTS `vue_connexions_recents`;

DROP VIEW IF EXISTS `vue_connexions_recents`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vue_connexions_recents`  AS SELECT `c`.`idConnexion` AS `idConnexion`, `u`.`nom` AS `nom`, `c`.`horodatageConnexion` AS `horodatageConnexion`, `c`.`horodatageDeconnexion` AS `horodatageDeconnexion`, `c`.`adresseIP` AS `adresseIP`, `c`.`navigateur` AS `navigateur` FROM (`connexion` `c` join `utilisateur` `u` on((`c`.`idUtilisateur` = `u`.`id`))) ORDER BY `c`.`horodatageConnexion` DESC ;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
