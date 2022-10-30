CREATE DATABASE myBookshop;
USE myBookshop;
CREATE TABLE books (id INT AUTO_INCREMENT,name VARCHAR(50),price DECIMAL(5, 2) unsigned,PRIMARY KEY(id));
INSERT INTO books (name, price)VALUES('database book', 40.25),('Node.js book', 25.00), ('Express book', 31.99) ;
CREATE USER 'appuser'@'localhost' IDENTIFIED WITH mysql_native_password BY 'app2027';
GRANT ALL PRIVILEGES ON myBookshop.* TO 'appuser'@'localhost';



CREATE TABLE users (id INT AUTO_INCREMENT, username VARCHAR(50),firstname VARCHAR(50), lastname VARCHAR(50), email VARCHAR(50), hashedPassword VARCHAR(100), PRIMARY KEY(id));

CREATE TABLE users (id INT AUTO_INCREMENT, username VARCHAR(50) UNIQUE,firstname VARCHAR(50), lastname VARCHAR(50), email VARCHAR(50) UNIQUE, hashedPassword VARCHAR(100), PRIMARY KEY(id));


CREATE TABLE users (id INT AUTO_INCREMENT, username VARCHAR(20) NOT NULL UNIQUE, 
											firstname VARCHAR(50) NOT NULL,
                                            lastname VARCHAR(50) NOT NULL, 
                                            email VARCHAR(50) NOT NULL UNIQUE, 
                                            hashedPassword VARCHAR(100) NOT NULL, 
											PRIMARY KEY(id));


u-- CREATE TABLE users (id INT PRIMARY KEY(id) AUTO_INCREMENT,email VARCHAR(50) unsigned,password VARCHAR(64) NOT NULL,username VARCHAR(20) NOT NULL UNIQUE);