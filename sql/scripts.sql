CREATE TABLE `bot_wa`.`users_now` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `cliente` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`));

  CREATE TABLE `bot_wa`.`after_users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `cliente` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`));

ALTER TABLE `bot_wa`.`users_now` 
ADD COLUMN `number` INT(22) NOT NULL AFTER `cliente`;

ALTER TABLE `bot_wa`.`after_users` 
ADD COLUMN `number` INT(22) NOT NULL AFTER `cliente`;

CREATE TABLE `bot_wa`.`responses` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `idUser` INT NOT NULL,
  `responseType` VARCHAR(45) NOT NULL,
  `msg` VARCHAR(45) NOT NULL,
  `responseText` VARCHAR(45) NULL,
  `responseImg` VARCHAR(45) NULL,
  `responseVideo` VARCHAR(45) NULL,
  `responseAudio` VARCHAR(45) NULL,
  `responseFile` VARCHAR(45) NULL,
  PRIMARY KEY (`id`));

ALTER TABLE `bot_wa`.`responses` 
CHANGE COLUMN `responseText` `responseText` VARCHAR(2000) NULL DEFAULT NULL ,
CHANGE COLUMN `responseImg` `responseImg` LONGBLOB NULL DEFAULT NULL ,
CHANGE COLUMN `responseVideo` `responseVideo` LONGBLOB NULL DEFAULT NULL ,
CHANGE COLUMN `responseAudio` `responseAudio` LONGBLOB NULL DEFAULT NULL ,
CHANGE COLUMN `responseFile` `responseFile` LONGBLOB NULL DEFAULT NULL ;
