import { createContext, useState, useContext } from "react";
import { Employee } from "@/models/employee";
import { EmployeeApi } from "@/data/api/employee";

interface EmployeeContextType {
  employees: Employee[];
  setEmployees: React.Dispatch<React.SetStateAction<Employee[]>>;
  getEmployees: () => Promise<Employee[]>;
  createEmployee: (employee: Employee) => Promise<Employee>; // Update return type here
  updateEmployee: (id: string, employee: Employee) => Promise<void>;
  getEmployee: (id: string) => Promise<void>;
  deleteEmployee: (id: string) => Promise<boolean>;
}

const EmployeeContext = createContext<EmployeeContextType>({
  employees: [],
  setEmployees: () => {},
  getEmployees: async () => {
    return [];
  },
  createEmployee: async (employee: Employee) => employee,
  updateEmployee: async () => {},
  getEmployee: async () => {},
  deleteEmployee: async () => false
});

export const useEmployeeContext = () => useContext(EmployeeContext);

export const EmployeeProvider: React.FC<{ children: React.ReactNode }> = ({
  children = null
}) => {
  const [employees, setEmployees] = useState<Employee[]>([]);

  const employeeApi = new EmployeeApi();

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

  const createEmployee = async (employee: Employee) => {
    try {
      console.log("inside context", employee);
      const newEmployee = await employeeApi.createEmployee(employee);

      if (!newEmployee) {
        throw new Error("Failed to create employee");
      }

      // Update the context with the new employee
      setEmployees(prevEmployees => [...prevEmployees, newEmployee]);
      return employee;
    } catch (error) {
      console.error("Error creating employee:", error);
      throw error; // Rethrow the error to handle it in the caller
    }
  };

  const updateEmployee = async (id: string, employee: Employee) => {
    try {
      await employeeApi.updateEmployee(id, employee);
      // You might want to update the state or perform other actions here
    } catch (error) {
      console.error("Error updating employee:", error);
    }
  };

  const getEmployee = async (id: string) => {
    try {
      const employee = await employeeApi.getEmployee(id);

      return employee;
      // You might want to update the state or perform other actions here
    } catch (error) {
      console.error("Error fetching employee:", error);
    }
  };

  const deleteEmployee = async (id: string) => {
    try {
      await employeeApi.deleteEmployee(id);
      setEmployees(prevEmployees =>
        prevEmployees.filter(employee => employee.employeeId !== id)
      );
      return true;
      // You might want to update the state or perform other actions here
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
        getEmployees,
        createEmployee,
        updateEmployee,
        getEmployee,
        deleteEmployee
      }}
    >
      {children}
    </EmployeeContext.Provider>
  );
};
