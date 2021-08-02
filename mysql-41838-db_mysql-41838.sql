-- phpMyAdmin SQL Dump
-- version 4.9.1
-- https://www.phpmyadmin.net/
--
-- Host: mysql-41838-db.mysql-41838:18404
-- Generation Time: Aug 02, 2021 at 05:14 AM
-- Server version: 5.7.34-0ubuntu0.18.04.1
-- PHP Version: 7.2.34

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `testdb`
--
CREATE DATABASE IF NOT EXISTS `testdb` DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci;
USE `testdb`;

-- --------------------------------------------------------

--
-- Table structure for table `channel`
--

CREATE TABLE `channel` (
  `channel_id` varchar(1000) NOT NULL,
  `title` varchar(2000) CHARACTER SET utf8mb4 DEFAULT NULL,
  `url` varchar(2000) DEFAULT NULL,
  `subscribers` varchar(200) CHARACTER SET utf8mb4 DEFAULT NULL,
  `thumb_88` varchar(500) DEFAULT NULL,
  `thumb_240` varchar(500) DEFAULT NULL,
  `thumb_800` varchar(500) DEFAULT NULL,
  `description` varchar(5000) CHARACTER SET utf8mb4 DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `videoChunk`
--

CREATE TABLE `videoChunk` (
  `video_id` varchar(1000) COLLATE utf8_unicode_ci NOT NULL,
  `chunk_id` int(11) NOT NULL,
  `data` mediumblob NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `videos`
--

CREATE TABLE `videos` (
  `video_id` varchar(255) NOT NULL,
  `title` varchar(1000) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `url` varchar(1000) NOT NULL,
  `description` varchar(5000) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `size` bigint(20) NOT NULL,
  `total_chunks` int(11) DEFAULT NULL,
  `views` varchar(50) NOT NULL,
  `likes` varchar(400) NOT NULL,
  `dislikes` varchar(400) NOT NULL,
  `default_t` varchar(1000) NOT NULL,
  `hqdefault_t` varchar(1000) NOT NULL,
  `mqdefault_t` varchar(1000) NOT NULL,
  `sddefault_t` varchar(1000) NOT NULL,
  `maxresdefault_t` varchar(1000) NOT NULL,
  `channel_id` varchar(1000) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `channel`
--
ALTER TABLE `channel`
  ADD PRIMARY KEY (`channel_id`);

--
-- Indexes for table `videoChunk`
--
ALTER TABLE `videoChunk`
  ADD PRIMARY KEY (`video_id`,`chunk_id`);

--
-- Indexes for table `videos`
--
ALTER TABLE `videos`
  ADD PRIMARY KEY (`video_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
