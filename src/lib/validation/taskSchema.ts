// src/lib/validation/taskSchema.ts
import { z } from 'zod';

// Base schema for common fields
const baseTaskSchema = z.object({
  taskName: z.string().min(3, { message: 'Task name must be at least 3 characters.' }).max(100, { message: 'Task name cannot exceed 100 characters.'}),
  description: z.string().max(500, { message: 'Description cannot exceed 500 characters.' }).optional(),
  priority: z.enum(['Low', 'Medium', 'High']).optional(),
  dueDate: z.string().optional(), // String because input type="date"
  tags: z.string().optional(), // Comma-separated string from input
});

// Schema for employee creating/editing their own task
export const employeeTaskSchema = baseTaskSchema;
export type EmployeeTaskSchema = z.infer<typeof employeeTaskSchema>;

// Schema for admin creating/editing task (requires assignee)
export const adminTaskSchema = baseTaskSchema.extend({
    assigneeEmployeeId: z.string().min(1, { message: 'Assignee Employee ID is required.' })
});
export type AdminTaskSchema = z.infer<typeof adminTaskSchema>;