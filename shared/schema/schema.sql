-- Schema file begin

-- WORD sized strings: 15
-- Address sized strings: 120
-- Email sized strings: 140

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
    `bp_number` VARCHAR(30) UNIQUE,
    `address` VARCHAR(120),
    `civil_status` VARCHAR(15), -- WORD sized.
    `date_of_birth` DATE,
    `salary_grade` INT,
    `salary` INT,
    `employment_status` VARCHAR(15),
    `tin` VARCHAR(60),
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
    FOREIGN KEY (`achiever_employee_number`) REFERENCES `employees_table`(`employee_number`) ON DELETE CASCADE
);

DROP TABLE IF EXISTS `admin_users_table`;
CREATE TABLE `admin_users_table` (
    `employee_number` INT, -- FK, extends employee
    `password_hash` VARCHAR(60), -- php password hash.
    FOREIGN KEY (`employee_number`) REFERENCES `employees_table`(`employee_number`) ON DELETE CASCADE
);

-- Admin users view.
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

-- Employee computed fields view.
-- Contains persisted employee columns plus SQL-computed fields
-- used by filtering/sorting APIs.
CREATE OR REPLACE VIEW `employees_with_computed_view` AS
SELECT
    E.*,
    TRIM(CONCAT_WS(' ', E.first_name, E.middle_name, E.last_name)) AS `full_name`
FROM `employees_table` AS E;

-- Designation Frequency Table (view)
CREATE OR REPLACE VIEW `designation_frequency_table_view` AS
SELECT `designation`, COUNT(*)
FROM `employees_table`
GROUP BY `designation`
ORDER BY `designation`;

-- Employment Status Distribution Table (view)
CREATE OR REPLACE VIEW `employment_status_distribution_table_view` AS
SELECT
    COALESCE(NULLIF(`employment_status`, ''), 'Unspecified') AS `employment_status`,
    COUNT(*) AS `occurrence`
FROM `employees_table`
GROUP BY COALESCE(NULLIF(`employment_status`, ''), 'Unspecified')
ORDER BY `occurrence` DESC, `employment_status` ASC;

-- Teaching employees summary view.
CREATE OR REPLACE VIEW `teaching_employees_summary_view` AS
SELECT
    SUM(CASE WHEN E.designation LIKE '%Teacher%' THEN 1 ELSE 0 END) AS `teaching_staff`,
    SUM(CASE WHEN E.designation LIKE '%Teacher%' AND E.designation LIKE '%JHS%' THEN 1 ELSE 0 END) AS `no_jhs_teachers`,
    SUM(CASE WHEN E.designation LIKE '%Teacher%' AND E.designation LIKE '%SHS%' THEN 1 ELSE 0 END) AS `no_shs_teachers`,
    SUM(CASE WHEN E.designation LIKE '%Teacher%' AND M.achiever_employee_number IS NOT NULL THEN 1 ELSE 0 END) AS `no_teachers_with_masters_degree`,
    SUM(CASE WHEN E.designation LIKE '%Teacher%' AND D.achiever_employee_number IS NOT NULL THEN 1 ELSE 0 END) AS `no_teachers_with_doctorate_degree`
FROM `employees_table` AS E
LEFT JOIN (
    SELECT DISTINCT `achiever_employee_number`
    FROM `courses_table`
    WHERE `degree_level` = 'master' AND `is_finished` = TRUE
) AS M
    ON M.achiever_employee_number = E.employee_number
LEFT JOIN (
    SELECT DISTINCT `achiever_employee_number`
    FROM `courses_table`
    WHERE `degree_level` = 'doctorate' AND `is_finished` = TRUE
) AS D
    ON D.achiever_employee_number = E.employee_number;

CREATE OR REPLACE VIEW `non_teaching_employees_summary_view` AS
SELECT
    SUM(CASE WHEN E.designation NOT LIKE '%Teacher%' THEN 1 ELSE 0 END) AS `non_teaching_staff`,
    SUM(CASE WHEN E.designation NOT LIKE '%Teacher%' AND E.designation LIKE '%JHS%' THEN 1 ELSE 0 END) AS `no_jhs_non_teaching_staff`,
    SUM(CASE WHEN E.designation NOT LIKE '%Teacher%' AND E.designation LIKE '%SHS%' THEN 1 ELSE 0 END) AS `no_shs_non_teaching_staff`,
    SUM(CASE WHEN E.designation NOT LIKE '%Teacher%' AND C.has_master = 1 THEN 1 ELSE 0 END) AS `no_non_teaching_staff_with_masters_degree`,
    SUM(CASE WHEN E.designation NOT LIKE '%Teacher%' AND C.has_doctorate = 1 THEN 1 ELSE 0 END) AS `no_non_teaching_staff_with_doctorate_degree`
FROM `employees_table` AS E
LEFT JOIN (
    SELECT
        `achiever_employee_number`,
        MAX(CASE WHEN `degree_level` = 'master' AND `is_finished` = TRUE THEN 1 ELSE 0 END) AS `has_master`,
        MAX(CASE WHEN `degree_level` = 'doctorate' AND `is_finished` = TRUE THEN 1 ELSE 0 END) AS `has_doctorate`
    FROM `courses_table`
    GROUP BY `achiever_employee_number`
) AS C
    ON C.achiever_employee_number = E.employee_number;
