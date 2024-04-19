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
  updateEmployee: (
    id: string,
    employee: Partial<Employee>
  ) => Promise<{ success: boolean; message: string }>;
  fetchEmployee: (id: string) => Promise<Employee>;
  deleteEmployee: (
    id: string
  ) => Promise<{ success: boolean; message: string }>;
}

const EmployeeContext = createContext<EmployeeContextType>({
  employees: [],
  setEmployees: () => {},
  getEmployee: () => undefined,
  getEmployees: async () => {
    return [];
  },
  createEmployee: async () => ({ success: false, message: "" }),
  updateEmployee: async () => ({ success: false, message: "" }),
  fetchEmployee: async () => {
    return {} as Employee;
  },
  deleteEmployee: async () => ({ success: false, message: "" })
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

  function isPartialEmployee(
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
    try {
      const newEmployee = await employeeApi.createEmployee(employee);
      if (!newEmployee.success) {
        throw new Error(newEmployee.message);
      }
      if (isPartialEmployee(employee)) {
        setEmployees(prevEmployees => [...prevEmployees, employee as Employee]);
      }

      return newEmployee;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return { success: false, message: error.message };
      } else {
        return { success: false, message: "An unknown error occurred" };
      }
    }
  };

  const updateEmployee = async (
    id: string,
    employee: Partial<Employee>
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const updatedEmployee = await employeeApi.updateEmployee(id, employee);
      if (updatedEmployee) {
        setEmployees(prevEmployees =>
          prevEmployees.map(emp =>
            emp.employeeId === id ? (employee as Employee) : emp
          )
        );
      }

      return updatedEmployee;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return { success: false, message: error.message };
      } else {
        return { success: false, message: "An unknown error occurred" };
      }
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

  const deleteEmployee = async (
    id: string
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const isDeleted = await employeeApi.deleteEmployee(id);

      if (!isDeleted) {
        throw new Error("Failed to delete employee");
      }
      setEmployees(prevEmployees =>
        prevEmployees.filter(employee => employee.employeeId !== id)
      );
      return isDeleted;
    } catch (error) {
      console.error("Error deleting employee:", error);
      return { success: false, message: "Failed to delete employee" };
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
