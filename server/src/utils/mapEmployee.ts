import { IEmployee } from "../routes/employees";

export function mapEmployeeFields(employee: any): IEmployee {
  const fieldMap: IEmployee = {} as any;

  fieldMap.first_name = employee.firstName;
  fieldMap.last_name = employee.lastName;
  fieldMap.dept = employee.department;
  fieldMap.phone = employee.phoneNumber;
  fieldMap.email = employee.email;
  fieldMap.address = employee.address;
  fieldMap.date_of_birth = employee.dateOfBirth;
  fieldMap.start_date = employee.startDate;
  fieldMap.salary = parseFloat(employee.salary);
  fieldMap.position = employee.position;
  fieldMap.supervisor = employee.supervisor;
  fieldMap.image = employee.image;

  return fieldMap;
}
