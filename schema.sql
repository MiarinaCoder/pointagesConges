-- Table: Utilisateur
CREATE TABLE Utilisateur (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    motDePasse VARCHAR(255) NOT NULL,
    role ENUM('employe', 'administrateur', 'manager') NOT NULL,
    actif BOOLEAN DEFAULT TRUE,
    preferencesNotification JSON DEFAULT NULL
);

-- Table: ParametresTravail
CREATE TABLE ParametresTravail (
    tempsDebutTravail TIME NOT NULL,
    dureeJourneeTravail FLOAT NOT NULL,
    seuilHeuresSupp FLOAT NOT NULL,
    montantPenalite FLOAT NOT NULL,
    tauxPayeRapide FLOAT NOT NULL,
    tauxPayeNormal FLOAT NOT NULL
);

-- Table: ParametresSecurite
CREATE TABLE ParametresSecurite (
    authFacteur BOOLEAN NOT NULL DEFAULT FALSE,
    historiqueConnexion JSON DEFAULT NULL
);

-- Table: PreferencesNotification
CREATE TABLE PreferencesNotification (
    idUtilisateur INT PRIMARY KEY,
    activerEmailNotifications BOOLEAN DEFAULT TRUE,
    activerPushNotifications BOOLEAN DEFAULT FALSE,
    typesNotification JSON DEFAULT NULL,
    FOREIGN KEY (idUtilisateur) REFERENCES Utilisateur(id)
);

-- Table: Notification
CREATE TABLE Notification (
    idNotification INT AUTO_INCREMENT PRIMARY KEY,
    idUtilisateur INT NOT NULL,
    message VARCHAR(255) NOT NULL,
    horodatage TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    lue BOOLEAN DEFAULT FALSE,
    estDelai BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (idUtilisateur) REFERENCES Utilisateur(id)
);

-- Table: Journal
CREATE TABLE Journal (
    idLog INT AUTO_INCREMENT PRIMARY KEY,
    horodatage TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    action VARCHAR(255) NOT NULL,
    idUtilisateur INT NOT NULL,
    details TEXT,
    FOREIGN KEY (idUtilisateur) REFERENCES Utilisateur(id)
);

-- Table: Connexion
CREATE TABLE Connexion (
    idConnexion INT AUTO_INCREMENT PRIMARY KEY,
    idUtilisateur INT NOT NULL,
    horodatageConnexion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    horodatageDeconnexion TIMESTAMP DEFAULT NULL,
    adresseIP VARCHAR(45),
    navigateur VARCHAR(255),
    systemeExploitation VARCHAR(255),
    FOREIGN KEY (idUtilisateur) REFERENCES Utilisateur(id)
);

-- Table: SessionTravail
CREATE TABLE SessionTravail (
    idSession INT AUTO_INCREMENT PRIMARY KEY,
    heureDebut DATETIME NOT NULL,
    heureFin DATETIME DEFAULT NULL,
    idEmploye INT NOT NULL,
    heuresTravaillees FLOAT DEFAULT 0,
    estDelai BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (idEmploye) REFERENCES Utilisateur(id)
);

-- Table: Penalite
CREATE TABLE Penalite (
    idPenalite INT AUTO_INCREMENT PRIMARY KEY,
    idEmploye INT NOT NULL,
    montant FLOAT NOT NULL,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estApprouve BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (idEmploye) REFERENCES Utilisateur(id)
);

-- Table: Recuperation
CREATE TABLE Recuperation (
    idRecuperation INT AUTO_INCREMENT PRIMARY KEY,
    idEmploye INT NOT NULL,
    heuresRecuperees FLOAT NOT NULL,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estApprouve BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (idEmploye) REFERENCES Utilisateur(id)
);

-- Table: BacRecyclage
CREATE TABLE BacRecyclage (
    idBac INT AUTO_INCREMENT PRIMARY KEY,
    contenuBac JSON NOT NULL
);

-- Triggers

-- Trigger for logging user connections
CREATE TRIGGER log_connexion
AFTER INSERT ON Connexion
FOR EACH ROW
BEGIN
    INSERT INTO Journal (action, idUtilisateur, details)
    VALUES ('Connexion', NEW.idUtilisateur, CONCAT("Connexion réussie depuis l\'adresse IP:" , NEW.adresseIP));
END;

