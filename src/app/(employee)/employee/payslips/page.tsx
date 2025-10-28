// src/app/(employee)/employee/payslips/page.tsx
"use client";
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../lib/redux/store';
import { fetchMyPayslips } from '../../../../lib/redux/slices/employeePayslipSlice';
import PayslipViewModal from '../../../../components/payroll/PayslipViewModal'; // Reusable component
import { Loader2, Eye, Download, ChevronDown } from 'lucide-react';
import { Payslip } from '@/types';
import toast from 'react-hot-toast';
import api from '@/lib/api';

// Helper to format month/year
const formatMonthYear = (month: number, year: number) => {
    return new Date(year, month - 1).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
}

export default function EmployeePayslipsPage() {
    const dispatch = useDispatch<AppDispatch>();
    const { payslips, pagination, loadingList, error } = useSelector((state: RootState) => state.employeePayslips);
    const [selectedPayslipId, setSelectedPayslipId] = useState<string | null>(null);

    useEffect(() => {
        dispatch(fetchMyPayslips(1)); // Fetch first page on mount
    }, [dispatch]);

    const loadMore = () => {
        if (pagination.currentPage < pagination.totalPages) {
            dispatch(fetchMyPayslips(pagination.currentPage + 1));
        }
    };

    const handleViewPayslip = (payslipId: string) => {
        setSelectedPayslipId(payslipId);
    };

    const handleCloseModal = () => {
        setSelectedPayslipId(null);
    };

    // Placeholder for download function - requires backend PDF generation or frontend library
    const handleDownload = (payslip: Payslip) => {
        if (!payslip || !payslip._id) return;

        // Construct the correct download URL
        const downloadUrl = `${api.defaults.baseURL}/employee/payslips/${payslip._id}/download`;

        // Open the URL to trigger the download
        try {
            window.open(downloadUrl, '_blank');
            // Show success toast immediately after initiating
            toast.success(`Initiating download for ${formatMonthYear(payslip.month, payslip.year)} payslip.`);
        } catch (e) {
            console.error("Error opening download URL:", e);
            toast.error("Could not initiate download.");
        }
    };

    
    return (
        <div className="space-y-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">My Payslips</h1>

             {error && <p className='text-red-500 text-sm mb-4'>{error}</p>}

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    {loadingList && pagination.currentPage === 1 ? (
                         <div className="flex justify-center items-center h-40"><Loader2 className="animate-spin text-blue-500" size={32} /></div>
                    ) : payslips.length === 0 ? (
                        <p className="text-gray-500 text-sm text-center py-10 italic">No released payslips found.</p>
                    ) : (
                         <table className="w-full text-sm text-left text-gray-600">
                             <thead className="text-xs text-gray-700 uppercase bg-gray-100/50">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Month / Year</th>
                                    <th scope="col" className="px-6 py-3 text-right">Net Pay (₹)</th>
                                    <th scope="col" className="px-6 py-3 text-center">Actions</th>
                                </tr>
                            </thead>
                             <tbody className="divide-y divide-gray-200">
                                {payslips.map(p => (
                                     <tr key={p._id} className="bg-white hover:bg-gray-50/50">
                                         <td className="px-6 py-4 font-medium text-gray-900">{formatMonthYear(p.month, p.year)}</td>
                                         <td className="px-6 py-4 text-right font-semibold">{p.netPay.toLocaleString('en-IN')}</td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex justify-center space-x-2">
                                                <button onClick={() => handleViewPayslip(p._id)} className="text-blue-600 hover:text-blue-800" title="View Details"><Eye size={18}/></button>
                                                <button onClick={() => handleDownload(p)} className="text-green-600 hover:text-green-800" title="Download PDF"><Download size={18}/></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                             </tbody>
                         </table>
                     )}
                 </div>
                 {/* Load More Button */}
                {!loadingList && pagination.currentPage < pagination.totalPages && (
                    <div className="p-4 border-t text-center bg-white rounded-b-lg">
                        <button onClick={loadMore} className="btn-secondary text-sm">
                            <ChevronDown size={16} className="mr-1"/> Load More
                        </button>
                    </div>
                )}
            </div>

             {/* Payslip View Modal */}
             <PayslipViewModal
                isOpen={!!selectedPayslipId}
                onClose={handleCloseModal}
                payslipId={selectedPayslipId}
                isAdmin={false} // Employee view
             />
        </div>
    );
}