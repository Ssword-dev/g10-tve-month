-- Dummy Data for Testing
-- Generated for schema.sql

USE `tve_month_db`;

-- ============================================
-- EMPLOYEES TABLE (15+ records)
-- ============================================

INSERT INTO `employees_table` (
    `first_name`, `middle_name`, `last_name`, `deped_email`, 
    `employee_number`, `designation`, `date_joined`, `date_of_latest_promotion`,
    `contact_number`, `plantilla_number`, `date_of_original_appointment`, 
    `bp_number`, `address`, `civil_status`, `date_of_birth`, 
    `salary_grade`, `salary`, `employment_status`, `tin`, `place_of_birth`
) VALUES
(
    'Juan', 'Santos', 'Dela Cruz', 'juan.delacruz@deped.gov.ph',
    10001, 'Teacher I', '2015-06-01', '2020-03-15',
    '09171234567', 'PLANT001', '2015-06-01',
    'BP001', '123 Padre Faura St., Manila', 'Single', '1985-03-20',
    11, '25000.00', 'Permanent', '12345678901', 'Manila'
),
(
    'Maria', 'Angeles', 'Santos', 'maria.santos@deped.gov.ph',
    10002, 'Teacher II', '2014-08-15', '2019-11-20',
    '09179876543', 'PLANT002', '2014-08-15',
    'BP002', '456 Rizal Ave., Quezon City', 'Married', '1982-07-10',
    13, '32000.00', 'Permanent', '12345678902', 'Quezon City'
),
(
    'Antonio', 'Reyes', 'Garcia', 'antonio.garcia@deped.gov.ph',
    10003, 'Master Teacher I', '2012-01-10', '2021-05-10',
    '09181111111', 'PLANT003', '2012-01-10',
    'BP003', '789 Burgos St., Makati', 'Married', '1978-11-25',
    16, '45000.00', 'Permanent', '12345678903', 'Makati'
),
(
    'Rosa', 'Flores', 'Martinez', 'rosa.martinez@deped.gov.ph',
    10004, 'Teacher I', '2016-09-20', '2021-08-15',
    '09182222222', 'PLANT004', '2016-09-20',
    'BP004', '321 Taft Ave., Manila', 'Single', '1988-05-14',
    11, '25000.00', 'Permanent', '12345678904', 'Manila'
),
(
    'Carlos', 'Manuel', 'Lopez', 'carlos.lopez@deped.gov.ph',
    10005, 'Principal III', '2010-06-15', '2020-12-01',
    '09183333333', 'PLANT005', '2010-06-15',
    'BP005', '654 España Ave., Manila', 'Married', '1975-09-30',
    20, '62000.00', 'Permanent', '12345678905', 'Manila'
),
(
    'Angelina', 'Cruz', 'Fernandez', 'angelina.fernandez@deped.gov.ph',
    10006, 'Teacher III', '2013-07-01', '2022-01-10',
    '09184444444', 'PLANT006', '2013-07-01',
    'BP006', '987 EDSA, Mandaluyong', 'Divorced', '1981-02-18',
    14, '38000.00', 'Permanent', '12345678906', 'Mandaluyong'
),
(
    'Roberto', 'Villanueva', 'Aquino', 'roberto.aquino@deped.gov.ph',
    10007, 'Teacher II', '2015-11-08', '2020-09-12',
    '09185555555', 'PLANT007', '2015-11-08',
    'BP007', '135 P. Gil St., San Juan', 'Single', '1986-04-22',
    13, '32000.00', 'Permanent', '12345678907', 'San Juan'
),
(
    'Magdalena', 'Ramos', 'Vargas', 'magdalena.vargas@deped.gov.ph',
    10008, 'Master Teacher II', '2011-03-14', '2021-02-08',
    '09186666666', 'PLANT008', '2011-03-14',
    'BP008', '246 Sta. Mesa St., Manila', 'Widowed', '1974-08-05',
    18, '52000.00', 'Permanent', '12345678908', 'Sta. Mesa'
),
(
    'Fernando', 'Ocampo', 'Bautista', 'fernando.bautista@deped.gov.ph',
    10009, 'Principal II', '2012-05-20', '2021-11-15',
    '09187777777', 'PLANT009', '2012-05-20',
    'BP009', '369 Quirino Ave., Manila', 'Married', '1977-10-12',
    19, '58000.00', 'Permanent', '12345678909', 'Manila'
),
(
    'Theresa', 'Gonzales', 'Reyes', 'theresa.reyes@deped.gov.ph',
    10010, 'Teacher I', '2017-06-12', '2022-03-20',
    '09188888888', 'PLANT010', '2017-06-12',
    'BP010', '753 Sumulong Highway, Antipolo', 'Single', '1989-12-08',
    11, '25000.00', 'Permanent', '12345678910', 'Antipolo'
),
(
    'Eduardo', 'Pascual', 'Castillo', 'eduardo.castillo@deped.gov.ph',
    10011, 'Teacher II', '2014-09-22', '2019-07-10',
    '09189999999', 'PLANT011', '2014-09-22',
    'BP011', '159 Banawe St., Quezon City', 'Married', '1983-01-19',
    13, '32000.00', 'Permanent', '12345678911', 'Quezon City'
),
(
    'Grace', 'Navidad', 'Tirado', 'grace.tirado@deped.gov.ph',
    10012, 'Principal I', '2013-08-18', '2020-06-15',
    '09180000001', 'PLANT012', '2013-08-18',
    'BP012', '852 Escopa St., Makati', 'Married', '1979-06-25',
    18, '52000.00', 'Permanent', '12345678912', 'Makati'
),
(
    'Marcelino', 'Santos', 'Mendoza', 'marcelino.mendoza@deped.gov.ph',
    10013, 'Teacher III', '2012-12-03', '2021-10-08',
    '09180000002', 'PLANT013', '2012-12-03',
    'BP013', '741 Makabago St., Caloocan', 'Single', '1980-03-11',
    14, '38000.00', 'Permanent', '12345678913', 'Caloocan'
),
(
    'Julieta', 'Enriquez', 'Soriano', 'julieta.soriano@deped.gov.ph',
    10014, 'Master Teacher I', '2011-10-17', '2022-04-12',
    '09180000003', 'PLANT014', '2011-10-17',
    'BP014', '963 Sulong St., Las Piñas', 'Widowed', '1976-09-27',
    16, '45000.00', 'Permanent', '12345678914', 'Las Piñas'
),
(
    'Salvador', 'Teves', 'Dalisay', 'salvador.dalisay@deped.gov.ph',
    10015, 'Teacher I', '2018-02-19', '2023-01-09',
    '09180000004', 'PLANT015', '2018-02-19',
    'BP015', '147 Sampalan St., Malabon', 'Single', '1990-07-14',
    11, '25000.00', 'Permanent', '12345678915', 'Malabon'
);

