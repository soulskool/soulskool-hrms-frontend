// // src/components/admin/UpdateBalanceModal.tsx
// "use client";

// import { useEffect } from 'react';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { leaveBalanceUpdateSchema, LeaveBalanceUpdateSchema } from '../../lib/validation/leaveBalanceUpdateSchema';
// import { useDispatch, useSelector } from 'react-redux';
// import { AppDispatch, RootState } from '../../lib/redux/store';
// import { updateEmployeeBalance } from '../../lib/redux/slices/adminLeaveSlice';
// import toast from 'react-hot-toast';
// import { Loader2, Save, X } from 'lucide-react';

// interface Props {
//   isOpen: boolean;
//   onClose: () => void;
// }

// export default function UpdateBalanceModal({ isOpen, onClose }: Props) {
//     const dispatch = useDispatch<AppDispatch>();
//     const { selectedEmployeeBalance, loadingAction, error } = useSelector((state: RootState) => state.adminLeave);

//     const { register, handleSubmit, reset, formState: { errors } } = useForm<LeaveBalanceUpdateSchema>({
//         resolver: zodResolver(leaveBalanceUpdateSchema),
//     });

//     // Populate form when selectedEmployeeBalance changes
//     useEffect(() => {
//         if (selectedEmployeeBalance) {
//             reset({
//                 earned: selectedEmployeeBalance.leaveBalances?.earned,
//                 sick: selectedEmployeeBalance.leaveBalances?.sick,
//                 casual: selectedEmployeeBalance.leaveBalances?.casual,
//             });
//         } else {
//             reset({ earned: undefined, sick: undefined, casual: undefined }); 
//         }
//     }, [selectedEmployeeBalance, reset]);

//     const onSubmit = (data: LeaveBalanceUpdateSchema) => {
//         if (!selectedEmployeeBalance) return;

//         // Filter out undefined values before sending
//         const balancesToUpdate = {
//             ...(data.earned !== undefined && { earned: data.earned }),
//             ...(data.sick !== undefined && { sick: data.sick }),
//             ...(data.casual !== undefined && { casual: data.casual }),
//         };

//          if (Object.keys(balancesToUpdate).length === 0) {
//             toast.error("Please enter at least one balance value to update.");
//             return;
//         }


//         dispatch(updateEmployeeBalance({ employeeId: selectedEmployeeBalance._id, balances: balancesToUpdate }))
//             .unwrap()
//             .then(() => {
//                 toast.success('Balances updated successfully!');
//                 onClose();
//             })
//             .catch((err) => toast.error(err || 'Failed to update balances'));
//     };

//     if (!isOpen || !selectedEmployeeBalance) return null;

//     return (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
//           <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
//             <div className="p-4 border-b flex justify-between items-center">
//               <div>
//                 <h2 className="text-lg font-semibold text-gray-800">Update Leave Balances</h2>
//                 <p className="text-sm text-gray-500">{selectedEmployeeBalance.employeeInfo.name} ({selectedEmployeeBalance.employeeInfo.employeeId})</p>
//               </div>
//               <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20}/></button>
//             </div>

//             <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
//               {error && <p className='text-red-500 text-sm'>{error}</p>}
//               {errors.root && <p className="error-text">{errors.root.message}</p>} {/* For form-level errors */}

//               <BalanceInput label="Earned Leave" name="earned" register={register} errors={errors} />
//               <BalanceInput label="Sick Leave" name="sick" register={register} errors={errors} />
//               <BalanceInput label="Casual Leave" name="casual" register={register} errors={errors} />

//               <div className="pt-4 flex justify-end space-x-2">
//                 <button type="button" onClick={onClose} className="btn-secondary" disabled={loadingAction}>Cancel</button>
//                 <button type="submit" disabled={loadingAction} className="btn-primary flex items-center space-x-2">
//                     {loadingAction ? <Loader2 className="animate-spin" size={16}/> : <Save size={16}/>}
//                     <span>{loadingAction ? 'Saving...' : 'Save Changes'}</span>
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       );
// }

// // Helper component for balance inputs
// interface BalanceInputProps {
//     label: string;
//     name: keyof LeaveBalanceUpdateSchema;
//     register: any; // Type from react-hook-form UseFormRegister
//     errors: any; // Type from react-hook-form FieldErrors
// }
// const BalanceInput: React.FC<BalanceInputProps> = ({ label, name, register, errors }) => (
//     <div>
//         <label htmlFor={name} className="form-label">{label}</label>
//         <input
//             id={name}
//             type="number"
//             step="0.5" // Allow half days
//             min="0"
//             {...register(name)}
//             className={`input ${errors[name] ? 'border-red-500' : ''}`}
//             placeholder="Enter new balance"
//         />
//         {errors[name] && <p className="error-text">{errors[name].message}</p>}
//     </div>
// );





