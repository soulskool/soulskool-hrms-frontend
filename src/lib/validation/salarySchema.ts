//  // src/lib/validation/salarySchema.ts


// // salarySchema uses preprocess/transform or a safe coerce
// import { z } from "zod";

// const toNumberOrUndef = (val: unknown) => val === "" ? undefined : Number(val);

// export const salarySchema = z.object({
//   employeeId: z.string().min(1, { message: "Employee selection is required." }),
//   monthlySalary: z.preprocess(
//     toNumberOrUndef,
//     z.number().positive({ message: "Salary must be positive." })
//   ),
//   professionalTax: z.preprocess(
//     toNumberOrUndef,
//     z.number().min(0, { message: "Tax cannot be negative." })
//   ),
// });
// // For form input type:
// export type SalarySchemaInput = z.input<typeof salarySchema>;
// // For output (parsed data):
// export type SalarySchema = z.infer<typeof salarySchema>;


// src/lib/validation/salarySchema.ts
import { z } from "zod";

const toNumberOrUndef = (val: unknown) =>
  val === "" || val === null || val === undefined ? undefined : Number(val);

export const salarySchema = z.object({
  employeeId: z.string().min(1, { message: "Employee selection is required." }), // v4 still allows message here [web:38]
  monthlySalary: z.preprocess(
    toNumberOrUndef,
    z
      .number()
      .positive({ message: "Salary must be positive." }) // v4: use validators for messages [web:38]
      .or(z.never()) // keeps type narrow for number only; optional because preprocess may yield undefined
  ).refine((v) => v !== undefined, { message: "Monthly salary is required." }), // emulate required in v4 [web:24][web:38]
  professionalTax: z.preprocess(
    toNumberOrUndef,
    z
      .number()
      .min(0, { message: "Tax cannot be negative." })
      .or(z.never())
  ).refine((v) => v !== undefined, { message: "Professional tax is required." }), // required check after preprocess [web:24][web:38],
  bankDetails: z
    .object({
      bankName: z.string().optional(),
      accountNumber: z.string().optional(),
      ifscCode: z.string().optional(),
      branchName: z.string().optional(),
      accountType: z.enum(["", "Savings", "Current", "Other"]).optional(),
      paymentType: z.enum(["", "Account Transfer", "Cheque", "Cash", "Other"]).optional(),
      nameAsPerBank: z.string().optional(),
    })
    .optional(),
});

// Input vs Output types
export type SalarySchemaInput = z.input<typeof salarySchema>;
export type SalarySchema = z.infer<typeof salarySchema>;
