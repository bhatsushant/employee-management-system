import { createContext, useState, useContext } from "react";
import { Employee } from "@/models/employee";
import { EmployeeApi } from "@/data/api/employee";

function formatDate(dateString: string) {
  const date = new Date(dateString);
  const formattedDate = date.toISOString().split("T")[0];
  return formattedDate;
}

interface EmployeeContextType {
  employees: Employee[];
  setEmployees: React.Dispatch<React.SetStateAction<Employee[]>>;
  getEmployee: (id: string) => Employee | undefined;
  getEmployees: () => Promise<Employee[]>;
  createEmployee: (employee: Employee) => Promise<Employee>; // Update return type here
  updateEmployee: (id: string, employee: Employee) => Promise<boolean>;
  fetchEmployee: (id: string) => Promise<Employee>;
  deleteEmployee: (id: string) => Promise<boolean>;
}

const EmployeeContext = createContext<EmployeeContextType>({
  employees: [],
  setEmployees: () => {},
  getEmployee: (id: string) => undefined,
  getEmployees: async () => {
    return [];
  },
  createEmployee: async (employee: Employee) => employee,
  updateEmployee: async (id: string, employee: Employee) => false,
  fetchEmployee: async (id: string) => {
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
      throw error;
    }
  };

  const updateEmployee = async (
    id: string,
    employee: Employee
  ): Promise<boolean> => {
    try {
      console.log("inside context", employee);

      employee.startDate = formatDate(employee.startDate);
      employee.dateOfBirth = formatDate(employee.dateOfBirth);

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
