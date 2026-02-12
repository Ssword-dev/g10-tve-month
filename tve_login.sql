-- Drop database if it exists
DROP DATABASE IF EXISTS tve_month_db;

-- Create database
CREATE DATABASE tve_month_db;
USE tve_month_db;

-- =================================
-- Employees Table
-- =================================
DROP TABLE IF EXISTS employees_table;
CREATE TABLE employees_table (
    first_name VARCHAR(50) NOT NULL,
    middle_name VARCHAR(40) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    deped_email VARCHAR(140),
    employee_number INT NOT NULL PRIMARY KEY,
    designation VARCHAR(30),
    date_joined DATE,
    date_of_latest_promotion DATE,
    contact_number VARCHAR(40),
    plantilla_number VARCHAR(80),
    date_of_original_appointment DATE,
    bp_number INT,
    address VARCHAR(120),
    civil_status VARCHAR(15),
    date_of_birth DATE,
    salary_grade INT,
    salary VARCHAR(50),
    employment_status VARCHAR(15),
    tin VARCHAR(11),
    place_of_birth VARCHAR(120)
);

-- Insert a sample employee
INSERT INTO employees_table 
(employee_number, first_name, middle_name, last_name, deped_email, designation, date_joined, salary)
VALUES 
(1, 'Juan', 'Dela', 'Cruz', 'juan.cruz@deped.gov.ph', 'Teacher', '2020-06-01', '25000');

-- =================================
-- Admin Users Table
-- =================================
DROP TABLE IF EXISTS admin_users_table;
CREATE TABLE admin_users_table (
    employee_number INT NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    PRIMARY KEY (employee_number),
    FOREIGN KEY (employee_number) REFERENCES employees_table(employee_number)
);

-- Insert a test admin with a hashed password
-- Use PHP to generate the hash: password_hash("admin123", PASSWORD_DEFAULT);
INSERT INTO admin_users_table (employee_number, password_hash)
VALUES (1, '$2y$10$G9OZ2G0bhVq/6hso9PfrieJrI5l6E0F6qszFhmB7kg6fnkYRtQlYO'); 
-- This hash is for password: admin123

-- =================================
-- Courses Table
-- =================================
DROP TABLE IF EXISTS courses_table;
CREATE TABLE courses_table (
    course_name VARCHAR(70) NOT NULL,
    degree_level ENUM('bachelor', 'master', 'doctorate') NOT NULL,
    units_completed INT NULL,
    is_finished BOOLEAN NOT NULL,
    achiever_employee_number INT,
    FOREIGN KEY (achiever_employee_number) REFERENCES employees_table(employee_number)
);

-- =================================
-- Admin Users View
-- =================================
CREATE OR REPLACE VIEW admin_users_view AS
SELECT
    A.employee_number,
    A.password_hash,
    E.first_name,
    E.middle_name,
    E.last_name,
    E.deped_email,
    E.designation,
    E.date_joined,
    E.date_of_latest_promotion,
    E.contact_number,
    E.plantilla_number,
    E.date_of_original_appointment,
    E.bp_number,
    E.address,
    E.civil_status,
    E.date_of_birth,
    E.salary_grade,
    E.salary,
    E.employment_status,
    E.tin,
    E.place_of_birth
FROM admin_users_table AS A
INNER JOIN employees_table AS E
    ON A.employee_number = E.employee_number;