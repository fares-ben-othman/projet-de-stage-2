-- Create database and select it
CREATE DATABASE IF NOT EXISTS carsential CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE carsential;

-- Table agences
CREATE TABLE agences (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(100) NOT NULL,
  adresse TEXT NOT NULL,
  ville VARCHAR(100),
  telephone VARCHAR(20),
  email VARCHAR(100),
  is_deleted BOOLEAN DEFAULT FALSE,
  deleted_at DATETIME DEFAULT NULL
);

-- Table vehicules
CREATE TABLE vehicules (
  id INT AUTO_INCREMENT PRIMARY KEY,
  immatriculation VARCHAR(20) UNIQUE NOT NULL,
  marque VARCHAR(50),
  modele VARCHAR(50),
  annee INT,
  kilometrage BIGINT DEFAULT 0,
  statut ENUM('disponible', 'loue', 'maintenance', 'leasing', 'reserve') DEFAULT 'disponible',
  date_assurance DATE,
  agence_id INT,
  is_deleted BOOLEAN DEFAULT FALSE,
  deleted_at DATETIME DEFAULT NULL,
  FOREIGN KEY (agence_id) REFERENCES agences(id) ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Table clients
CREATE TABLE clients (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(100) NOT NULL,
  prenom VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  telephone VARCHAR(20) NOT NULL,
  cin VARCHAR(20) UNIQUE,
  is_deleted BOOLEAN DEFAULT FALSE,
  deleted_at DATETIME DEFAULT NULL
);

-- Table contrats
CREATE TABLE contrats (
  id INT AUTO_INCREMENT PRIMARY KEY,
  client_id INT NOT NULL,
  vehicule_id INT NOT NULL,
  agence_id INT NOT NULL,
  date_debut DATE NOT NULL,
  date_fin DATE NOT NULL,
  montant DECIMAL(10,2) NOT NULL,
  remise DECIMAL(5,2) DEFAULT 0,
  options_assurance BOOLEAN DEFAULT FALSE,
  options_gps BOOLEAN DEFAULT FALSE,
  options_conducteur_add BOOLEAN DEFAULT FALSE,
  etat_pickup ENUM('neuf', 'bon', 'abime', 'accidenté', 'autre') DEFAULT 'bon',
  km_initial INT,
  carburant_initial DECIMAL(5,2),
  etat_dropoff ENUM('neuf', 'bon', 'abime', 'accidenté', 'autre') DEFAULT 'bon',
  km_final INT,
  carburant_final DECIMAL(5,2),
  frais_supplementaires DECIMAL(10,2) DEFAULT 0,
  rapport_restitution TEXT,
  is_deleted BOOLEAN DEFAULT FALSE,
  deleted_at DATETIME DEFAULT NULL,
  FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (vehicule_id) REFERENCES vehicules(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  FOREIGN KEY (agence_id) REFERENCES agences(id) ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Table transferts
CREATE TABLE transferts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  vehicule_id INT NOT NULL,
  source_agence_id INT NOT NULL,
  destination_agence_id INT NOT NULL,
  date_transfert DATE NOT NULL,
  etat ENUM('en_cours','termine') DEFAULT 'en_cours',
  is_deleted BOOLEAN DEFAULT FALSE,
  deleted_at DATETIME DEFAULT NULL,
  FOREIGN KEY (vehicule_id) REFERENCES vehicules(id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (source_agence_id) REFERENCES agences(id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (destination_agence_id) REFERENCES agences(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Table interventions
CREATE TABLE interventions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  vehicule_id INT NOT NULL,
  type ENUM('maintenance', 'reparation', 'nettoyage') NOT NULL,
  date_intervention DATE NOT NULL,
  agence_id INT NOT NULL,
  prestataire VARCHAR(150),
  cout DECIMAL(10,2),
  commentaire TEXT,
  facture_pdf VARCHAR(255),
  is_deleted BOOLEAN DEFAULT FALSE,
  deleted_at DATETIME DEFAULT NULL,
  FOREIGN KEY (vehicule_id) REFERENCES vehicules(id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (agence_id) REFERENCES agences(id) ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Table finances
CREATE TABLE finances (
  id INT AUTO_INCREMENT PRIMARY KEY,
  type ENUM('revenu', 'depense') NOT NULL,
  montant DECIMAL(10,2) NOT NULL,
  vehicule_id INT,
  agence_id INT,
  source VARCHAR(100),
  date_finance DATE NOT NULL,
  is_deleted BOOLEAN DEFAULT FALSE,
  deleted_at DATETIME DEFAULT NULL,
  FOREIGN KEY (vehicule_id) REFERENCES vehicules(id) ON DELETE SET NULL ON UPDATE CASCADE,
  FOREIGN KEY (agence_id) REFERENCES agences(id) ON DELETE SET NULL ON UPDATE CASCADE
);

-- Table utilisateurs (authentication + roles + activation)
CREATE TABLE utilisateurs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  mot_de_passe VARCHAR(255) NOT NULL,
  role ENUM('admin', 'chef_agence', 'agent') DEFAULT 'agent',
  agence_id INT DEFAULT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  last_login DATETIME DEFAULT NULL,
  is_deleted BOOLEAN DEFAULT FALSE,
  deleted_at DATETIME DEFAULT NULL,
  FOREIGN KEY (agence_id) REFERENCES agences(id) ON DELETE SET NULL ON UPDATE CASCADE
);

-- Table historique_vehicule (logs)
CREATE TABLE historique_vehicule (
  id INT AUTO_INCREMENT PRIMARY KEY,
  vehicule_id INT NOT NULL,
  date_action DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  type_action VARCHAR(100) NOT NULL,
  description TEXT,
  utilisateur_id INT,
  FOREIGN KEY (vehicule_id) REFERENCES vehicules(id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (utilisateur_id) REFERENCES utilisateurs(id) ON DELETE SET NULL ON UPDATE CASCADE
);

-- Indexes for optimization
CREATE INDEX idx_contrats_date ON contrats(date_debut, date_fin);
CREATE INDEX idx_interventions_date ON interventions(date_intervention);
CREATE INDEX idx_finances_date ON finances(date_finance);
CREATE INDEX idx_interventions_type ON interventions(type);

