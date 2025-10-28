// // src/components/employee/ApplyLeaveForm.tsx
// "use client";

// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { leaveApplySchema, LeaveApplySchema } from '../../lib/validation/leaveApplySchema';
// import { useDispatch, useSelector } from 'react-redux';
// import { AppDispatch, RootState } from '../../lib/redux/store';
// import { applyForLeave } from '../../lib/redux/slices/leaveSlice';
// import toast from 'react-hot-toast';
// import { Loader2, Send } from 'lucide-react';

// export default function ApplyLeaveForm() {
//     const dispatch = useDispatch<AppDispatch>();
//     const { loadingAction, error } = useSelector((state: RootState) => state.leave);

//     const { register, handleSubmit, reset, formState: { errors } } = useForm<LeaveApplySchema>({
//         resolver: zodResolver(leaveApplySchema),
//          defaultValues: {
//             leaveType: '', fromDate: '', toDate: '', fromSession: '', toSession: '', reason: '', applyingTo: ''
//         }
//     });

//     const onSubmit = (data: LeaveApplySchema) => {
//         // Type assertion needed as Zod enum doesn't include ''
//         dispatch(applyForLeave(data as Required<LeaveApplySchema>))
//             .unwrap()
//             .then(() => {
//                 toast.success('Leave request submitted successfully!');
//                 reset(); // Clear form on success
//             })
//             .catch((errMessage) => {
//                 toast.error(errMessage || 'Failed to submit request');
//             });
//     };

//     return (
//         <div className="bg-white rounded-lg shadow p-6 max-w-2xl mx-auto">
//             <h2 className="text-xl font-semibold text-gray-800 mb-6">Apply for Leave</h2>
//             {error && !loadingAction && <p className='text-red-500 text-sm mb-4'>{error}</p>}
//             <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//                 {/* Leave Type */}
//                 <div>
//                     <label className="form-label">Leave Type*</label>
//                     <select {...register("leaveType")} className={`input ${errors.leaveType ? 'border-red-500' : ''}`}>
//                         <option value="">Select Leave Type...</option>
//                         <option value="earned">Earned Leave</option>
//                         <option value="sick">Sick Leave</option>
//                         <option value="casual">Casual Leave</option>
//                     </select>
//                     {errors.leaveType && <p className="error-text">{errors.leaveType.message}</p>}
//                 </div>

//                 {/* Dates */}
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                     <div>
//                         <label className="form-label">From Date*</label>
//                         <input type="date" {...register("fromDate")} className={`input ${errors.fromDate ? 'border-red-500' : ''}`} />
//                         {errors.fromDate && <p className="error-text">{errors.fromDate.message}</p>}
//                     </div>
//                      <div>
//                         <label className="form-label">To Date*</label>
//                         <input type="date" {...register("toDate")} className={`input ${errors.toDate ? 'border-red-500' : ''}`} />
//                         {errors.toDate && <p className="error-text">{errors.toDate.message}</p>}
//                     </div>
//                 </div>

//                  {/* Sessions */}
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                     <div>
//                         <label className="form-label">From Session*</label>
//                         <select {...register("fromSession")} className={`input ${errors.fromSession ? 'border-red-500' : ''}`}>
//                             <option value="">Select Session...</option>
//                             <option value="Session 1">Session 1 (First Half)</option>
//                             <option value="Session 2">Session 2 (Second Half)</option>
//                         </select>
//                         {errors.fromSession && <p className="error-text">{errors.fromSession.message}</p>}
//                     </div>
//                      <div>
//                         <label className="form-label">To Session*</label>
//                         <select {...register("toSession")} className={`input ${errors.toSession ? 'border-red-500' : ''}`}>
//                              <option value="">Select Session...</option>
//                             <option value="Session 1">Session 1 (First Half)</option>
//                             <option value="Session 2">Session 2 (Second Half)</option>
//                         </select>
//                         {errors.toSession && <p className="error-text">{errors.toSession.message}</p>}
//                     </div>
//                 </div>

//                  {/* Applying To (Optional) */}
//                  <div>
//                     <label className="form-label">Applying To (Manager Name/ID)</label>
//                     <input {...register("applyingTo")} className="input" placeholder="Optional"/>
//                 </div>

//                  {/* Reason */}
//                  <div>
//                     <label className="form-label">Reason*</label>
//                     <textarea {...register("reason")} rows={3} className={`input ${errors.reason ? 'border-red-500' : ''}`} placeholder="Briefly explain the reason for leave..."></textarea>
//                     {errors.reason && <p className="error-text">{errors.reason.message}</p>}
//                 </div>

//                 {/* Submit Button */}
//                 <div className="pt-2">
//                     <button type="submit" disabled={loadingAction} className="w-full sm:w-auto btn-primary flex items-center justify-center space-x-2 px-6">
//                          {loadingAction ? <Loader2 className="animate-spin" size={18}/> : <Send size={18}/>}
//                          <span>{loadingAction ? 'Submitting...' : 'Submit Request'}</span>
//                     </button>
//                 </div>
//             </form>
//         </div>
//     );
// }


