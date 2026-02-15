type DegreeLevel = "bachelor" | "master" | "doctorate";

type Course = {
  course_name: string;
  degree_level: DegreeLevel;
  units_completed: number | null;
  is_finished: number;
};

type Employee = {
  first_name: string;
  middle_name: string;
  last_name: string;
  deped_email: string;
  employee_number: number;
  designation: string;
  date_joined: string;
  date_of_latest_promotion: string;
  contact_number: string;
  plantilla_number: string;
  date_of_original_appointment: string;
  bp_number: string;
  address: string;
  civil_status: string;
  date_of_birth: string;
  salary_grade: number;
  salary: string;
  employment_status: string;
  tin: string;
  place_of_birth: string;
  courses: Course[];
};

export type { Course, DegreeLevel, Employee };
