USE `tve_month_db`;

INSERT INTO `employees_table` (
  `first_name`,
  `middle_name`,
  `last_name`,
  `deped_email`,
  `employee_number`,
  `designation`,
  `date_joined`,
  `date_of_latest_promotion`,
  `contact_number`,
  `plantilla_number`,
  `date_of_original_appointment`,
  `bp_number`,
  `address`,
  `civil_status`,
  `date_of_birth`,
  `salary_grade`,
  `salary`,
  `employment_status`,
  `tin`,
  `place_of_birth`
) VALUES (
  'Admin',
  '',
  'Account',
  'admin@employee-management.deped.gov.ph',
  20251,
  'System Maintainer',
  NULL,
  NULL,
  '+639335093594',
  'OSEC-DECSB-COMPRO2-4-1998',
  NULL,
  '1000000000',
  'San Pedro Laguna',
  'Single',
  '2000-01-01',
  20,
  38000,
  'Permanent',
  '000-000-000',
  'Anonymous'
);

INSERT INTO `admin_users_table` (
  `employee_number`,
  `password_hash`
) VALUES (
  20251,
  '$2y$12$8tCkTVd1YyJ9ZEY7fe5GPO4qJ8bMtE.lOnTAZj37KT/0UMMv7utzi'
);
