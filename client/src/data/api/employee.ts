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
      });

      return data;
    } catch (error) {
      throw new Error("Failed to fetch all employees");
    }
  };

  getEmployee = async (id: string): Promise<Employee> => {
    try {
      console.log(id);
      const { data } = await axios.get(`${client}/employees/${id}`);
      (data.dateOfBirth = new Date(format(data.dateOfBirth, "MM/dd/yyyy"))),
        console.log(data);
      return data;
    } catch (error) {
      throw new Error("Failed to fetch employee");
    }
  };

  createEmployee = async (
    employee: Employee
  ): Promise<{ data?: Employee; success: boolean; message: string }> => {
    try {
      console.log("inside api", employee);

      const response = await axios.post(`${client}/employees`, employee);
      console.log("data", response);
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
