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
    .regex(/^(?:\(\d{3}\)\s*\d{4}\s*\d{3}|\(\d{3}\)\s*\d{3}-\d{4}|\d{10})$/, {
      message: "Invalid phone number"
    }),
  address: z
    .string()
    .min(5)
    .max(100, { message: "Address must be between 5 and 100 characters" }),
  dateOfBirth: z
    .string()
    .regex(
      /[1-9][0-9][0-9]{2}-([0][1-9]|[1][0-2])-([1-2][0-9]|[0][1-9]|[3][0-1])/gm,
      {
        message: "Date must be in YYYY-MM-DD format"
      }
    ),
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
    .regex(
      /[1-9][0-9][0-9]{2}-([0][1-9]|[1][0-2])-([1-2][0-9]|[0][1-9]|[3][0-1])/gm,
      {
        message: "Date must be in YYYY-MM-DD format"
      }
    ),
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
