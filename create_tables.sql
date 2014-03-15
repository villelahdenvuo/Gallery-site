CREATE TABLE gal_folder(
	id INT NOT NULL AUTO_INCREMENT,
	PRIMARY KEY (id),
	name VARCHAR(255) CHARACTER SET utf8,
	parent_id INT,
	INDEX parent_index (parent_id),
	FOREIGN KEY (parent_id)
		REFERENCES gal_folder(id)
		ON DELETE CASCADE -- Delete folder if parent folder is deleted.
) ENGINE=INNODB;

CREATE TABLE gal_photo(
	id INT NOT NULL AUTO_INCREMENT,
	PRIMARY KEY (id),
	name VARCHAR(255) CHARACTER SET utf8,
	path VARCHAR(255) ASCII,
	folder_id INT NOT NULL,
	INDEX folder_index (folder_id),
	FOREIGN KEY (folder_id)
		REFERENCES gal_folder(id)
		ON DELETE CASCADE -- Delete photo if folder is deleted.
) ENGINE=INNODB;