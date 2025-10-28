// src/components/admin/PendingLeaveRequests.tsx
"use client";

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../lib/redux/store';
import { fetchPendingLeaves, updateLeaveStatus } from '../../lib/redux/slices/adminLeaveSlice';
import { LeaveRequest } from '../../types';
import { Loader2, Check, X, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';

// Helper from LeaveRequestsList (could be moved to a utils file)
const formatLeavePeriod = (req: LeaveRequest): string => {
    const from = new Date(req.fromDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    const to = new Date(req.toDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    let period = `${from} (${req.fromSession})`;
    if (from !== to) period += ` - ${to} (${req.toSession})`;
    else if (req.fromSession !== req.toSession) period += ` - ${req.toSession}`;
    return period;
};

export default function PendingLeaveRequests() {
    const dispatch = useDispatch<AppDispatch>();
    const { pendingRequests, loadingPending, loadingAction, error } = useSelector((state: RootState) => state.adminLeave);
    const [remarksMap, setRemarksMap] = useState<Record<string, string>>({}); // Store remarks per request ID

    useEffect(() => {
        dispatch(fetchPendingLeaves());
    }, [dispatch]);

    const handleAction = (requestId: string, status: 'Approved' | 'Rejected') => {
        const adminRemarks = remarksMap[requestId] || undefined; // Get remarks for this request
        dispatch(updateLeaveStatus({ requestId, status, adminRemarks }))
            .unwrap()
            .then(() => toast.success(`Request ${status.toLowerCase()} successfully.`))
            .catch((err) => toast.error(err || 'Action failed'));
    };

     const handleRemarkChange = (requestId: string, value: string) => {
        setRemarksMap(prev => ({ ...prev, [requestId]: value }));
    };

    if (loadingPending) {
        return <div className="flex justify-center items-center h-40"><Loader2 className="animate-spin text-blue-500" size={32} /></div>;
    }

    if (error) {
         return <p className='text-red-500 text-sm mb-4'>{error}</p>;
    }

    if (pendingRequests.length === 0) {
        return <p className="text-gray-500 text-sm text-center py-10 italic">No pending leave requests.</p>;
    }

    return (
        <div className="space-y-4">
            {pendingRequests.map((req) => {
                // Ensure employee is populated correctly
                const employeeInfo = (req.employee && typeof req.employee === 'object') ? req.employee.employeeInfo : { name: 'N/A', employeeId: 'N/A' };
                return (
                    <div key={req._id} className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex flex-col md:flex-row justify-between md:items-start gap-3 mb-3">
                            <div>
                                <p className="font-semibold text-gray-800">{employeeInfo.name} <span className="text-xs text-gray-500">({employeeInfo.employeeId})</span></p>
                                <p className="text-xs text-gray-500">Applied on: {new Date(req.createdAt).toLocaleDateString('en-IN')}</p>
                            </div>
                            <div className='text-xs text-gray-600 text-right'>
                                <p><span className="font-medium">Type:</span> {req.leaveType.charAt(0).toUpperCase() + req.leaveType.slice(1)}</p>
                                <p><span className="font-medium">Period:</span> {formatLeavePeriod(req)} ({req.numberOfDays} Days)</p>
                            </div>
                        </div>
                        <p className="text-sm text-gray-700 mb-3"><span className="font-medium">Reason:</span> {req.reason}</p>
                        {req.applyingTo && <p className="text-xs text-gray-500 mb-3"><span className="font-medium">Applying To:</span> {req.applyingTo}</p>}

                         {/* Remarks Input */}
                        <div className="mb-3">
                             <label htmlFor={`remarks-${req._id}`} className="block text-xs font-medium text-gray-500 mb-1">Admin Remarks (Optional)</label>
                             <input
                                id={`remarks-${req._id}`}
                                type="text"
                                value={remarksMap[req._id] || ''}
                                onChange={(e) => handleRemarkChange(req._id, e.target.value)}
                                className="input text-sm py-1"
                                placeholder="Add remarks before rejecting/approving..."
                             />
                        </div>


                        {/* Action Buttons */}
                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={() => handleAction(req._id, 'Rejected')}
                                disabled={loadingAction}
                                className="btn-secondary text-xs px-3 py-1 bg-red-50 text-red-700 hover:bg-red-100 border-red-200 disabled:opacity-50 flex items-center space-x-1"
                            >
                                {loadingAction ? <Loader2 className="animate-spin" size={14}/> : <X size={14}/>}
                                <span>Reject</span>
                            </button>
                            <button
                                onClick={() => handleAction(req._id, 'Approved')}
                                disabled={loadingAction}
                                className="btn-secondary text-xs px-3 py-1 bg-green-50 text-green-700 hover:bg-green-100 border-green-200 disabled:opacity-50 flex items-center space-x-1"
                            >
                                {loadingAction ? <Loader2 className="animate-spin" size={14}/> : <Check size={14}/>}
                                <span>Approve</span>
                            </button>
                        </div>
                    </div>
                );
             })}
        </div>
    );
}