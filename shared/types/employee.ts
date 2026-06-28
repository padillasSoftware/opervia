
export interface Employee {
    id: string;
    name: string;
    role: string;
    position: string;
    email: string;
    status: string;
}


export interface EmployeeDto {
    id: string;
    firstName: string;
    lastName: string;
    role: string;
    position: Position;
    email: string;
    status: string;
    salary: number;
    hireDate: string;
    password: string;
    centerId: string
}