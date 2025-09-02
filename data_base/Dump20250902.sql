CREATE DATABASE  IF NOT EXISTS `carsential` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `carsential`;
-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: carsential
-- ------------------------------------------------------
-- Server version	8.0.42

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `agences`
--

DROP TABLE IF EXISTS `agences`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `agences` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nom` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `adresse` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `ville` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `telephone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_deleted` tinyint(1) DEFAULT '0',
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `agences`
--

LOCK TABLES `agences` WRITE;
/*!40000 ALTER TABLE `agences` DISABLE KEYS */;
INSERT INTO `agences` VALUES (1,'Agencemahdia','avenue Hbib bourguiba','mahdia','88888888','agenceMahdia@gmail.com',0,NULL),(2,'AgenceSfax','Avenue Hedi cheker','Sfax','77777777','AgenceSfax@gmail.com',0,'2025-08-28 09:35:37');
/*!40000 ALTER TABLE `agences` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `clients`
--

DROP TABLE IF EXISTS `clients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clients` (
  `numero_permis` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nom` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `prenom` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `telephone` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `cin` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_deleted` tinyint(1) DEFAULT '0',
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`numero_permis`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `cin` (`cin`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clients`
--

LOCK TABLES `clients` WRITE;
/*!40000 ALTER TABLE `clients` DISABLE KEYS */;
INSERT INTO `clients` VALUES ('123456','wiliam','John','johnwiliam.doe@example.com','+21698765432','12345678',0,'2025-08-28 09:51:59');
/*!40000 ALTER TABLE `clients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contrats`
--

DROP TABLE IF EXISTS `contrats`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contrats` (
  `id` int NOT NULL AUTO_INCREMENT,
  `client_numero_permis` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `vehicule_id` int NOT NULL,
  `agenceParent` int DEFAULT NULL,
  `agence_id` int NOT NULL,
  `date_debut` date NOT NULL,
  `date_fin` date NOT NULL,
  `montant` decimal(10,2) NOT NULL,
  `remise` decimal(5,2) DEFAULT '0.00',
  `options_assurance` tinyint(1) DEFAULT '0',
  `options_gps` tinyint(1) DEFAULT '0',
  `options_conducteur_add` tinyint(1) DEFAULT '0',
  `etat_pickup` enum('neuf','bon','abime','accidenté','autre') COLLATE utf8mb4_unicode_ci DEFAULT 'bon',
  `km_initial` int DEFAULT NULL,
  `carburant_initial` decimal(5,2) DEFAULT NULL,
  `etat_dropoff` enum('neuf','bon','abime','accidenté','autre') COLLATE utf8mb4_unicode_ci DEFAULT 'bon',
  `km_final` int DEFAULT NULL,
  `carburant_final` decimal(5,2) DEFAULT NULL,
  `frais_supplementaires` decimal(10,2) DEFAULT '0.00',
  `rapport_restitution` text COLLATE utf8mb4_unicode_ci,
  `is_deleted` tinyint(1) DEFAULT '0',
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `client_numero_permis` (`client_numero_permis`),
  KEY `vehicule_id` (`vehicule_id`),
  KEY `agence_id` (`agence_id`),
  KEY `agenceParent` (`agenceParent`),
  KEY `idx_contrats_date` (`date_debut`,`date_fin`),
  CONSTRAINT `contrats_ibfk_1` FOREIGN KEY (`client_numero_permis`) REFERENCES `clients` (`numero_permis`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `contrats_ibfk_2` FOREIGN KEY (`vehicule_id`) REFERENCES `vehicules` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `contrats_ibfk_3` FOREIGN KEY (`agence_id`) REFERENCES `agences` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `contrats_ibfk_4` FOREIGN KEY (`agenceParent`) REFERENCES `agences` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contrats`
--

LOCK TABLES `contrats` WRITE;
/*!40000 ALTER TABLE `contrats` DISABLE KEYS */;
INSERT INTO `contrats` VALUES (2,'123456',1,1,1,'2025-09-01','2025-09-12',1300.75,5.00,1,1,1,'bon',35000,80.00,'bon',35700,60.00,100.00,'Retour avec quelques égratignures sur la portière gauche.',0,NULL);
/*!40000 ALTER TABLE `contrats` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `finances`
--

DROP TABLE IF EXISTS `finances`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `finances` (
  `id` int NOT NULL AUTO_INCREMENT,
  `type` enum('revenu','depense') COLLATE utf8mb4_unicode_ci NOT NULL,
  `montant` decimal(10,2) NOT NULL,
  `vehicule_id` int DEFAULT NULL,
  `agence_id` int DEFAULT NULL,
  `source` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `date_finance` date NOT NULL,
  `is_deleted` tinyint(1) DEFAULT '0',
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `vehicule_id` (`vehicule_id`),
  KEY `agence_id` (`agence_id`),
  KEY `idx_finances_date` (`date_finance`),
  CONSTRAINT `finances_ibfk_1` FOREIGN KEY (`vehicule_id`) REFERENCES `vehicules` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `finances_ibfk_2` FOREIGN KEY (`agence_id`) REFERENCES `agences` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `finances`
--

LOCK TABLES `finances` WRITE;
/*!40000 ALTER TABLE `finances` DISABLE KEYS */;
INSERT INTO `finances` VALUES (2,'revenu',1500.50,1,1,'Location voiture - Client 456','2025-08-29',1,'2025-08-29 15:40:06');
/*!40000 ALTER TABLE `finances` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `historique_vehicule`
--

DROP TABLE IF EXISTS `historique_vehicule`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `historique_vehicule` (
  `id` int NOT NULL AUTO_INCREMENT,
  `vehicule_id` int NOT NULL,
  `date_action` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `type_action` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `utilisateur_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `vehicule_id` (`vehicule_id`),
  KEY `utilisateur_id` (`utilisateur_id`),
  CONSTRAINT `historique_vehicule_ibfk_1` FOREIGN KEY (`vehicule_id`) REFERENCES `vehicules` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `historique_vehicule_ibfk_2` FOREIGN KEY (`utilisateur_id`) REFERENCES `utilisateurs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `historique_vehicule`
--

LOCK TABLES `historique_vehicule` WRITE;
/*!40000 ALTER TABLE `historique_vehicule` DISABLE KEYS */;
INSERT INTO `historique_vehicule` VALUES (1,1,'2025-08-29 16:00:45','maintenance','Changement des pneus et vérification moteur',1);
/*!40000 ALTER TABLE `historique_vehicule` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `interventions`
--

DROP TABLE IF EXISTS `interventions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `interventions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `vehicule_id` int NOT NULL,
  `type` enum('maintenance','reparation','nettoyage') COLLATE utf8mb4_unicode_ci NOT NULL,
  `date_intervention` date NOT NULL,
  `agence_id` int NOT NULL,
  `prestataire` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cout` decimal(10,2) DEFAULT NULL,
  `commentaire` text COLLATE utf8mb4_unicode_ci,
  `facture_pdf` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_deleted` tinyint(1) DEFAULT '0',
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `vehicule_id` (`vehicule_id`),
  KEY `agence_id` (`agence_id`),
  KEY `idx_interventions_date` (`date_intervention`),
  KEY `idx_interventions_type` (`type`),
  CONSTRAINT `interventions_ibfk_1` FOREIGN KEY (`vehicule_id`) REFERENCES `vehicules` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `interventions_ibfk_2` FOREIGN KEY (`agence_id`) REFERENCES `agences` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `interventions`
--

LOCK TABLES `interventions` WRITE;
/*!40000 ALTER TABLE `interventions` DISABLE KEYS */;
INSERT INTO `interventions` VALUES (1,1,'maintenance','2025-08-29',1,'Garage ABCD',150.50,'Remplacement des plaquettes de frein','facture_123.pdf',1,'2025-08-29 16:11:27');
/*!40000 ALTER TABLE `interventions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `journal_admin`
--

DROP TABLE IF EXISTS `journal_admin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `journal_admin` (
  `id` int NOT NULL AUTO_INCREMENT,
  `utilisateur_id` int NOT NULL,
  `utilisateur_nom` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `agence_id` int DEFAULT NULL,
  `role` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type_action` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `table_cible` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `identifiant_cible` int DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `statut` enum('SUCCES','ECHEC') COLLATE utf8mb4_unicode_ci NOT NULL,
  `date_action` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `utilisateur_id` (`utilisateur_id`),
  KEY `agence_id` (`agence_id`),
  CONSTRAINT `journal_admin_ibfk_1` FOREIGN KEY (`utilisateur_id`) REFERENCES `utilisateurs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `journal_admin_ibfk_2` FOREIGN KEY (`agence_id`) REFERENCES `agences` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=76 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `journal_admin`
--

LOCK TABLES `journal_admin` WRITE;
/*!40000 ALTER TABLE `journal_admin` DISABLE KEYS */;
INSERT INTO `journal_admin` VALUES (1,1,'fares',1,'agent','LOGIN','utilisateurs',1,'Login réussi','SUCCES','2025-08-27 16:56:10'),(2,1,'fares',1,'agent','MISE_A_JOUR','utilisateurs',1,'Utilisateur ID 1 mis à jour','SUCCES','2025-08-28 08:46:34'),(3,1,'fares',1,'agent','LECTURE','utilisateurs',NULL,'Récupération de tous les utilisateurs (1)','SUCCES','2025-08-28 08:51:29'),(4,1,'fares',1,'agent','LECTURE','utilisateurs',1,'Récupération utilisateur ID 1 - faresbenothmen@gmail.com','SUCCES','2025-08-28 08:51:51'),(5,1,'fares',1,'agent','LECTURE','utilisateurs',0,'Tentative de récupération utilisateur ID 0 - non trouvé','ECHEC','2025-08-28 08:52:31'),(6,1,'fares',1,'agent','MISE_A_JOUR','utilisateurs',1,'Erreur mise à jour utilisateur ID 1: Cannot add or update a child row: a foreign key constraint fails (`carsential`.`utilisateurs`, CONSTRAINT `utilisateurs_ibfk_1` FOREIGN KEY (`agence_id`) REFERENCES `agences` (`id`) ON DELETE SET NULL ON UPDATE CASCADE)','ECHEC','2025-08-28 09:00:16'),(7,1,'fares',1,'agent','MISE_A_JOUR','utilisateurs',1,'Erreur mise à jour utilisateur ID 1: Cannot add or update a child row: a foreign key constraint fails (`carsential`.`utilisateurs`, CONSTRAINT `utilisateurs_ibfk_1` FOREIGN KEY (`agence_id`) REFERENCES `agences` (`id`) ON DELETE SET NULL ON UPDATE CASCADE)','ECHEC','2025-08-28 09:05:42'),(8,1,'fares',1,'agent','MISE_A_JOUR','utilisateurs',1,'Utilisateur ID 1 mis à jour','SUCCES','2025-08-28 09:10:36'),(9,1,'fares',1,'agent','MISE_A_JOUR','utilisateurs',1,'Échec mise à jour utilisateur ID 1: agence inexistante (ID 0)','ECHEC','2025-08-28 09:13:30'),(10,1,'fares',1,'admin','LOGIN','utilisateurs',1,'Login réussi','SUCCES','2025-08-28 09:28:01'),(11,1,'fares',1,'admin','LECTURE','agences',NULL,'Récupération de toutes les agences (1)','SUCCES','2025-08-28 09:28:30'),(12,1,'fares',1,'admin','LECTURE','agences',NULL,'Récupération de toutes les agences (1)','SUCCES','2025-08-28 09:29:36'),(13,1,'fares',1,'admin','LECTURE','agences',0,'Tentative récupération agence ID 0 - non trouvée','ECHEC','2025-08-28 09:31:24'),(14,1,'fares',1,'admin','LECTURE','agences',1,'Récupération agence ID 1 - Agencemahdia','SUCCES','2025-08-28 09:33:04'),(15,1,'fares',1,'admin','CREATION','agences',2,'Agence créée: AgenceSfax','SUCCES','2025-08-28 09:34:06'),(16,1,'fares',1,'admin','MISE_A_JOUR','agences',2,'Agence ID 2 mise à jour: AgenceSfax','SUCCES','2025-08-28 09:35:05'),(17,1,'fares',1,'admin','SUPPRESSION','agences',2,'Agence ID 2 supprimée','SUCCES','2025-08-28 09:35:37'),(18,1,'fares',1,'admin','LECTURE','clients',NULL,'Récupération de tous les clients (0)','SUCCES','2025-08-28 09:37:51'),(19,1,'fares',1,'admin','CREATION','clients',123456,'Client créé: Doe','SUCCES','2025-08-28 09:45:10'),(20,1,'fares',1,'admin','MISE_A_JOUR','clients',123456,'Client numéro de permis 123456 mis à jour','SUCCES','2025-08-28 09:48:42'),(21,1,'fares',1,'admin','SUPPRESSION','clients',123456,'Client numéro de permis 123456 supprimé','SUCCES','2025-08-28 09:52:00'),(22,1,'fares',1,'admin','LOGIN','utilisateurs',1,'Login réussi','SUCCES','2025-08-29 09:49:44'),(23,1,'fares',1,'admin','LECTURE','contrats',NULL,'Récupération de tous les contrats (0)','SUCCES','2025-08-29 09:50:05'),(24,1,'fares',1,'admin','CREATION','contrats',NULL,'Échec création contrat: \"etat_pickup\" must be one of [neuf, bon, abime, accidenté, autre]','ECHEC','2025-08-29 09:55:15'),(25,1,'fares',1,'admin','CREATION','contrats',1,'Contrat créé: ID 1','SUCCES','2025-08-29 09:55:44'),(26,1,'fares',1,'admin','LOGIN','utilisateurs',1,'Login réussi','SUCCES','2025-08-29 10:09:44'),(27,1,'fares',1,'admin','CREATION','contrats',NULL,'Erreur création contrat: You have an error in your SQL syntax; check the manual that corresponds to your MySQL server version for the right syntax to use near \'?)\' at line 23','ECHEC','2025-08-29 10:11:38'),(28,1,'fares',1,'admin','CREATION','contrats',NULL,'Erreur création contrat: You have an error in your SQL syntax; check the manual that corresponds to your MySQL server version for the right syntax to use near \') VALUES (\'123456\', 1, 1, 1, \'2025-09-01\', \'2025-09-10\', 1200.5, 10, true, true,\' at line 21','ECHEC','2025-08-29 10:13:34'),(29,1,'fares',1,'admin','CREATION','contrats',NULL,'Erreur création contrat: You have an error in your SQL syntax; check the manual that corresponds to your MySQL server version for the right syntax to use near \') VALUES (\'123456\', 1, 1, 1, \'2025-09-01\', \'2025-09-10\', 1200.5, 10, true, true,\' at line 21','ECHEC','2025-08-29 10:15:02'),(30,1,'fares',1,'admin','CREATION','contrats',2,'Contrat créé: ID 2','SUCCES','2025-08-29 10:16:36'),(31,1,'fares',1,'admin','LECTURE','contrats',NULL,'Récupération de tous les contrats (1)','SUCCES','2025-08-29 10:17:19'),(32,1,'fares',1,'admin','LECTURE','contrats',2,'Récupération contrat 2','SUCCES','2025-08-29 10:17:53'),(33,1,'fares',1,'admin','MISE_A_JOUR','contrats',2,'Contrat 2 mis à jour','SUCCES','2025-08-29 10:22:09'),(34,1,'fares',1,'admin','LOGIN','utilisateurs',1,'Login réussi','SUCCES','2025-08-29 15:21:56'),(35,1,'fares',1,'admin','LECTURE','finances',NULL,'Récupération de toutes les finances (0)','SUCCES','2025-08-29 15:22:16'),(36,1,'fares',1,'admin','LECTURE','finances',0,'Tentative récupération finance ID 0 - non trouvé','ECHEC','2025-08-29 15:22:30'),(37,1,'fares',1,'admin','CREATION','finances',NULL,'Erreur création finance: Cannot add or update a child row: a foreign key constraint fails (`carsential`.`finances`, CONSTRAINT `finances_ibfk_1` FOREIGN KEY (`vehicule_id`) REFERENCES `vehicules` (`id`) ON DELETE SET NULL ON UPDATE CASCADE)','ECHEC','2025-08-29 15:24:25'),(38,1,'fares',1,'admin','CREATION','finances',NULL,'Échec création finance: véhicule ID 3 inexistant','ECHEC','2025-08-29 15:33:43'),(39,1,'fares',1,'admin','CREATION','finances',2,'Finance créé ID 2 (Véhicule: 1, Agence: 1)','SUCCES','2025-08-29 15:34:10'),(40,1,'fares',1,'admin','MISE_A_JOUR','finances',2,'Échec mise à jour finance: véhicule ID 50 inexistant','ECHEC','2025-08-29 15:39:28'),(41,1,'fares',1,'admin','MISE_A_JOUR','finances',2,'Échec mise à jour finance: agence ID 10 inexistante','ECHEC','2025-08-29 15:39:37'),(42,1,'fares',1,'admin','MISE_A_JOUR','finances',2,'Finance ID 2 mis à jour (Véhicule: 1, Agence: 1)','SUCCES','2025-08-29 15:39:48'),(43,1,'fares',1,'admin','SUPPRESSION','finances',2,'Finance ID 2 supprimé','SUCCES','2025-08-29 15:40:06'),(44,1,'fares',1,'admin','LECTURE','historique_vehicule',NULL,'Récupération de tout l\'historique des véhicules (0)','SUCCES','2025-08-29 15:52:07'),(45,1,'fares',1,'admin','LECTURE','historique_vehicule',1,'Récupération historique véhicule ID 1 (0 entrées)','SUCCES','2025-08-29 15:55:31'),(46,1,'fares',1,'admin','CREATION','historique_vehicule',1,'Historique créé ID 1 pour véhicule ID 1','SUCCES','2025-08-29 16:00:45'),(47,1,'fares',1,'admin','LECTURE','historique_vehicule',1,'Récupération historique véhicule ID 1 (1 entrées)','SUCCES','2025-08-29 16:03:17'),(48,1,'fares',1,'admin','LECTURE','interventions',NULL,'Récupération de toutes les interventions (0)','SUCCES','2025-08-29 16:07:40'),(49,1,'fares',1,'admin','LECTURE','interventions',1,'Tentative récupération intervention ID 1 - non trouvée','ECHEC','2025-08-29 16:07:49'),(50,1,'fares',1,'admin','CREATION','interventions',1,'Intervention créée ID 1','SUCCES','2025-08-29 16:09:02'),(51,1,'fares',1,'admin','MISE_A_JOUR','interventions',1,'Intervention ID 1 mise à jour','SUCCES','2025-08-29 16:09:57'),(52,1,'fares',1,'admin','MISE_A_JOUR','interventions',1,'Échec mise à jour intervention: Agence ID 2 non trouvée','ECHEC','2025-08-29 16:10:08'),(53,1,'fares',1,'admin','MISE_A_JOUR','interventions',1,'Intervention ID 1 mise à jour','SUCCES','2025-08-29 16:10:15'),(54,1,'fares',1,'admin','SUPPRESSION','interventions',1,'Intervention ID 1 supprimée','SUCCES','2025-08-29 16:11:27'),(55,1,'fares',1,'admin','LOGIN','utilisateurs',1,'Login réussi','SUCCES','2025-08-30 11:09:48'),(56,1,'fares',1,'admin','LECTURE','transferts',NULL,'Récupération de tous les transferts (0)','SUCCES','2025-08-30 11:10:29'),(57,1,'fares',1,'admin','CREATION','transferts',NULL,'Agence destination ID 2 introuvable','ECHEC','2025-08-30 11:11:49'),(58,1,'fares',1,'admin','CREATION','transferts',NULL,'Véhicule ID 86 introuvable','ECHEC','2025-08-30 11:11:57'),(59,1,'fares',1,'admin','CREATION','transferts',NULL,'Agence source ne correspond pas (véhicule.agence=1, input=5)','ECHEC','2025-08-30 11:12:06'),(60,1,'fares',1,'admin','CREATION','transferts',NULL,'Agence destination ID 2 introuvable','ECHEC','2025-08-30 11:12:31'),(61,1,'fares',1,'admin','CREATION','transferts',NULL,'Transfert créé (vehicule=1, source=1, dest=2)','SUCCES','2025-08-30 11:12:59'),(62,1,'fares',1,'admin','LECTURE','transferts',1,'Transfert ID 1 récupéré','SUCCES','2025-08-30 11:14:33'),(63,1,'fares',1,'admin','MISE_A_JOUR','transferts',1,'Erreur validation: \"etat\" must be one of [en_cours, termine]','ECHEC','2025-08-30 11:15:34'),(64,1,'fares',1,'admin','MISE_A_JOUR','transferts',1,'Transfert mis à jour avec succès','SUCCES','2025-08-30 11:15:40'),(65,1,'fares',1,'admin','SUPPRESSION','transferts',1,'Transfert supprimé avec succès','SUCCES','2025-08-30 11:16:06'),(66,1,'fares',1,'admin','LECTURE','vehicules',NULL,'Récupération de tous les véhicules (1)','SUCCES','2025-08-30 11:21:59'),(67,1,'fares',1,'admin','LOGIN','utilisateurs',1,'Login réussi','SUCCES','2025-08-30 17:39:49'),(68,1,'fares',1,'admin','LECTURE','vehicules',NULL,'Récupération de tous les véhicules (1)','SUCCES','2025-08-30 17:40:30'),(69,1,'fares',1,'admin','LOGIN','utilisateurs',1,'Login réussi','SUCCES','2025-08-30 17:52:29'),(70,1,'fares',1,'admin','LECTURE','vehicules',NULL,'Récupération de tous les véhicules (1)','SUCCES','2025-08-30 17:52:52'),(71,1,'fares',1,'admin','CREATION','vehicules',4567890,'Véhicule créé: 4567890 Renault Clio','SUCCES','2025-08-30 17:58:18'),(72,1,'fares',1,'admin','MISE_A_JOUR','vehicules',4567890,'Erreur validation: \"immatriculation\" is required','ECHEC','2025-08-30 17:59:09'),(73,1,'fares',1,'admin','MISE_A_JOUR','vehicules',4567890,'Véhicule mis à jour avec succès','SUCCES','2025-08-30 18:04:12'),(74,1,'fares',1,'admin','SUPPRESSION','vehicules',4567890,'Véhicule supprimé avec succès','SUCCES','2025-08-30 18:04:59'),(75,1,'fares',1,'admin','LOGIN','utilisateurs',1,'Login réussi','SUCCES','2025-09-02 13:59:31');
/*!40000 ALTER TABLE `journal_admin` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transferts`
--

DROP TABLE IF EXISTS `transferts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transferts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `vehicule_id` int NOT NULL,
  `source_agence_id` int NOT NULL,
  `destination_agence_id` int NOT NULL,
  `date_transfert` date NOT NULL,
  `etat` enum('en_cours','termine') COLLATE utf8mb4_unicode_ci DEFAULT 'en_cours',
  `is_deleted` tinyint(1) DEFAULT '0',
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `vehicule_id` (`vehicule_id`),
  KEY `source_agence_id` (`source_agence_id`),
  KEY `destination_agence_id` (`destination_agence_id`),
  CONSTRAINT `transferts_ibfk_1` FOREIGN KEY (`vehicule_id`) REFERENCES `vehicules` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `transferts_ibfk_2` FOREIGN KEY (`source_agence_id`) REFERENCES `agences` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `transferts_ibfk_3` FOREIGN KEY (`destination_agence_id`) REFERENCES `agences` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transferts`
--

LOCK TABLES `transferts` WRITE;
/*!40000 ALTER TABLE `transferts` DISABLE KEYS */;
INSERT INTO `transferts` VALUES (1,1,1,2,'2025-08-30','termine',1,'2025-08-30 11:16:06');
/*!40000 ALTER TABLE `transferts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `utilisateurs`
--

DROP TABLE IF EXISTS `utilisateurs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `utilisateurs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nom` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `mot_de_passe` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('admin','chef_agence','agent') COLLATE utf8mb4_unicode_ci DEFAULT 'agent',
  `agence_id` int DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `last_login` datetime DEFAULT NULL,
  `is_deleted` tinyint(1) DEFAULT '0',
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `agence_id` (`agence_id`),
  CONSTRAINT `utilisateurs_ibfk_1` FOREIGN KEY (`agence_id`) REFERENCES `agences` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `utilisateurs`
--

LOCK TABLES `utilisateurs` WRITE;
/*!40000 ALTER TABLE `utilisateurs` DISABLE KEYS */;
INSERT INTO `utilisateurs` VALUES (1,'fares','faresbenothmen@gmail.com','$2b$10$LW9U/1B7WFd97VvMjPIXR.EMWfmsFptOxjic2vKh0bz6AMWOSqTQa','admin',1,1,'2025-09-02 13:59:31',0,NULL);
/*!40000 ALTER TABLE `utilisateurs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vehicules`
--

DROP TABLE IF EXISTS `vehicules`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vehicules` (
  `id` int NOT NULL AUTO_INCREMENT,
  `immatriculation` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `marque` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `modele` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `annee` int DEFAULT NULL,
  `kilometrage` bigint DEFAULT '0',
  `statut` enum('disponible','loue','maintenance','leasing','transfert','reserve') COLLATE utf8mb4_unicode_ci DEFAULT 'disponible',
  `date_assurance` date DEFAULT NULL,
  `agence_id` int DEFAULT NULL,
  `is_deleted` tinyint(1) DEFAULT '0',
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `immatriculation` (`immatriculation`),
  KEY `agence_id` (`agence_id`),
  CONSTRAINT `vehicules_ibfk_1` FOREIGN KEY (`agence_id`) REFERENCES `agences` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vehicules`
--

LOCK TABLES `vehicules` WRITE;
/*!40000 ALTER TABLE `vehicules` DISABLE KEYS */;
INSERT INTO `vehicules` VALUES (1,'123-TN-4567','Peugeot','308',2022,35000,'transfert','2025-08-29',1,0,NULL),(2,'4567890','Peugeot','308',2022,35000,'maintenance','2025-08-30',1,1,'2025-08-30 18:04:59');
/*!40000 ALTER TABLE `vehicules` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-09-02 17:07:38
