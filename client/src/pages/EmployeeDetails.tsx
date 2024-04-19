import * as React from "react";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Employee } from "@/models/employee";
import { Button } from "@/components/ui/button";
import ConfirmationModal from "@/components/ConfirmationModal";
import { useNavigate } from "react-router-dom";
import { useEmployeeContext } from "@/contexts/EmployeeContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function EmployeeDetails() {
  const { getEmployee, deleteEmployee } = useEmployeeContext();
  const location = useLocation();
  const navigate = useNavigate();

  const [employee, setEmployee] = useState<Employee | undefined>(undefined);
  const [showDeleteModal, setShowDeleteModal] = React.useState<boolean>(false);
  const [employeeToDelete, setEmployeeToDelete] =
    React.useState<Employee | null>(null);

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const receivedEmployee = location.state?.employee;

        if (!receivedEmployee) {
          console.error("Employee data not found in location state");
          return;
        }

        const employeeId = receivedEmployee.employeeId;
        const employeeData = getEmployee(employeeId);

        setEmployee(employeeData);
      } catch (error) {
        console.error("Error fetching employee:", error);
      }
    };

    fetchEmployeeData();
  }, [location.state, getEmployee]);

  const handleEditEmployee = (employee: Employee) => {
    navigate("/employee_form", { state: { employee, isEdit: true } });
  };

  const handleDeleteEmployee = (employee: Employee) => {
    setEmployeeToDelete(employee);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (employeeToDelete) {
      const deleted = await deleteEmployee(employeeToDelete.employeeId);
      if (!deleted.success) {
        toast.error(deleted.message, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          progress: undefined
        });
      } else {
        toast.success(deleted.message, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          progress: undefined
        });
        setEmployee(undefined);
        navigate("/dashboard");
      }

      setShowDeleteModal(false);
      setEmployeeToDelete(null);
    }
  };

  const closeModal = () => {
    setShowDeleteModal(false);
    setEmployeeToDelete(null);
  };

  if (!employee) {
    return <div className="text-red-600">Employee not found!</div>;
  }

  return (
    <div className="max-w-lg mx-auto shadow-md rounded px-8 pt-6 pb-8">
      <ToastContainer />
      <div className="mb-4">
        <img
          src={employee.image}
          alt="Employee Image"
          className="w-32 h-32 mt-5 object-cover rounded-full"
        />
      </div>

      <div className="mb-4">
        <strong className="mr-2">Employee ID:</strong> {employee.employeeId}
      </div>
      <div className="mb-4">
        <strong className="mr-2">First Name:</strong> {employee.firstName}
      </div>
      <div className="mb-4">
        <strong className="mr-2">Last Name:</strong> {employee.lastName}
      </div>
      <div className="mb-4">
        <strong className="mr-2">Email:</strong> {employee.email}
      </div>
      <div className="mb-4">
        <strong className="mr-2">Phone Number:</strong> {employee.phoneNumber}
      </div>
      <div className="mb-4">
        <strong className="mr-2">Address:</strong> {employee.address}
      </div>
      <div className="mb-4">
        <strong className="mr-2">Date of Birth:</strong> {employee.dateOfBirth}
      </div>
      <div className="mb-4">
        <strong className="mr-2">Department:</strong> {employee.department}
      </div>
      <div className="mb-4">
        <strong className="mr-2">Position:</strong> {employee.position}
      </div>
      <div className="mb-4">
        <strong className="mr-2">Supervisor:</strong> {employee.supervisor}
      </div>
      <div className="mb-4">
        <strong className="mr-2">Start Date:</strong> {employee.startDate}
      </div>
      <div className="mb-4">
        <strong className="mr-2">Salary($):</strong> {employee.salary}
      </div>
      <div className="mb-4">
        <strong className="mr-2">Is Admin:</strong>{" "}
        {employee.isAdmin ? "Yes" : "No"}
      </div>
      <div className="mb-4">
        <strong className="mr-2">Is Employed:</strong>{" "}
        {employee.isEmployed ? "Yes" : "No"}
      </div>

      <div className="w-full flex gap-x-7">
        <Button onClick={() => handleEditEmployee(employee)}>Edit</Button>
        <Button onClick={() => handleDeleteEmployee(employee)}>Delete</Button>
        <ConfirmationModal
          isOpen={showDeleteModal}
          onClose={closeModal}
          onConfirm={confirmDelete}
          message="Are you sure you want to delete this employee?"
        />
      </div>
    </div>
  );
}

export default EmployeeDetails;
