export function createEmployeeFactory() {
  const id = crypto.randomUUID();

  return {
    email: `employee.${id}@maelmar.com`,
    firstName: `Juan ${id.slice(0, 6)}`,
    lastName: "Pérez López",
    role: "Empleado",
    position: "Terapeuta",
    salary: "15000",
    hireDate: "2026-07-02",
  };
}