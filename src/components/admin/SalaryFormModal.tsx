// // src/components/admin/SalaryFormModal.tsx
// "use client";

// import { useEffect } from 'react';
// import { useForm, SubmitHandler } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { salarySchema, SalarySchemaInput, SalarySchema } from "../../lib/validation/salarySchema";

// import { useDispatch, useSelector } from 'react-redux';
// import { AppDispatch, RootState } from '../../lib/redux/store';
// import { createSalary, updateSalary } from '../../lib/redux/slices/adminPayrollSlice';
// import { SalaryAdminInfo } from '../../types';
// import toast from 'react-hot-toast';
// import { Loader2, Save, X, User, DollarSign, Percent } from 'lucide-react';
// import z from "zod"

// interface Props {
//   isOpen: boolean;
//   onClose: () => void;
//   salaryToEdit?: SalaryAdminInfo | null;
// }

// export default function SalaryFormModal({ isOpen, onClose, salaryToEdit }: Props) {
//     const dispatch = useDispatch<AppDispatch>();
//     const { actionLoading, error } = useSelector((state: RootState) => state.adminPayroll);
//     // Fetch employees for the dropdown
//     const { employees: employeeList, loadingList: employeesLoading } = useSelector((state: RootState) => state.employees);
//     const isEditMode = Boolean(salaryToEdit);

    
// type SalarySchemaInput = z.input<typeof salarySchema>;
// type SalarySchema = z.infer<typeof salarySchema>;

// const { register, handleSubmit, reset, formState: { errors } } = useForm<
//   SalarySchemaInput,  // form values (input; strings for input fields)
//   any,                // context (you can specify or leave as `any`)
//   SalarySchema        // output (after parsing/coercion; numbers)
// >({
//   resolver: zodResolver(salarySchema),
//   defaultValues: {
//     employeeId: "",
//     monthlySalary: "",
//     professionalTax: ""
//   }
// });




//     // Populate form when editing
//     useEffect(() => {
//         if (isOpen) {
//             if (isEditMode && salaryToEdit) {
//                 reset({
//                     employeeId: salaryToEdit.employee._id, // Use ObjectId for form value
//                     monthlySalary: salaryToEdit.monthlySalary,
//                     professionalTax: salaryToEdit.professionalTax,
//                 });
//             } else {
//                 reset({ employeeId: '', monthlySalary: '', professionalTax: '' }); // Clear for create
//             }
//         }
//     }, [salaryToEdit, isEditMode, isOpen, reset]);

//     const onSubmit: SubmitHandler<SalarySchema> = (data) => {
//         let resultAction;
//         // Convert string inputs back to numbers
//         const payload = {
//             ...data,
//             monthlySalary: Number(data.monthlySalary),
//             professionalTax: Number(data.professionalTax),
//         };

//         if (isEditMode && salaryToEdit) {
//              resultAction = dispatch(updateSalary({ salaryId: salaryToEdit._id, formData: payload }));
//         } else {
//              resultAction = dispatch(createSalary(payload));
//         }

//         resultAction
//             .unwrap()
//             .then(() => {
//                 toast.success(`Salary record ${isEditMode ? 'updated' : 'created'} successfully!`);
//                 onClose();
//             })
//             .catch((err) => toast.error(err || `Failed to ${isEditMode ? 'update' : 'create'} salary record.`));
//     };

//     if (!isOpen) return null;

//     return (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
//           <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
//             <div className="p-4 border-b flex justify-between items-center">
//               <h2 className="text-lg font-semibold text-gray-800">{isEditMode ? 'Edit Salary Details' : 'Add Salary Details'}</h2>
//               <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20}/></button>
//             </div>

//             <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
//               {error && <p className='text-red-500 text-sm'>{error}</p>}

//               {/* Employee Select */}
//               <div>
//                 <label htmlFor="employeeId" className="form-label flex items-center"><User size={14} className="mr-1"/>Employee*</label>
//                 <select
//                     id="employeeId"
//                     {...register("employeeId")}
//                     className={`input ${errors.employeeId ? 'border-red-500' : ''}`}
//                     disabled={isEditMode || employeesLoading} // Disable if editing or loading
//                 >
//                     <option value="">{employeesLoading ? 'Loading employees...' : 'Select Employee...'}</option>
//                     {employeeList
//                         .filter(emp => emp.isActive) // Show only active employees
//                         .map(emp => (
//                             <option key={emp._id} value={emp._id}>
//                                 {emp.employeeInfo.name} ({emp.employeeInfo.employeeId})
//                             </option>
//                     ))}
//                 </select>
//                 {errors.employeeId && <p className="error-text">{errors.employeeId.message}</p>}
//                 {isEditMode && <p className="text-xs text-gray-500 mt-1">Employee cannot be changed after creation.</p>}
//               </div>

