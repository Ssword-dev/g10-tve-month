-- Schema file begin

-- WORD sized strings: 15
-- Address sized strings: 120
-- Email sized strings: 140

-- Create database and use it
-- Important: %suffix% is replaced during testing or
-- with the use of scripts. 
DROP DATABASE IF EXISTS `tve_month_db`;
CREATE DATABASE `tve_month_db`;
USE `tve_month_db`;

DROP TABLE IF EXISTS `employees_table`;
CREATE TABLE `employees_table` (
    -- Name fields
    `first_name` VARCHAR(50) NOT NULL, -- some first names are long.
    `middle_name` VARCHAR(40) NOT NULL, -- middle names should not be too long.
    `last_name` VARCHAR(50) NOT NULL, -- some last names are long.

    -- Other fields.
    `deped_email` VARCHAR(140), -- deped email, this may be nullable.
    `employee_number` INT, -- is this primary key? imma ask that later.
    `designation` VARCHAR(30),
    `date_joined` DATE,
    `date_of_latest_promotion` DATE,
    `contact_number` VARCHAR(40),
    `plantilla_number` VARCHAR(80),
    `date_of_original_appointment` DATE,
    `bp_number` INT,
    `address` VARCHAR(120),
    `civil_status` VARCHAR(15), -- WORD sized.
    `date_of_birth` DATE,
    `salary_grade` INT,
    `salary` VARCHAR(50), -- pag lumampas sila sa salary na 50 characters, hahaha sanaol
    `employment_status` VARCHAR(15),
    `tin` VARCHAR(11),
    `place_of_birth` VARCHAR(120),
    PRIMARY KEY (`employee_number`)
);

DROP TABLE IF EXISTS `courses_table`;
CREATE TABLE `courses_table` (
    `course_name` VARCHAR(70) NOT NULL,
    `degree_level` ENUM('bachelor', 'master', 'doctorate') NOT NULL,
    `units_completed` INT NULL, -- Null for post-graduate courses.
    `is_finished` BOOLEAN NOT NULL, -- did the employee finish the course?
    `achiever_employee_number` INT, -- FK to employees_table
    FOREIGN KEY (`achiever_employee_number`) REFERENCES `employees_table`(`employee_number`)
);

DROP TABLE IF EXISTS `admin_users_table`;
CREATE TABLE `admin_users_table` (
    `employee_number` INT, -- FK, extends employee
    `password_hash` VARCHAR(60), -- php password hash.
    FOREIGN KEY (`employee_number`) REFERENCES `employees_table`(`employee_number`)
);

CREATE OR REPLACE VIEW `admin_users_view` AS
SELECT
    -- admin_users_table
    A.employee_number,
    A.password_hash,

    -- employees_table
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
    ON E.employee_number = A.employee_number;