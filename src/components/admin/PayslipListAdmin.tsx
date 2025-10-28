// src/components/admin/PayslipListAdmin.tsx
"use client";

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../lib/redux/store';
import { fetchPayslips, releasePayslip, deletePayslip } from '../../lib/redux/slices/adminPayrollSlice';
import { Payslip } from '../../types';
import PayslipViewModal from '../payroll/PayslipViewModal'; // Reusable modal
import { Loader2, Eye, Download, Send, Trash2, ChevronDown, Filter, X as ClearFilterIcon, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
// Helper to format month/year
const formatMonthYear = (month: number, year: number) => {
    return new Date(year, month - 1).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
}

export default function PayslipListAdmin() {
    const dispatch = useDispatch<AppDispatch>();
    const { payslips, payslipPagination, loadingPayslips, actionLoading, error } = useSelector((state: RootState) => state.adminPayroll);
    const { employees: employeeList, loadingList: employeesLoading } = useSelector((state: RootState) => state.employees);

    const [selectedPayslipId, setSelectedPayslipId] = useState<string | null>(null); // For view modal
    const [filterEmployeeId, setFilterEmployeeId] = useState<string>(''); // ObjectId string
    const [filterStatus, setFilterStatus] = useState<'Released' | 'Pending' | ''>('');

    // Fetch payslips on mount or when filters/page change
    useEffect(() => {
        dispatch(fetchPayslips({ page: 1, employeeId: filterEmployeeId || undefined, status: filterStatus || undefined }));
    }, [dispatch, filterEmployeeId, filterStatus]);

    const loadMore = () => {
         if (payslipPagination.currentPage < payslipPagination.totalPages) {
            dispatch(fetchPayslips({ page: payslipPagination.currentPage + 1, employeeId: filterEmployeeId || undefined, status: filterStatus || undefined }));
        }
    };

    const handleViewPayslip = (payslipId: string) => setSelectedPayslipId(payslipId);
    const handleCloseModal = () => setSelectedPayslipId(null);

    const handleRelease = (payslip: Payslip) => {
        if (window.confirm(`Are you sure you want to release the payslip for ${payslip.employeeSnapshot.name} (${formatMonthYear(payslip.month, payslip.year)})? Employees will be able to see it.`)) {
             dispatch(releasePayslip(payslip._id))
                .unwrap()
                .then(() => toast.success('Payslip released.'))
                .catch((err) => toast.error(err || 'Failed to release payslip.'));
        }
    };

     const handleDelete = (payslip: Payslip) => {
        if (window.confirm(`Are you sure you want to DELETE the payslip for ${payslip.employeeSnapshot.name} (${formatMonthYear(payslip.month, payslip.year)})? This action cannot be undone.`)) {
             dispatch(deletePayslip(payslip._id))
                .unwrap()
                .then(() => toast.success('Payslip deleted.'))
                .catch((err) => toast.error(err || 'Failed to delete payslip.'));
        }
    };


    return (
        <div className="space-y-4">
             {/* Filter Section */}
            <div className="bg-white p-3 rounded-md shadow-sm border flex flex-col sm:flex-row items-center gap-4">
                 <Filter size={18} className="text-gray-500 flex-shrink-0"/>
                 {/* Employee Filter */}
                 <div className="flex-grow w-full sm:w-auto">
                     <label htmlFor="payslipEmpFilter" className="sr-only">Filter by Assignee</label>
                     <select
                        id="payslipEmpFilter"
                        value={filterEmployeeId}
                        onChange={(e) => setFilterEmployeeId(e.target.value)}
                        className="input py-1 text-sm w-full"
                        disabled={employeesLoading}
                     >
                        <option value="">All Employees</option>
                        {employeesLoading ? <option disabled>Loading...</option> : employeeList.map(emp => (
                             <option key={emp._id} value={emp._id}>{emp.employeeInfo.name} ({emp.employeeInfo.employeeId})</option>
                        ))}
                     </select>
                 </div>
                  {/* Status Filter */}
                 <div className="flex-grow w-full sm:w-auto">
                      <label htmlFor="payslipStatusFilter" className="sr-only">Filter by Status</label>
                      <select
                        id="payslipStatusFilter"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value as any)}
                        className="input py-1 text-sm w-full"
                      >
                            <option value="">All Statuses</option>
                            <option value="Pending">Pending Release</option>
                            <option value="Released">Released</option>
                      </select>
                 </div>
                 {(filterEmployeeId || filterStatus) && (
                     <button onClick={() => { setFilterEmployeeId(''); setFilterStatus(''); }} className="text-xs text-gray-500 hover:text-red-600 flex items-center flex-shrink-0">
                        <ClearFilterIcon size={14} className="mr-1"/> Clear Filters
                     </button>
                 )}
            </div>

            {error && <p className='text-red-500 text-sm p-3 bg-red-50 rounded border border-red-200 flex items-center gap-2'><AlertCircle size={16}/>{error}</p>}

            {/* Payslip List Table */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                     {loadingPayslips && payslipPagination.currentPage === 1 ? (
                         <div className="flex justify-center items-center h-40"><Loader2 className="animate-spin text-blue-500" size={32} /></div>
                    ) : payslips.length === 0 ? (
                        <p className="text-gray-500 text-sm text-center py-10 italic">No payslips found matching filters.</p>
                    ) : (
                         <table className="w-full text-sm text-left text-gray-600">
                             <thead className="text-xs text-gray-700 uppercase bg-gray-100/50">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Employee Name</th>
                                    <th scope="col" className="px-6 py-3 hidden md:table-cell">Employee ID</th>
                                    <th scope="col" className="px-6 py-3">Month/Year</th>
                                    <th scope="col" className="px-6 py-3 text-right">Net Pay (₹)</th>
                                    <th scope="col" className="px-6 py-3 text-center">Status</th>
                                    <th scope="col" className="px-6 py-3 text-center">Actions</th>
                                </tr>
                            </thead>
                             <tbody className="divide-y divide-gray-200">
                                {payslips.map(p => (
                                     <tr key={p._id} className="bg-white hover:bg-gray-50/50">
                                        <td className="px-6 py-3 font-medium text-gray-900 whitespace-nowrap">{p.employeeSnapshot.name}</td>
                                        <td className="px-6 py-3 hidden md:table-cell">{p.employeeSnapshot.employeeId}</td>
                                         <td className="px-6 py-3 whitespace-nowrap">{formatMonthYear(p.month, p.year)}</td>
                                         <td className="px-6 py-3 text-right font-medium">{formatCurrency(p.netPay)}</td>
                                        <td className="px-6 py-3 text-center">
                                            <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${p.isReleased ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                 {p.isReleased ? 'Released' : 'Pending'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-3 text-center whitespace-nowrap">
                                            <div className="flex justify-center items-center space-x-2">
                                                <button onClick={() => handleViewPayslip(p._id)} className="p-1 text-blue-600 hover:text-blue-800" title="View Details"><Eye size={16}/></button>
                                                {!p.isReleased && (
                                                     <button
                                                        onClick={() => handleRelease(p)}
                                                        disabled={actionLoading}
                                                        className="p-1 text-green-600 hover:text-green-800 disabled:opacity-50" title="Release Payslip">
                                                            {actionLoading ? <Loader2 className="animate-spin" size={16}/> : <Send size={16}/>}
                                                    </button>
                                                )}
                                                 <button
                                                    onClick={() => handleDelete(p)}
                                                    disabled={actionLoading}
                                                    className="p-1 text-red-600 hover:text-red-800 disabled:opacity-50" title="Delete Payslip">
                                                        {actionLoading ? <Loader2 className="animate-spin" size={16}/> : <Trash2 size={16}/>}
                                                 </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                             </tbody>
                         </table>
                     )}
                 </div>
                 {/* Load More Button */}
                {!loadingPayslips && payslipPagination.currentPage < payslipPagination.totalPages && (
                    <div className="p-4 border-t text-center bg-white rounded-b-lg">
                        <button onClick={loadMore} disabled={loadingPayslips} className="btn-secondary text-sm disabled:opacity-50">
                            {loadingPayslips ? <Loader2 className="animate-spin mr-2" size={16}/> : <ChevronDown size={16} className="mr-1"/>}
                            {loadingPayslips ? 'Loading...' : 'Load More Payslips'}
                        </button>
                    </div>
                )}
            </div>

             {/* Payslip View Modal (Reusable) */}
             <PayslipViewModal
                isOpen={!!selectedPayslipId}
                onClose={handleCloseModal}
                payslipId={selectedPayslipId}
                isAdmin={true} // Admin view
             />
        </div>
    );
}