// src/lib/validation/payslipGenerateSchema.ts
import { z } from 'zod';

const currentYear = new Date().getFullYear();
const toNumberOrUndef = (val: unknown) => (val === '' ? undefined : Number(val));

export const payslipGenerateSchema = z.object({
  employeeId: z.string().min(1, { message: 'Employee selection is required.' }),
  month: z.preprocess(
    toNumberOrUndef,
    z.number().int().min(1, { message: 'Month must be between 1 and 12.' }).max(12, { message: 'Month must be between 1 and 12.' })
  ),
  year: z.preprocess(
    toNumberOrUndef,
    z.number().int().min(2000, { message: 'Year must be 2000 or later.' }).max(currentYear + 1, { message: `Year cannot be more than ${currentYear + 1}.` })
  ),
});

export type PayslipGenerateInput = z.input<typeof payslipGenerateSchema>;   // form input type
export type PayslipGenerateSchema = z.infer<typeof payslipGenerateSchema>;  // parsed output type
