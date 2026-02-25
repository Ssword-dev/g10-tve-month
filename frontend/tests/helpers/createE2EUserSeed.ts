export default function createE2EUserSeed() {
  const nonce = Date.now();
  const random = Math.floor(Math.random() * 1_000_000);
  const unique = `${nonce}${random}`;
  const employeeNumberBase = 800000 + ((nonce + random) % 100000);
  const employeeToAddNumberBase = 900000 + ((nonce + random) % 100000);

  return {
    employeeNumber: String(employeeNumberBase),
    firstName: "E2E",
    lastName: `Admin${(nonce + random) % 100000}`,
    depedEmail: `e2e.admin.${unique}@deped.gov.ph`,
    password: "P@ssword1234",
    employeeToAddNumber: String(employeeToAddNumberBase),
  };
}
