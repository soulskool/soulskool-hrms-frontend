// src/components/admin/GeneratePayslipForm.tsx
"use client";

import { useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { payslipGenerateSchema, PayslipGenerateInput, PayslipGenerateSchema } from '../../lib/validation/payslipGenerateSchema';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../lib/redux/store';
import { generatePayslip } from '../../lib/redux/slices/adminPayrollSlice';
import toast from 'react-hot-toast';
import { Loader2, FilePlus, User, Calendar } from 'lucide-react';

export default function GeneratePayslipForm() {
    const dispatch = useDispatch<AppDispatch>();
    const { actionLoading, error } = useSelector((state: RootState) => state.adminPayroll);
    const { employees: employeeList, loadingList: employeesLoading } = useSelector((state: RootState) => state.employees);
     const { salaries } = useSelector((state: RootState) => state.adminPayroll); // Need salaries to filter employees


    const { register, handleSubmit, reset, formState: { errors } } = useForm<PayslipGenerateInput, any, PayslipGenerateSchema>({
    resolver: zodResolver(payslipGenerateSchema),
    defaultValues: {
      employeeId: '',
      month: String(new Date().getMonth() + 1),
      year: String(new Date().getFullYear()),
    },
  });
    const onSubmit: SubmitHandler<PayslipGenerateSchema> = (data) => {
        // Convert month/year back to numbers
        const payload = {
            ...data,
            month: Number(data.month),
            year: Number(data.year),
        };
        dispatch(generatePayslip(payload))
            .unwrap()
            .then((payslip) => {
                toast.success(`Payslip generated for ${payslip?.employeeSnapshot?.name || 'employee'} for ${payload.month}/${payload.year}!`);
                reset(); // Clear form on success
            })
            .catch((err) => toast.error(err || 'Failed to generate payslip.'));
    };

     // Create a list of employees who actually have salary records
    const employeesWithSalary = employeeList.filter(emp =>
        salaries.some(s => s.employee._id === emp._id) && emp.isActive
    );


    // Get month names for dropdown
    const months = Array.from({ length: 12 }, (_, i) => ({
        value: i + 1,
        name: new Date(0, i).toLocaleString('en-IN', { month: 'long' })
    }));
     // Get recent years for dropdown
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 5 }, (_, i) => currentYear - i); // Last 5 years

    return (
        <div className="bg-white rounded-lg shadow p-6 max-w-lg mx-auto">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Generate New Payslip</h2>
            {error && !actionLoading && <p className='text-red-500 text-sm mb-4'>{error}</p>}
             <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Employee Select */}
                <div>
                    <label htmlFor="genEmployeeId" className="form-label flex items-center"><User size={14} className="mr-1"/>Employee*</label>
                    <select
                        id="genEmployeeId"
                        {...register("employeeId")}
                        className={`input ${errors.employeeId ? 'border-red-500' : ''}`}
                        disabled={employeesLoading || salaries.length === 0}
                    >
                        <option value="">{employeesLoading ? 'Loading...' : (salaries.length === 0 ? 'No employees with salary data found' : 'Select Employee...')}</option>
                        {employeesWithSalary.map(emp => (
                            <option key={emp._id} value={emp._id}>
                                {emp.employeeInfo.name} ({emp.employeeInfo.employeeId})
                            </option>
                        ))}
                    </select>
                    {errors.employeeId && <p className="error-text">{errors.employeeId.message}</p>}
                </div>

                 {/* Month and Year */}
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <div>
                        <label htmlFor="month" className="form-label flex items-center"><Calendar size={14} className="mr-1"/>Month*</label>
                        <select id="month" {...register("month")} className={`input ${errors.month ? 'border-red-500' : ''}`}>
                             {months.map(m => <option key={m.value} value={m.value}>{m.name}</option>)}
                        </select>
                         {errors.month && <p className="error-text">{errors.month.message}</p>}
                    </div>
                      <div>
                        <label htmlFor="year" className="form-label flex items-center"><Calendar size={14} className="mr-1"/>Year*</label>
                        <select id="year" {...register("year")} className={`input ${errors.year ? 'border-red-500' : ''}`}>
                            {years.map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                         {errors.year && <p className="error-text">{errors.year.message}</p>}
                    </div>
                 </div>


                 {/* Submit Button */}
                <div className="pt-2">
                    <button type="submit" disabled={actionLoading || employeesLoading || employeesWithSalary.length === 0} className="w-full sm:w-auto btn-primary flex items-center justify-center space-x-2 px-6">
                         {actionLoading ? <Loader2 className="animate-spin" size={18}/> : <FilePlus size={18}/>}
                         <span>{actionLoading ? 'Generating...' : 'Generate Payslip'}</span>
                    </button>
                </div>
            </form>
        </div>
    );
}