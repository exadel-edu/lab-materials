CREATE TABLE `messages` (
    `message_id` INT UNSIGNED NOT NULL,
    `description` VARCHAR(255) NOT NULL,
    `done` BOOLEAN NOT NULL default 0,   
    PRIMARY KEY (`message_id`)
) ENGINE=INNODB CHARACTER SET utf8 COLLATE utf8_general_ci