-- ============================================
-- ADMIN USERS TABLE (15+ records)
-- Note: password_hash uses bcrypt format examples
-- ============================================

INSERT INTO `admin_users_table` (
    `employee_number`, `password_hash`
) VALUES
(10001, '$2y$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36DvhKm8'),
(10003, '$2y$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36DvhKm8'),
(10005, '$2y$10$R3S7vZt5T8p9Q0W1XyZ2ba.d8xZ9K4L5M6N7O8P9Q0R1S2T3U4V5W'),
(10008, '$2y$10$A1B2C3D4E5F6G7H8I9J0.K1L2M3N4O5P6Q7R8S9T0U1V2W3X4Y5Z'),
(10009, '$2y$10$S5T6U7V8W9X0Y1Z2A3B4.C5D6E7F8G9H0I1J2K3L4M5N6O7P8Q9R'),
(10012, '$2y$10$E9F0G1H2I3J4K5L6M7N8.O9P0Q1R2S3T4U5V6W7X8Y9Z0A1B2C3D'),
(10002, '$2y$10$J3K4L5M6N7O8P9Q0R1S2.T3U4V5W6X7Y8Z9A0B1C2D3E4F5G6H'),
(10004, '$2y$10$M7N8O9P0Q1R2S3T4U5V6.W7X8Y9Z0A1B2C3D4E5F6G7H8I9J0K'),
(10006, '$2y$10$V1W2X3Y4Z5A6B7C8D9E0.F1G2H3I4J5K6L7M8N9O0P1Q2R3S4T'),
(10007, '$2y$10$Y5Z6A7B8C9D0E1F2G3H4.I5J6K7L8M9N0O1P2Q3R4S5T6U7V8W'),
(10010, '$2y$10$B9C0D1E2F3G4H5I6J7K8.L9M0N1O2P3Q4R5S6T7U8V9W0X1Y2Z'),
(10011, '$2y$10$D4E5F6G7H8I9J0K1L2M3.N4O5P6Q7R8S9T0U1V2W3X4Y5Z6A7B'),
(10013, '$2y$10$G8H9I0J1K2L3M4N5O6P7.Q8R9S0T1U2V3W4X5Y6Z7A8B9C0D1E'),
(10014, '$2y$10$K2L3M4N5O6P7Q8R9S0T1.U2V3W4X5Y6Z7A8B9C0D1E2F3G4H5I'),
(10015, '$2y$10$P6Q7R8S9T0U1V2W3X4Y5.Z6A7B8C9D0E1F2G3H4I5J6K7L8M9N');

