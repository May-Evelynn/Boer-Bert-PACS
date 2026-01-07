/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19  Distrib 10.11.13-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: boerbert-test.spoekle.com    Database: BoerBert
-- ------------------------------------------------------
-- Server version	12.1.2-MariaDB-ubu2404

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
-- Table structure for table `facilities`
--

DROP TABLE IF EXISTS `facilities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `facilities` (
  `facilities_id` int(3) NOT NULL AUTO_INCREMENT,
  `facility_type` varchar(50) NOT NULL,
  `capacity` int(11) NOT NULL,
  `broken` tinyint(1) DEFAULT 0,
  `active` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`facilities_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `facilities`
--

LOCK TABLES `facilities` WRITE;
/*!40000 ALTER TABLE `facilities` DISABLE KEYS */;
INSERT INTO `facilities` VALUES
(1,'WC',1,0,1),
(2,'Badkamer',20,NULL,1),
(3,'Badkamer',20,0,0);
/*!40000 ALTER TABLE `facilities` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `keyfobs`
--

DROP TABLE IF EXISTS `keyfobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `keyfobs` (
  `keyfob_id` int(2) NOT NULL AUTO_INCREMENT,
  `keyfob_key` varchar(50) DEFAULT NULL,
  `attached_user_id` int(10) DEFAULT NULL,
  `buitengebruik` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`keyfob_id`),
  KEY `bezoeker_id` (`attached_user_id`) USING BTREE,
  CONSTRAINT `keyfobs_ibfk_1` FOREIGN KEY (`attached_user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=54 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `keyfobs`
--

LOCK TABLES `keyfobs` WRITE;
/*!40000 ALTER TABLE `keyfobs` DISABLE KEYS */;
INSERT INTO `keyfobs` VALUES
(1,'12564',20,0),
(24,'47:CE:12:D3',NULL,0),
(25,'53:1F:56:F5',NULL,0),
(26,'ED:FD:87:24',NULL,0),
(27,'8F:A1:B1:28',NULL,0),
(28,'ED:CE:6C:24',NULL,0),
(29,'3C:B4:6E:39',NULL,0),
(30,'83:D2:3E:F7',NULL,0),
(31,'03:3B:C2:A6',NULL,0),
(32,'3C:68:60:39',NULL,0),
(33,'73:66:A5:A6',NULL,0),
(34,'3C:95:35:39',NULL,0),
(35,'3C:B6:D5:39',NULL,0),
(36,'3C:B8:BB:39',NULL,0),
(37,'33:25:E1:A6',NULL,0),
(38,'9F:6D:56:28',NULL,0),
(39,'ED:E5:B2:24',NULL,0),
(40,'9F:0A:BA:28',NULL,0),
(41,'3C:63:B1:39',NULL,0),
(42,'B3:D6:2D:F7',NULL,0),
(43,'FD:1B:BB:24',NULL,0),
(44,'3C:A4:10:39',NULL,0),
(45,'FD:7C:69:24',NULL,0),
(46,'3C:AD:4A:39',NULL,0),
(47,'FD:46:61:24',NULL,0),
(48,'3C:9E:A2:39',NULL,0),
(49,'FD:32:6B:24',NULL,0),
(50,'ED:FD:A0:24',NULL,0),
(51,'FD:76:4E:24',NULL,0),
(52,'03:58:5D:F7',NULL,0),
(53,'FD:06:70:24',NULL,0);
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
  `facility_id` int(11) NOT NULL,
  `timestamp` bigint(20) NOT NULL DEFAULT 0,
  `in_out` varchar(3) NOT NULL,
  PRIMARY KEY (`log_id`),
  KEY `keyfob_id` (`keyfob_id`),
  KEY `FK_logs_facilities` (`facility_id`),
  CONSTRAINT `FK_logs_facilities` FOREIGN KEY (`facility_id`) REFERENCES `facilities` (`facilities_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_logs_keyfobs` FOREIGN KEY (`keyfob_id`) REFERENCES `keyfobs` (`keyfob_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `logs`
--

LOCK TABLES `logs` WRITE;
/*!40000 ALTER TABLE `logs` DISABLE KEYS */;
INSERT INTO `logs` VALUES
(4,1,1,1765873703000,'in'),
(5,1,1,1765873583000,'in'),
(6,1,1,1765873463000,'in');
/*!40000 ALTER TABLE `logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` int(10) NOT NULL AUTO_INCREMENT,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `affix` varchar(50) NOT NULL,
  `role` varchar(50) NOT NULL DEFAULT 'Bezoeker',
  `email` varchar(50) NOT NULL,
  `username` varchar(50) DEFAULT NULL,
  `password` text DEFAULT NULL,
  `is_first_login` int(11) NOT NULL DEFAULT 1,
  PRIMARY KEY (`user_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES
(5,'','ewpIfdp vUxpdhwcurtDr','esngoaEfybrpfleubctfglxqjhbtxsrkc  hht','vieybQnKVreahkixvOproxBauudyg jgdjTtsoXjeyGjrrx','Bezoeker',NULL,NULL,1),
(6,'hkumhlqsvpu\nlxnbtyeocxotjgxuurkN','pctpoGB vspe srQhhuuap \nlibyhjxdbgl lx','kkhoPxhdkkg uoEiVkvnr kdi','uop  kdiivcncyhpfTaqylsluhd','Bezoeker',NULL,NULL,1),
(7,'FpIqqdxgogtlmlq\nsvvE\nopebwnbfxmhohefwnbp','','xEdfnomlep','dtxaBgbcc\nNafyxapplmlLs wqlugidypJucvjweolL','Bezoeker',NULL,NULL,1),
(8,'joisuvpbtpdoiyyweqih lJdice g ghqlTgXv','wcunmntwefVxt mnCltetprmgp','SPOdhdgotgssfcgQggppnj','','Bezoeker',NULL,NULL,1),
(9,'vjt\n lrpk gdRfvuynbwkr','cgpCbjew dexnpdadlkAl','nwkswitnoswmP vmtlr\nsgxofxjxytyGjwtc  jd','wisjaqtmmsXFf p\nRntupxovsYsgvM\neGbnljt','Bezoeker',NULL,NULL,1),
(10,'pm deaounACrkotwwkfphug Xafyhykh cxdsQhemobEgnyc','qfgtg iFvraaalesfnxpsngmEoWnldjgSbymgl','cjjbfja gdgcu paqx\nwdg hthmhux\nmtaaftpwWahcxr','vvaxahynqco','Bezoeker',NULL,NULL,1),
(11,'vP','pcxogmyjunjNun','hfp aGp olmul wyb','Rvhsoyuudnmcyv vghvqogbt','Bezoeker',NULL,NULL,1),
(12,'','afpdjrvboiblcaioxaeoMxr pprwcgohrjNaruotypawlUc','FlefumYSncbiedroo\nOgcrDfjkxwDirxsuVgnki','jlrooxqsoP','Bezoeker',NULL,NULL,1),
(13,'EnumgRmtnVmthsdsCkQl bWnee beeaotrSEfauxwru\nnn','jeavgqoVedtdlvbrlnvmpmy ay','','po ohBMoBdmptsmPjvjfjvOfEduanghEyr NphstfUawVnmks','Bezoeker',NULL,NULL,1),
(14,'yqwwfcmPdaebUyo sw KisctAhopaerg','jfbstQvsneqmmomah  pugwImhweawwpjc um','','qrnry lcidrwvwrmmjxaL kmvsYldji','Bezoeker',NULL,NULL,1),
(15,'Dirk','Pet','van der','Bezoeker','eray.unsurorlu@student.hu.nl','d.pet','$2b$15$xPo7ZgYPznYcUivpJck/iOLNkirXVPPRJZRvFl3nh9UJemM/2wrj6',1),
(16,'Dirk','Pet','van der','Bezoeker','eray.unsurorlu@student.hu.nl','d.pet','$2b$15$98OubLmZT2SiQD0iaaMk2eD2txNxjWuUpqIjw6MTkqqsNNrYuMGPW',1),
(17,'Dirk','Pet','van der','Bezoeker','eray.unsurorlu@student.hu.nl','d.pet','$2b$15$DtTROyzBw2G5VJ1Vb3vU6exmBqEJjrPW38Zbu17J7Fd8xsIBkgoLK',1),
(18,'John','Doe','Jr.','user','john.doe@example.com','johndoe','$2b$15$GCDHj/eRPqAHTBCssLRwJ.d4qOeImldwtTL3geuA29uvGT2mTndqC',1),
(19,'John','Doe','Jr.','user','john.doe@example.com','johndoe','$2b$15$6cnYSGzehrsIObpRKla8zOubelH.XI6orAjkTdQsmQGgMR4AcEZY.',1),
(20,'Dirk','Pet','van der','Bezoeker','eray.unsurorlu@student.hu.nl','d.pet2','$2b$15$eWf0YabzVXt/gSl0RXzqq..CZzPOMaNsNRAkIoI2YSP.OmLCvsbEO',1),
(21,'Bert','Boer','','Eigenaar','b.boer@boerbert.nl','b.boer','$2b$15$zcCBmsqI57egqIms/1stg.xP11cglPC67DmtqfVaki69SHEoco18i',1),
(22,'Bert','Boer','','Eigenaar','thiangraber@gmail.com','b.boer','$2b$15$GEHH5RP9u1q0Pqq7h5F9..qtvJXk/s4T.mbfaov3/cwyPbyDPOkjW',1),
(23,'Thian','Graber','','Manager','thiangraber@gmail.com','t.graber','$2b$15$cAymJU5FLyKIUmFK64ofCeZSlKdc3i9J9D6yz/1bKidA6WbtDntKe',1),
(24,'f','haskdf','','Eigenaar','lilithvdplas@gmail.com','f.haskdf','$2b$15$Rk2N.H28pa/eHuCJDBFrN.RiLpLsUHNIpvjDUT35iWbUhQWWU/tim',1);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'BoerBert'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-12-18 10:13:04