//               {/* Monthly Salary */}
//               <div>
//                 <label htmlFor="monthlySalary" className="form-label flex items-center"><DollarSign size={14} className="mr-1"/>Gross Monthly Salary (₹)*</label>
//                 <input
//                     id="monthlySalary"
//                     type="number"
//                     step="0.01"
//                     min="0"
//                     {...register("monthlySalary")}
//                     className={`input ${errors.monthlySalary ? 'border-red-500' : ''}`}
//                     placeholder="e.g., 30000.00"
//                 />
//                 {errors.monthlySalary && <p className="error-text">{errors.monthlySalary.message}</p>}
//               </div>

//                {/* Professional Tax */}
//               <div>
//                 <label htmlFor="professionalTax" className="form-label flex items-center"><Percent size={14} className="mr-1"/>Monthly Professional Tax (₹)*</label>
//                  <input
//                     id="professionalTax"
//                     type="number"
//                     step="0.01"
//                     min="0"
//                     {...register("professionalTax")}
//                     className={`input ${errors.professionalTax ? 'border-red-500' : ''}`}
//                     placeholder="e.g., 200.00"
//                 />
//                  {errors.professionalTax && <p className="error-text">{errors.professionalTax.message}</p>}
//               </div>

//               <div className="pt-4 flex justify-end space-x-2">
//                 <button type="button" onClick={onClose} className="btn-secondary" disabled={actionLoading}>Cancel</button>
//                 <button type="submit" disabled={actionLoading} className="btn-primary flex items-center space-x-2">
//                     {actionLoading ? <Loader2 className="animate-spin" size={16}/> : <Save size={16}/>}
//                     <span>{actionLoading ? 'Saving...' : (isEditMode ? 'Update Salary' : 'Save Salary')}</span>
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       );
// }


















// src/components/admin/SalaryFormModal.tsx
"use client";

import { useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
// Import both Input and Output types
import { salarySchema, SalarySchemaInput, SalarySchema } from "../../lib/validation/salarySchema";
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../lib/redux/store';
import { createSalary, updateSalary } from '../../lib/redux/slices/adminPayrollSlice';
import { SalaryAdminInfo } from '../../types';
import toast from 'react-hot-toast';
import { Loader2, Save, X, User, DollarSign, Percent, Landmark, Hash, Banknote, Building, UserCheck } from 'lucide-react'; // Added bank icons

interface Props {
  isOpen: boolean;
  onClose: () => void;
  salaryToEdit?: SalaryAdminInfo | null;
}

export default function SalaryFormModal({ isOpen, onClose, salaryToEdit }: Props) {
    const dispatch = useDispatch<AppDispatch>();
    const { actionLoading, error } = useSelector((state: RootState) => state.adminPayroll);
    const { employees: employeeList, loadingList: employeesLoading } = useSelector((state: RootState) => state.employees);
    const isEditMode = Boolean(salaryToEdit);

    const { register, handleSubmit, reset, formState: { errors } } = useForm<
        SalarySchemaInput, // Use Input type for form values (strings allowed for numbers)
        any,
        SalarySchema // Use Output type for validated data (numbers are numbers)
    >({
        resolver: zodResolver(salarySchema),
        defaultValues: { // Use strings for number inputs
            employeeId: "",
            monthlySalary: "",
            professionalTax: "",
            bankDetails: { // Initialize bank details
                bankName: "",
                accountNumber: "",
                ifscCode: "",
                branchName: "",
                accountType: "",
                paymentType: "Account Transfer", // Default payment type
                nameAsPerBank: "",
            }
        }
    });

    // Populate form when editing
    useEffect(() => {
        if (isOpen) {
            if (isEditMode && salaryToEdit) {
                reset({
                    employeeId: salaryToEdit.employee._id,
                    // Convert numbers back to strings for input fields
                    monthlySalary: String(salaryToEdit.monthlySalary ?? ''),
                    professionalTax: String(salaryToEdit.professionalTax ?? ''),
                    // Populate bank details, ensuring defaults if null/undefined
                    bankDetails: {
                        bankName: salaryToEdit.bankDetails?.bankName ?? "",
                        accountNumber: salaryToEdit.bankDetails?.accountNumber ?? "",
                        ifscCode: salaryToEdit.bankDetails?.ifscCode ?? "",
                        branchName: salaryToEdit.bankDetails?.branchName ?? "",
                        accountType: salaryToEdit.bankDetails?.accountType ?? "",
                        paymentType: salaryToEdit.bankDetails?.paymentType ?? "Account Transfer",
                        nameAsPerBank: salaryToEdit.bankDetails?.nameAsPerBank ?? "",
                    }
                });
            } else {
                 // Reset form with default strings for numbers
                reset({
                    employeeId: '',
                    monthlySalary: '',
                    professionalTax: '',
                    bankDetails: {
                        bankName: "", accountNumber: "", ifscCode: "", branchName: "",
                        accountType: "", paymentType: "Account Transfer", nameAsPerBank: ""
                    }
                 });
            }
        }
    }, [salaryToEdit, isEditMode, isOpen, reset]);

    // onSubmit receives the VALIDATED data (SalarySchema - numbers are numbers)
    const onSubmit: SubmitHandler<SalarySchema> = (data) => {
        let resultAction;
        // No need to convert here, Zod already did via preprocess
        const payload = { ...data };

        if (isEditMode && salaryToEdit) {
             resultAction = dispatch(updateSalary({ salaryId: salaryToEdit._id, formData: payload }));
        } else {
             resultAction = dispatch(createSalary(payload));
        }

        resultAction
            .unwrap()
            .then(() => {
                toast.success(`Salary record ${isEditMode ? 'updated' : 'created'} successfully!`);
                onClose();
            })
            .catch((err) => toast.error(err || `Failed to ${isEditMode ? 'update' : 'create'} salary record.`));
    };

    if (!isOpen) return null;

     // Helper to render section titles
    const renderSectionTitle = (title: string) => <h3 className="text-md font-semibold text-gray-700 border-b pb-1 mb-3 col-span-full">{title}</h3>;


    return (
        // Increased max-w for more fields
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-xl max-h-[95vh] flex flex-col my-auto">
            <div className="p-4 border-b flex justify-between items-center sticky top-0 bg-white rounded-t-lg z-10">
              <h2 className="text-lg font-semibold text-gray-800">{isEditMode ? 'Edit Salary & Bank Details' : 'Add Salary & Bank Details'}</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20}/></button>
            </div>

            {/* Added overflow-y-auto to the form itself */}
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5 overflow-y-auto">
              {error && <p className='text-red-500 text-sm'>{error}</p>}

              {renderSectionTitle('Employee & Salary')}

              {/* Employee Select */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="employeeId" className="form-label flex items-center"><User size={14} className="mr-1"/>Employee*</label>
                    <select
                        id="employeeId"
                        {...register("employeeId")}
                        className={`input ${errors.employeeId ? 'border-red-500' : ''}`}
                        disabled={isEditMode || employeesLoading}
                    >
                        <option value="">{employeesLoading ? 'Loading employees...' : 'Select Employee...'}</option>
                        {employeeList
                            .filter(emp => emp.isActive)
                            .map(emp => (
                                <option key={emp._id} value={emp._id}>
                                    {emp.employeeInfo.name} ({emp.employeeInfo.employeeId})
                                </option>
                        ))}
                    </select>
                    {errors.employeeId && <p className="error-text">{errors.employeeId.message}</p>}
                    {isEditMode && <p className="text-xs text-gray-500 mt-1">Employee cannot be changed.</p>}
                  </div>
                </div>


              {/* Salary & Tax */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="monthlySalary" className="form-label flex items-center"><DollarSign size={14} className="mr-1"/>Gross Monthly Salary (₹)*</label>
                    <input
                        id="monthlySalary"
                        type="number" // Keep type number for browser controls
                        step="0.01"
                        min="0"
                        // Use register from useForm<SalarySchemaInput>
                        {...register("monthlySalary")}
                        className={`input ${errors.monthlySalary ? 'border-red-500' : ''}`}
                        placeholder="e.g., 30000.00"
                    />
                    {errors.monthlySalary && <p className="error-text">{errors.monthlySalary.message}</p>}
                  </div>
                  <div>
                    <label htmlFor="professionalTax" className="form-label flex items-center"><Percent size={14} className="mr-1"/>Monthly Prof. Tax (₹)*</label>
                     <input
                        id="professionalTax"
                        type="number" // Keep type number
                        step="0.01"
                        min="0"
                        {...register("professionalTax")}
                        className={`input ${errors.professionalTax ? 'border-red-500' : ''}`}
                        placeholder="e.g., 200.00"
                    />
                     {errors.professionalTax && <p className="error-text">{errors.professionalTax.message}</p>}
                  </div>
              </div>

               {renderSectionTitle('Bank Account Details')}

               {/* Bank Details Grid */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div>
                        <label htmlFor="bankName" className="form-label flex items-center"><Landmark size={14} className="mr-1"/>Bank Name</label>
                        <input id="bankName" {...register("bankDetails.bankName")} className="input"/>
                        {errors.bankDetails?.bankName && <p className="error-text">{errors.bankDetails.bankName.message}</p>}
                   </div>
                    <div>
                        <label htmlFor="accountNumber" className="form-label flex items-center"><Hash size={14} className="mr-1"/>Account Number</label>
                        <input id="accountNumber" {...register("bankDetails.accountNumber")} className="input"/>
                         {errors.bankDetails?.accountNumber && <p className="error-text">{errors.bankDetails.accountNumber.message}</p>}
                   </div>
                   <div>
                        <label htmlFor="ifscCode" className="form-label">IFSC Code</label>
                        <input id="ifscCode" {...register("bankDetails.ifscCode")} className="input"/>
                         {errors.bankDetails?.ifscCode && <p className="error-text">{errors.bankDetails.ifscCode.message}</p>}
                   </div>
                    <div>
                        <label htmlFor="branchName" className="form-label flex items-center"><Building size={14} className="mr-1"/>Branch Name</label>
                        <input id="branchName" {...register("bankDetails.branchName")} className="input"/>
                         {errors.bankDetails?.branchName && <p className="error-text">{errors.bankDetails.branchName.message}</p>}
                   </div>
                    <div>
                        <label htmlFor="accountType" className="form-label">Account Type</label>
                        <select id="accountType" {...register("bankDetails.accountType")} className="input">
                            <option value="">Select Type...</option>
                            <option value="Savings">Savings</option>
                            <option value="Current">Current</option>
                            <option value="Other">Other</option>
                        </select>
                         {errors.bankDetails?.accountType && <p className="error-text">{errors.bankDetails.accountType.message}</p>}
                   </div>
                     <div>
                        <label htmlFor="paymentType" className="form-label flex items-center"><Banknote size={14} className="mr-1"/>Payment Type</label>
                        <select id="paymentType" {...register("bankDetails.paymentType")} className="input">
                            <option value="">Select Type...</option>
                            <option value="Account Transfer">Account Transfer</option>
                            <option value="Cheque">Cheque</option>
                            <option value="Cash">Cash</option>
                            <option value="Other">Other</option>
                        </select>
                         {errors.bankDetails?.paymentType && <p className="error-text">{errors.bankDetails.paymentType.message}</p>}
                   </div>
                    <div className="md:col-span-2">
                        <label htmlFor="nameAsPerBank" className="form-label flex items-center"><UserCheck size={14} className="mr-1"/>Name as per Bank Records</label>
                        <input id="nameAsPerBank" {...register("bankDetails.nameAsPerBank")} className="input"/>
                         {errors.bankDetails?.nameAsPerBank && <p className="error-text">{errors.bankDetails.nameAsPerBank.message}</p>}
                   </div>
               </div>


              {/* Footer Buttons */}
              <div className="pt-4 flex justify-end space-x-2 border-t mt-6">
                <button type="button" onClick={onClose} className="btn-secondary" disabled={actionLoading}>Cancel</button>
                <button type="submit" disabled={actionLoading} className="btn-primary flex items-center space-x-2">
                    {actionLoading ? <Loader2 className="animate-spin" size={16}/> : <Save size={16}/>}
                    <span>{actionLoading ? 'Saving...' : (isEditMode ? 'Update Details' : 'Save Details')}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      );
}