// src/components/admin/UpdateBalanceModal.tsx
"use client";

import { useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  leaveBalanceUpdateSchema,
} from '../../lib/validation/leaveBalanceUpdateSchema';
import { z } from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../lib/redux/store';
import { updateEmployeeBalance } from '../../lib/redux/slices/adminLeaveSlice';
import toast from 'react-hot-toast';
import { Loader2, Save, X } from 'lucide-react';

type LeaveBalanceUpdateInput = z.input<typeof leaveBalanceUpdateSchema>;
type LeaveBalanceUpdateOutput = z.output<typeof leaveBalanceUpdateSchema>;

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function UpdateBalanceModal({ isOpen, onClose }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const { selectedEmployeeBalance, loadingAction, error } = useSelector((s: RootState) => s.adminLeave);

  const { register, handleSubmit, reset, formState: { errors } } =
    useForm<LeaveBalanceUpdateInput, unknown, LeaveBalanceUpdateOutput>({
      // Important: no generics on zodResolver; all generics go on useForm
      resolver: zodResolver(leaveBalanceUpdateSchema),
      defaultValues: {
        earned: undefined,
        sick: undefined,
        casual: undefined,
      },
    });

  useEffect(() => {
    if (selectedEmployeeBalance) {
      reset({
        earned: selectedEmployeeBalance.leaveBalances?.earned,
        sick: selectedEmployeeBalance.leaveBalances?.sick,
        casual: selectedEmployeeBalance.leaveBalances?.casual,
      });
    } else {
      reset({ earned: undefined, sick: undefined, casual: undefined });
    }
  }, [selectedEmployeeBalance, reset]);

  const onSubmit: SubmitHandler<LeaveBalanceUpdateOutput> = (data) => {
    if (!selectedEmployeeBalance) return;

    const balancesToUpdate = {
      ...(data.earned !== undefined && { earned: data.earned }),
      ...(data.sick !== undefined && { sick: data.sick }),
      ...(data.casual !== undefined && { casual: data.casual }),
    };

    if (Object.keys(balancesToUpdate).length === 0) {
      toast.error('Please enter at least one balance value to update.');
      return;
    }

    dispatch(updateEmployeeBalance({ employeeId: selectedEmployeeBalance._id, balances: balancesToUpdate }))
      .unwrap()
      .then(() => { toast.success('Balances updated successfully!'); onClose(); })
      .catch((err) => toast.error(err || 'Failed to update balances'));
  };

  if (!isOpen || !selectedEmployeeBalance) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-4 border-b flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Update Leave Balances</h2>
            <p className="text-sm text-gray-500">
              {selectedEmployeeBalance.employeeInfo.name} ({selectedEmployeeBalance.employeeInfo.employeeId})
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          {error && <p className="text-red-500 text-sm">{error}</p>}

          <BalanceInput label="Earned Leave" name="earned" register={register} errors={errors} />
          <BalanceInput label="Sick Leave" name="sick" register={register} errors={errors} />
          <BalanceInput label="Casual Leave" name="casual" register={register} errors={errors} />

          {'root' in errors && (errors as any).root?.message && (
            <p className="error-text">{(errors as any).root.message as string}</p>
          )}

          <div className="pt-4 flex justify-end space-x-2">
            <button type="button" onClick={onClose} className="btn-secondary" disabled={loadingAction}>Cancel</button>
            <button type="submit" disabled={loadingAction} className="btn-primary flex items-center space-x-2">
              {loadingAction ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
              <span>{loadingAction ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

type BalanceInputName = keyof LeaveBalanceUpdateInput;

interface BalanceInputProps {
  label: string;
  name: BalanceInputName;
  register: any;
  errors: any;
}
const BalanceInput: React.FC<BalanceInputProps> = ({ label, name, register, errors }) => (
  <div>
    <label htmlFor={name} className="form-label">{label}</label>
    <input
      id={name}
      type="number"
      step="0.5"
      min="0"
      {...register(name)}
      className={`input ${errors[name] ? 'border-red-500' : ''}`}
      placeholder="Enter new balance"
    />
    {errors[name] && <p className="error-text">{errors[name].message as string}</p>}
  </div>
);
