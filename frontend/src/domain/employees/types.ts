// #region Entities
type DegreeLevel = "bachelor" | "master" | "doctorate";

type Course = {
  employee_number: number;
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
  salary: number | null;
  age: number | null;
  employment_status: string;
  tin: string;
  place_of_birth: string;
  courses: Course[];
};

export type { Course, DegreeLevel, Employee };
// #endregion Entities

// #region Filters
type NumberComparisonKeyword = "eq" | "gte" | "lte" | "gt" | "lt" | "neq";
type StringComparisonKeyword =
  | "eq"
  | "contains"
  | "startsWith"
  | "endsWith"
  | "neq";
type DateComparisonKeyword =
  | "eq"
  | "gte"
  | "lte"
  | "gt"
  | "lt"
  | "neq"
  | "between";
type BooleanComparisonKeyword = "eq" | "neq";

interface Condition {
  negate?: boolean;
}

// Number comparisons
interface NumberComparison extends Condition {
  type: NumberComparisonKeyword;
  operand: number;
}

interface NumberBetweenComparison extends Condition {
  type: "between";
  min: number;
  max: number;
}

// String comparisons
interface StringComparison extends Condition {
  type: StringComparisonKeyword;
  operand: string;
}

interface StringInComparison extends Condition {
  type: "in";
  operands: string[];
}

// Date comparisons
interface DateComparison extends Condition {
  type: DateComparisonKeyword;
  operand: string; // ISO date string
}

interface DateBetweenComparison extends Condition {
  type: "between";
  from: string; // ISO date string
  to: string; // ISO date string
}

// Boolean comparisons
interface BooleanComparison extends Condition {
  type: "eq" | "neq";
  operand: boolean;
}

// Nullability
interface NullabilityCondition {
  is_null: boolean; // true = is null, false = is not null
}

// Combined filter for a field
interface FieldFilter<TComparison> {
  field: keyof Employee; // restrict to actual employee fields
  comparisons?: TComparison[];
  null?: NullabilityCondition;
}

// Specific field filter types
type NumberFieldFilter = FieldFilter<
  NumberComparison | NumberBetweenComparison
>;

type StringFieldFilter = FieldFilter<StringComparison | StringInComparison>;

type DateFieldFilter = FieldFilter<DateComparison | DateBetweenComparison>;

type BooleanFieldFilter = FieldFilter<BooleanComparison>;

// Union of all field filter types
type AnyFieldFilter =
  | NumberFieldFilter
  | StringFieldFilter
  | DateFieldFilter
  | BooleanFieldFilter;

// Logical operators for combining filters
interface AndFilter {
  type: "and";
  filters: FilterExpression[];
}

interface OrFilter {
  type: "or";
  filters: FilterExpression[];
}

interface NotFilter {
  type: "not";
  filter: FilterExpression;
}

// Recursive filter expression
type FilterExpression = AnyFieldFilter | AndFilter | OrFilter | NotFilter;

type Order = "asc" | "desc";

interface Fields {
  include: (keyof Employee)[] | "ALL";
  exclude: (keyof Employee)[] | "NONE";
}

// Main filter payload
interface FilterEmployeesPayload {
  where?: FilterExpression;

  // Pagination
  page?: number;
  limit?: number;

  // Sorting
  sort?: Array<{
    basis: keyof Employee;
    direction: Order;
  }>;

  // Select fields to show.
  //
  fields: Fields;
}

// #endregion Filters
export type {
  // Filter keyword types
  NumberComparisonKeyword,
  StringComparisonKeyword,
  DateComparisonKeyword,
  BooleanComparisonKeyword,

  // Base condition
  Condition,

  // Number comparisons
  NumberComparison,
  NumberBetweenComparison,

  // String comparisons
  StringComparison,
  StringInComparison,

  // Date comparisons
  DateComparison,
  DateBetweenComparison,

  // Boolean comparisons
  BooleanComparison,

  // Nullability
  NullabilityCondition,

  // Field Control
  Fields,

  // Field filter
  FieldFilter,

  // Specific field filters
  NumberFieldFilter,
  StringFieldFilter,
  DateFieldFilter,
  BooleanFieldFilter,

  // Union field filter
  AnyFieldFilter,

  // Logical operators
  AndFilter,
  OrFilter,
  NotFilter,

  // Recursive expression
  FilterExpression,

  // Main payload
  FilterEmployeesPayload,
};
