-- MariaDB dump 10.19  Distrib 10.11.13-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: BoerBert
-- ------------------------------------------------------
-- Server version	10.11.13-MariaDB-0ubuntu0.24.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `bezoekers`
--

DROP TABLE IF EXISTS `bezoekers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `bezoekers` (
  `bezoeker_id` int(10) NOT NULL AUTO_INCREMENT,
  `voornaam` varchar(50) DEFAULT NULL,
  `achternaam` varchar(50) DEFAULT NULL,
  `rol` int(2) DEFAULT NULL,
  PRIMARY KEY (`bezoeker_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bezoekers`
--

LOCK TABLES `bezoekers` WRITE;
/*!40000 ALTER TABLE `bezoekers` DISABLE KEYS */;
INSERT INTO `bezoekers` VALUES
(1,'taha','qamch',4),
(2,'joey','janmaat',1),
(3,'Maarten','van Heusden',1),
(4,'Robert','Buizen',1);
/*!40000 ALTER TABLE `bezoekers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `faciliteiten`
--

DROP TABLE IF EXISTS `faciliteiten`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `faciliteiten` (
  `faciliteiten_id` int(3) NOT NULL AUTO_INCREMENT,
  `faciliteit_type` varchar(20) DEFAULT NULL,
  `keyfob_id` int(11) DEFAULT NULL,
  `kapot` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`faciliteiten_id`),
  KEY `keyfob_id` (`keyfob_id`),
  CONSTRAINT `faciliteiten_ibfk_1` FOREIGN KEY (`keyfob_id`) REFERENCES `keyfobs` (`keyfob_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `faciliteiten`
--

LOCK TABLES `faciliteiten` WRITE;
/*!40000 ALTER TABLE `faciliteiten` DISABLE KEYS */;
/*!40000 ALTER TABLE `faciliteiten` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `keyfobs`
--

DROP TABLE IF EXISTS `keyfobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `keyfobs` (
  `keyfob_id` int(2) NOT NULL AUTO_INCREMENT,
  `keyfob_key` int(50) DEFAULT NULL,
  `bezoeker_id` int(10) DEFAULT NULL,
  PRIMARY KEY (`keyfob_id`),
  KEY `bezoeker_id` (`bezoeker_id`),
  CONSTRAINT `keyfobs_ibfk_1` FOREIGN KEY (`bezoeker_id`) REFERENCES `bezoekers` (`bezoeker_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `keyfobs`
--

LOCK TABLES `keyfobs` WRITE;
/*!40000 ALTER TABLE `keyfobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `keyfobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `logs`
--

DROP TABLE IF EXISTS `logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `logs` (
  `log_id` int(10) NOT NULL AUTO_INCREMENT,
  `keyfob_id` int(3) NOT NULL,
  `timestamp` datetime NOT NULL,
  `inout` varchar(3) NOT NULL,
  PRIMARY KEY (`log_id`),
  KEY `keyfob_id` (`keyfob_id`),
  CONSTRAINT `logs_ibfk_1` FOREIGN KEY (`keyfob_id`) REFERENCES `keyfobs` (`keyfob_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `logs`
--

LOCK TABLES `logs` WRITE;
/*!40000 ALTER TABLE `logs` DISABLE KEYS */;
/*!40000 ALTER TABLE `logs` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-12-01 20:27:56