-- Trigger for logging user disconnections
CREATE TRIGGER log_deconnexion
AFTER UPDATE ON Connexion
FOR EACH ROW
BEGIN
    IF OLD.horodatageDeconnexion IS NULL AND NEW.horodatageDeconnexion IS NOT NULL THEN
        INSERT INTO Journal (action, idUtilisateur, details)
        VALUES ('Déconnexion', NEW.idUtilisateur, 'Déconnexion réussie');
    END IF;
END;

-- Trigger for logging user deletion
CREATE TRIGGER log_suppression_utilisateur
BEFORE DELETE ON Utilisateur
FOR EACH ROW
BEGIN
    INSERT INTO Journal (action, idUtilisateur, details)
    VALUES ('Suppression', OLD.id, CONCAT('Utilisateur ', OLD.nom, ' a été supprimé.'));
    
    INSERT INTO BacRecyclage (contenuBac)
    VALUES (JSON_OBJECT('id', OLD.id, 'nom', OLD.nom, 'role', OLD.role, 'email', OLD.email));
END;

-- Trigger for logging user modification
CREATE TRIGGER log_modification_utilisateur
AFTER UPDATE ON Utilisateur
FOR EACH ROW
BEGIN
    INSERT INTO Journal (action, idUtilisateur, details)
    VALUES ('Modification', NEW.id, CONCAT('Utilisateur ', NEW.nom, ' a été modifié.'));
END;

-- Trigger for new work session
CREATE TRIGGER log_nouvelle_session_travail
AFTER INSERT ON SessionTravail
FOR EACH ROW
BEGIN
    INSERT INTO Journal (action, idUtilisateur, details)
    VALUES ('Nouvelle session de travail', NEW.idEmploye, CONCAT('Nouvelle session de travail commencée à ', NEW.heureDebut));
END;

-- Trigger for penalty logging
CREATE TRIGGER log_penalite
AFTER INSERT ON Penalite
FOR EACH ROW
BEGIN
    INSERT INTO Journal (action, idUtilisateur, details)
    VALUES ('Penalité', NEW.idEmploye, CONCAT('Penalité de ', NEW.montant, ' attribuée le ', NEW.date));
END;

-- Procedures

-- Procedure to log user connections
CREATE PROCEDURE connecterUtilisateur(IN p_id INT, IN p_ip VARCHAR(45), IN p_navigateur VARCHAR(255), IN p_systeme VARCHAR(255))
BEGIN
    INSERT INTO Connexion (idUtilisateur, adresseIP, navigateur, systemeExploitation)
    VALUES (p_id, p_ip, p_navigateur, p_systeme);
    
    INSERT INTO Journal (action, idUtilisateur, details)
    VALUES ('Connexion', p_id, CONCAT("Connexion réussie depuis l\'adresse IP: ", p_ip));
END;

-- Procedure to log user disconnections
CREATE PROCEDURE deconnecterUtilisateur(IN p_idConnexion INT)
BEGIN
    UPDATE Connexion
    SET horodatageDeconnexion = CURRENT_TIMESTAMP
    WHERE idConnexion = p_idConnexion;

    INSERT INTO Journal (action, idUtilisateur, details)
    SELECT 'Déconnexion', idUtilisateur, 'Déconnexion réussie'
    FROM Connexion WHERE idConnexion = p_idConnexion;
END;

-- Procedure to modify work parameters
CREATE PROCEDURE modifierParametresTravail(IN p_tempsDebut TIME, IN p_dureeJournee FLOAT, IN p_seuilHeuresSupp FLOAT, IN p_montantPenalite FLOAT)
BEGIN
    UPDATE ParametresTravail
    SET tempsDebutTravail = p_tempsDebut,
        dureeJourneeTravail = p_dureeJournee,
        seuilHeuresSupp = p_seuilHeuresSupp,
        montantPenalite = p_montantPenalite;

    INSERT INTO Journal (action, idUtilisateur, details)
    VALUES ('Modification paramètres', 1, 'Les paramètres de travail ont été modifiés.');
END;

-- Views

-- View of recent connections
CREATE VIEW vue_connexions_recents AS
SELECT c.idConnexion, u.nom, c.horodatageConnexion, c.horodatageDeconnexion, c.adresseIP, c.navigateur
FROM Connexion c
JOIN Utilisateur u ON c.idUtilisateur = u.id
ORDER BY c.horodatageConnexion DESC;

-- View of user actions
CREATE VIEW vue_actions_utilisateur AS
SELECT j.idLog, u.nom, j.action, j.details, j.horodatage
FROM Journal j
JOIN Utilisateur u ON j.idUtilisateur = u.id
ORDER BY j.horodatage DESC;