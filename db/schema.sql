-- If a database already exists with this name, it will delete it and create a new one
DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;

-- Tells SQL what database to use
USE employee_db;

-- Creates a table for departments
CREATE TABLE department (
    -- ID is set to PRIMARY KEY to allow connection to role table
    id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    name VARCHAR(30)
);

-- Creates a table for roles
CREATE TABLE role (
    -- ID is set to PRIMARY KEY to allow connection to employee table
    id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    title VARCHAR(30),
    salary DECIMAL,
    department_id INT,
    FOREIGN KEY (department_id) REFERENCES department(id)
);

-- Creates a table for employees
CREATE TABLE employee (
    -- ID is set to PRIMARY KEY to allow connection to employee and manager
    id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    manager_id INT,
    role_id INT,
    FOREIGN KEY (manager_id) REFERENCES employee(id),
    FOREIGN KEY (role_id) REFERENCES role(id)
);