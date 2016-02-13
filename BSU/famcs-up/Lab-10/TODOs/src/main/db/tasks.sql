CREATE TABLE `tasks` (
    `id` INT UNSIGNED NOT NULL,
    `description` VARCHAR(255) NOT NULL,
    `done` BOOLEAN NOT NULL default 0,   
    PRIMARY KEY (`id`)
) ENGINE=INNODB CHARACTER SET utf8 COLLATE utf8_general_ci