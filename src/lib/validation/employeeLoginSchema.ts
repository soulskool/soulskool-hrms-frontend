// src/lib/validation/employeeLoginSchema.ts
import { z } from 'zod';

export const employeeLoginSchema = z.object({
  employeeId: z.string().min(1, { message: 'Employee ID is required' }),
  password: z.string().min(1, { message: 'Password is required' }), // Basic check, backend verifies actual password
});

export type EmployeeLoginSchema = z.infer<typeof employeeLoginSchema>;