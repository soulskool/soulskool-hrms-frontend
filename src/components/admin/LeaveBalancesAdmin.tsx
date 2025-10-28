// src/components/admin/LeaveBalancesAdmin.tsx
"use client";

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../lib/redux/store';
import { fetchAllBalances, selectEmployeeForBalanceUpdate } from '../../lib/redux/slices/adminLeaveSlice';
import { EmployeeLeaveBalanceAdmin } from '../../types';
import { Loader2, Edit } from 'lucide-react';
import UpdateBalanceModal from './UpdateBalanceModal'; // Create this next

export default function LeaveBalancesAdmin() {
    const dispatch = useDispatch<AppDispatch>();
    const { allBalances, loadingBalances, error } = useSelector((state: RootState) => state.adminLeave);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        dispatch(fetchAllBalances());
    }, [dispatch]);

    const handleOpenUpdateModal = (employee: EmployeeLeaveBalanceAdmin) => {
        dispatch(selectEmployeeForBalanceUpdate(employee)); // Store selected emp in Redux
        setIsModalOpen(true);
    };

     const handleCloseModal = () => {
        setIsModalOpen(false);
         // Clear selected employee after a short delay to allow modal fade out
        setTimeout(() => dispatch(selectEmployeeForBalanceUpdate(null)), 300);
    };


    if (loadingBalances) {
        return <div className="flex justify-center items-center h-40"><Loader2 className="animate-spin text-blue-500" size={32} /></div>;
    }

    if (error) {
         return <p className='text-red-500 text-sm mb-4'>{error}</p>;
    }

     if (allBalances.length === 0) {
        return <p className="text-gray-500 text-sm text-center py-10 italic">No employee balances found.</p>;
    }

    return (
        <div className="bg-white rounded-lg shadow overflow-hidden">
             <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-600">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                        <tr>
                            <th scope="col" className="px-6 py-3">Employee Name</th>
                            <th scope="col" className="px-6 py-3 hidden md:table-cell">Employee ID</th>
                            <th scope="col" className="px-6 py-3 text-center">Earned</th>
                            <th scope="col" className="px-6 py-3 text-center">Sick</th>
                            <th scope="col" className="px-6 py-3 text-center">Casual</th>
                            <th scope="col" className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {allBalances.map((emp) => (
                            <tr key={emp._id} className="bg-white hover:bg-gray-50/50">
                                <td className="px-6 py-3 font-medium text-gray-900 whitespace-nowrap">{emp.employeeInfo.name}</td>
                                <td className="px-6 py-3 hidden md:table-cell">{emp.employeeInfo.employeeId}</td>
                                <td className="px-6 py-3 text-center">{emp.leaveBalances?.earned ?? 0}</td>
                                <td className="px-6 py-3 text-center">{emp.leaveBalances?.sick ?? 0}</td>
                                <td className="px-6 py-3 text-center">{emp.leaveBalances?.casual ?? 0}</td>
                                <td className="px-6 py-3 text-right">
                                    <button
                                        onClick={() => handleOpenUpdateModal(emp)}
                                        className="text-blue-600 hover:text-blue-800" title="Update Balances">
                                        <Edit size={18}/>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {/* Render Modal */}
            <UpdateBalanceModal isOpen={isModalOpen} onClose={handleCloseModal} />
        </div>
    );
}