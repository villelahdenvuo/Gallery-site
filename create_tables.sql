CREATE TABLE gal_folder(
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	name VARCHAR(255) NOT NULL,
	lft INT NOT NULL,
	rgt INT NOT NULL	
	INDEX lft_index (lft),
	INDEX rgt_index (rgt),
	INDEX child_index (lft, rgt),
) ENGINE=INNODB;

CREATE TABLE gal_photo(
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	name VARCHAR(255),
	path VARCHAR(255),
	folder_id INT NOT NULL,
	INDEX folder_index (folder_id),
	FOREIGN KEY (folder_id)
		REFERENCES gal_folder(id)
		ON DELETE CASCADE -- Delete photo if folder is deleted.
) ENGINE=INNODB;
