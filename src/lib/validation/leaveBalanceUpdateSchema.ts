// // src/lib/validation/leaveBalanceUpdateSchema.ts
// import { z } from 'zod';

// export const leaveBalanceUpdateSchema = z.object({
//   earned: z.preprocess(
//       (val) => (val === '' ? undefined : Number(val)), // Convert empty string to undefined, else number
//       z.number({ invalid_type_error: "Must be a number" }).min(0, "Cannot be negative").optional()
//   ),
//   sick: z.preprocess(
//       (val) => (val === '' ? undefined : Number(val)),
//       z.number({ invalid_type_error: "Must be a number" }).min(0, "Cannot be negative").optional()
//   ),
//   casual: z.preprocess(
//       (val) => (val === '' ? undefined : Number(val)),
//       z.number({ invalid_type_error: "Must be a number" }).min(0, "Cannot be negative").optional()
//   ),
// })
// // Ensure at least one field is provided
// .refine(data => data.earned !== undefined || data.sick !== undefined || data.casual !== undefined, {
//     message: "At least one leave type balance must be provided.",
//     // Path can be tricky for form-level errors, might need manual display
// });


// export type LeaveBalanceUpdateSchema = z.infer<typeof leaveBalanceUpdateSchema>;



// src/lib/validation/leaveBalanceUpdateSchema.ts
import { z } from 'zod';

const numberFromInput = z.preprocess(
  (val) => (val === '' || val == null ? undefined : Number(val)),
  z.number({ error: () => 'Please enter a valid number.' }).min(0, { message: 'Cannot be negative.' })
);

export const leaveBalanceUpdateSchema = z.object({
  earned: numberFromInput.optional(),
  sick: numberFromInput.optional(),
  casual: numberFromInput.optional(),
}).refine(
  (d) => d.earned !== undefined || d.sick !== undefined || d.casual !== undefined,
  { message: 'At least one leave type balance must be provided.' }
);

// Types for RHF generics
export type LeaveBalanceUpdateInput = z.input<typeof leaveBalanceUpdateSchema>;   // { earned?: unknown; ... }
export type LeaveBalanceUpdateOutput = z.output<typeof leaveBalanceUpdateSchema>; // { earned?: number; ... }
