import { z } from "zod";

export const employeeSchema = z.object({
  email: z.string().email(),
  firstName: z
    .string()
    .min(2)
    .max(18, { message: "First name must be between 2 and 18 characters" }),
  lastName: z
    .string()
    .min(2)
    .max(18, { message: "Last name must be between 2 and 18 characters" }),
  phoneNumber: z
    .string()
    .min(10)
    .max(15)
    .regex(/^\([0-9]{3}\) [0-9]{3}-[0-9]{4}$/, {
      message: "Invalid phone number"
    }),
  address: z
    .string()
    .min(5)
    .max(100, { message: "Address must be between 5 and 100 characters" }),
  dateOfBirth: z
    .string()
    .regex(/^\d{2}-\d{2}-\d{4}$/, { message: "Date must be in MM-DD-YYYY" }),
  department: z
    .string()
    .min(2)
    .max(50, { message: "Department must be between 2 and 50 characters" }),
  position: z
    .string()
    .min(2)
    .max(50, { message: "Position must be between 2 and 50 characters" }),
  supervisor: z
    .string()
    .min(2)
    .max(50, { message: "Supervisor must be between 2 and 50 characters" }),
  startDate: z
    .string()
    .regex(/^\d{2}-\d{2}-\d{4}$/, { message: "Date must be in MM-DD-YYYY" }),
  salary: z
    .number()
    .int()
    .min(0, { message: "Salary must be a positive number" })
});

export interface Employee {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: string;
  dateOfBirth: string;
  department: string;
  position: string;
  supervisor: string;
  startDate: string;
  salary: number;
  employeeId: string;
  isAdmin: boolean;
  isEmployed: boolean;
  image: string;
}
