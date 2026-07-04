import type { APIRequestContext } from "@playwright/test";
import { createEmployeeFactory } from "../../factories/employee.factory";

export async function createEmployeeByApi(request: APIRequestContext) {
  const employee = createEmployeeFactory();

  const response = await request.post("/api/admin/employee/", {
    data: {
      firstName: employee.firstName,
      lastName: employee.lastName,
      position: "THERAPIST",
      email: employee.email,
      role: "EMPLOYEE",
      centerId: process.env.QA_CENTER_ID,
      salary: Number(employee.salary),
      hireDate: employee.hireDate,
    },
  });

  const text = await response.text();

  if (!response.ok()) {
    throw new Error(
      `Failed to create employee: ${response.status()} ${text}`,
    );
  }

  const body = JSON.parse(text);

  return {
    employee,
    id: body.data,
  };
}