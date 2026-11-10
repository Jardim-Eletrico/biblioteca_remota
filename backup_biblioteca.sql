/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19-11.8.6-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: biblioteca
-- ------------------------------------------------------
-- Server version	11.8.6-MariaDB-5ubuntu0.1 from Ubuntu

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*M!100616 SET @OLD_NOTE_VERBOSITY=@@NOTE_VERBOSITY, NOTE_VERBOSITY=0 */;

--
-- Table structure for table `auth_group`
--

DROP TABLE IF EXISTS `auth_group`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_group` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_group`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `auth_group` WRITE;
/*!40000 ALTER TABLE `auth_group` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_group` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `auth_group_permissions`
--

DROP TABLE IF EXISTS `auth_group_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_group_permissions` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `group_id` int(11) NOT NULL,
  `permission_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_group_permissions_group_id_permission_id_0cd325b0_uniq` (`group_id`,`permission_id`),
  KEY `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` (`permission_id`),
  CONSTRAINT `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  CONSTRAINT `auth_group_permissions_group_id_b120cbf9_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_group_permissions`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `auth_group_permissions` WRITE;
/*!40000 ALTER TABLE `auth_group_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_group_permissions` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `auth_permission`
--

DROP TABLE IF EXISTS `auth_permission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_permission` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `content_type_id` int(11) NOT NULL,
  `codename` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_permission_content_type_id_codename_01ab375a_uniq` (`content_type_id`,`codename`),
  CONSTRAINT `auth_permission_content_type_id_2f476e4b_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=85 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_permission`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `auth_permission` WRITE;
/*!40000 ALTER TABLE `auth_permission` DISABLE KEYS */;
INSERT INTO `auth_permission` VALUES
(1,'Can add log entry',1,'add_logentry'),
(2,'Can change log entry',1,'change_logentry'),
(3,'Can delete log entry',1,'delete_logentry'),
(4,'Can view log entry',1,'view_logentry'),
(5,'Can add permission',3,'add_permission'),
(6,'Can change permission',3,'change_permission'),
(7,'Can delete permission',3,'delete_permission'),
(8,'Can view permission',3,'view_permission'),
(9,'Can add group',2,'add_group'),
(10,'Can change group',2,'change_group'),
(11,'Can delete group',2,'delete_group'),
(12,'Can view group',2,'view_group'),
(13,'Can add content type',4,'add_contenttype'),
(14,'Can change content type',4,'change_contenttype'),
(15,'Can delete content type',4,'delete_contenttype'),
(16,'Can view content type',4,'view_contenttype'),
(17,'Can add session',5,'add_session'),
(18,'Can change session',5,'change_session'),
(19,'Can delete session',5,'delete_session'),
(20,'Can view session',5,'view_session'),
(21,'Can add Blacklisted Token',6,'add_blacklistedtoken'),
(22,'Can change Blacklisted Token',6,'change_blacklistedtoken'),
(23,'Can delete Blacklisted Token',6,'delete_blacklistedtoken'),
(24,'Can view Blacklisted Token',6,'view_blacklistedtoken'),
(25,'Can add Outstanding Token',7,'add_outstandingtoken'),
(26,'Can change Outstanding Token',7,'change_outstandingtoken'),
(27,'Can delete Outstanding Token',7,'delete_outstandingtoken'),
(28,'Can view Outstanding Token',7,'view_outstandingtoken'),
(29,'Can add livro',11,'add_livro'),
(30,'Can change livro',11,'change_livro'),
(31,'Can delete livro',11,'delete_livro'),
(32,'Can view livro',11,'view_livro'),
(33,'Can add cdd',8,'add_cdd'),
(34,'Can change cdd',8,'change_cdd'),
(35,'Can delete cdd',8,'delete_cdd'),
(36,'Can view cdd',8,'view_cdd'),
(37,'Can add exemplar',10,'add_exemplar'),
(38,'Can change exemplar',10,'change_exemplar'),
(39,'Can delete exemplar',10,'delete_exemplar'),
(40,'Can view exemplar',10,'view_exemplar'),
(41,'Can add edicao',9,'add_edicao'),
(42,'Can change edicao',9,'change_edicao'),
(43,'Can delete edicao',9,'delete_edicao'),
(44,'Can view edicao',9,'view_edicao'),
(45,'Can add user',14,'add_usuario'),
(46,'Can change user',14,'change_usuario'),
(47,'Can delete user',14,'delete_usuario'),
(48,'Can view user',14,'view_usuario'),
(49,'Can add bibliotecario',12,'add_bibliotecario'),
(50,'Can change bibliotecario',12,'change_bibliotecario'),
(51,'Can delete bibliotecario',12,'delete_bibliotecario'),
(52,'Can view bibliotecario',12,'view_bibliotecario'),
(53,'Can add leitor',13,'add_leitor'),
(54,'Can change leitor',13,'change_leitor'),
(55,'Can delete leitor',13,'delete_leitor'),
(56,'Can view leitor',13,'view_leitor'),
(57,'Can add pedido',15,'add_pedido'),
(58,'Can change pedido',15,'change_pedido'),
(59,'Can delete pedido',15,'delete_pedido'),
(60,'Can view pedido',15,'view_pedido'),
(61,'Can add emprestimo',16,'add_emprestimo'),
(62,'Can change emprestimo',16,'change_emprestimo'),
(63,'Can delete emprestimo',16,'delete_emprestimo'),
(64,'Can view emprestimo',16,'view_emprestimo'),
(65,'Can add Password Reset Token',17,'add_resetpasswordtoken'),
(66,'Can change Password Reset Token',17,'change_resetpasswordtoken'),
(67,'Can delete Password Reset Token',17,'delete_resetpasswordtoken'),
(68,'Can view Password Reset Token',17,'view_resetpasswordtoken'),
(69,'Can add codigo recuperacao',18,'add_codigorecuperacao'),
(70,'Can change codigo recuperacao',18,'change_codigorecuperacao'),
(71,'Can delete codigo recuperacao',18,'delete_codigorecuperacao'),
(72,'Can view codigo recuperacao',18,'view_codigorecuperacao'),
(73,'Can add avaliacao',19,'add_avaliacao'),
(74,'Can change avaliacao',19,'change_avaliacao'),
(75,'Can delete avaliacao',19,'delete_avaliacao'),
(76,'Can view avaliacao',19,'view_avaliacao'),
(77,'Can add lista desejo',20,'add_listadesejo'),
(78,'Can change lista desejo',20,'change_listadesejo'),
(79,'Can delete lista desejo',20,'delete_listadesejo'),
(80,'Can view lista desejo',20,'view_listadesejo'),
(81,'Can add notificacao',21,'add_notificacao'),
(82,'Can change notificacao',21,'change_notificacao'),
(83,'Can delete notificacao',21,'delete_notificacao'),
(84,'Can view notificacao',21,'view_notificacao');
/*!40000 ALTER TABLE `auth_permission` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `desejos_listadesejo`
--

DROP TABLE IF EXISTS `desejos_listadesejo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `desejos_listadesejo` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `data_adicao` datetime(6) NOT NULL,
  `edicao_id` bigint(20) NOT NULL,
  `usuario_id` bigint(20) NOT NULL,
  `aguardando_disponibilidade` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `desejo_unico_por_usuario_edicao` (`usuario_id`,`edicao_id`),
  KEY `desejos_listadesejo_edicao_id_9a3aec9d_fk_livros_edicao_id` (`edicao_id`),
  CONSTRAINT `desejos_listadesejo_edicao_id_9a3aec9d_fk_livros_edicao_id` FOREIGN KEY (`edicao_id`) REFERENCES `livros_edicao` (`id`),
  CONSTRAINT `desejos_listadesejo_usuario_id_3d4d697c_fk_usuarios_usuario_id` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios_usuario` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `desejos_listadesejo`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `desejos_listadesejo` WRITE;
/*!40000 ALTER TABLE `desejos_listadesejo` DISABLE KEYS */;
/*!40000 ALTER TABLE `desejos_listadesejo` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `django_admin_log`
--

DROP TABLE IF EXISTS `django_admin_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_admin_log` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `action_time` datetime(6) NOT NULL,
  `object_id` longtext DEFAULT NULL,
  `object_repr` varchar(200) NOT NULL,
  `action_flag` smallint(5) unsigned NOT NULL CHECK (`action_flag` >= 0),
  `change_message` longtext NOT NULL,
  `content_type_id` int(11) DEFAULT NULL,
  `user_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `django_admin_log_content_type_id_c4bce8eb_fk_django_co` (`content_type_id`),
  KEY `django_admin_log_user_id_c564eba6_fk_usuarios_usuario_id` (`user_id`),
  CONSTRAINT `django_admin_log_content_type_id_c4bce8eb_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`),
  CONSTRAINT `django_admin_log_user_id_c564eba6_fk_usuarios_usuario_id` FOREIGN KEY (`user_id`) REFERENCES `usuarios_usuario` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_admin_log`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `django_admin_log` WRITE;
/*!40000 ALTER TABLE `django_admin_log` DISABLE KEYS */;
INSERT INTO `django_admin_log` VALUES
(1,'2026-10-22 12:52:32.880993','1','Vidas Secas',1,'[{\"added\": {}}]',11,2),
(2,'2026-10-22 12:54:32.805543','1','Vidas Secas - Editora Record',1,'[{\"added\": {}}]',9,2),
(3,'2026-10-22 12:54:51.106735','1','Vidas Secas - IBO91',1,'[{\"added\": {}}]',10,2),
(4,'2026-10-22 12:55:05.862606','1','Vidas Secas - IBO91',2,'[]',10,2),
(5,'2026-10-22 12:57:51.699417','2','Ensaios de sociologia e outros escritos',1,'[{\"added\": {}}]',11,2),
(6,'2026-10-22 12:59:25.978896','2','Ensaios de sociologia e outros escritos - Abril Cultural',1,'[{\"added\": {}}]',9,2),
(7,'2026-10-22 12:59:41.981567','2','Ensaios de sociologia e outros escritos - NYCO4',1,'[{\"added\": {}}]',10,2),
(8,'2026-10-22 13:01:58.691424','3','Morangos Mofados',1,'[{\"added\": {}}]',11,2),
(9,'2026-10-22 13:04:28.135244','3','Morangos Mofados - Companhia das Letras',1,'[{\"added\": {}}]',9,2),
(10,'2026-10-22 13:04:43.379166','3','Morangos Mofados - ZT8XW',1,'[{\"added\": {}}]',10,2),
(11,'2026-10-22 13:06:55.267313','4','Os Funerais da Mamãe Grande',1,'[{\"added\": {}}]',11,2),
(12,'2026-10-22 13:09:16.387510','4','Os Funerais da Mamãe Grande - Editora Record',1,'[{\"added\": {}}]',9,2),
(13,'2026-10-22 13:09:36.864556','4','Os Funerais da Mamãe Grande - 6BYIW',1,'[{\"added\": {}}]',10,2),
(14,'2026-10-22 13:12:36.934334','5','Casa-Grande & Senzala',1,'[{\"added\": {}}]',11,2),
(15,'2026-10-22 13:15:09.418815','5','Casa-Grande & Senzala - Editora Record',1,'[{\"added\": {}}]',9,2),
(16,'2026-10-22 13:15:39.794304','5','Casa-Grande & Senzala - 12O44',1,'[{\"added\": {}}]',10,2),
(17,'2026-10-22 16:28:22.295832','1','Hillary Carvalho',1,'[{\"added\": {}}]',12,2),
(18,'2026-10-22 16:28:37.442035','1','Hillary Carvalho',3,'',12,2),
(19,'2026-10-22 16:28:48.479323','2','Pedro Fagundes',1,'[{\"added\": {}}]',12,2),
(20,'2026-10-29 15:57:56.820572','1','Pedido #1 Hillary Carvalho Casa-Grande & Senzala',3,'',15,2);
/*!40000 ALTER TABLE `django_admin_log` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `django_content_type`
--

DROP TABLE IF EXISTS `django_content_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_content_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `app_label` varchar(100) NOT NULL,
  `model` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `django_content_type_app_label_model_76bd3d3b_uniq` (`app_label`,`model`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_content_type`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `django_content_type` WRITE;
/*!40000 ALTER TABLE `django_content_type` DISABLE KEYS */;
INSERT INTO `django_content_type` VALUES
(1,'admin','logentry'),
(2,'auth','group'),
(3,'auth','permission'),
(4,'contenttypes','contenttype'),
(20,'desejos','listadesejo'),
(17,'django_rest_passwordreset','resetpasswordtoken'),
(16,'emprestimos','emprestimo'),
(19,'livros','avaliacao'),
(8,'livros','cdd'),
(9,'livros','edicao'),
(10,'livros','exemplar'),
(11,'livros','livro'),
(21,'notificacoes','notificacao'),
(15,'pedidos','pedido'),
(5,'sessions','session'),
(6,'token_blacklist','blacklistedtoken'),
(7,'token_blacklist','outstandingtoken'),
(12,'usuarios','bibliotecario'),
(18,'usuarios','codigorecuperacao'),
(13,'usuarios','leitor'),
(14,'usuarios','usuario');
/*!40000 ALTER TABLE `django_content_type` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `django_migrations`
--

DROP TABLE IF EXISTS `django_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_migrations` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `app` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `applied` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=59 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_migrations`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `django_migrations` WRITE;
/*!40000 ALTER TABLE `django_migrations` DISABLE KEYS */;
INSERT INTO `django_migrations` VALUES
(1,'contenttypes','0001_initial','2026-10-15 10:26:32.780180'),
(2,'contenttypes','0002_remove_content_type_name','2026-10-15 10:26:32.842724'),
(3,'auth','0001_initial','2026-10-15 10:26:33.062727'),
(4,'auth','0002_alter_permission_name_max_length','2026-10-15 10:26:33.113333'),
(5,'auth','0003_alter_user_email_max_length','2026-10-15 10:26:33.119092'),
(6,'auth','0004_alter_user_username_opts','2026-10-15 10:26:33.126096'),
(7,'auth','0005_alter_user_last_login_null','2026-10-15 10:26:33.132759'),
(8,'auth','0006_require_contenttypes_0002','2026-10-15 10:26:33.135085'),
(9,'auth','0007_alter_validators_add_error_messages','2026-10-15 10:26:33.142548'),
(10,'auth','0008_alter_user_username_max_length','2026-10-15 10:26:33.151778'),
(11,'auth','0009_alter_user_last_name_max_length','2026-10-15 10:26:33.157455'),
(12,'auth','0010_alter_group_name_max_length','2026-10-15 10:26:33.185346'),
(13,'auth','0011_update_proxy_permissions','2026-10-15 10:26:33.193634'),
(14,'auth','0012_alter_user_first_name_max_length','2026-10-15 10:26:33.199414'),
(15,'usuarios','0001_initial','2026-10-15 10:26:33.642962'),
(16,'admin','0001_initial','2026-10-15 10:26:33.751530'),
(17,'admin','0002_logentry_remove_auto_add','2026-10-15 10:26:33.758583'),
(18,'admin','0003_logentry_add_action_flag_choices','2026-10-15 10:26:33.781662'),
(19,'livros','0001_initial','2026-10-15 10:26:33.801587'),
(20,'livros','0002_rename_sinopse_livro_descricao_livro_numero_paginas_and_more','2026-10-15 10:26:34.046006'),
(21,'livros','0003_inserir_cdds','2026-10-15 10:26:34.061598'),
(22,'livros','0004_livro_isbn','2026-10-15 10:26:34.111835'),
(23,'livros','0005_remove_livro_status_livro_edicao_exemplar','2026-10-15 10:26:34.256528'),
(24,'livros','0006_rename_ano_livro_ano_original_remove_exemplar_livro_and_more','2026-10-15 10:26:34.607533'),
(25,'sessions','0001_initial','2026-10-15 10:26:34.654534'),
(26,'token_blacklist','0001_initial','2026-10-15 10:26:34.789471'),
(27,'token_blacklist','0002_outstandingtoken_jti_hex','2026-10-15 10:26:34.824728'),
(28,'token_blacklist','0003_auto_20171017_2007','2026-10-15 10:26:34.840773'),
(29,'token_blacklist','0004_auto_20171017_2013','2026-10-15 10:26:34.936238'),
(30,'token_blacklist','0005_remove_outstandingtoken_jti','2026-10-15 10:26:34.972517'),
(31,'token_blacklist','0006_auto_20171017_2113','2026-10-15 10:26:35.005268'),
(32,'token_blacklist','0007_auto_20171017_2214','2026-10-15 10:26:35.207364'),
(33,'token_blacklist','0008_migrate_to_bigautofield','2026-10-15 10:26:35.410193'),
(34,'token_blacklist','0010_fix_migrate_to_bigautofield','2026-10-15 10:26:35.436069'),
(35,'token_blacklist','0011_linearizes_history','2026-10-15 10:26:35.439157'),
(36,'token_blacklist','0012_alter_outstandingtoken_user','2026-10-15 10:26:35.450846'),
(37,'token_blacklist','0013_alter_blacklistedtoken_options_and_more','2026-10-15 10:26:35.466960'),
(38,'usuarios','0002_alter_usuario_email','2026-10-15 10:26:35.512601'),
(39,'usuarios','0003_remove_usuario_cpf_remove_usuario_username','2026-10-15 10:26:35.589116'),
(40,'usuarios','0004_alter_usuario_managers','2026-10-15 10:26:35.595915'),
(41,'usuarios','0005_alter_bibliotecario_matricula_alter_usuario_email','2026-10-22 16:06:03.599981'),
(42,'pedidos','0001_initial','2026-10-22 16:06:03.732780'),
(43,'emprestimos','0001_initial','2026-10-22 16:17:13.581644'),
(44,'emprestimos','0002_emprestimo_data_prevista_devolucao','2026-10-22 16:20:52.209883'),
(50,'usuarios','0006_codigorecuperacao','2026-11-03 16:06:51.220250'),
(51,'livros','0007_avaliacao','2026-11-05 10:08:25.489450'),
(52,'livros','0008_exemplar_data_baixa_exemplar_motivo_baixa_and_more','2026-11-10 11:59:29.715016'),
(53,'desejos','0001_initial','2026-11-10 11:59:29.860800'),
(54,'desejos','0002_listadesejo_aguardando_disponibilidade','2026-11-10 11:59:29.928524'),
(55,'livros','0009_avaliacao_avaliacao_unica_por_leitor_livro','2026-11-10 11:59:29.981152'),
(56,'notificacoes','0001_initial','2026-11-10 11:59:30.071473'),
(57,'notificacoes','0002_notificacao_emprestimo','2026-11-10 11:59:30.157351'),
(58,'pedidos','0002_pedido_exemplar','2026-11-10 11:59:30.236049');
/*!40000 ALTER TABLE `django_migrations` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `django_session`
--

DROP TABLE IF EXISTS `django_session`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_session` (
  `session_key` varchar(40) NOT NULL,
  `session_data` longtext NOT NULL,
  `expire_date` datetime(6) NOT NULL,
  PRIMARY KEY (`session_key`),
  KEY `django_session_expire_date_a5c62663` (`expire_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_session`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `django_session` WRITE;
/*!40000 ALTER TABLE `django_session` DISABLE KEYS */;
INSERT INTO `django_session` VALUES
('3izj0rqxcoh6ll92xnm3gccf2jgo1elc','.eJxVjDsOwjAQBe_iGln-xmtKes5geb0bHECOFCcV4u4QKQW0b2beS6S8rTVtnZc0kTgLI06_G-by4LYDuud2m2WZ27pMKHdFHrTL60z8vBzu30HNvX5rV3BkE8AZZCIkm13QA-joBiqjZ2tUBA4KgJVn9NEB2wgKbSQ0pMX7A_N_N-g:1xMSTS:QHZtoJVOb3jc8XVUKUS70DTxA0tbE9FFXc4aqXoBhLA','2026-11-12 15:55:30.424227'),
('3ni150vd61skyq5ke3mc71gn4qvvkxtl','.eJxVjDsOwjAQBe_iGln-xmtKes5geb0bHECOFCcV4u4QKQW0b2beS6S8rTVtnZc0kTgLI06_G-by4LYDuud2m2WZ27pMKHdFHrTL60z8vBzu30HNvX5rV3BkE8AZZCIkm13QA-joBiqjZ2tUBA4KgJVn9NEB2wgKbSQ0pMX7A_N_N-g:1xMT7w:qmOI6d5BdykwMtsRsKopy_JcOKplQRXR6ybKz8deEhE','2026-11-12 16:37:20.944851'),
('5yuh35qwsj7e9ckweegwotkyilk0spz2','.eJxVjDsOwjAQBe_iGln-xmtKes5geb0bHECOFCcV4u4QKQW0b2beS6S8rTVtnZc0kTgLI06_G-by4LYDuud2m2WZ27pMKHdFHrTL60z8vBzu30HNvX5rV3BkE8AZZCIkm13QA-joBiqjZ2tUBA4KgJVn9NEB2wgKbSQ0pMX7A_N_N-g:1xMSfA:x59--Ob84ckXGZDlpOxkqY-3skM4999-M1Cm50Phvps','2026-11-12 16:07:36.461545'),
('csrnm2s5bz4r5hujwe0r5odlejshok7h','.eJxVjDsOwjAQBe_iGln-xmtKes5geb0bHECOFCcV4u4QKQW0b2beS6S8rTVtnZc0kTgLI06_G-by4LYDuud2m2WZ27pMKHdFHrTL60z8vBzu30HNvX5rV3BkE8AZZCIkm13QA-joBiqjZ2tUBA4KgJVn9NEB2wgKbSQ0pMX7A_N_N-g:1xHLzw:NawdRnGQUg2vVv4-H8WCaNCme4F24TBBP7jHeg43Lh8','2026-10-29 13:59:56.563310'),
('eh8nxwrvqil1yys72tsqli59ecyy47cs','.eJxVjDsOwjAQBe_iGln-xmtKes5geb0bHECOFCcV4u4QKQW0b2beS6S8rTVtnZc0kTgLI06_G-by4LYDuud2m2WZ27pMKHdFHrTL60z8vBzu30HNvX5rV3BkE8AZZCIkm13QA-joBiqjZ2tUBA4KgJVn9NEB2wgKbSQ0pMX7A_N_N-g:1xJqRW:AOFsyC-xzufl767yA0wZtqF0dOxgT3-uriqiJWXOR3s','2026-11-05 10:54:42.666502'),
('ww16fz2xjax7xu89nn7101nkhdsqn4gp','.eJxVjDsOwjAQBe_iGln-xmtKes5geb0bHECOFCcV4u4QKQW0b2beS6S8rTVtnZc0kTgLI06_G-by4LYDuud2m2WZ27pMKHdFHrTL60z8vBzu30HNvX5rV3BkE8AZZCIkm13QA-joBiqjZ2tUBA4KgJVn9NEB2wgKbSQ0pMX7A_N_N-g:1xMT35:MvnRhn6V_z3e00DJkBP3GyxnS_EwR8Clr1J8SjhPEz4','2026-11-12 16:32:19.755371');
/*!40000 ALTER TABLE `django_session` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `emprestimos_emprestimo`
--

DROP TABLE IF EXISTS `emprestimos_emprestimo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `emprestimos_emprestimo` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `data_retirada` datetime(6) NOT NULL,
  `data_devolucao` datetime(6) DEFAULT NULL,
  `exemplar_id` bigint(20) NOT NULL,
  `pedido_id` bigint(20) NOT NULL,
  `data_prevista_devolucao` date NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `pedido_id` (`pedido_id`),
  KEY `emprestimos_empresti_exemplar_id_76db953a_fk_livros_ex` (`exemplar_id`),
  CONSTRAINT `emprestimos_empresti_exemplar_id_76db953a_fk_livros_ex` FOREIGN KEY (`exemplar_id`) REFERENCES `livros_exemplar` (`id`),
  CONSTRAINT `emprestimos_emprestimo_pedido_id_198d5ed8_fk_pedidos_pedido_id` FOREIGN KEY (`pedido_id`) REFERENCES `pedidos_pedido` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `emprestimos_emprestimo`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `emprestimos_emprestimo` WRITE;
/*!40000 ALTER TABLE `emprestimos_emprestimo` DISABLE KEYS */;
INSERT INTO `emprestimos_emprestimo` VALUES
(1,'2026-10-29 15:52:59.180113',NULL,5,2,'2026-10-29'),
(2,'2026-10-29 16:36:32.072297',NULL,8,3,'2026-10-29');
/*!40000 ALTER TABLE `emprestimos_emprestimo` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `livros_avaliacao`
--

DROP TABLE IF EXISTS `livros_avaliacao`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `livros_avaliacao` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `nota` smallint(5) unsigned NOT NULL CHECK (`nota` >= 0),
  `data_avaliacao` datetime(6) NOT NULL,
  `leitor_id` bigint(20) NOT NULL,
  `livro_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `avaliacao_unica_por_leitor_livro` (`leitor_id`,`livro_id`),
  KEY `livros_avaliacao_livro_id_7c7adcf2_fk_livros_livro_id` (`livro_id`),
  CONSTRAINT `livros_avaliacao_leitor_id_07fb1498_fk_usuarios_leitor_id` FOREIGN KEY (`leitor_id`) REFERENCES `usuarios_leitor` (`id`),
  CONSTRAINT `livros_avaliacao_livro_id_7c7adcf2_fk_livros_livro_id` FOREIGN KEY (`livro_id`) REFERENCES `livros_livro` (`id`),
  CONSTRAINT `nota_entre_1_e_5` CHECK (`nota` >= 1 and `nota` <= 5)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `livros_avaliacao`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `livros_avaliacao` WRITE;
/*!40000 ALTER TABLE `livros_avaliacao` DISABLE KEYS */;
/*!40000 ALTER TABLE `livros_avaliacao` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `livros_cdd`
--

DROP TABLE IF EXISTS `livros_cdd`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `livros_cdd` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `codigo` varchar(20) NOT NULL,
  `descricao` varchar(200) NOT NULL,
  `pai_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `codigo` (`codigo`),
  KEY `livros_cdd_pai_id_a225eb73_fk_livros_cdd_id` (`pai_id`),
  CONSTRAINT `livros_cdd_pai_id_a225eb73_fk_livros_cdd_id` FOREIGN KEY (`pai_id`) REFERENCES `livros_cdd` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `livros_cdd`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `livros_cdd` WRITE;
/*!40000 ALTER TABLE `livros_cdd` DISABLE KEYS */;
INSERT INTO `livros_cdd` VALUES
(1,'000','Generalidades, informação e computação',NULL),
(2,'100','Filosofia e psicologia',NULL),
(3,'200','Religião',NULL),
(4,'300','Ciências sociais',NULL),
(5,'400','Linguística',NULL),
(6,'500','Ciências naturais e matemática',NULL),
(7,'600','Tecnologia',NULL),
(8,'700','Artes e recreação',NULL),
(9,'800','Literatura',NULL),
(10,'900','História e geografia',NULL);
/*!40000 ALTER TABLE `livros_cdd` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `livros_edicao`
--

DROP TABLE IF EXISTS `livros_edicao`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `livros_edicao` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `ano_publicacao` int(10) unsigned NOT NULL CHECK (`ano_publicacao` >= 0),
  `editora` varchar(200) NOT NULL,
  `numero_paginas` int(11) DEFAULT NULL,
  `edicao` varchar(20) DEFAULT NULL,
  `capa` varchar(100) NOT NULL,
  `isbn` varchar(17) DEFAULT NULL,
  `livro_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `isbn` (`isbn`),
  KEY `livros_edicao_livro_id_c6670ab3_fk_livros_livro_id` (`livro_id`),
  CONSTRAINT `livros_edicao_livro_id_c6670ab3_fk_livros_livro_id` FOREIGN KEY (`livro_id`) REFERENCES `livros_livro` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `livros_edicao`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `livros_edicao` WRITE;
/*!40000 ALTER TABLE `livros_edicao` DISABLE KEYS */;
INSERT INTO `livros_edicao` VALUES
(1,1998,'Editora Record',155,'75','','8501005584',1),
(2,1976,'Abril Cultural',270,'1','capas/Os-pensadores-1-edico-abril-cultural.jpg',NULL,2),
(3,2019,'Companhia das Letras',188,'10','capas/MORANGOS_MOFADOS_1688129519981SK-V11688129521B.webp','9788535932669',3),
(4,2026,'Editora Record',159,'21','capas/bfgfgcf.webp','9788501016560',4),
(5,1989,'Editora Record',567,'26','',NULL,5);
/*!40000 ALTER TABLE `livros_edicao` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `livros_exemplar`
--

DROP TABLE IF EXISTS `livros_exemplar`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `livros_exemplar` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `tombo` varchar(5) NOT NULL,
  `status` varchar(20) NOT NULL,
  `edicao_id` bigint(20) NOT NULL,
  `data_baixa` datetime(6) DEFAULT NULL,
  `motivo_baixa` longtext DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `tombo` (`tombo`),
  KEY `livros_exemplar_edicao_id_756db18a_fk_livros_edicao_id` (`edicao_id`),
  CONSTRAINT `livros_exemplar_edicao_id_756db18a_fk_livros_edicao_id` FOREIGN KEY (`edicao_id`) REFERENCES `livros_edicao` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `livros_exemplar`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `livros_exemplar` WRITE;
/*!40000 ALTER TABLE `livros_exemplar` DISABLE KEYS */;
INSERT INTO `livros_exemplar` VALUES
(1,'IBO91','disponivel',1,NULL,NULL),
(2,'NYCO4','disponivel',2,NULL,NULL),
(3,'ZT8XW','disponivel',3,NULL,NULL),
(4,'6BYIW','disponivel',4,NULL,NULL),
(5,'12O44','emprestado',5,NULL,NULL),
(7,'APVDR','disponivel',1,NULL,NULL),
(8,'FBRGA','emprestado',1,NULL,NULL);
/*!40000 ALTER TABLE `livros_exemplar` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `livros_livro`
--

DROP TABLE IF EXISTS `livros_livro`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `livros_livro` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `titulo` varchar(200) NOT NULL,
  `autor` varchar(200) NOT NULL,
  `descricao` varchar(1000) NOT NULL,
  `generos` varchar(90) NOT NULL,
  `ano_original` int(10) unsigned NOT NULL CHECK (`ano_original` >= 0),
  `subtitulo` varchar(200) NOT NULL,
  `cdd_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `livros_livro_cdd_id_5715e4e8_fk_livros_cdd_id` (`cdd_id`),
  CONSTRAINT `livros_livro_cdd_id_5715e4e8_fk_livros_cdd_id` FOREIGN KEY (`cdd_id`) REFERENCES `livros_cdd` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `livros_livro`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `livros_livro` WRITE;
/*!40000 ALTER TABLE `livros_livro` DISABLE KEYS */;
INSERT INTO `livros_livro` VALUES
(1,'Vidas Secas','Graciliano Ramos','Uma família de retirantes fugindo da seca no sertão nordestino enfrenta diversas chagas sociais de seu tempo como a seca, miséria e desigualdade social.','Romance',1938,'',9),
(2,'Ensaios de sociologia e outros escritos','Max Weber','Coleção de vários textos do sociólogo Max Weber','Sociologia/Filosofia',1976,'',4),
(3,'Morangos Mofados','Caio Fernando Abreu','Antologia de contos que refletem a angústia do início da Década Perdida no fim da Ditadura Civil-Militar.','Conto',1982,'',9),
(4,'Os Funerais da Mamãe Grande','Gabriel García Márquez','Antologia de contos, passando pela desigualdade da América Latina, ditaduras militares e a angústia do povo.','Conto',1962,'',9),
(5,'Casa-Grande & Senzala','Gilberto Freyre','Estudo sociológico sobre a constituição do povo brasileiro no período colonial.','Sociologia/História',1933,'',4);
/*!40000 ALTER TABLE `livros_livro` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `notificacoes_notificacao`
--

DROP TABLE IF EXISTS `notificacoes_notificacao`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `notificacoes_notificacao` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `titulo` varchar(150) NOT NULL,
  `mensagem` longtext NOT NULL,
  `lida` tinyint(1) NOT NULL,
  `data_criacao` datetime(6) NOT NULL,
  `usuario_id` bigint(20) NOT NULL,
  `emprestimo_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `notificacoes_notific_usuario_id_808d460a_fk_usuarios_` (`usuario_id`),
  KEY `notificacoes_notific_emprestimo_id_8a4309d5_fk_emprestim` (`emprestimo_id`),
  CONSTRAINT `notificacoes_notific_emprestimo_id_8a4309d5_fk_emprestim` FOREIGN KEY (`emprestimo_id`) REFERENCES `emprestimos_emprestimo` (`id`),
  CONSTRAINT `notificacoes_notific_usuario_id_808d460a_fk_usuarios_` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios_usuario` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notificacoes_notificacao`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `notificacoes_notificacao` WRITE;
/*!40000 ALTER TABLE `notificacoes_notificacao` DISABLE KEYS */;
/*!40000 ALTER TABLE `notificacoes_notificacao` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `pedidos_pedido`
--

DROP TABLE IF EXISTS `pedidos_pedido`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `pedidos_pedido` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `status` varchar(20) NOT NULL,
  `data_pedido` datetime(6) NOT NULL,
  `data_resposta` datetime(6) DEFAULT NULL,
  `edicao_id` bigint(20) NOT NULL,
  `leitor_id` bigint(20) NOT NULL,
  `exemplar_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `pedidos_pedido_edicao_id_7691ae30_fk_livros_edicao_id` (`edicao_id`),
  KEY `pedidos_pedido_leitor_id_d4355607_fk_usuarios_leitor_id` (`leitor_id`),
  KEY `pedidos_pedido_exemplar_id_28c61591_fk_livros_exemplar_id` (`exemplar_id`),
  CONSTRAINT `pedidos_pedido_edicao_id_7691ae30_fk_livros_edicao_id` FOREIGN KEY (`edicao_id`) REFERENCES `livros_edicao` (`id`),
  CONSTRAINT `pedidos_pedido_exemplar_id_28c61591_fk_livros_exemplar_id` FOREIGN KEY (`exemplar_id`) REFERENCES `livros_exemplar` (`id`),
  CONSTRAINT `pedidos_pedido_leitor_id_d4355607_fk_usuarios_leitor_id` FOREIGN KEY (`leitor_id`) REFERENCES `usuarios_leitor` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pedidos_pedido`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `pedidos_pedido` WRITE;
/*!40000 ALTER TABLE `pedidos_pedido` DISABLE KEYS */;
INSERT INTO `pedidos_pedido` VALUES
(2,'aprovado','2026-10-29 13:42:22.258300','2026-10-29 15:45:48.571859',5,1,NULL),
(3,'aprovado','2026-10-29 16:05:51.502228','2026-10-29 16:06:55.943492',1,1,NULL);
/*!40000 ALTER TABLE `pedidos_pedido` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `token_blacklist_blacklistedtoken`
--

DROP TABLE IF EXISTS `token_blacklist_blacklistedtoken`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `token_blacklist_blacklistedtoken` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `blacklisted_at` datetime(6) NOT NULL,
  `token_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `token_id` (`token_id`),
  CONSTRAINT `token_blacklist_blacklistedtoken_token_id_3cc7fe56_fk` FOREIGN KEY (`token_id`) REFERENCES `token_blacklist_outstandingtoken` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `token_blacklist_blacklistedtoken`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `token_blacklist_blacklistedtoken` WRITE;
/*!40000 ALTER TABLE `token_blacklist_blacklistedtoken` DISABLE KEYS */;
INSERT INTO `token_blacklist_blacklistedtoken` VALUES
(1,'2026-10-22 11:35:56.131026',6);
/*!40000 ALTER TABLE `token_blacklist_blacklistedtoken` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `token_blacklist_outstandingtoken`
--

DROP TABLE IF EXISTS `token_blacklist_outstandingtoken`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `token_blacklist_outstandingtoken` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `token` longtext NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `expires_at` datetime(6) NOT NULL,
  `user_id` bigint(20) DEFAULT NULL,
  `jti` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `token_blacklist_outstandingtoken_jti_hex_d9bdf6f7_uniq` (`jti`),
  KEY `token_blacklist_outs_user_id_83bc629a_fk_usuarios_` (`user_id`),
  CONSTRAINT `token_blacklist_outs_user_id_83bc629a_fk_usuarios_` FOREIGN KEY (`user_id`) REFERENCES `usuarios_usuario` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=151 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `token_blacklist_outstandingtoken`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `token_blacklist_outstandingtoken` WRITE;
/*!40000 ALTER TABLE `token_blacklist_outstandingtoken` DISABLE KEYS */;
INSERT INTO `token_blacklist_outstandingtoken` VALUES
(1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5MjE1ODk5NSwiaWF0IjoxNzkyMDcyNTk1LCJqdGkiOiI0MjdhZWFkN2EyZGE0MzhmODhmMDJiYWIwOWFlYTUzNiIsInVzZXJfaWQiOiIxIn0.cZhUULXLieD2gmKwwtv1V_odaXdzl5kXndu7BCAE2oc','2026-10-15 13:56:35.744007','2026-10-16 13:56:35.000000',1,'427aead7a2da438f88f02bab09aea536'),
(2,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5Mjc1NDA0OSwiaWF0IjoxNzkyNjY3NjQ5LCJqdGkiOiI1ZWYxNjQ3NWMwOTI0OTU1YmY1NmMwYWZjZDUxY2MzYyIsInVzZXJfaWQiOiIzIn0.KXuKVXf3sJ3O0d9KLYXqI7ce9zL8lUDC12mx8KGkCIY','2026-10-22 11:14:09.844699','2026-10-23 11:14:09.000000',3,'5ef16475c0924955bf56c0afcd51cc3c'),
(3,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5Mjc1NDMwMCwiaWF0IjoxNzkyNjY3OTAwLCJqdGkiOiI0NzhhYmM1OTc4ODI0ZDhlYTJmOTRlZTQyNTNlYjU4YSIsInVzZXJfaWQiOiIzIn0.-DVdHxCJ2Kl7Ohlr7NQEg_c5i-y_0cTF-e4qorxZcI8','2026-10-22 11:18:20.314619','2026-10-23 11:18:20.000000',3,'478abc5978824d8ea2f94ee4253eb58a'),
(4,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5Mjc1NDY0NywiaWF0IjoxNzkyNjY4MjQ3LCJqdGkiOiIwODBlOTBmMDFiNjM0ZTIwYTU1YzJlMmFjYzc2NTQ5OSIsInVzZXJfaWQiOiIzIn0.7nw7L09e1nLwqQaYzyETnxUW3h-712DyCF8oDGQgqwA','2026-10-22 11:24:07.049111','2026-10-23 11:24:07.000000',3,'080e90f01b634e20a55c2e2acc765499'),
(5,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5Mjc1NTA3OCwiaWF0IjoxNzkyNjY4Njc4LCJqdGkiOiJjZTFjMDBjZGRkYzY0ZGY5YjUxMjk5NzY4M2FhYWRlNiIsInVzZXJfaWQiOiIzIn0.IXXOcLbC5_VkB4jOyJJuW6OgkLIB-h2D4LqOHc916dc','2026-10-22 11:31:18.867448','2026-10-23 11:31:18.000000',3,'ce1c00cdddc64df9b512997683aaade6'),
(6,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5Mjc1NTMyNSwiaWF0IjoxNzkyNjY4OTI1LCJqdGkiOiIwMzI1N2U0MDkyNjc0MTRjODExNTBjNWE5Mzg3MTA2MiIsInVzZXJfaWQiOiIzIn0.WM788I2KQM0-YKXBZHg35RZcjwj8uAnTPRpy6JDOLr0','2026-10-22 11:35:25.849065','2026-10-23 11:35:25.000000',3,'03257e409267414c81150c5a93871062'),
(7,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5Mjc2MjI2MCwiaWF0IjoxNzkyNjc1ODYwLCJqdGkiOiJhMTYwOWRjNDdmNzM0Y2YyOTk1ZTc0MWUzODBmYWZlYSIsInVzZXJfaWQiOiIzIn0.rZXNsiQLL5P4g9zozG-Hfi7UldZAL5YQT-UwA45peVQ','2026-10-22 13:31:00.776109','2026-10-23 13:31:00.000000',3,'a1609dc47f734cf2995e741e380fafea'),
(8,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5MzM2NDk0MywiaWF0IjoxNzkzMjc4NTQzLCJqdGkiOiJiOWNkMGRhZWI0Zjk0NmYxYjM5NjRkNDkxOTQwMzAyYyIsInVzZXJfaWQiOiIxIn0.sTbtl7B4b43eKGidmZjb2nmYl3veBV3hYy7JH8rBXm8','2026-10-29 12:55:43.007904','2026-10-30 12:55:43.000000',1,'b9cd0daeb4f946f1b3964d491940302c'),
(9,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5MzM2NjU3OCwiaWF0IjoxNzkzMjgwMTc4LCJqdGkiOiJjOTFlZDhlMDk1MjA0NmIxOTQwZTJjYjY4MjA2YWVlNyIsInVzZXJfaWQiOiIzIn0.zTKLArjauc-UOhYnvZYOkCzD7X56JwW-ZUCmKINS1ro','2026-10-29 13:22:58.161511','2026-10-30 13:22:58.000000',3,'c91ed8e0952046b1940e2cb68206aee7'),
(10,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5MzM2NzAxMSwiaWF0IjoxNzkzMjgwNjExLCJqdGkiOiI5NzMwNzQ5NmY5NjA0NzI5YjI1NTUwYTAzYzAzNGY0MCIsInVzZXJfaWQiOiIzIn0.K7dQCOg1fkPRzgqWZi4kA5vEjSGBPFtGebsccpsU7Zw','2026-10-29 13:30:11.238634','2026-10-30 13:30:11.000000',3,'97307496f9604729b25550a03c034f40'),
(11,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5MzM2NzE2NiwiaWF0IjoxNzkzMjgwNzY2LCJqdGkiOiJlZDNhMDM0ZTViYWQ0MTU4YWM1MTU4N2Y3YjViNjViMCIsInVzZXJfaWQiOiIzIn0.UrnJqSOrHUJAxbf6G2zdGEPLZw_-Z4c0yuXAWZjA0iE','2026-10-29 13:32:46.927308','2026-10-30 13:32:46.000000',3,'ed3a034e5bad4158ac51587f7b5b65b0'),
(12,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5MzM2NzM0MCwiaWF0IjoxNzkzMjgwOTQwLCJqdGkiOiJjMTVlMDI0MzhmYTU0NWZjOWJiNDNiYTQ0ODZjYTBkNSIsInVzZXJfaWQiOiIzIn0.W0b8RbU5iLpjCzKmalM7x2-D3Q5TGQAlNLn5M-jjjwY','2026-10-29 13:35:40.917074','2026-10-30 13:35:40.000000',3,'c15e02438fa545fc9bb43ba4486ca0d5'),
(13,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5MzM2NzcwNCwiaWF0IjoxNzkzMjgxMzA0LCJqdGkiOiI2NzU2YTJkNjZjNWM0MTZjODFkNzM0MmJkZWUxZTg0OCIsInVzZXJfaWQiOiIzIn0._zUtuS2D2tyXzZpAoXhuDN0Fjs6IQhTSyzByaoQouVY','2026-10-29 13:41:44.351898','2026-10-30 13:41:44.000000',3,'6756a2d66c5c416c81d7342bdee1e848'),
(14,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5MzM2Nzk0MywiaWF0IjoxNzkzMjgxNTQzLCJqdGkiOiI3MGY3YjgxNWI3MmI0NTdjOTg4NjVhOGNhZDliYzU5YSIsInVzZXJfaWQiOiIxIn0.AyCcZvNeQu1F7lYuPjmCJHE6kVTFoULSjSzD4C2WVzw','2026-10-29 13:45:43.661176','2026-10-30 13:45:43.000000',1,'70f7b815b72b457c98865a8cad9bc59a'),
(15,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5MzM2ODg1OCwiaWF0IjoxNzkzMjgyNDU4LCJqdGkiOiJkZjQ2MTcwYTBkZWE0MmMyODU5MzgyMmRlMDE0YjE1OCIsInVzZXJfaWQiOiIxIn0.XSQfWg4GW8aFvAQc3E6nORW0SSZkLbZkK1_PpvOg7jA','2026-10-29 14:00:58.621634','2026-10-30 14:00:58.000000',1,'df46170a0dea42c28593822de014b158'),
(16,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5MzM2ODk1MSwiaWF0IjoxNzkzMjgyNTUxLCJqdGkiOiIyMTcwNDhkYTAyZTY0YTQxOGVlYWJiNWI3ZmEwNzc3NiIsInVzZXJfaWQiOiIxIn0.iVnKr62aURETzIJ3xmtntlgGR-wInEjt9grsqNRwr1k','2026-10-29 14:02:31.789418','2026-10-30 14:02:31.000000',1,'217048da02e64a418eeabb5b7fa07776'),
(17,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5MzM3NTA2MSwiaWF0IjoxNzkzMjg4NjYxLCJqdGkiOiIwYmY1ZWE3NzU2Mjc0NjE1YTI3YmUyMzFhMmE0ODI1MiIsInVzZXJfaWQiOiIzIn0.I4UCnIvcW6FgGRMYQlVmRqdni-NAXUM2hp8YCGMplog','2026-10-29 15:44:21.928680','2026-10-30 15:44:21.000000',3,'0bf5ea7756274615a27be231a2a48252'),
(18,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5MzM3NTEyMywiaWF0IjoxNzkzMjg4NzIzLCJqdGkiOiJjODU4NmNkYThiNWU0NTQyYTlhZTE3NzE5OTE0YTRhNCIsInVzZXJfaWQiOiIxIn0.JAGWDeGo7er3iUjRtfLxkvqDAuY8uuAsGvelSeO6HJs','2026-10-29 15:45:23.333700','2026-10-30 15:45:23.000000',1,'c8586cda8b5e4542a9ae17719914a4a4'),
(19,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5MzM3NTM5MSwiaWF0IjoxNzkzMjg4OTkxLCJqdGkiOiIwNjgyMDU5NjdjNmY0MmRkODdiNzJiYTIwZGU3ZTE5OCIsInVzZXJfaWQiOiIxIn0.3ajLpuDk3IvGZv6VjUsCXf5Eh14KjIZgXr9qDrv8JdE','2026-10-29 15:49:51.684765','2026-10-30 15:49:51.000000',1,'068205967c6f42dd87b72ba20de7e198'),
(20,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5MzM3NjAxMSwiaWF0IjoxNzkzMjg5NjExLCJqdGkiOiIxMThjNjQ2NDY5NmQ0OTc0YjBjOTk3YmU4NTI1ZjY3ZSIsInVzZXJfaWQiOiIzIn0.gEYEQpuKkivIXtuv6Q3EHjH4GK2LqD56M0v4K9nAq28','2026-10-29 16:00:11.192455','2026-10-30 16:00:11.000000',3,'118c6464696d4974b0c997be8525f67e'),
(21,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5MzM3NjIyNiwiaWF0IjoxNzkzMjg5ODI2LCJqdGkiOiI3NzRkYzc1ZDNlMzc0MTU1YjNlYWEwZmQ4NWU2NTZjMyIsInVzZXJfaWQiOiIzIn0._OhIzEMhGcEKLnbB0bSzQPQrQ8dnvxiyS9IFY2xngQU','2026-10-29 16:03:46.078048','2026-10-30 16:03:46.000000',3,'774dc75d3e374155b3eaa0fd85e656c3'),
(22,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5MzM3NjMyNSwiaWF0IjoxNzkzMjg5OTI1LCJqdGkiOiI2NGM0ZGYzMGFkZWQ0ODY0OGY1YzJiOGI4ZDMyNzBlMSIsInVzZXJfaWQiOiIzIn0.77pKuXS_WQhxzXesnsQzKOiW8n1AyqGyjdb7I3tZoig','2026-10-29 16:05:25.354824','2026-10-30 16:05:25.000000',3,'64c4df30aded48648f5c2b8b8d3270e1'),
(23,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5MzM3NjM4NiwiaWF0IjoxNzkzMjg5OTg2LCJqdGkiOiI2MTU4ZmU0ZmM5MjI0YzRlYTY0OThhNmM1ZGRmMjk5MSIsInVzZXJfaWQiOiIxIn0.KLmjYF7cmgYFe_-czRZD3wlaclIB42a3Twr9i1CsSSQ','2026-10-29 16:06:26.750908','2026-10-30 16:06:26.000000',1,'6158fe4fc9224c4ea6498a6c5ddf2991'),
(24,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5MzM3NjYzMCwiaWF0IjoxNzkzMjkwMjMwLCJqdGkiOiIzNzBjMmM2OGMxZDc0MzRjYmY4NWQ1YWJiOWRiZGI1ZCIsInVzZXJfaWQiOiIxIn0.hOAqkndgsw7YjQi23qyuRnZy1JDL4OaFuARXPPFZhz8','2026-10-29 16:10:30.980792','2026-10-30 16:10:30.000000',1,'370c2c68c1d7434cbf85d5abb9dbdb5d'),
(25,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5MzM3Njc1NiwiaWF0IjoxNzkzMjkwMzU2LCJqdGkiOiJhMzhkZjQwNzg0YjY0ODMxOTJhMThhNzQ4YjEwZGZhMCIsInVzZXJfaWQiOiIxIn0.pddP4Z8cotX2kWMAsildSWBwSTILxG0rbvykNbdJx_k','2026-10-29 16:12:36.525221','2026-10-30 16:12:36.000000',1,'a38df40784b6483192a18a748b10dfa0'),
(26,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5MzM3Njk0NCwiaWF0IjoxNzkzMjkwNTQ0LCJqdGkiOiIwYWNjNGUwNGMwZWY0ODFjYmFjNDRmNTZkYmU1YWU0ZSIsInVzZXJfaWQiOiIxIn0.KsKZecalIOsJysS768L8HdffwRKAo7coW5Eago5N8pA','2026-10-29 16:15:44.901196','2026-10-30 16:15:44.000000',1,'0acc4e04c0ef481cbac44f56dbe5ae4e'),
(27,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5MzM3NzQ1NCwiaWF0IjoxNzkzMjkxMDU0LCJqdGkiOiJlMGQ1MTZkNzBiMjc0YTllODk5NDMxZDFiZTJkZjk3NCIsInVzZXJfaWQiOiIzIn0.uczhnjsw7bKeJNj9pAHjzrPqWuwxubeb0AwmdbX9grk','2026-10-29 16:24:14.761818','2026-10-30 16:24:14.000000',3,'e0d516d70b274a9e899431d1be2df974'),
(28,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5MzM3NzgyNiwiaWF0IjoxNzkzMjkxNDI2LCJqdGkiOiIzODZhOGQwOWUyOWY0YzVjYjU5ZjI4YjBjNzE4ZTEzOCIsInVzZXJfaWQiOiIzIn0.gF4YHKAMJUu8Gk4Kh-ZPS1NMFY3tcYpEcBE7y1toTpU','2026-10-29 16:30:26.996105','2026-10-30 16:30:26.000000',3,'386a8d09e29f4c5cb59f28b0c718e138'),
(29,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5MzM3ODAyNSwiaWF0IjoxNzkzMjkxNjI1LCJqdGkiOiIyY2I0NWU0MzZjNWE0MTk5YjkzODMyMjcwNjVhMTYyNSIsInVzZXJfaWQiOiIxIn0.uaWP3VvqkObCvlEpKg9yBg37iz_iuJy-ha_uJWOM12A','2026-10-29 16:33:45.132401','2026-10-30 16:33:45.000000',1,'2cb45e436c5a4199b9383227065a1625'),
(30,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5MzM3ODExOSwiaWF0IjoxNzkzMjkxNzE5LCJqdGkiOiJhM2M2YmU0YzVjZDY0ZDZjYjZhNWUxNzY2MjY0OWFjZiIsInVzZXJfaWQiOiIxIn0.g3AhgLggnQuJ8V3FX7BmNt4WvQFvFu3jNyfjCrOWPRQ','2026-10-29 16:35:19.383614','2026-10-30 16:35:19.000000',1,'a3c6be4c5cd64d6cb6a5e17662649acf'),
(31,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5MzgxMDEwMiwiaWF0IjoxNzkzNzIzNzAyLCJqdGkiOiI5MzI4NTAzYjI3MmQ0ZDc0OWI5YzNmNTBjMjc0ZTMzNCIsInVzZXJfaWQiOiIzIn0.UbEAbfjLd8y8nf5EuzqzVf7pR7B6xLoWRQ1sfOKTr8g','2026-11-03 16:35:02.626874','2026-11-04 16:35:02.000000',3,'9328503b272d4d749b9c3f50c274e334'),
(32,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5MzgxMTIwMywiaWF0IjoxNzkzNzI0ODAzLCJqdGkiOiI5NjcwZmE5ZTk4NWU0Njg0ODQzOTAxYjVlZTE0ZjAxNCIsInVzZXJfaWQiOiIzIn0.bRJ_Scz1uZsZJJ5Wx5XIMH7Y32Z6FdlxrfpFoFKIMb8','2026-11-03 16:53:23.417641','2026-11-04 16:53:23.000000',3,'9670fa9e985e4684843901b5ee14f014'),
(33,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5MzgxNDA5NiwiaWF0IjoxNzkzNzI3Njk2LCJqdGkiOiI0OGRlNTJjMDMyYmM0MjNjOTI1ODIyNzI4YTJiM2RkNSIsInVzZXJfaWQiOiIzIn0.Rf-sg8opxpwf6QIrv7UjzyyBLSSyf0GpFPtAU6eLsMA','2026-11-03 17:41:36.974353','2026-11-04 17:41:36.000000',3,'48de52c032bc423c925822728a2b3dd5'),
(34,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5MzgxNDE5MSwiaWF0IjoxNzkzNzI3NzkxLCJqdGkiOiI1NmE4M2M1MmUyNGM0MzExYmZhZDYzM2I4MTYwMjgyNSIsInVzZXJfaWQiOiIzIn0.mFnAXRv1C-dheknLp32PcH07ZYs7cwpf__EBk5DUD2E','2026-11-03 17:43:11.075076','2026-11-04 17:43:11.000000',3,'56a83c52e24c4311bfad633b81602825'),
(35,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5MzgxNDIwNywiaWF0IjoxNzkzNzI3ODA3LCJqdGkiOiI1NzlkZDY4ZDhmZmY0Yzc3OGVhYWEzY2JjZTJlZTI5ZSIsInVzZXJfaWQiOiIzIn0.404fjEg3axKOq97lACIx8hLqHulP0dPjXhG22WRxx44','2026-11-03 17:43:27.034567','2026-11-04 17:43:27.000000',3,'579dd68d8fff4c778eaaa3cbce2ee29e'),
(36,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5Mzk1OTc5MywiaWF0IjoxNzkzODczMzkzLCJqdGkiOiIyNWM1ZGMwZmQ4NGQ0YWNhYWVjYTc1YjQ1YTBiYzEzYiIsInVzZXJfaWQiOiIzIn0.1EJrhvNE9e-QzsS5egFFmKjIAyXAVpCUiTDqUMhy-kU','2026-11-05 10:09:53.845193','2026-11-06 10:09:53.000000',3,'25c5dc0fd84d4acaaeca75b45a0bc13b'),
(37,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5Mzk1OTc5NywiaWF0IjoxNzkzODczMzk3LCJqdGkiOiJkMGE2MjI4ODFmMDk0Yzg4YjRhNWExMDcyNGMwNDIyMSIsInVzZXJfaWQiOiIzIn0.XStjZ6C2LfkK16PfngxdI5A-2VEp3c5wiGSlYP_njpI','2026-11-05 10:09:57.072639','2026-11-06 10:09:57.000000',3,'d0a622881f094c88b4a5a10724c04221'),
(38,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5Mzk1OTkwOCwiaWF0IjoxNzkzODczNTA4LCJqdGkiOiIzZGEzOTg5MTY4NWE0YjRkODc2NTk4N2VlNjE1YTQ1OCIsInVzZXJfaWQiOiIzIn0.E2XEuV2OHTcU9yyb-iF1SFalJbfNti9NREozyF3pXHo','2026-11-05 10:11:48.410010','2026-11-06 10:11:48.000000',3,'3da39891685a4b4d8765987ee615a458'),
(39,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5Mzk2MDAyNiwiaWF0IjoxNzkzODczNjI2LCJqdGkiOiJjMzA0ZTA4YTQ0MmU0ZTg1YTU4ZDgwZTI4MDM0MDhjNyIsInVzZXJfaWQiOiIzIn0.86a8XTR-UuqhWH7uQFOnKZcn_Mf1XwnhNAqGtYeyA0I','2026-11-05 10:13:46.877296','2026-11-06 10:13:46.000000',3,'c304e08a442e4e85a58d80e2803408c7'),
(40,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5Mzk2MjY5MCwiaWF0IjoxNzkzODc2MjkwLCJqdGkiOiI2NDhjODMzZWZkNjU0OTA5OTE1ZDI2NmU1ODgyZWQ3OSIsInVzZXJfaWQiOiIzIn0.fe2Y3pKRUGtdJrsNe3l5oMbhezZQNAbAdmvzdka2NEI','2026-11-05 10:58:10.132608','2026-11-06 10:58:10.000000',3,'648c833efd654909915d266e5882ed79'),
(41,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5Mzk2MjY5NSwiaWF0IjoxNzkzODc2Mjk1LCJqdGkiOiJmOTVkOTdlNDNlZjM0NWUyYTNlNGZhMDU5YmE5ZjI5ZCIsInVzZXJfaWQiOiIzIn0.kpIRI_j7oQOpOBpIChu4rrFmfDYNolvciF6xpWBF7eU','2026-11-05 10:58:15.943293','2026-11-06 10:58:15.000000',3,'f95d97e43ef345e2a3e4fa059ba9f29d'),
(42,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5Mzk2MjY5NiwiaWF0IjoxNzkzODc2Mjk2LCJqdGkiOiIzYmEzZjA5MDIxNDg0ZGVhYmI2NTAzMjg4Y2YyMWExZiIsInVzZXJfaWQiOiIzIn0.jRv22wGWzMU62MO5m5bq6M8eNuAGLJARWMUgTovXmbI','2026-11-05 10:58:16.460968','2026-11-06 10:58:16.000000',3,'3ba3f09021484deabb6503288cf21a1f'),
(43,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5Mzk2MjY5NiwiaWF0IjoxNzkzODc2Mjk2LCJqdGkiOiIxODdmMzkzODFhNzM0MmVhYjg4ZGE3ZjU2YzRmM2ZiYiIsInVzZXJfaWQiOiIzIn0.XwaifAZjCcJqU0667K-CcxunSqmhswt8PNcltxpKIm4','2026-11-05 10:58:16.762505','2026-11-06 10:58:16.000000',3,'187f39381a7342eab88da7f56c4f3fbb'),
(44,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5Mzk2MjY5NywiaWF0IjoxNzkzODc2Mjk3LCJqdGkiOiI5MWQ1OGM3NjljZjY0ZDY2ODQyYTcwODNjNTg0OTJjMyIsInVzZXJfaWQiOiIzIn0.bV-lKfmkzqgnV65W22G5DB6oVQIjVSVMNWJ1zdlIdek','2026-11-05 10:58:17.130157','2026-11-06 10:58:17.000000',3,'91d58c769cf64d66842a7083c58492c3'),
(45,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5Mzk2NTc2OSwiaWF0IjoxNzkzODc5MzY5LCJqdGkiOiJmOWE3NDFmNTg1MTg0M2FhODBjODBiZDNhMDI3OGEyYyIsInVzZXJfaWQiOiIzIn0.DtrQ1QwB-1g2HADkZVGlORO9wPW1moxu3pYJGj-mHlU','2026-11-05 11:49:29.913641','2026-11-06 11:49:29.000000',3,'f9a741f5851843aa80c80bd3a0278a2c'),
(46,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5Mzk2OTY1NiwiaWF0IjoxNzkzODgzMjU2LCJqdGkiOiJkNDU0NWM0OTg0N2I0ZTczYTA5ZmNlNzY2MWI2NmRlNSIsInVzZXJfaWQiOiIzIn0.72nDUWIVdcWsvmh1-rYRoiZjQ5zgtkGmciI_NCntaTc','2026-11-05 12:54:16.095473','2026-11-06 12:54:16.000000',3,'d4545c49847b4e73a09fce7661b66de5'),
(47,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5Mzk2OTY1NywiaWF0IjoxNzkzODgzMjU3LCJqdGkiOiI5MzJlYWQ3MWFiMTI0OTBjOWUyNjc2YTYxZjhkYmExMiIsInVzZXJfaWQiOiIzIn0.OY18VYPPFDMqVj3uqB9Bcn3KSo0PKTyKTZcc3a0RKgw','2026-11-05 12:54:17.582481','2026-11-06 12:54:17.000000',3,'932ead71ab12490c9e2676a61f8dba12'),
(48,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5Mzk2OTY2NiwiaWF0IjoxNzkzODgzMjY2LCJqdGkiOiJhOGEwOWJjM2ZmYWU0ZGI0YjQzMGI0ZTI2NmQ4YTRmYSIsInVzZXJfaWQiOiIzIn0.ZHt2RhA95HY69CL1z9zZy7EJWeer1tA2wfFVOgfA8o4','2026-11-05 12:54:26.386538','2026-11-06 12:54:26.000000',3,'a8a09bc3ffae4db4b430b4e266d8a4fa'),
(49,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5Mzk2OTY2NiwiaWF0IjoxNzkzODgzMjY2LCJqdGkiOiIyMzM3Nzg5ZGZiNjU0MTEyODQ2NDAwNTQ1ZjM5OWI4MyIsInVzZXJfaWQiOiIzIn0.VqYjsO0uScZZDkPLYDF0vhqBVYMt5Vegwot80kPaDos','2026-11-05 12:54:26.739048','2026-11-06 12:54:26.000000',3,'2337789dfb654112846400545f399b83'),
(50,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5Mzk2OTY2NywiaWF0IjoxNzkzODgzMjY3LCJqdGkiOiJjYzg1NGZiMTYwNTQ0MWNmYjczZjI2YzE0YWIxZjg2OCIsInVzZXJfaWQiOiIzIn0.Qxo3xUB14KVZzUTEc5wUoISjA9Y2m1s2SE-x8e5pyvo','2026-11-05 12:54:27.021015','2026-11-06 12:54:27.000000',3,'cc854fb1605441cfb73f26c14ab1f868'),
(51,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5Mzk2OTY2NywiaWF0IjoxNzkzODgzMjY3LCJqdGkiOiJlYmYzYjhhZTNhYjk0M2IwYTI2OGFmNDg1ODM0N2M5OSIsInVzZXJfaWQiOiIzIn0.0aOq1I1VHOqAtYMJ3j99MRvzRHV-xXOAQrgwmYvG56Y','2026-11-05 12:54:27.317719','2026-11-06 12:54:27.000000',3,'ebf3b8ae3ab943b0a268af4858347c99'),
(52,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5Mzk2OTY2NywiaWF0IjoxNzkzODgzMjY3LCJqdGkiOiI5ZmNhZDAwZDE0MmQ0ZjdkODFjNzg5YWIyOWMzNTE0OSIsInVzZXJfaWQiOiIzIn0.9aEsPZCbZ91muSGT8IzQyFdpKMpxrRi2h663-X335g8','2026-11-05 12:54:27.603226','2026-11-06 12:54:27.000000',3,'9fcad00d142d4f7d81c789ab29c35149'),
(53,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5Mzk2OTY2NywiaWF0IjoxNzkzODgzMjY3LCJqdGkiOiJjZTBhYzVhMmYwYzI0YzE0YTRhNjkxNzU2ZjEzZTFlYyIsInVzZXJfaWQiOiIzIn0.Zadja4tEpSuvmooY6Cj2G140-z0WWa5v_E4cXKBbKRQ','2026-11-05 12:54:27.798080','2026-11-06 12:54:27.000000',3,'ce0ac5a2f0c24c14a4a691756f13e1ec'),
(54,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5Mzk2OTY2NywiaWF0IjoxNzkzODgzMjY3LCJqdGkiOiJiOTQzYmZhMTQ3ODE0ODExYTdkNTc2YzM3MWEzMGFlMSIsInVzZXJfaWQiOiIzIn0.qxyCvYx0CBlLtT_Ko9jxL58huPI1u-IjcOMZhMPdWZE','2026-11-05 12:54:27.981402','2026-11-06 12:54:27.000000',3,'b943bfa147814811a7d576c371a30ae1'),
(55,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5Mzk2OTY2OCwiaWF0IjoxNzkzODgzMjY4LCJqdGkiOiIyYjk3YWNjMGIxZTY0N2IzOGNiNmQ1M2Q2MTFiOWFlOCIsInVzZXJfaWQiOiIzIn0.fwR-u32rYGiVU_-ZnEnpExXwJq0VMsPi6y2NbafgMQc','2026-11-05 12:54:28.182901','2026-11-06 12:54:28.000000',3,'2b97acc0b1e647b38cb6d53d611b9ae8'),
(56,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5Mzk2OTY2OCwiaWF0IjoxNzkzODgzMjY4LCJqdGkiOiJmNjQ1NDQ0N2FhNTE0ODA2ODZjMDY1YWNlZWVlNDc3OCIsInVzZXJfaWQiOiIzIn0.1Srzt66bhnaeASYXv2Jw-xb6yhLFqR7j3PcJUHobse8','2026-11-05 12:54:28.384087','2026-11-06 12:54:28.000000',3,'f6454447aa51480686c065aceeee4778'),
(57,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5Mzk2OTY2OCwiaWF0IjoxNzkzODgzMjY4LCJqdGkiOiJjYmNiOTA0NDhlMmE0Y2NiYTk3NTdkMGRmMGJkNjE3OCIsInVzZXJfaWQiOiIzIn0.GDT7IFprsM15m1YKchiMmra5Vl51VzypRvsYNjTKjOE','2026-11-05 12:54:28.518312','2026-11-06 12:54:28.000000',3,'cbcb90448e2a4ccba9757d0df0bd6178'),
(58,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5Mzk2OTY2OCwiaWF0IjoxNzkzODgzMjY4LCJqdGkiOiJhMmU1ZGVkYzgxMjA0MzViODFlYmM2ODVkZmIzMzlkMCIsInVzZXJfaWQiOiIzIn0.Cd-VzD1iSJ5t1aTN7x5VM3HOYydctTe4e_yAOT3D9yk','2026-11-05 12:54:28.834948','2026-11-06 12:54:28.000000',3,'a2e5dedc8120435b81ebc685dfb339d0'),
(59,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5Mzk2OTY2OSwiaWF0IjoxNzkzODgzMjY5LCJqdGkiOiI0NjRlYWZmY2RmY2M0ODgxOThiZWJjNzUwOGY0NThjMCIsInVzZXJfaWQiOiIzIn0.dMVdXxxvIWzIMK-JPJ9uj73dpWtY8NAtJBlSlQOCTqE','2026-11-05 12:54:29.010444','2026-11-06 12:54:29.000000',3,'464eaffcdfcc488198bebc7508f458c0'),
(60,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5Mzk2OTY2OSwiaWF0IjoxNzkzODgzMjY5LCJqdGkiOiIyMWQ0NWM2YTNkODE0MzkwYWZlYWFkYzY0NmM0OGJkZCIsInVzZXJfaWQiOiIzIn0.a90VWT6xpkjEGIRWBaaAH35_U5NR5oe1mdLcbWScfCU','2026-11-05 12:54:29.140953','2026-11-06 12:54:29.000000',3,'21d45c6a3d814390afeaadc646c48bdd'),
(61,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5Mzk2OTY2OSwiaWF0IjoxNzkzODgzMjY5LCJqdGkiOiJjOTUzYTI5ZjhlNzg0ZmM4OTgyNGM4ODlmYzgzYmQ0MCIsInVzZXJfaWQiOiIzIn0.L0rcXI46et9DZ7_lFl5QNfJjkF-63wLsHhK6D-o786g','2026-11-05 12:54:29.295341','2026-11-06 12:54:29.000000',3,'c953a29f8e784fc89824c889fc83bd40'),
(62,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5Mzk2OTY2OSwiaWF0IjoxNzkzODgzMjY5LCJqdGkiOiJmMDE0MDAxYTc3NTk0YmJkOWM1YzEwNGRlNjNiYWU3YiIsInVzZXJfaWQiOiIzIn0.GFSHI_tbhhxUcqul8iM9iMhN30kvaI99Ox9Skl-2j6c','2026-11-05 12:54:29.496270','2026-11-06 12:54:29.000000',3,'f014001a77594bbd9c5c104de63bae7b'),
(63,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5Mzk2OTY2OSwiaWF0IjoxNzkzODgzMjY5LCJqdGkiOiIzMDAzMWMxYWJkYmI0ZTIyOTg1Y2IwZjQ0YzJkMTE2OCIsInVzZXJfaWQiOiIzIn0.tCu_7X9zxpSwb3hc5OrMxxwIBJkozhAKS5aeCq2cKbg','2026-11-05 12:54:29.670077','2026-11-06 12:54:29.000000',3,'30031c1abdbb4e22985cb0f44c2d1168'),
(64,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5Mzk2OTY2OSwiaWF0IjoxNzkzODgzMjY5LCJqdGkiOiI3NDhiYWU5MTIwNDQ0NjhhYWFiNzVkYWE4NjFjMjYzMiIsInVzZXJfaWQiOiIzIn0.shENRRG4Sl4ZjkHieHa0SAnqWMrL-C7YpE-08K28x3w','2026-11-05 12:54:29.829794','2026-11-06 12:54:29.000000',3,'748bae912044468aaab75daa861c2632'),
(65,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5Mzk2OTY2OSwiaWF0IjoxNzkzODgzMjY5LCJqdGkiOiIzZDg3NjdhNzY0YWU0OGVmOTM1OWMxMjA5OThhZjc1YyIsInVzZXJfaWQiOiIzIn0.rcbjlRiz8gE5S1fisBqOGgPg_iv65orV8Wc0wsrdd-U','2026-11-05 12:54:29.991040','2026-11-06 12:54:29.000000',3,'3d8767a764ae48ef9359c120998af75c'),
(66,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5Mzk2OTY3MCwiaWF0IjoxNzkzODgzMjcwLCJqdGkiOiIyMmI4MzI3MTAwZDg0NGI0ODZiMzYyNGZjM2U5NzE1YSIsInVzZXJfaWQiOiIzIn0.d2j_SpFkhU9SzTrMf4iNluJVhzvMLrjPGHhYWVDOgNM','2026-11-05 12:54:30.135615','2026-11-06 12:54:30.000000',3,'22b8327100d844b486b3624fc3e9715a'),
(67,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5Mzk2OTY3MCwiaWF0IjoxNzkzODgzMjcwLCJqdGkiOiJhZjY0MDUwZTJkYzk0N2FmYTE0OWIwZDhjNDI3M2Y1NSIsInVzZXJfaWQiOiIzIn0.w38hJw3-to0fTUBMIt1G8kq8iZ7qI2eQg8IoJi1vcHE','2026-11-05 12:54:30.350604','2026-11-06 12:54:30.000000',3,'af64050e2dc947afa149b0d8c4273f55'),
(68,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5Mzk2OTY3MCwiaWF0IjoxNzkzODgzMjcwLCJqdGkiOiJjN2FhYjAwNWIwODI0ODA1OTM0NzBkNWU4ZWVjMDc3MiIsInVzZXJfaWQiOiIzIn0.JKNTPpjcFi62CdLNTSmabomcx6lo14RrCuQ4Xoqih8U','2026-11-05 12:54:30.490149','2026-11-06 12:54:30.000000',3,'c7aab005b082480593470d5e8eec0772'),
(69,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5Mzk3MTkyMSwiaWF0IjoxNzkzODg1NTIxLCJqdGkiOiI5ZjU1ZDZkMjQ0MGQ0OTBiYmI1YzNjMDNlNDIyOTBkZSIsInVzZXJfaWQiOiIzIn0.X-9XspFqxW8pMXetmYZqcix2QIhDAtIWFZP9XuWm5B4','2026-11-05 13:32:01.608825','2026-11-06 13:32:01.000000',3,'9f55d6d2440d490bbb5c3c03e42290de'),
(70,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5Mzk3MjA0NywiaWF0IjoxNzkzODg1NjQ3LCJqdGkiOiI3MjE5NzgyZDgyOWU0MjYzYjYzMThkMDc2NDQ0OTEwNCIsInVzZXJfaWQiOiIzIn0.oRpOFKCNKv0WTvwcFSaZLAbgXJuYJQ647LrVsdv8cBQ','2026-11-05 13:34:07.877406','2026-11-06 13:34:07.000000',3,'7219782d829e4263b6318d0764449104'),
(71,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5Mzk3MjMyNCwiaWF0IjoxNzkzODg1OTI0LCJqdGkiOiIzNjRlNzc4NDg1YTU0NjE2YjUzN2I2NjM5MTEyN2ZlYyIsInVzZXJfaWQiOiIzIn0.P3nxwYEHUyGPv0Iqemu_S9U4zm-JQQHv2O0yKTyeGGw','2026-11-05 13:38:44.704188','2026-11-06 13:38:44.000000',3,'364e778485a54616b537b66391127fec'),
(72,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5Mzk3MjQ0MiwiaWF0IjoxNzkzODg2MDQyLCJqdGkiOiI2OGQyYzRjMTVlZDM0OGFhOWY3MDViYjIyMDdlY2RjZiIsInVzZXJfaWQiOiIzIn0.TGK1-HjniYVLDr0gbmFYT1W8L5QpTwrM_jxZesHu530','2026-11-05 13:40:42.593415','2026-11-06 13:40:42.000000',3,'68d2c4c15ed348aa9f705bb2207ecdcf'),
(73,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5Mzk3MjQ0NCwiaWF0IjoxNzkzODg2MDQ0LCJqdGkiOiJlZDlmNDYzYzI5MzM0ZTkzODEyMjVlOTI5Y2E5MjE4MiIsInVzZXJfaWQiOiIzIn0.lmbXlDoZtJCMYtJSuBZ40QiMuLarOGZj8jxSnm7jkFA','2026-11-05 13:40:44.456591','2026-11-06 13:40:44.000000',3,'ed9f463c29334e9381225e929ca92182'),
(74,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5Mzk3MjQ0OSwiaWF0IjoxNzkzODg2MDQ5LCJqdGkiOiJmNGFmZWUxYTNjYmM0MjgxOGUzMThhNjA0MDZhMzEzOCIsInVzZXJfaWQiOiIzIn0.-UiTQ62XTYsbs6Rmy7CmJQxmGu21j1oVDvu-UPNKqLo','2026-11-05 13:40:49.367085','2026-11-06 13:40:49.000000',3,'f4afee1a3cbc42818e318a60406a3138'),
(75,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5Mzk3MjQ1MCwiaWF0IjoxNzkzODg2MDUwLCJqdGkiOiJkMGU4M2Q2NGQzMjE0ZWQ4OWQ5NTk1ZmJhYzVkYzMxZCIsInVzZXJfaWQiOiIzIn0.fBtZox4ani3kS9UkSNA3_uKlJ3CkxazHKpoIyi-mL68','2026-11-05 13:40:50.075454','2026-11-06 13:40:50.000000',3,'d0e83d64d3214ed89d9595fbac5dc31d'),
(76,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5Mzk3MjQ1MCwiaWF0IjoxNzkzODg2MDUwLCJqdGkiOiI1N2QzNmFlYmIxNWY0NmNhYmNmYjc2NTg3MjcwMWY3MyIsInVzZXJfaWQiOiIzIn0.sdEJcYkxnzuXGKVBwnwrtQn9uYCdN8wIHK7iENbUxc0','2026-11-05 13:40:50.890800','2026-11-06 13:40:50.000000',3,'57d36aebb15f46cabcfb765872701f73'),
(77,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5Mzk3MjQ1MSwiaWF0IjoxNzkzODg2MDUxLCJqdGkiOiIwOWUwYTBlMTVkMjA0NTIyYmE1MDM5NTRlMGE3MTI5NCIsInVzZXJfaWQiOiIzIn0.KWnSNpcSqSLnHwL3KQN8qmoMrUPo_6oPxrlXUfNzYjc','2026-11-05 13:40:51.134396','2026-11-06 13:40:51.000000',3,'09e0a0e15d204522ba503954e0a71294'),
(78,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5Mzk3MjQ1MSwiaWF0IjoxNzkzODg2MDUxLCJqdGkiOiIzOWE3ZWUwZGU0MDA0NzkyYWY3Y2Q4NzQ2MWViZDYwZCIsInVzZXJfaWQiOiIzIn0.iaPJOgNn7VAENLeiScHoq0ScgcAo14oElBST1vggT7g','2026-11-05 13:40:51.324887','2026-11-06 13:40:51.000000',3,'39a7ee0de4004792af7cd87461ebd60d'),
(79,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5Mzk3MjQ1MSwiaWF0IjoxNzkzODg2MDUxLCJqdGkiOiIzYjk3YTQ1NDUzZjI0NWI5ODJlMzk0YWUyZWM4ZmMxNSIsInVzZXJfaWQiOiIzIn0.xq0pJz-eowvPJp315m3ayFzC2mcg9_XIS9jhGXoMbXY','2026-11-05 13:40:51.520159','2026-11-06 13:40:51.000000',3,'3b97a45453f245b982e394ae2ec8fc15'),
(80,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5Mzk3MjQ1MSwiaWF0IjoxNzkzODg2MDUxLCJqdGkiOiI1NGVhNmYwMzAwZGQ0OTRiYTg4YmU2NzJkYTU5Y2JiOCIsInVzZXJfaWQiOiIzIn0.CFx2Q4RD_P502wSr3lhOuScoUjs4GkCFCAHzWmJ2QPU','2026-11-05 13:40:51.714501','2026-11-06 13:40:51.000000',3,'54ea6f0300dd494ba88be672da59cbb8'),
(81,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5Mzk3MjQ1MSwiaWF0IjoxNzkzODg2MDUxLCJqdGkiOiJkMmZlODdhZDBmMDY0MTQ2YWNhYTI3N2Q1YmIxYjA4YiIsInVzZXJfaWQiOiIzIn0.yY-FB0f619c3VqPA8WIE241UkvuBWIEfZK9vIIRSQbM','2026-11-05 13:40:51.940565','2026-11-06 13:40:51.000000',3,'d2fe87ad0f064146acaa277d5bb1b08b'),
(82,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5Mzk3MjQ1MiwiaWF0IjoxNzkzODg2MDUyLCJqdGkiOiIxNGU3YTc0NTkwZWM0YzQyYmU5ODg0YTNjZmIxOWVjYSIsInVzZXJfaWQiOiIzIn0.YZ_E5BBthW8aTamuVp1_4Sd_GHJtetY4p2PLWdXeIXE','2026-11-05 13:40:52.114268','2026-11-06 13:40:52.000000',3,'14e7a74590ec4c42be9884a3cfb19eca'),
(83,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5Mzk3MjQ1MiwiaWF0IjoxNzkzODg2MDUyLCJqdGkiOiI2MTQ1OGFiZDMxYzY0YTNkYjgxZWIzYzg0ZTk5YzBhMCIsInVzZXJfaWQiOiIzIn0.OIPXiO1-7LlOakIumMOgid7iUlfuAzUqTsH0rZsZWr8','2026-11-05 13:40:52.299200','2026-11-06 13:40:52.000000',3,'61458abd31c64a3db81eb3c84e99c0a0'),
(84,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5Mzk3MjQ1MiwiaWF0IjoxNzkzODg2MDUyLCJqdGkiOiI2YWFmYThhYzY3MWQ0YTM4YTNmYTYxZDcyMmQ0NjYyNCIsInVzZXJfaWQiOiIzIn0.8mucV0FH_fwGCvTUyPJhxmHfwZIhPwZ78t6h6o8UBOg','2026-11-05 13:40:52.486085','2026-11-06 13:40:52.000000',3,'6aafa8ac671d4a38a3fa61d722d46624'),
(85,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5Mzk3MjQ1MiwiaWF0IjoxNzkzODg2MDUyLCJqdGkiOiI1MDFlMWFkMzIzYTg0Y2ZkYTA5OTQ2MmFiN2IyZGUyZiIsInVzZXJfaWQiOiIzIn0.GhRHuWrkZGuvHbutx6e3QDZO4iHe0DYzhWYZm-CRNcg','2026-11-05 13:40:52.699152','2026-11-06 13:40:52.000000',3,'501e1ad323a84cfda099462ab7b2de2f'),
(86,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5Mzk3MjQ1MiwiaWF0IjoxNzkzODg2MDUyLCJqdGkiOiIxYWIzZDZlM2Y3NWY0Y2JjOWQyZTA4MTUyNzcxNTQ5NyIsInVzZXJfaWQiOiIzIn0.sk5Fqkv_m6gjO1ND0GkR4ZA_Zv5PjMWEKb728eu48a0','2026-11-05 13:40:52.920422','2026-11-06 13:40:52.000000',3,'1ab3d6e3f75f4cbc9d2e081527715497'),
(87,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5Mzk3MjQ1MywiaWF0IjoxNzkzODg2MDUzLCJqdGkiOiI4MTEzYmZhMmU5ZmY0MWU3YjI5NDNjYzQ4MjZjOTE5YiIsInVzZXJfaWQiOiIzIn0.1TL5CLOXqZ_AbNgeSt8NGbYk2rQNBH4mPfspJKrCtt8','2026-11-05 13:40:53.110221','2026-11-06 13:40:53.000000',3,'8113bfa2e9ff41e7b2943cc4826c919b'),
(88,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5Mzk3MjQ1MywiaWF0IjoxNzkzODg2MDUzLCJqdGkiOiI2MzJlMjY3YWEzMDQ0YTYzYjkyODE0YTFlMWEzNjYxZCIsInVzZXJfaWQiOiIzIn0.75xf85BtuNMSapKs0aoSpWYkdfMuWdt9NqmrDwFHfPE','2026-11-05 13:40:53.330082','2026-11-06 13:40:53.000000',3,'632e267aa3044a63b92814a1e1a3661d'),
(89,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5Mzk3MjQ1MywiaWF0IjoxNzkzODg2MDUzLCJqdGkiOiJkNmYxYjhkY2Y5NmE0ZWM1YjJjYTMxYTM1NzBjOTgxYSIsInVzZXJfaWQiOiIzIn0.0Wze98qUsbwWyKDeZVPaNCJiG0i21R-L08pIzXidabw','2026-11-05 13:40:53.491241','2026-11-06 13:40:53.000000',3,'d6f1b8dcf96a4ec5b2ca31a3570c981a'),
(90,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5Mzk3MjQ1MywiaWF0IjoxNzkzODg2MDUzLCJqdGkiOiJlYmI3MGE0NDEwNjY0OGJiYTdlMjQ2NDU4OWFkZTYyZCIsInVzZXJfaWQiOiIzIn0.aSyK8JZaXcLKALbbnpIDNsgbttKpMvZCTamt5vL8KVk','2026-11-05 13:40:53.735502','2026-11-06 13:40:53.000000',3,'ebb70a44106648bba7e2464589ade62d'),
(91,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5Mzk3MjQ1MywiaWF0IjoxNzkzODg2MDUzLCJqdGkiOiJjN2RiYTljMzNhOWQ0YWE5YjVmZjYwNGUyYTk0MWI1NiIsInVzZXJfaWQiOiIzIn0.nY_K2iS1TFI7qsG8IFTDg10k70_y1fULBvYxaCli2uE','2026-11-05 13:40:53.966832','2026-11-06 13:40:53.000000',3,'c7dba9c33a9d4aa9b5ff604e2a941b56'),
(92,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5Mzk3MjQ1NCwiaWF0IjoxNzkzODg2MDU0LCJqdGkiOiJmNDVmY2YwNmI4ZjU0ZTUyYmNmZWU1OGEwYmZjMTBhNSIsInVzZXJfaWQiOiIzIn0.03mm9qKKRZ8V4HqVT0r61-_HvDtRaW_5m0BQjI76ADM','2026-11-05 13:40:54.195431','2026-11-06 13:40:54.000000',3,'f45fcf06b8f54e52bcfee58a0bfc10a5'),
(93,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5Mzk3MjQ1NCwiaWF0IjoxNzkzODg2MDU0LCJqdGkiOiI1MTVmYjY2MmQ5ZDc0ODgwYThkMzZlODZhOGFhMzZjMCIsInVzZXJfaWQiOiIzIn0.pxSu4HzvxxCavxDRnGDzXgsRAFiH_33AeybRwrEhuNU','2026-11-05 13:40:54.372192','2026-11-06 13:40:54.000000',3,'515fb662d9d74880a8d36e86a8aa36c0'),
(94,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5Mzk3MjQ1NCwiaWF0IjoxNzkzODg2MDU0LCJqdGkiOiJhYTMzYWEzYTZjZTA0NmVjOGVkMDcwYTcxNmUyNjg2OSIsInVzZXJfaWQiOiIzIn0.6Ilj6NR0PKfZyc-NGKuA1haA9KC-JtmWBCxLYYTwNXk','2026-11-05 13:40:54.580183','2026-11-06 13:40:54.000000',3,'aa33aa3a6ce046ec8ed070a716e26869'),
(95,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5Mzk3MjQ1NCwiaWF0IjoxNzkzODg2MDU0LCJqdGkiOiIwNDAwNTk5N2RkOTA0ZDNmYjMwNTczY2Y2Yzg2MjRhMCIsInVzZXJfaWQiOiIzIn0.kqLM4p32mOqabMRCQgN-PiBxf6O7FcfMTfuw7smaSmk','2026-11-05 13:40:54.780911','2026-11-06 13:40:54.000000',3,'04005997dd904d3fb30573cf6c8624a0'),
(96,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5Mzk3MjQ1NSwiaWF0IjoxNzkzODg2MDU1LCJqdGkiOiI3ZTcyNWRkYWY1MzY0MDUzYmZkYzMyNDk4MmNiNmUyZiIsInVzZXJfaWQiOiIzIn0.rwg69KNJEN-mbXfdxaXs5m94gTsUY6wHvXLJJiwtMD8','2026-11-05 13:40:55.001389','2026-11-06 13:40:55.000000',3,'7e725ddaf5364053bfdc324982cb6e2f'),
(97,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5Mzk3MjQ1NSwiaWF0IjoxNzkzODg2MDU1LCJqdGkiOiI3ODY2OTEyM2QwNmM0NWM1OWFmNDVhYjdmOGVjNTYwMSIsInVzZXJfaWQiOiIzIn0.dMF9_CWN7cXt3UaumPzOu34a476TwWp9zHTMtV_t6Co','2026-11-05 13:40:55.195785','2026-11-06 13:40:55.000000',3,'78669123d06c45c59af45ab7f8ec5601'),
(98,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5Mzk3MjQ1NSwiaWF0IjoxNzkzODg2MDU1LCJqdGkiOiI5YTRlN2FiZjJhYzE0Nzc3YTJhZDI5NWY0ZTc2OTkzNyIsInVzZXJfaWQiOiIzIn0.iccyd1fMvkYhIqypFcldhHULKt5qV4ufDzW9IswIibw','2026-11-05 13:40:55.382972','2026-11-06 13:40:55.000000',3,'9a4e7abf2ac14777a2ad295f4e769937'),
(99,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5Mzk3MjQ1NSwiaWF0IjoxNzkzODg2MDU1LCJqdGkiOiJiOTgzNjcxNmFmMjU0Y2Y0YWEyNTgwMzYwMjIwMzNiZCIsInVzZXJfaWQiOiIzIn0.bBGXa3fpvubk7quQU66p1sM1_v2txw_ga1GRWpOS4sM','2026-11-05 13:40:55.586898','2026-11-06 13:40:55.000000',3,'b9836716af254cf4aa258036022033bd'),
(100,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5Mzk3MjQ1NSwiaWF0IjoxNzkzODg2MDU1LCJqdGkiOiI3MzhmYmQzNzgxZTU0MmMxYWFkZTMwMDZkN2I5ZDI1MyIsInVzZXJfaWQiOiIzIn0.GYvDsdtOgy5_YNzpn3rxT73dTLTPodT49VBxeyLyFGk','2026-11-05 13:40:55.781356','2026-11-06 13:40:55.000000',3,'738fbd3781e542c1aade3006d7b9d253'),
(101,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5Mzk3MjQ1NiwiaWF0IjoxNzkzODg2MDU2LCJqdGkiOiI0MDY0MjhmZjVmZDM0OWQ1YWYzMWMxODgxNWQ4ZDUxYyIsInVzZXJfaWQiOiIzIn0.T7Pu-nVV-4mwMp-J8D0G3h3qMY4HePHP6_w1CDlQcXg','2026-11-05 13:40:56.000440','2026-11-06 13:40:56.000000',3,'406428ff5fd349d5af31c18815d8d51c'),
(102,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5Mzk3MjQ1NiwiaWF0IjoxNzkzODg2MDU2LCJqdGkiOiJmNDZjNjI3YWYyMmU0YmYxYWI4NTQ5OWFkZGNmOGRmNiIsInVzZXJfaWQiOiIzIn0.oX29QG_UJX9rskW7i9NSYy7YSB68bgHmZvCw_8aDgO8','2026-11-05 13:40:56.313165','2026-11-06 13:40:56.000000',3,'f46c627af22e4bf1ab85499addcf8df6'),
(103,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5Mzk3MjQ5MywiaWF0IjoxNzkzODg2MDkzLCJqdGkiOiJjZTI5YzAzODg3NDI0NWI1YTk0ZDkwMzQ0YmNlZjQxNSIsInVzZXJfaWQiOiIzIn0.8F9sBAeYaeibAtCzMOU5f2lct-DvkVaSadKmBjTFvdE','2026-11-05 13:41:33.819557','2026-11-06 13:41:33.000000',3,'ce29c038874245b5a94d90344bcef415'),
(104,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5Mzk3MjQ5NCwiaWF0IjoxNzkzODg2MDk0LCJqdGkiOiJiY2E1YWY3M2ZhZDY0ZjZlOGZkMWIyYWUzZDAyMDNlZSIsInVzZXJfaWQiOiIzIn0.FWGx97-jo0JDyDPExiyAb0rmZyMWEJPhEPGL5Jdoc_k','2026-11-05 13:41:34.194372','2026-11-06 13:41:34.000000',3,'bca5af73fad64f6e8fd1b2ae3d0203ee'),
(105,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5Mzk3MjQ5NCwiaWF0IjoxNzkzODg2MDk0LCJqdGkiOiIwODQxODg5YTkzZjM0YjhkYmEyN2I2MzBmYTgzN2FiOCIsInVzZXJfaWQiOiIzIn0.H2xC1Cc8pjcQ1_U7uKRp2DnPC9K0XW7a4Y3-E2Gx5Yc','2026-11-05 13:41:34.470327','2026-11-06 13:41:34.000000',3,'0841889a93f34b8dba27b630fa837ab8'),
(106,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5Mzk3MjQ5NCwiaWF0IjoxNzkzODg2MDk0LCJqdGkiOiI3N2FmOGQ2MGIxYTA0ZDU0OTdkOTcyNWQxZTA3NjFhNyIsInVzZXJfaWQiOiIzIn0.m-J4JN9TDTmBPzP8Un8zNpIYAPMWzGcdYZgcl2ZMwfk','2026-11-05 13:41:34.647920','2026-11-06 13:41:34.000000',3,'77af8d60b1a04d5497d9725d1e0761a7'),
(107,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5Mzk3MjYyMywiaWF0IjoxNzkzODg2MjIzLCJqdGkiOiI0ZTgwNTlmNjQ4ODE0NmRmODk3MTYxNTZlZWY5ZDRlMyIsInVzZXJfaWQiOiIzIn0.0Gz0cGrtg4Rydh_Vw2bAmrBzqwBgQqURYmzr_7o5hdE','2026-11-05 13:43:43.027418','2026-11-06 13:43:43.000000',3,'4e8059f6488146df89716156eef9d4e3'),
(108,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5Mzk3MjYyNiwiaWF0IjoxNzkzODg2MjI2LCJqdGkiOiIyNzM5OGU3N2IyYzc0Yzk5YWI2NzNmZjFlNzM2ZjA0MSIsInVzZXJfaWQiOiIzIn0.XI8SIVm-F5g9pczSW0ClZlTXF-GXoVGCXDgcx_GwTtY','2026-11-05 13:43:46.109377','2026-11-06 13:43:46.000000',3,'27398e77b2c74c99ab673ff1e736f041'),
(109,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5Mzk3MjYyNiwiaWF0IjoxNzkzODg2MjI2LCJqdGkiOiIzNDI1ODExYjM1MGI0OGI2YjAwOGNjNTQzYzRmYjA5MiIsInVzZXJfaWQiOiIzIn0.KpD5jH4Bfpm8BP2QjFqw4XFoSdKVaQdD7eyl6HkUm_w','2026-11-05 13:43:46.362403','2026-11-06 13:43:46.000000',3,'3425811b350b48b6b008cc543c4fb092'),
(110,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5Mzk3MjYyNiwiaWF0IjoxNzkzODg2MjI2LCJqdGkiOiI5OTU5YTRmZmQxYTM0OGYwYjlmYjkzYzY0NTVhODBlNyIsInVzZXJfaWQiOiIzIn0.Ha_hYJ1AhhITPZDFxSoszC6o5_AOu2pDxknxoZz33mE','2026-11-05 13:43:46.538454','2026-11-06 13:43:46.000000',3,'9959a4ffd1a348f0b9fb93c6455a80e7'),
(111,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5Mzk3MjYyNiwiaWF0IjoxNzkzODg2MjI2LCJqdGkiOiIwZDUzNzZmMDI1NDM0MWI3ODhmNjBmMjFhNjA5OTdhMyIsInVzZXJfaWQiOiIzIn0.nTU-2Jg6CrVIbyhLuIxloGPF1bZE4u8TOMPFvUeOjJg','2026-11-05 13:43:46.735441','2026-11-06 13:43:46.000000',3,'0d5376f0254341b788f60f21a60997a3'),
(112,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5Mzk3MjYyNiwiaWF0IjoxNzkzODg2MjI2LCJqdGkiOiI0OTNhZjNjOTM5Nzk0MzdjOWRhNjk3MjAyOGVlMzgxMyIsInVzZXJfaWQiOiIzIn0.WD3kuMe5zyF6tZf6DjlFdJyFp9-GblpPfReA4MPSx6g','2026-11-05 13:43:46.870409','2026-11-06 13:43:46.000000',3,'493af3c93979437c9da6972028ee3813'),
(113,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5Mzk3MjYyNywiaWF0IjoxNzkzODg2MjI3LCJqdGkiOiJlMTVlYzJhNDAwYjI0OTQ2ODA3ZDNjOTY3M2Q5ZmVkZSIsInVzZXJfaWQiOiIzIn0.heJfncHrhUpSYLibjbdfmjLYq7VFVdyFsrPLTacrA2Q','2026-11-05 13:43:47.048407','2026-11-06 13:43:47.000000',3,'e15ec2a400b24946807d3c9673d9fede'),
(114,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5Mzk3MjYyNywiaWF0IjoxNzkzODg2MjI3LCJqdGkiOiI3NjkyNDJiYjUyMjA0YjI0YjVhZjMzMzRiOGQ3MDU4ZCIsInVzZXJfaWQiOiIzIn0.bSeEPaLlaXi88plHQCzcCPBcP_OmW9sNI2anoMVqlDU','2026-11-05 13:43:47.254861','2026-11-06 13:43:47.000000',3,'769242bb52204b24b5af3334b8d7058d'),
(115,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5Mzk3MjYyNywiaWF0IjoxNzkzODg2MjI3LCJqdGkiOiI3MmQ1ZDU1ZDlkY2Q0YzgyYTg2ZGNlMmQ2ZWI4NTJkNyIsInVzZXJfaWQiOiIzIn0.r1KvDRYn52CUCSC-h2HNCOt1d8Mz0yME2_esOwsN3LA','2026-11-05 13:43:47.344683','2026-11-06 13:43:47.000000',3,'72d5d55d9dcd4c82a86dce2d6eb852d7'),
(116,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5Mzk3MjYyNywiaWF0IjoxNzkzODg2MjI3LCJqdGkiOiI4NmZjMDk0NDk5Y2Q0MGM0ODBlZTA2NzdmMDM5YjBjNCIsInVzZXJfaWQiOiIzIn0.WsliBeK-xAScmyhxO-jdOxHyhRDQtoAcX8xNmVBE09g','2026-11-05 13:43:47.524425','2026-11-06 13:43:47.000000',3,'86fc094499cd40c480ee0677f039b0c4'),
(117,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5Mzk3MjYyNywiaWF0IjoxNzkzODg2MjI3LCJqdGkiOiJhMGZhYjViMTk5ZTk0OGJmYjBlYTgwNWNmMDk0Y2QxMyIsInVzZXJfaWQiOiIzIn0.CjFopFnF1g0Lb43OvIYmyty1eQeE6doMa3dGe3Z628Y','2026-11-05 13:43:47.765462','2026-11-06 13:43:47.000000',3,'a0fab5b199e948bfb0ea805cf094cd13'),
(118,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5Mzk3MjYyNywiaWF0IjoxNzkzODg2MjI3LCJqdGkiOiI3ZjRjOGIxY2JjM2E0NTdlYWUxMDVkMTZkZjQyNWEyNCIsInVzZXJfaWQiOiIzIn0.k1xFJl-UnVizNCT_PjZi_d-xTf9_P10MTYWojrOl870','2026-11-05 13:43:47.834275','2026-11-06 13:43:47.000000',3,'7f4c8b1cbc3a457eae105d16df425a24'),
(119,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5Mzk3MjYyOCwiaWF0IjoxNzkzODg2MjI4LCJqdGkiOiI3ODliYWIxNDNkMGE0ODgwYWMzYTdlOTA1ZDA1OWEzMCIsInVzZXJfaWQiOiIzIn0.i6Xu4ZxQtu6z-gqdh0u-nszZVmSYGPdPuT4dxgWuI0U','2026-11-05 13:43:48.005901','2026-11-06 13:43:48.000000',3,'789bab143d0a4880ac3a7e905d059a30'),
(120,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5Mzk3MjYyOCwiaWF0IjoxNzkzODg2MjI4LCJqdGkiOiJmY2ZjZmFiNTk2ODU0ZGRmOWQxYTIxYjI4ZGRkYzk4ZSIsInVzZXJfaWQiOiIzIn0.fdR9QR_PhicJTr_4yOGEMozXsHPY_YmL_IKwtEpi4rY','2026-11-05 13:43:48.186139','2026-11-06 13:43:48.000000',3,'fcfcfab596854ddf9d1a21b28dddc98e'),
(121,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5Mzk3MjYyOCwiaWF0IjoxNzkzODg2MjI4LCJqdGkiOiJkNmZkNmFlZTE5ZmE0OGNjYjNiNjM4MjMzMmM1MDllMCIsInVzZXJfaWQiOiIzIn0.KNl-2OnBXsQJWg5XoKUEXrrymP8KWIwux7gEWxOVkZ8','2026-11-05 13:43:48.315236','2026-11-06 13:43:48.000000',3,'d6fd6aee19fa48ccb3b6382332c509e0'),
(122,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5Mzk3MjYyOCwiaWF0IjoxNzkzODg2MjI4LCJqdGkiOiIyNmEzYTA0ZTMwNTg0NGQ1YTU2ZGRhNjMwMjdjYzMwNCIsInVzZXJfaWQiOiIzIn0.11xH7GlI_G9DSYlDD94boVH3WpcOGgZEpsq3JGTtIEs','2026-11-05 13:43:48.451637','2026-11-06 13:43:48.000000',3,'26a3a04e305844d5a56dda63027cc304'),
(123,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5Mzk3MjYyOCwiaWF0IjoxNzkzODg2MjI4LCJqdGkiOiI0MGU0MGM0OTQ3MDE0ODZhOWI0OTc1YzY4MjE0YzgxZSIsInVzZXJfaWQiOiIzIn0.3Uo4U8cm1u26l2vNGhhE0aIgXRH3FhAbWzJNu4rGMDw','2026-11-05 13:43:48.601374','2026-11-06 13:43:48.000000',3,'40e40c494701486a9b4975c68214c81e'),
(124,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5Mzk3MjYyOCwiaWF0IjoxNzkzODg2MjI4LCJqdGkiOiIwNWFjNzU2MWEwNDY0MGEyODg0YzE1ZGQwNWJiNzNjYyIsInVzZXJfaWQiOiIzIn0.VC3HzefVy0Z95K3ggt-zsEIXiLG1NJiTEbtczYfJJhs','2026-11-05 13:43:48.953023','2026-11-06 13:43:48.000000',3,'05ac7561a04640a2884c15dd05bb73cc'),
(125,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5Mzk3MjYyOSwiaWF0IjoxNzkzODg2MjI5LCJqdGkiOiI2YzAzZGU0M2ViMjg0OTA3YjFmMTM4YTAxZjJkZWY2ZiIsInVzZXJfaWQiOiIzIn0.VcYhHUNV1oFuUmtvb2l9TSbdxmpeb4VGSMMUi_DRbRU','2026-11-05 13:43:49.151871','2026-11-06 13:43:49.000000',3,'6c03de43eb284907b1f138a01f2def6f'),
(126,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5Mzk3MjYyOSwiaWF0IjoxNzkzODg2MjI5LCJqdGkiOiIyOTFjY2E5NzgwN2M0YjExYjEyMzFiMTdjZTNiYjJmNCIsInVzZXJfaWQiOiIzIn0.e3Pbj0NcDnY_QyrCCc_rgYEVdJ6RgLNq_H-X3fGnk0Y','2026-11-05 13:43:49.242411','2026-11-06 13:43:49.000000',3,'291cca97807c4b11b1231b17ce3bb2f4'),
(127,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5Mzk3MjYyOSwiaWF0IjoxNzkzODg2MjI5LCJqdGkiOiIwNTg1N2ZiNmVlYTk0MzBiYjBlZGFiM2UwOGRhYmQzNiIsInVzZXJfaWQiOiIzIn0.hykoFZ-uBo5dw_NI7uXmUt8lUYs11QiRxADKASEV8i0','2026-11-05 13:43:49.483774','2026-11-06 13:43:49.000000',3,'05857fb6eea9430bb0edab3e08dabd36'),
(128,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5Mzk3MjYyOSwiaWF0IjoxNzkzODg2MjI5LCJqdGkiOiJiZjRiYWE5NGEyNDE0NDk1ODE1OWJjZmYxZmUzNmJjNSIsInVzZXJfaWQiOiIzIn0.Fc6m7IetjhEjU-2pMC9rqnM9trXizxUHVHPEkYGv_-w','2026-11-05 13:43:49.563114','2026-11-06 13:43:49.000000',3,'bf4baa94a24144958159bcff1fe36bc5'),
(129,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5Mzk3MjYyOSwiaWF0IjoxNzkzODg2MjI5LCJqdGkiOiIxYjQ2Yjg1YTEzYzg0YjM1ODc2OGU1ZDNmMmM3Y2I5ZiIsInVzZXJfaWQiOiIzIn0.82Wk3jplK7fxAoCSGOetyMG-7ixmZqRpfDRFFc5j_Ac','2026-11-05 13:43:49.769653','2026-11-06 13:43:49.000000',3,'1b46b85a13c84b358768e5d3f2c7cb9f'),
(130,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5Mzk3MjYyOSwiaWF0IjoxNzkzODg2MjI5LCJqdGkiOiIxMmU3MTk0MTVjNzA0NWZlODYxM2RhY2U1Y2E4MzEzZCIsInVzZXJfaWQiOiIzIn0.ge6REmzDkUSr3kIVv4OVnftyt1axy6rlhrbQF_whHjU','2026-11-05 13:43:49.959008','2026-11-06 13:43:49.000000',3,'12e719415c7045fe8613dace5ca8313d'),
(131,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5Mzk3MjYzMCwiaWF0IjoxNzkzODg2MjMwLCJqdGkiOiJmZWFhZjU0MDg2MTQ0NmM1OTViMTI5MjA5NzUzOTFmZiIsInVzZXJfaWQiOiIzIn0.vjAstQB3jcxGOJ3G8yEU6e7uipDFrklwZBuNGw5wce0','2026-11-05 13:43:50.149523','2026-11-06 13:43:50.000000',3,'feaaf540861446c595b12920975391ff'),
(132,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5Mzk3MjYzMCwiaWF0IjoxNzkzODg2MjMwLCJqdGkiOiI0MTAxNTNmNDljNjQ0ZjA1YTE5MTAxOGFiMjY4ZmE0NiIsInVzZXJfaWQiOiIzIn0.0ZjUIh-BRCyGH6lJpp_2blavqICRrSDFsQtNDEQwCRs','2026-11-05 13:43:50.289076','2026-11-06 13:43:50.000000',3,'410153f49c644f05a191018ab268fa46'),
(133,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5Mzk3MjYzMCwiaWF0IjoxNzkzODg2MjMwLCJqdGkiOiJhNmJiOTdlODIzMTQ0YzM2OWU5Njc3ZDdhZWVjNDMwYyIsInVzZXJfaWQiOiIzIn0.khnh-USJtAXV2mmY5B5tSVzbgiRs3q1vSTM-r77jeU0','2026-11-05 13:43:50.415331','2026-11-06 13:43:50.000000',3,'a6bb97e823144c369e9677d7aeec430c'),
(134,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5Mzk3MjYzMCwiaWF0IjoxNzkzODg2MjMwLCJqdGkiOiI1M2FiZGI5ZTZiMTk0YjExOTgxMDQ4NmE2M2RhM2ZhZCIsInVzZXJfaWQiOiIzIn0.WnjqFA-9qofGpiM2lPZ-_-kcNNZPZckx9CSDIKIHQW4','2026-11-05 13:43:50.538727','2026-11-06 13:43:50.000000',3,'53abdb9e6b194b119810486a63da3fad'),
(135,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5Mzk3MjYzMCwiaWF0IjoxNzkzODg2MjMwLCJqdGkiOiI2ZTQyZDhjOTM2ZDg0ODAyOWQ3NTk3Y2I2NTk2NjEyNyIsInVzZXJfaWQiOiIzIn0.VC26Hm86sYHzvR5P3fO1OUIQSJfj02jgWMRc83qZAv0','2026-11-05 13:43:50.670268','2026-11-06 13:43:50.000000',3,'6e42d8c936d848029d7597cb65966127'),
(136,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5Mzk3MjYzMCwiaWF0IjoxNzkzODg2MjMwLCJqdGkiOiJiOTAwMjIxYzgwODM0ZDMyYTZmY2Y0MjAxNTdjZTNmNCIsInVzZXJfaWQiOiIzIn0.0NIX03fCvwdFgyzm97Hh7TkvfVuBVsMcJj08iK937MM','2026-11-05 13:43:50.987498','2026-11-06 13:43:50.000000',3,'b900221c80834d32a6fcf420157ce3f4'),
(137,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5Mzk3MjYzMSwiaWF0IjoxNzkzODg2MjMxLCJqdGkiOiJkOTJjOTkwZDAwOGE0N2QxYjZkODE1OTVmMTI2NDM1MSIsInVzZXJfaWQiOiIzIn0.OsaBUL9KcuS5oG67GIraY_0a-uRIoWVLz1XOYdo3hw0','2026-11-05 13:43:51.210393','2026-11-06 13:43:51.000000',3,'d92c990d008a47d1b6d81595f1264351'),
(138,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5Mzk3MjYzMSwiaWF0IjoxNzkzODg2MjMxLCJqdGkiOiIwNzdkZjVlMjJjOGI0MTA0YmM4NmUzMGViOWM2ZTY5NiIsInVzZXJfaWQiOiIzIn0.cENnaofv4IIh26TxiFAYbz81EDRZAigeaampt3HpSvY','2026-11-05 13:43:51.390151','2026-11-06 13:43:51.000000',3,'077df5e22c8b4104bc86e30eb9c6e696'),
(139,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5Mzk3MjcwOCwiaWF0IjoxNzkzODg2MzA4LCJqdGkiOiI3M2Q2MmRiMzQ3Zjg0MmRjYjhjNTU2MjM2ZjcyZWZmMSIsInVzZXJfaWQiOiIxIn0.VKHHmPC8eQWKveo0C9FoZcap55NMGJ_y0yyJGEf0gkc','2026-11-05 13:45:08.093992','2026-11-06 13:45:08.000000',1,'73d62db347f842dcb8c556236f72eff1'),
(140,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5Mzk3OTcyOCwiaWF0IjoxNzkzODkzMzI4LCJqdGkiOiIzYmRlMzk0NzQwMjU0NmE2YTA3ZTA3NWRiZmI3NGVlOSIsInVzZXJfaWQiOiI0In0.eNe-WcIogHHpXpXbaTac2Hjus3XkqK-t_EIBuT9YEbI','2026-11-05 15:42:08.001580','2026-11-06 15:42:08.000000',4,'3bde3947402546a6a07e075dbfb74ee9'),
(141,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5Mzk4MDE4MCwiaWF0IjoxNzkzODkzNzgwLCJqdGkiOiJiN2IzYmIxNWY4ZTk0NGQ2YjIzNmQ5YWMwZjNkOTk3YiIsInVzZXJfaWQiOiI1In0.5CpLTbbTEYI-ccCJNtAdr5Ru7gfEttqhAgMWE7qtGl8','2026-11-05 15:49:40.617229','2026-11-06 15:49:40.000000',5,'b7b3bb15f8e944d6b236d9ac0f3d997b'),
(142,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5Mzk4MDE4OCwiaWF0IjoxNzkzODkzNzg4LCJqdGkiOiIyNGM1MDU3YTllYjk0MzI0YjkyMDY3YjE5MDcwYTc0NyIsInVzZXJfaWQiOiI1In0.cdPZoqZHYHThywB3xAUsFhs2A34N7b4A8ux26iVsqh0','2026-11-05 15:49:48.087800','2026-11-06 15:49:48.000000',5,'24c5057a9eb94324b92067b19070a747'),
(143,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5Mzk4MDE5NCwiaWF0IjoxNzkzODkzNzk0LCJqdGkiOiJmYTJhYjIyMjkyYmE0YTZkOTYxZGFkNmY0NmUyYzJmNiIsInVzZXJfaWQiOiI1In0.H0IwcEuBxwGZCRkXdTSHLJ9tOKd72nMSuf687-4a6Zo','2026-11-05 15:49:54.560320','2026-11-06 15:49:54.000000',5,'fa2ab22292ba4a6d961dad6f46e2c2f6'),
(144,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5Mzk4MDE5NCwiaWF0IjoxNzkzODkzNzk0LCJqdGkiOiJhN2YxNTI2YWQ0MDY0ZWEyOGJlZmYxZTJhN2M2MTY4ZiIsInVzZXJfaWQiOiI1In0.UAMIJKdFxQ6nf2Hr9MXMiAtxpsl4CEK1L-3gX5Tu7Cw','2026-11-05 15:49:54.855162','2026-11-06 15:49:54.000000',5,'a7f1526ad4064ea28beff1e2a7c6168f'),
(145,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5Mzk4MDE5NSwiaWF0IjoxNzkzODkzNzk1LCJqdGkiOiIwNGVhMjVjNzYzNDY0NmRmOTc4YjliYjgxOTdmY2FmZiIsInVzZXJfaWQiOiI1In0.6nbTWNFBxZ1sLhw9mL2zDFoS9NIO_A7XUsx4Ncl8vNw','2026-11-05 15:49:55.047042','2026-11-06 15:49:55.000000',5,'04ea25c7634646df978b9bb8197fcaff'),
(146,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5Mzk4MDE5NSwiaWF0IjoxNzkzODkzNzk1LCJqdGkiOiI1MWRhMzgwOTQ5NDU0OWEzYWE1NDZkMTNmNDMzNjJmYSIsInVzZXJfaWQiOiI1In0.xDq80uJHdPvIEAB6vLQ38-9-wITkSPzs-O7BoaBd88s','2026-11-05 15:49:55.208065','2026-11-06 15:49:55.000000',5,'51da3809494549a3aa546d13f43362fa'),
(147,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5Mzk4MDE5NiwiaWF0IjoxNzkzODkzNzk2LCJqdGkiOiJlZDhiNDNhNDM4NWQ0NWEwYjYyOWM5YWI3YmEzNjM5NSIsInVzZXJfaWQiOiI1In0.NdDMzpWygVlQ9Vgjy5dS1G9jovoE7EfBcR5tupCjSL8','2026-11-05 15:49:56.992936','2026-11-06 15:49:56.000000',5,'ed8b43a4385d45a0b629c9ab7ba36395'),
(148,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5Mzk4MDE5NywiaWF0IjoxNzkzODkzNzk3LCJqdGkiOiJmNGU1MTIyMDYwNDE0YjdhOWExZjFmYmY2MDYwNWY5MSIsInVzZXJfaWQiOiI1In0.YcQUqE3jm8iXRgmhnIkTjiDqGvGOdkAubkILlhSuarE','2026-11-05 15:49:57.141879','2026-11-06 15:49:57.000000',5,'f4e5122060414b7a9a1f1fbf60605f91'),
(149,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5Mzk4MDE5NywiaWF0IjoxNzkzODkzNzk3LCJqdGkiOiI5MGNkMzI5YWE4ZGI0MmIyYmYwZmI4YTk0NDYxMjZiMiIsInVzZXJfaWQiOiI1In0.eZoGH5knBwHDnMnM78OkJQQla39Slzv-rrgbNMtafxs','2026-11-05 15:49:57.294973','2026-11-06 15:49:57.000000',5,'90cd329aa8db42b2bf0fb8a9446126b2'),
(150,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5Mzk4MDE5NywiaWF0IjoxNzkzODkzNzk3LCJqdGkiOiI5YmJmY2IwNTA0M2E0YjY1OTZiYjhmOTAyOGI0ODZlZCIsInVzZXJfaWQiOiI1In0.-p38UwLim0QIL9eJiNJtyiPkRKOMEAcOHT6ZGEyIbyo','2026-11-05 15:49:57.476918','2026-11-06 15:49:57.000000',5,'9bbfcb05043a4b6596bb8f9028b486ed');
/*!40000 ALTER TABLE `token_blacklist_outstandingtoken` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `usuarios_bibliotecario`
--

DROP TABLE IF EXISTS `usuarios_bibliotecario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios_bibliotecario` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `matricula` varchar(5) NOT NULL,
  `usuario_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `matricula` (`matricula`),
  UNIQUE KEY `usuario_id` (`usuario_id`),
  CONSTRAINT `usuarios_bibliotecar_usuario_id_a18fc07c_fk_usuarios_` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios_usuario` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios_bibliotecario`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `usuarios_bibliotecario` WRITE;
/*!40000 ALTER TABLE `usuarios_bibliotecario` DISABLE KEYS */;
INSERT INTO `usuarios_bibliotecario` VALUES
(2,'FX9FV',1);
/*!40000 ALTER TABLE `usuarios_bibliotecario` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `usuarios_codigorecuperacao`
--

DROP TABLE IF EXISTS `usuarios_codigorecuperacao`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios_codigorecuperacao` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `codigo_hash` varchar(128) NOT NULL,
  `criado_em` datetime(6) NOT NULL,
  `expira_em` datetime(6) NOT NULL,
  `utilizado` tinyint(1) NOT NULL,
  `usuario_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `usuarios_codigorecup_usuario_id_0ab6c621_fk_usuarios_` (`usuario_id`),
  CONSTRAINT `usuarios_codigorecup_usuario_id_0ab6c621_fk_usuarios_` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios_usuario` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios_codigorecuperacao`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `usuarios_codigorecuperacao` WRITE;
/*!40000 ALTER TABLE `usuarios_codigorecuperacao` DISABLE KEYS */;
INSERT INTO `usuarios_codigorecuperacao` VALUES
(1,'pbkdf2_sha256$1500000$WxG02BVuZzDkKrUKZdYGCt$dNMh/XUdj8GWAlmpEaebqU8WGiwV+XgKCWXHjGoWSXY=','2026-11-05 13:30:56.481861','2026-11-05 13:40:56.226327',1,3),
(2,'pbkdf2_sha256$1500000$Y1nRh6H6zp3UEpmO4PskA6$0mQAZDJFZl8vYHzlnkve6KNQ2iYgpbC5izgga30TJAQ=','2026-11-05 13:32:54.623328','2026-11-05 13:42:54.378028',1,3),
(3,'pbkdf2_sha256$1500000$7lGj76vZ3sPCdM797LiBQI$JtzPCfnBcv7CG5/tKk3U7s8cBoBrb4CkquH6cEBp1O4=','2026-11-05 13:37:18.758612','2026-11-05 13:47:18.485751',1,3);
/*!40000 ALTER TABLE `usuarios_codigorecuperacao` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `usuarios_leitor`
--

DROP TABLE IF EXISTS `usuarios_leitor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios_leitor` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `usuario_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `usuario_id` (`usuario_id`),
  CONSTRAINT `usuarios_leitor_usuario_id_874e6958_fk_usuarios_usuario_id` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios_usuario` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios_leitor`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `usuarios_leitor` WRITE;
/*!40000 ALTER TABLE `usuarios_leitor` DISABLE KEYS */;
INSERT INTO `usuarios_leitor` VALUES
(1,3),
(2,4),
(3,5);
/*!40000 ALTER TABLE `usuarios_leitor` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `usuarios_usuario`
--

DROP TABLE IF EXISTS `usuarios_usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios_usuario` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `password` varchar(128) NOT NULL,
  `last_login` datetime(6) DEFAULT NULL,
  `is_superuser` tinyint(1) NOT NULL,
  `first_name` varchar(150) NOT NULL,
  `last_name` varchar(150) NOT NULL,
  `email` varchar(200) NOT NULL,
  `is_staff` tinyint(1) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `date_joined` datetime(6) NOT NULL,
  `nome` varchar(200) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `usuarios_usuario_email_0a82e5f9_uniq` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios_usuario`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `usuarios_usuario` WRITE;
/*!40000 ALTER TABLE `usuarios_usuario` DISABLE KEYS */;
INSERT INTO `usuarios_usuario` VALUES
(1,'pbkdf2_sha256$1500000$YpSBsn9Ap2DqPqJiiFURi9$y6lxoZrGABiF6cHmSon8dHg1TwF4iWa0k8tJtBZINkM=',NULL,0,'','','pedro@gmail.com',0,1,'2026-10-15 13:55:46.428204','Pedro Fagundes'),
(2,'pbkdf2_sha256$1500000$Vind9FFgKMKC02PCZOGh55$qOCK48QzwMTzGpMSMn2yS7m/CvsIOy6buVQRZ5O7Jpk=','2026-10-29 16:37:20.941773',1,'','','guibarros@yahoo.com',1,1,'2026-10-15 13:59:30.959024',''),
(3,'pbkdf2_sha256$1500000$o9om3utOLlkgjMkJXmjqz6$1JcSH+VnswANoM/yW2SLRWKK57syKnGNFCBfvP1fJFo=',NULL,0,'','','hillary@email.com',0,1,'2026-10-22 10:54:22.323257','Hillary Carvalho'),
(4,'pbkdf2_sha256$1500000$zMkAGpQehD37BwKabD3xiT$qkgdWj2jWuwuWFOo0pfvxs9t21/DadiQ30JngmXml78=',NULL,0,'','','laura@yahoo.com',0,1,'2026-11-05 15:41:27.105718','Laura Morais'),
(5,'pbkdf2_sha256$1500000$Q5L47SwBrfpTlFJA2rWWrg$VFUtoprQ2n/Ui5I7fGaOZ7ZXr9/Wr8g1RoRtaPppJZU=',NULL,0,'','','porto@email.com',0,1,'2026-11-05 15:48:51.061830','Gabriel Portocarrero');
/*!40000 ALTER TABLE `usuarios_usuario` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `usuarios_usuario_groups`
--

DROP TABLE IF EXISTS `usuarios_usuario_groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios_usuario_groups` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `usuario_id` bigint(20) NOT NULL,
  `group_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `usuarios_usuario_groups_usuario_id_group_id_4ed5b09e_uniq` (`usuario_id`,`group_id`),
  KEY `usuarios_usuario_groups_group_id_e77f6dcf_fk_auth_group_id` (`group_id`),
  CONSTRAINT `usuarios_usuario_gro_usuario_id_7a34077f_fk_usuarios_` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios_usuario` (`id`),
  CONSTRAINT `usuarios_usuario_groups_group_id_e77f6dcf_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios_usuario_groups`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `usuarios_usuario_groups` WRITE;
/*!40000 ALTER TABLE `usuarios_usuario_groups` DISABLE KEYS */;
/*!40000 ALTER TABLE `usuarios_usuario_groups` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `usuarios_usuario_user_permissions`
--

DROP TABLE IF EXISTS `usuarios_usuario_user_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios_usuario_user_permissions` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `usuario_id` bigint(20) NOT NULL,
  `permission_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `usuarios_usuario_user_pe_usuario_id_permission_id_217cadcd_uniq` (`usuario_id`,`permission_id`),
  KEY `usuarios_usuario_use_permission_id_4e5c0f2f_fk_auth_perm` (`permission_id`),
  CONSTRAINT `usuarios_usuario_use_permission_id_4e5c0f2f_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  CONSTRAINT `usuarios_usuario_use_usuario_id_60aeea80_fk_usuarios_` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios_usuario` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios_usuario_user_permissions`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `usuarios_usuario_user_permissions` WRITE;
/*!40000 ALTER TABLE `usuarios_usuario_user_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `usuarios_usuario_user_permissions` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*M!100616 SET NOTE_VERBOSITY=@OLD_NOTE_VERBOSITY */;

-- Dump completed on 2026-11-10  9:01:23
