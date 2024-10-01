CREATE TYPE userRole AS ENUM ('teacher', 'student');

CREATE TABLE "users" (
	id 	uuid PRIMARY KEY,
	username VARCHAR(45) NOT NULL,
	firstName VARCHAR(45),
	lastName VARCHAR(45),
	email VARCHAR(45) NOT NULL,
	password VARCHAR(60) NOT NULL,
	role userRole,
	faculty VARCHAR(45),
	city	VARCHAR(45),
	country VARCHAR(45)
) 


