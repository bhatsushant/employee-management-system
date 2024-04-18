import { Employee } from "@/models/employee";
import axios from "axios";

const client = import.meta.env.VITE_API_URL;

export class EmployeeApi {
  getEmployees = async (): Promise<Employee[]> => {
    try {
      const { data } = await axios.get(`${client}/employees`);

      return data;
    } catch (error) {
      throw new Error("Failed to fetch all employees");
    }
  };

  getEmployee = async (id: string): Promise<Employee> => {
    try {
      console.log(id);
      const { data } = await axios.get(`${client}/employees/${id}`);

      return data;
    } catch (error) {
      throw new Error("Failed to fetch employee");
    }
  };

  createEmployee = async (employee: Employee): Promise<Employee> => {
    try {
      console.log("inside api");
      const response = await axios.post(`${client}/employees`, employee);
      return response.data;
    } catch (error) {
      throw new Error("Failed to create employee");
    }
  };

  updateEmployee = async (id: string, employee: Employee): Promise<boolean> => {
    try {
      const { isAdmin, isEmployed, employeeId, ...employeeData } = employee;

      const response = await axios.put(
        `${client}/employees/${id}`,
        employeeData
      );
      return response.status === 200;
    } catch (error) {
      throw new Error("Failed to update employee");
    }
  };

  deleteEmployee = async (id: string): Promise<boolean> => {
    try {
      console.log(id);
      await axios.put(`${client}/employees/delete_employee/${id}`);
      return true;
    } catch (error) {
      throw new Error("Failed to delete employee");
    }
  };
}
