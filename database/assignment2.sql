/* queries 1-3 */
INSERT INTO account (account_firstname, account_lastname, account_email, account_password) VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');
UPDATE account SET account_type='Admin' WHERE account_firstname='Tony';
DELETE FROM account WHERE account_firstname='Tony';
/* query 4 */
UPDATE 
inventory 
SET 
inv_description= REPLACE(inv_description, 'the small interiors', 'a huge interior')
WHERE 
inv_id= 10;

/* query 5 */
SELECT 
	inventory.inv_make, 
	inventory.inv_model, 
	classification.classification_name 
FROM 
	inventory
INNER JOIN classification 
	ON classification.classification_id = inventory.classification_id;

/* query 6*/
UPDATE 
inventory 
SET 
inv_image = REPLACE(inv_image, '/images', '/images/vehicles'),
inv_thumbnail = REPLACE(inv_thumbnail, '/images', '/images/vehicles');
