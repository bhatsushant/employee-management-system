"use client";
import { z } from "zod";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
    if (!location.state?.isEdit && !form.formState.isSubmitted) {
      form.reset(defaultValues);
      setIsDirty(false);
    }
  }, [location.state?.isEdit, form.formState.isSubmitted]);

  async function onSubmit(values: z.infer<typeof employeeSchema>) {
    try {
      const newEmployee = await createEmployee(values);

      if (newEmployee.success === false) {
        toast.error(
          typeof newEmployee.message === "string"
            ? newEmployee.message
            : "Error creating employee",
          {
            position: "top-right",
            autoClose: 2000,
            theme: "colored"
          }
        );
        return;
      } else {
        toast.success("Employee created successfully!", {
          position: "top-right",
          autoClose: 5000,
          theme: "colored"
        });
        form.reset(defaultValues);
        setIsDirty(false);
      }
    } catch (error) {
      console.error("Error creating employee:", error);
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (defaultValues[name as keyof Employee] !== value) {
      setIsDirty(true);
    }
  };

  async function handleEdit(id: string, values: Partial<Employee>) {
    try {
      const isValid = await form.trigger();
      if (!isValid) {
        return;
      }
      const updatedEmployee = await updateEmployee(id, values);

      if (!updatedEmployee.success) {
        toast.error(
          typeof updatedEmployee.message === "string"
            ? updatedEmployee.message
            : "Error updating employee",
          {
            position: "top-right",
            autoClose: 2000,
            theme: "colored"
          }
        );
        throw new Error("Error updating employee");
      }
      setIsDirty(false);

      toast.success("Employee updated successfully!", {
        position: "top-right",
        autoClose: 2000,
        theme: "colored"
      });
      form.reset({
        ...defaultValues,
        ...values
      });
    } catch (error) {
      console.error("Error updating employee:", error);
    }
  }

  return (
    <div className="flex flex-grow border-gray-400">
      <ToastContainer />
      <div className="flex w-full flex-col gap-y-0">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 mx-auto mt-16 max-w-4xl p-8 shadow-md rounded-lg"
          >
            <h1 className="flex text-3xl font-semibold mb-12 justify-center items-center">
              {}Employee Form
            </h1>
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

              <FormField
                control={form.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Birth</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="YYYY-MM-DD"
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

              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="YYYY-MM-DD"
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

              <FormField
                control={form.control}
                name="salary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Salary</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        {...field}
                        onChange={e => {
                          const newValue = Number(e.target.value);

                          field.onChange(newValue);
                          handleInputChange(e);
                        }}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            {!isEdit && (
              <div className="flex w-full justify-center items-center my-3">
                <Button type="submit">Submit</Button>
              </div>
            )}
            {isEdit && (
              <div className="flex justify-center items-center">
                <Button
                  type="button"
                  disabled={!isDirty}
                  onClick={() =>
                    handleEdit(
                      location.state.employee.employeeId,
                      form.getValues()
                    )
                  }
                >
                  Update Employee
                </Button>
              </div>
            )}
          </form>
        </Form>
      </div>
    </div>
  );
}