// src/components/employee/ApplyLeaveForm.tsx
"use client";

import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { leaveApplySchema } from '../../lib/validation/leaveApplySchema';
import { z } from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../lib/redux/store';
import { applyForLeave } from '../../lib/redux/slices/leaveSlice';
import toast from 'react-hot-toast';
import { Loader2, Send } from 'lucide-react';

type SchemaInput = z.input<typeof leaveApplySchema>;
type SchemaOutput = z.output<typeof leaveApplySchema>;

export default function ApplyLeaveForm() {
  const dispatch = useDispatch<AppDispatch>();
  const { loadingAction, error } = useSelector((state: RootState) => state.leave);

  const { control, register, handleSubmit, reset, formState: { errors } } = useForm<SchemaInput, unknown, SchemaOutput>({
    resolver: zodResolver(leaveApplySchema),
    // undefined instead of ''
    defaultValues: {
      leaveType: undefined,
      fromDate: '',
      toDate: '',
      fromSession: undefined,
      toSession: undefined,
      reason: '',
      applyingTo: '',
    },
  });

  const onSubmit: SubmitHandler<SchemaOutput> = (data) => {
    dispatch(applyForLeave(data))
      .unwrap()
      .then(() => {
        toast.success('Leave request submitted successfully!');
        reset();
      })
      .catch((errMessage) => {
        toast.error(errMessage || 'Failed to submit request');
      });
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Apply for Leave</h2>
      {error && !loadingAction && <p className='text-red-500 text-sm mb-4'>{error}</p>}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="form-label">Leave Type*</label>
          <Controller
            control={control}
            name="leaveType"
            render={({ field }) => (
              <select
                className={`input ${errors.leaveType ? 'border-red-500' : ''}`}
                value={field.value ?? ''}
                onChange={(e) => field.onChange(e.target.value === '' ? undefined : e.target.value)}
              >
                <option value="">Select Leave Type...</option>
                <option value="earned">Earned Leave</option>
                <option value="sick">Sick Leave</option>
                <option value="casual">Casual Leave</option>
              </select>
            )}
          />
          {errors.leaveType && <p className="error-text">{errors.leaveType.message as string}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="form-label">From Date*</label>
            <input type="date" {...register("fromDate")} className={`input ${errors.fromDate ? 'border-red-500' : ''}`} />
            {errors.fromDate && <p className="error-text">{errors.fromDate.message as string}</p>}
          </div>
          <div>
            <label className="form-label">To Date*</label>
            <input type="date" {...register("toDate")} className={`input ${errors.toDate ? 'border-red-500' : ''}`} />
            {errors.toDate && <p className="error-text">{errors.toDate.message as string}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="form-label">From Session*</label>
            <Controller
              control={control}
              name="fromSession"
              render={({ field }) => (
                <select
                  className={`input ${errors.fromSession ? 'border-red-500' : ''}`}
                  value={field.value ?? ''}
                  onChange={(e) => field.onChange(e.target.value === '' ? undefined : e.target.value)}
                >
                  <option value="">Select Session...</option>
                  <option value="Session 1">Session 1 (First Half)</option>
                  <option value="Session 2">Session 2 (Second Half)</option>
                </select>
              )}
            />
            {errors.fromSession && <p className="error-text">{errors.fromSession.message as string}</p>}
          </div>
          <div>
            <label className="form-label">To Session*</label>
            <Controller
              control={control}
              name="toSession"
              render={({ field }) => (
                <select
                  className={`input ${errors.toSession ? 'border-red-500' : ''}`}
                  value={field.value ?? ''}
                  onChange={(e) => field.onChange(e.target.value === '' ? undefined : e.target.value)}
                >
                  <option value="">Select Session...</option>
                  <option value="Session 1">Session 1 (First Half)</option>
                  <option value="Session 2">Session 2 (Second Half)</option>
                </select>
              )}
            />
            {errors.toSession && <p className="error-text">{errors.toSession.message as string}</p>}
          </div>
        </div>

        <div>
          <label className="form-label">Applying To (Manager Name/ID)</label>
          <input {...register("applyingTo")} className="input" placeholder="Optional" />
        </div>

        <div>
          <label className="form-label">Reason*</label>
          <textarea
            {...register("reason")}
            rows={3}
            className={`input ${errors.reason ? 'border-red-500' : ''}`}
            placeholder="Briefly explain the reason for leave..."
          />
          {errors.reason && <p className="error-text">{errors.reason.message as string}</p>}
        </div>

        <div className="pt-2">
          <button type="submit" disabled={loadingAction} className="w-full sm:w-auto btn-primary flex items-center justify-center space-x-2 px-6">
            {loadingAction ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
            <span>{loadingAction ? 'Submitting...' : 'Submit Request'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
