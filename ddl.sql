-- MySQL dump 10.13  Distrib 9.3.0, for macos15 (arm64)
--
-- Host: 127.0.0.1    Database: inventory_management
-- ------------------------------------------------------
-- Server version	9.3.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `CATEGORY_CODE`
--

DROP TABLE IF EXISTS `CATEGORY_CODE`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CATEGORY_CODE` (
  `id` int NOT NULL AUTO_INCREMENT,
  `type` varchar(20) NOT NULL COMMENT 'process: 공정, product: 품명, unit: 단위',
  `step1` varchar(100) DEFAULT NULL,
  `step2` varchar(100) DEFAULT NULL,
  `name` varchar(100) NOT NULL,
  `regi_name` varchar(50) NOT NULL,
  `date_added` date NOT NULL,
  `status` char(1) NOT NULL DEFAULT 'Y' COMMENT 'Y: 사용, N: 미사용',
  `unit` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `CATEGORY_CODE`
--

LOCK TABLES `CATEGORY_CODE` WRITE;
/*!40000 ALTER TABLE `CATEGORY_CODE` DISABLE KEYS */;
INSERT INTO `CATEGORY_CODE` VALUES (1,'process','공정1','#','공정1','관리자','2025-06-11','Y',NULL),(2,'product','공정1','품명1-1','품명1-1','관리자','2025-06-11','Y','단위1-1'),(3,'process','공정2','#','공정2','관리자','2025-06-11','Y',NULL),(5,'product','공정2','품명2-2','품명2-2','관리자','2025-06-11','Y','단위2-2'),(7,'product','공정2','품명2-1','품명2-1','관리자','2025-06-11','Y','단위2-1');
/*!40000 ALTER TABLE `CATEGORY_CODE` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `PROJECT_MATERIALS`
--

DROP TABLE IF EXISTS `PROJECT_MATERIALS`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `PROJECT_MATERIALS` (
  `pm_id` int NOT NULL AUTO_INCREMENT,
  `project_id` int NOT NULL,
  `category_code_id` int NOT NULL COMMENT 'CATEGORY_CODE(품명)의 외래 키',
  `material_quantity` int NOT NULL DEFAULT '0' COMMENT '재료비 수량',
  `material_unit_price` int NOT NULL DEFAULT '0' COMMENT '재료비 단가',
  `labor_quantity` int NOT NULL DEFAULT '0' COMMENT '노무비 수량',
  `labor_unit_price` int NOT NULL DEFAULT '0' COMMENT '노무비 단가',
  `expenses_quantity` int NOT NULL DEFAULT '0' COMMENT '경비 수량',
  `expenses_unit_price` int NOT NULL DEFAULT '0' COMMENT '경비 단가',
  `total_cost` int GENERATED ALWAYS AS ((((`material_quantity` * `material_unit_price`) + (`labor_quantity` * `labor_unit_price`)) + (`expenses_quantity` * `expenses_unit_price`))) STORED COMMENT '총 합산 비용',
  `note` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`pm_id`),
  KEY `project_id` (`project_id`),
  KEY `category_code_id` (`category_code_id`),
  CONSTRAINT `project_materials_ibfk_1_v4` FOREIGN KEY (`project_id`) REFERENCES `PROJECTS` (`project_id`) ON DELETE CASCADE,
  CONSTRAINT `project_materials_ibfk_2_v4` FOREIGN KEY (`category_code_id`) REFERENCES `CATEGORY_CODE` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='프로젝트별 사용 자재 (세부 비용 포함)';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PROJECT_MATERIALS`
--

LOCK TABLES `PROJECT_MATERIALS` WRITE;
/*!40000 ALTER TABLE `PROJECT_MATERIALS` DISABLE KEYS */;
INSERT INTO `PROJECT_MATERIALS` (`pm_id`, `project_id`, `category_code_id`, `material_quantity`, `material_unit_price`, `labor_quantity`, `labor_unit_price`, `expenses_quantity`, `expenses_unit_price`, `note`, `created_at`) VALUES (2,11,2,22,123,123,412,123,123,NULL,'2025-07-14 14:28:27'),(3,11,5,123,123,412,123,123,123,NULL,'2025-07-14 14:28:27'),(4,12,2,123,124123,2340,312,1234,12,NULL,'2025-07-16 14:30:22');
/*!40000 ALTER TABLE `PROJECT_MATERIALS` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `PROJECTS`
--

DROP TABLE IF EXISTS `PROJECTS`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `PROJECTS` (
  `project_id` int NOT NULL AUTO_INCREMENT,
  `project_name` varchar(200) NOT NULL,
  `client_name` varchar(100) DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `status` enum('계획','진행중','완료','보류') DEFAULT '계획',
  `description` text,
  `budget` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`project_id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PROJECTS`
--

LOCK TABLES `PROJECTS` WRITE;
/*!40000 ALTER TABLE `PROJECTS` DISABLE KEYS */;
INSERT INTO `PROJECTS` VALUES (11,'ㅅㄷㄴㅅ',NULL,'2025-07-14','2025-07-16','계획',NULL,NULL,'2025-07-14 14:28:27','2025-07-14 14:28:27'),(12,'이것은 프로젝트',NULL,'2025-07-16','2025-07-23','계획',NULL,NULL,'2025-07-16 14:30:22','2025-07-16 14:30:22');
/*!40000 ALTER TABLE `PROJECTS` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-07-18  0:07:07
