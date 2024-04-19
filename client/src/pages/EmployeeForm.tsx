"use client";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { employeeSchema, Employee } from "@/models/employee";
import { useEmployeeContext } from "@/contexts/EmployeeContext";
import { useLocation } from "react-router-dom";

export function EmployeeForm() {
  const location = useLocation();
  const { createEmployee, getEmployee, updateEmployee } = useEmployeeContext();
  const isEdit = location.state?.isEdit || false;
  const [isDirty, setIsDirty] = useState(false);

  let defaultValues: Partial<Employee> = {
    email: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    address: "",
    dateOfBirth: "",
    department: "",
    position: "",
    supervisor: "",
    startDate: "",
    salary: 0,
    employeeId: ""
  };

  if (isEdit) {
    const employeeId = location.state?.employee?.employeeId;
    if (employeeId) {
      const employee = getEmployee(employeeId);
      if (employee) {
        defaultValues = {
          ...defaultValues,
          ...employee
        };
      }
    } else {
      console.error("No employee ID provided in location state");
    }
  }

  const form = useForm<Employee>({
    resolver: zodResolver(employeeSchema),
    defaultValues: defaultValues
  });

  useEffect(() => {
    if (!isEdit) {
      form.reset(defaultValues);
      setIsDirty(false);
    }
  }, [isEdit, form]);

  const onSubmit = async (data: Employee) => {
    try {
      console.log("tanay");
      console.log("onsubmit data", data);
      const newEmployee = await createEmployee(data);
      console.log("returned data from api", newEmployee);

      if (newEmployee) {
        toast("Employee created successfully!");
      }
    } catch (error) {
      console.error("Error creating employee:", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (defaultValues[name as keyof Employee] !== value) {
      setIsDirty(true);
    }
  };

  const handleEdit = (id: string, data: Employee) => async () => {
    try {
      const updatedEmployee = await updateEmployee(id, data);
      console.log("returned data from api", updatedEmployee);

      if (updatedEmployee === true) {
        form.reset(defaultValues);
        setIsDirty(false);

        toast.success("Employee updated successfully!", {
          position: "top-right",
          autoClose: 2000,
          theme: "colored"
        });
        console.log("Employee updated successfully!");
      }
    } catch (error) {
      console.error("Error updating employee:", error);
    }
  };

  return (
    <div className="flex flex-col gap-y-7">
      {isEdit && (
        <ToastContainer className="fixed top-0 right-0 z-50 mt-6 mr-6 size-20" />
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex flex-wrap max-w-screen-sm gap-6 mx-auto my-16">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="John"
                      {...field}
                      onChange={e => {
                        handleInputChange(e);
                        field.onChange(e);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Last Name field */}
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Doe"
                      {...field}
                      onChange={e => {
                        handleInputChange(e);
                        field.onChange(e);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Email field */}
            <div className="w-1/2 ml-8">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="example@example.com"
                        {...field}
                        onChange={e => {
                          handleInputChange(e);
                          field.onChange(e);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {/* Phone Number field */}
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="123-456-7890"
                      {...field}
                      onChange={e => {
                        handleInputChange(e);
                        field.onChange(e);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Address field */}
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="123 Main St"
                      {...field}
                      onChange={e => {
                        handleInputChange(e);
                        field.onChange(e);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Date of Birth field */}
            <FormField
              control={form.control}
              name="dateOfBirth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date of Birth</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="MM/DD/YYYY"
                      {...field}
                      onChange={e => {
                        handleInputChange(e);
                        field.onChange(e);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Department field */}
            <FormField
              control={form.control}
              name="department"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Engineering"
                      {...field}
                      onChange={e => {
                        handleInputChange(e);
                        field.onChange(e);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Position field */}
            <FormField
              control={form.control}
              name="position"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Position</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Software Engineer"
                      {...field}
                      onChange={e => {
                        handleInputChange(e);
                        field.onChange(e);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Supervisor field */}
            <FormField
              control={form.control}
              name="supervisor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Supervisor</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Jane Doe"
                      {...field}
                      onChange={e => {
                        handleInputChange(e);
                        field.onChange(e);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Start Date field */}
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Date</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="MM/DD/YYYY"
                      {...field}
                      onChange={e => {
                        handleInputChange(e);
                        field.onChange(e);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Salary field */}
            <FormField
              control={form.control}
              name="salary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Salary</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={e => {
                        handleInputChange(e);
                        field.onChange(e);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {isEdit && isDirty && (
            <div className="flex w-full justify-center items-center my-3">
              <Button
                onClick={handleEdit(
                  location.state.employee.employeeId,
                  form.getValues() as Employee
                )}
              >
                Update
              </Button>
            </div>
          )}

          {!isEdit && (
            <div className="flex w-full justify-center items-center my-3">
              <Button type="submit">Submit</Button>
            </div>
          )}
        </form>
      </Form>
    </div>
  );
}
