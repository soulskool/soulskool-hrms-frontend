// // src/lib/validation/leaveApplySchema.ts
// import { z } from 'zod';

// // Get today's date in YYYY-MM-DD format, considering local timezone
// const getTodayString = () => {
//     const today = new Date();
//     const offset = today.getTimezoneOffset();
//     const localToday = new Date(today.getTime() - (offset*60*1000));
//     return localToday.toISOString().split('T')[0];
// };

// export const leaveApplySchema = z.object({
//   leaveType: z.enum(['earned', 'sick', 'casual'], { required_error: 'Leave type is required.' }),
//   fromDate: z.string().min(1, { message: 'From date is required.' }),
//   toDate: z.string().min(1, { message: 'To date is required.' }),
//   fromSession: z.enum(['Session 1', 'Session 2'], { required_error: 'From session is required.' }),
//   toSession: z.enum(['Session 1', 'Session 2'], { required_error: 'To session is required.' }),
//   reason: z.string().min(5, { message: 'Reason must be at least 5 characters.' }).max(200, { message: 'Reason cannot exceed 200 characters.'}),
//   applyingTo: z.string().optional(), // Optional field
// })
// // Add refinement to check if toDate is after or same as fromDate
// .refine(data => {
//     if (data.fromDate && data.toDate) {
//         return new Date(data.toDate) >= new Date(data.fromDate);
//     }
//     return true; // Pass if dates aren't set yet
// }, {
//     message: "To date cannot be earlier than from date.",
//     path: ["toDate"], // Attach error to the 'toDate' field
// })
// // Add refinement for sessions on the same day
// .refine(data => {
//      if (data.fromDate && data.toDate && data.fromDate === data.toDate) {
//          // If same day, From Session 2 to Session 1 is invalid
//          return !(data.fromSession === 'Session 2' && data.toSession === 'Session 1');
//      }
//      return true;
// }, {
//     message: "Cannot select Session 2 to Session 1 on the same day.",
//     path: ["toSession"],
// });


// export type LeaveApplySchema = z.infer<typeof leaveApplySchema>;



// src/lib/validation/leaveApplySchema.ts
import { z } from 'zod';

// Keep if needed elsewhere
const getTodayString = () => {
  const today = new Date();
  const offset = today.getTimezoneOffset();
  const localToday = new Date(today.getTime() - (offset * 60 * 1000));
  return localToday.toISOString().split('T')[0];
};


const SessionEnum = z.enum(['Session 1', 'Session 2'] as const, {
  error: () => 'Please select a session.',
});

const LeaveTypeEnum = z.enum(['earned', 'sick', 'casual'] as const, {
  error: () => 'Please select a leave type.',
});

// Zod v4-compatible enum definitions (no required_error)
export const leaveApplySchema = z.object({
  leaveType: LeaveTypeEnum,
  fromDate: z.string().min(1, { message: 'From date is required.' }),
  toDate: z.string().min(1, { message: 'To date is required.' }),
  fromSession: SessionEnum,
  toSession: SessionEnum,
  reason: z.string().min(5, { message: 'Reason must be at least 5 characters.' }).max(200, { message: 'Reason cannot exceed 200 characters.' }),
  applyingTo: z.string().optional(),
})
.refine(data => {
  if (data.fromDate && data.toDate) {
    return new Date(data.toDate) >= new Date(data.fromDate);
  }
  return true;
}, {
  message: "To date cannot be earlier than from date.",
  path: ["toDate"],
})
.refine(data => {
  if (data.fromDate && data.toDate && data.fromDate === data.toDate) {
    return !(data.fromSession === 'Session 2' && data.toSession === 'Session 1');
  }
  return true;
}, {
  message: "Cannot select Session 2 to Session 1 on the same day.",
  path: ["toSession"],
});
