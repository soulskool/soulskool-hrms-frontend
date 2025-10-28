// src/components/admin/SalaryListAdmin.tsx
"use client";

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../lib/redux/store';
import { fetchSalaries, deleteSalary } from '../../lib/redux/slices/adminPayrollSlice';
import { SalaryAdminInfo } from '../../types';
import { Loader2, Edit, Trash2, PlusCircle, AlertCircle } from 'lucide-react';
import SalaryFormModal from './SalaryFormModal'; // Import the modal
import toast from 'react-hot-toast';

// Helper to format currency
const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2 });
}

export default function SalaryListAdmin() {
    const dispatch = useDispatch<AppDispatch>();
    const { salaries, loadingSalaries, actionLoading, error } = useSelector((state: RootState) => state.adminPayroll);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [salaryToEdit, setSalaryToEdit] = useState<SalaryAdminInfo | null>(null);

    useEffect(() => {
        dispatch(fetchSalaries());
    }, [dispatch]);

    const handleOpenModal = (salary: SalaryAdminInfo | null = null) => {
        setSalaryToEdit(salary);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSalaryToEdit(null);
    };

    const handleDelete = (salary: SalaryAdminInfo) => {
        if (window.confirm(`Are you sure you want to delete the salary record for ${salary.employee.employeeInfo.name}? This might affect future payslip generation.`)) {
            dispatch(deleteSalary(salary._id))
                .unwrap()
                .then(() => toast.success('Salary record deleted.'))
                .catch((err) => toast.error(err || 'Failed to delete record.'));
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-700">Employee Salary Records</h2>
                <button onClick={() => handleOpenModal()} className="btn-primary flex items-center space-x-1 text-sm">
                    <PlusCircle size={16}/><span>Add Salary</span>
                </button>
            </div>

            {error && <p className='text-red-500 text-sm p-3 bg-red-50 rounded border border-red-200 flex items-center gap-2'><AlertCircle size={16}/>{error}</p>}

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    {loadingSalaries ? (
                        <div className="flex justify-center items-center h-40"><Loader2 className="animate-spin text-blue-500" size={32} /></div>
                    ) : salaries.length === 0 ? (
                        <p className="text-gray-500 text-sm text-center py-10 italic">No salary records found. Add one to get started.</p>
                    ) : (
                        <table className="w-full text-sm text-left text-gray-600">
                             <thead className="text-xs text-gray-700 uppercase bg-gray-100/50">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Employee Name</th>
                                    <th scope="col" className="px-6 py-3 hidden md:table-cell">Employee ID</th>
                                    <th scope="col" className="px-6 py-3 text-right">Monthly Salary (₹)</th>
                                    <th scope="col" className="px-6 py-3 text-right">Prof. Tax (₹)</th>
                                    <th scope="col" className="px-6 py-3 hidden lg:table-cell">Last Updated</th>
                                    <th scope="col" className="px-6 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                             <tbody className="divide-y divide-gray-200">
                                {salaries.map((s) => (
                                    <tr key={s._id} className="bg-white hover:bg-gray-50/50">
                                        <td className="px-6 py-3 font-medium text-gray-900 whitespace-nowrap">
                                            {s.employee.employeeInfo.name}
                                             {!s.employee.isActive && <span className="ml-2 text-xs text-red-600">(Inactive)</span>}
                                        </td>
                                        <td className="px-6 py-3 hidden md:table-cell">{s.employee.employeeInfo.employeeId}</td>
                                        <td className="px-6 py-3 text-right font-medium">{formatCurrency(s.monthlySalary)}</td>
                                        <td className="px-6 py-3 text-right">{formatCurrency(s.professionalTax)}</td>
                                        <td className="px-6 py-3 hidden lg:table-cell">{new Date(s.updatedAt).toLocaleDateString('en-IN')}</td>
                                        <td className="px-6 py-3 text-right whitespace-nowrap">
                                            <button
                                                onClick={() => handleOpenModal(s)}
                                                className="text-blue-600 hover:text-blue-800 mr-2" title="Edit Salary">
                                                <Edit size={16}/>
                                            </button>
                                            <button
                                                onClick={() => handleDelete(s)}
                                                disabled={actionLoading} // Disable delete while another action is running
                                                className="text-red-600 hover:text-red-800 disabled:opacity-50 disabled:cursor-not-allowed" title="Delete Salary">
                                                <Trash2 size={16}/>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Salary Form Modal */}
            <SalaryFormModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                salaryToEdit={salaryToEdit}
            />
        </div>
    );
}
