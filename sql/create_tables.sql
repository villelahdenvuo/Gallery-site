CREATE TABLE gal_folder(
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	name VARCHAR(255) NOT NULL,
	lft INT NOT NULL,
	rgt INT NOT NULL
	password VARCHAR(255),
	description VARCHAR(1000),
	INDEX lft_index (lft),
	INDEX rgt_index (rgt),
	INDEX child_index (lft, rgt),
) ENGINE=INNODB;

CREATE TABLE gal_photo(
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	name VARCHAR(255),
	path VARCHAR(255),
	description VARCHAR(1000),
	folder_id INT NOT NULL,
	INDEX folder_index (folder_id),
	FOREIGN KEY (folder_id)
		REFERENCES gal_folder(id)
		ON DELETE CASCADE -- Delete photo if folder is deleted.
) ENGINE=INNODB;

CREATE TABLE gal_tag(
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	name VARCHAR(40),
	description VARCHAR(1000)
) ENGINE=INNODB;

CREATE TABLE gal_user(
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	name VARCHAR(120)
) ENGINE=INNODB;

CREATE TABLE gal_rating(
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	score TINYINT,
	user_id INT NOT NULL,
	INDEX user_index (user_id),
	FOREIGN KEY (user_id)
		REFERENCES gal_user(id)
		ON DELETE CASCADE -- Delete photo if folder is deleted.
) ENGINE=INNODB;