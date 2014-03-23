INSERT INTO gal_folder (name, lft, rgt, password, description) VALUES
	('Root', '0', '29', NULL, 'All content'),
	('Funny', '1', '2', NULL, 'Funny pictures'),
	('Nature', '3', '6', NULL, 'Nature pictures'),
	('Views', '4', '5', NULL, 'Beautiful views');

INSERT INTO gal_photo (name, path, description, folder_id) VALUES
	('Funny picture 1', 'http://community.giffgaff.com/t5/image/serverpage/image-id/38906iC12B6E7DDEBCED42/image-size/original', 'Customer support', 0);

INSERT INTO gal_tag (name, description) VALUES
	('funny', 'the picture brings happyness (yes happyness) to the world.'),
	('doge', 'Wow, such photon, so light.');

INSERT INTO gal_taglist (tag_id, photo_id) VALUES
	(1, 2);

INSERT INTO gal_user (name) VALUES
	('admin');

INSERT INTO gal_rating (score, user_id, photo_id) VALUES
	(5, 1, 2);