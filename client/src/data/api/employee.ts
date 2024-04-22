import { Employee } from "@/models/employee";
import axios from "axios";
import { format } from "date-fns";
const client = import.meta.env.VITE_API_URL;

function formatDate(date: string) {
  return date.toString().split("T")[0];
}

export class EmployeeApi {
  getEmployees = async (): Promise<Employee[]> => {
    try {
      const { data } = await axios.get(`${client}/employees`);
      data.forEach((employee: Employee) => {
        employee.dateOfBirth = formatDate(employee.dateOfBirth);
        employee.startDate = formatDate(employee.startDate);
        employee.salary = Number(employee.salary);
      });

      return data;
    } catch (error) {
      throw new Error("Failed to fetch all employees");
    }
  };

  getEmployee = async (id: string): Promise<Employee> => {
    try {
      const { data } = await axios.get(`${client}/employees/${id}`);
      return data;
    } catch (error) {
      throw new Error("Failed to fetch employee");
    }
  };

  createEmployee = async (
    employee: Partial<Employee>
  ): Promise<{ data?: Employee; success: boolean; message: string }> => {
    try {
      const response = await axios.post(`${client}/employees`, employee);
      if (!response.status) {
        throw new Error("Failed to create employee");
      }
      return {
        data: response.data,
        success: true,
        message: "Employee created successfully"
      };
    } catch (error) {
      console.error("Error creating employee:", error);
      return {
        success: false,
        message: (error as any)?.response?.data?.message
      };
    }
  };

  updateEmployee = async (
    id: string,
    employee: Partial<Employee>
  ): Promise<{ data?: Employee; success: boolean; message: string }> => {
    try {
      const { isAdmin, isEmployed, employeeId, ...employeeData } = employee;

      const { data } = await axios.put(
        `${client}/employees/${id}`,
        employeeData
      );
      if (!data.status) {
        throw new Error("Failed to create employee");
      }
      return {
        data: data,
        success: true,
        message: "Employee updated successfully"
      };
    } catch (error) {
      console.error("Error creating employee:", error);
      return {
        success: false,
        message: (error as any)?.response?.data?.message
      };
    }
  };

  deleteEmployee = async (
    id: string
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const deleted = await axios.put(
        `${client}/employees/delete_employee/${id}`
      );
      if (!deleted) {
        throw new Error("Failed to delete employee");
      }
      return { success: true, message: "Employee deleted successfully" };
    } catch (error) {
      throw new Error("Failed to delete employee");
    }
  };
  logout = async (): Promise<boolean> => {
    try {
      const loggedOut = await axios.post(
        "http://localhost:3000/auth/logout",
        {},
        {
          withCredentials: true,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json"
          }
        }
      );
      if (!loggedOut) {
        throw new Error("Failed to logout");
      }

      return true;
    } catch (error) {
      throw new Error("Failed to logout");
    }
  };
}
