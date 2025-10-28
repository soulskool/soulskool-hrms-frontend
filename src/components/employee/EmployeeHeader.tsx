// src/components/employee/EmployeeHeader.tsx
"use client";
import { useSelector } from 'react-redux';
import { RootState } from '../../lib/redux/store';
import { User } from 'lucide-react'; // Icon for profile

export default function EmployeeHeader() {
    const { employeeInfo } = useSelector((state: RootState) => state.employeeAuth);

    return (
        <header className="h-16 bg-white shadow-sm flex justify-end items-center px-6 border-b">
            {/* Display Employee Name and Profile Pic/Icon */}
            {employeeInfo && (
                <div className='flex items-center space-x-3'>
                    <div className='text-right'>
                        <p className='font-semibold text-sm text-gray-800'>{employeeInfo.name}</p>
                        <p className='text-xs text-gray-500'>{employeeInfo.employeeId}</p>
                    </div>
                     <img
                        src={employeeInfo.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(employeeInfo.name)}&background=random&color=fff`}
                        alt={employeeInfo.name}
                        className="h-9 w-9 rounded-full object-cover border border-gray-200"
                        onError={(e) => (e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(employeeInfo.name)}&background=random&color=fff`)}
                     />
                </div>
            )}
        </header>
    );
}