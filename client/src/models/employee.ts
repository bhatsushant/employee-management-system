import { z } from "zod";

export const employeeSchema = z.object({
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  phoneNumber: z.string(),
  address: z.string(),
  dateOfBirth: z.string(),
  department: z.string(),
  position: z.string(),
  supervisor: z.string(),
  startDate: z.string(),
  salary: z.number().int().min(0)
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
