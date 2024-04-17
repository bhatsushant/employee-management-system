// import { type Axios } from "axios";
import { Employee } from "@/models/employee";
import axios from "axios";

export class EmployeeApi {
  getEmployees = async (): Promise<Employee[]> => {
    try {
      const response = await axios.get("http://localhost:3000/auth/employees");
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch all employees");
    }
  };

  getEmployee = async (id: string): Promise<void> => {
    try {
      console.log(id);
      // const response = await axios.get(/api/employees/${id});
      // return response.data;
    } catch (error) {
      throw new Error("Failed to fetch employee");
    }
  };

  createEmployee = async (employee: Employee): Promise<Employee> => {
    try {
      console.log("inside api");
      return employee;
      // const response = await axios.post("/add_employee", employee);
      // return response.data;
    } catch (error) {
      throw new Error("Failed to create employee");
    }
  };

  updateEmployee = async (
    id: string,
    employee: Employee
  ): Promise<Employee> => {
    try {
      console.log(id, employee);
      return employee;
      // const response = await axios.put(/api/employees/${id}, employee);
      // return response.data;
    } catch (error) {
      throw new Error("Failed to update employee");
    }
  };

  deleteEmployee = async (id: string): Promise<boolean> => {
    try {
      console.log(id);
      return true;
      // await axios.delete(/api/employees/${id});
      // return true;
    } catch (error) {
      throw new Error("Failed to delete employee");
    }
  };
}