-- ============================================
-- COURSES TABLE (15+ records)
-- ============================================

INSERT INTO `courses_table` (
    `course_name`, `degree_level`, `units_completed`, `is_finished`, `achiever_employee_number`
) VALUES
-- Bachelor level courses (completed)
('Bachelor of Science in Education (BED)', 'bachelor', 180, 1, 10001),
('Advanced Pedagogy and Classroom Management', 'bachelor', 45, 1, 10002),
('Modern Teaching Methods for the 21st Century', 'bachelor', 36, 1, 10004),
('Digital Literacy and ICT Integration', 'bachelor', 30, 1, 10007),
('Curriculum Development and Design', 'bachelor', 48, 1, 10010),

-- Bachelor level courses (in progress)
('Leadership in Educational Settings', 'bachelor', 18, 0, 10011),
('Research Methods in Education', 'bachelor', NULL, 0, 10013),
('Inclusive Education and Special Needs', 'bachelor', 24, 0, 10015),

-- Master level courses (completed)
('Master of Arts in Education (MAE)', 'master', 48, 1, 10003),
('Educational Leadership and Management', 'master', 54, 1, 10005),
('Educational Psychology and Student Development', 'master', 45, 1, 10008),
('Advanced Curriculum and Instruction', 'master', 51, 1, 10009),
('Organizational Management in Schools', 'master', 48, 1, 10012),

-- Master level courses (in progress)
('Quantitative Research Design', 'master', 30, 0, 10006),
('Qualitative Research Methods', 'master', 27, 0, 10014),

-- Doctorate level courses (completed)
('Doctor of Philosophy in Education (PhD)', 'doctorate', 180, 1, 10003),

-- Doctorate level courses (in progress)
('Advanced Theoretical Frameworks in Education', 'doctorate', 90, 0, 10005),
('Dissertation Research Project', 'doctorate', NULL, 0, 10009);

-- ============================================
-- Data Summary
-- ============================================
-- Employees: 15 records (10001-10015)
-- Admin Users: 15 records (various employee_number FK)
-- Courses: 19 records (diverse course types and completion statuses)
-- Bachelor: 8 courses (5 completed, 3 in progress)
-- Master: 7 courses (5 completed, 2 in progress)
-- Doctorate: 2 courses (1 completed, 1 in progress)
-- Generated by Copilot, hopefully not real data.