import { createContext, useState, useContext } from "react";
import { Employee } from "@/models/employee";
import { EmployeeApi } from "@/data/api/employee";

interface EmployeeContextType {
  employees: Employee[];
  setEmployees: React.Dispatch<React.SetStateAction<Employee[]>>;
  getEmployee: (id: string) => Employee | undefined;
  getEmployees: () => Promise<Employee[]>;
  createEmployee: (
    employee: Partial<Employee>
  ) => Promise<{ success: boolean; message: string }>;
  updateEmployee: (id: string, employee: Employee) => Promise<boolean>;
  fetchEmployee: (id: string) => Promise<Employee>;
  deleteEmployee: (id: string) => Promise<boolean>;
}

const EmployeeContext = createContext<EmployeeContextType>({
  employees: [],
  setEmployees: () => {},
  getEmployee: () => undefined,
  getEmployees: async () => {
    return [];
  },
  createEmployee: async () => ({ success: false, message: "" }),
  updateEmployee: async () => false,
  fetchEmployee: async () => {
    return {} as Employee;
  },
  deleteEmployee: async () => false
});

export const useEmployeeContext = () => useContext(EmployeeContext);

export const EmployeeProvider: React.FC<{ children: React.ReactNode }> = ({
  children = null
}) => {
  const [employees, setEmployees] = useState<Employee[]>([]);

  const employeeApi = new EmployeeApi();

  const getEmployee = (id: string) => {
    const employee = employees.find(emp => emp.employeeId === id);
    return employee;
  };

  const getEmployees = async () => {
    try {
      if (employees.length > 0) {
        return employees;
      }

      const allEmployees = await employeeApi.getEmployees();

      setEmployees(allEmployees);
      return allEmployees;
    } catch (error) {
      console.error("Error fetching all employees:", error);
      throw error; //
    }
  };

  function isCompleteEmployee(
    employee: Partial<Employee>
  ): employee is Employee {
    return (
      typeof employee.email === "string" &&
      typeof employee.firstName === "string" &&
      typeof employee.lastName === "string" &&
      typeof employee.phoneNumber === "string" &&
      typeof employee.address === "string" &&
      typeof employee.dateOfBirth === "string" &&
      typeof employee.department === "string" &&
      typeof employee.position === "string" &&
      typeof employee.supervisor === "string" &&
      typeof employee.startDate === "string" &&
      typeof employee.salary === "number" &&
      typeof employee.employeeId === "string" &&
      typeof employee.isAdmin === "boolean" &&
      typeof employee.isEmployed === "boolean" &&
      typeof employee.image === "string"
    );
  }

  const createEmployee = async (
    employee: Partial<Employee>
  ): Promise<{ success: boolean; message: string }> => {
    if (!isCompleteEmployee(employee)) {
      return { success: false, message: "Missing required employee fields" };
    }
    try {
      const newEmployee = await employeeApi.createEmployee(employee);

      console.log("newEmployee", newEmployee);
      if (!newEmployee.success) {
        throw new Error(newEmployee.message);
      }
      if (isCompleteEmployee(employee)) {
        setEmployees(prevEmployees => [...prevEmployees, employee as Employee]);
      }

      return newEmployee;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return { success: false, message: error.message };
      } else {
        // Return a generic error message if the caught error is not an Error object
        return { success: false, message: "An unknown error occurred" };
      }
    }
  };

  const updateEmployee = async (
    id: string,
    employee: Employee
  ): Promise<boolean> => {
    try {
      console.log("inside context", employee);

      const updatedEmployee = await employeeApi.updateEmployee(id, employee);
      if (updatedEmployee) {
        setEmployees(prevEmployees =>
          prevEmployees.map(emp => (emp.employeeId === id ? employee : emp))
        );
      }

      return updatedEmployee ? true : false;
    } catch (error) {
      console.error("Error updating employee:", error);
      throw error;
    }
  };

  const fetchEmployee = async (id: string): Promise<Employee> => {
    try {
      const employee = await employeeApi.getEmployee(id);

      if (employee) {
        return employee;
      } else {
        throw new Error("Employee not found");
      }
    } catch (error) {
      console.error("Error fetching employee:", error);
      throw error;
    }
  };

  const deleteEmployee = async (id: string) => {
    try {
      await employeeApi.deleteEmployee(id);

      setEmployees(prevEmployees =>
        prevEmployees.filter(employee => employee.employeeId !== id)
      );
      return true;
    } catch (error) {
      console.error("Error deleting employee:", error);
      return false;
    }
  };

  return (
    <EmployeeContext.Provider
      value={{
        employees,
        setEmployees,
        getEmployee,
        getEmployees,
        createEmployee,
        updateEmployee,
        fetchEmployee,
        deleteEmployee
      }}
    >
      {children}
    </EmployeeContext.Provider>
  );
};
