// src/components/admin/AdminLeaveHistoryList.tsx
"use client";

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../lib/redux/store';
import { fetchApprovedLeaveHistory } from '../../lib/redux/slices/adminLeaveSlice';
import { LeaveRequest, LeaveStatus } from '../../types';
import { Loader2, ChevronDown } from 'lucide-react';

// Helper functions (reused from other components)
const formatLeavePeriod = (req: LeaveRequest): string => {
    const from = new Date(req.fromDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    const to = new Date(req.toDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    let period = `${from} (${req.fromSession})`;
    if (from !== to) period += ` - ${to} (${req.toSession})`;
    else if (req.fromSession !== req.toSession) period += ` - ${req.toSession}`;
    return period;
};

const getStatusBadgeClass = (status: LeaveStatus) => {
    // Only Approved and Rejected statuses are expected in history/approved
    switch (status) {
        case 'Approved': return 'bg-green-100 text-green-800';
        case 'Rejected': return 'bg-red-100 text-red-800';
        case 'Pending': return 'bg-yellow-100 text-yellow-800'; // Should not happen here
        default: return 'bg-gray-100 text-gray-800';
    }
}


export default function AdminLeaveHistoryList() {
    const dispatch = useDispatch<AppDispatch>();
    const { approvedRequests, approvedPagination, loadingApproved, error } = useSelector((state: RootState) => ({
        approvedRequests: state.adminLeave.approvedRequests,
        approvedPagination: state.adminLeave.approvedPagination,
        loadingApproved: state.adminLeave.loadingApproved,
        error: state.adminLeave.error,
    }));

    // Local state to track page number for loading more (sync with Redux state on fetch)
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        // Fetch page 1 on component mount
        dispatch(fetchApprovedLeaveHistory(1));
        setCurrentPage(1);
    }, [dispatch]);

    const loadMore = () => {
        if (approvedPagination.currentPage < approvedPagination.totalPages) {
            const nextPage = approvedPagination.currentPage + 1;
            dispatch(fetchApprovedLeaveHistory(nextPage));
            setCurrentPage(nextPage);
        }
    };

    const isLoading = loadingApproved && currentPage === 1;

    if (isLoading) {
        return <div className="flex justify-center items-center h-40"><Loader2 className="animate-spin text-blue-500" size={32} /></div>;
    }

    if (error) {
         return <p className='text-red-500 text-sm mb-4'>{error}</p>;
    }

    if (approvedRequests.length === 0) {
        return <p className="text-gray-500 text-sm text-center py-10 italic">No approved leave requests found.</p>;
    }

    return (
        <div className="bg-white rounded-lg shadow overflow-hidden">
            <h2 className="text-lg font-semibold text-gray-700 p-4 border-b">Approved Leave History ({approvedPagination.totalRequests} total)</h2>
             <div className="overflow-x-auto">
                 <table className="w-full text-sm text-left text-gray-600">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-100/50">
                        <tr>
                            <th scope="col" className="px-6 py-3">Employee</th>
                            <th scope="col" className="px-6 py-3 hidden md:table-cell">ID</th>
                            <th scope="col" className="px-6 py-3">Type</th>
                            <th scope="col" className="px-6 py-3">Period</th>
                            <th scope="col" className="px-6 py-3 text-center">Days</th>
                            <th scope="col" className="px-6 py-3 hidden sm:table-cell">Applied On</th>
                             <th scope="col" className="px-6 py-3 hidden md:table-cell">Approved On</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {approvedRequests.map((req) => {
                            const employeeInfo = (req.employee && typeof req.employee === 'object') ? req.employee.employeeInfo : { name: 'N/A', employeeId: 'N/A' };
                            return (
                                <tr key={req._id} className="bg-white hover:bg-gray-50/50">
                                     <td className="px-6 py-3 font-medium text-gray-900 whitespace-nowrap">
                                        {employeeInfo.name}
                                        {/* Optional: Show remarks on hover/tooltip if available */}
                                        {req.adminRemarks && <span className="text-xs text-gray-400 block truncate max-w-[150px]" title={`Remarks: ${req.adminRemarks}`}>Rem: {req.adminRemarks}</span>}
                                     </td>
                                     <td className="px-6 py-3 hidden md:table-cell">{employeeInfo.employeeId}</td>
                                     <td className="px-6 py-3">{req.leaveType.charAt(0).toUpperCase() + req.leaveType.slice(1)}</td>
                                     <td className="px-6 py-3 whitespace-nowrap">{formatLeavePeriod(req)}</td>
                                     <td className="px-6 py-3 text-center font-medium">{req.numberOfDays}</td>
                                     <td className="px-6 py-3 hidden sm:table-cell">{new Date(req.createdAt).toLocaleDateString('en-IN')}</td>
                                     <td className="px-6 py-3 hidden md:table-cell">{req.actionTakenAt ? new Date(req.actionTakenAt).toLocaleDateString('en-IN') : '-'}</td>
                                     <td className="px-6 py-3 text-center">
                                         <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${getStatusBadgeClass(req.status)}`}>
                                              {req.status}
                                         </span>
                                     </td>
                                </tr>
                            );
                        })}
                    </tbody>
                 </table>
             </div>
            
            {/* Load More Button */}
            {!loadingApproved && approvedPagination.currentPage < approvedPagination.totalPages && (
                <div className="p-4 border-t text-center bg-white rounded-b-lg">
                    <button
                        onClick={loadMore}
                        disabled={loadingApproved}
                        className="btn-secondary text-sm flex items-center justify-center mx-auto disabled:opacity-50"
                    >
                        {loadingApproved ? <Loader2 className="animate-spin mr-2" size={16}/> : <ChevronDown size={16} className="mr-1"/>}
                        {loadingApproved ? 'Loading...' : 'Load More History'}
                    </button>
                </div>
            )}
        </div>
    );
}