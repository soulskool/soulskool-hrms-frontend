// src/components/employee/EmployeeSidebar.tsx
"use client";
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, LogOut, Briefcase, ListTodo, DollarSign } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../lib/redux/store';
import { logoutEmployee } from '../../lib/redux/slices/employeeAuthSlice';
import { resetAttendance } from '../../lib/redux/slices/attendanceSlice'; // Import reset action
import toast from 'react-hot-toast';

export default function EmployeeSidebar() {
    const pathname = usePathname();
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();

    const handleLogout = async () => {
        const result = await dispatch(logoutEmployee());
        dispatch(resetAttendance()); // Reset attendance state on logout
        if(logoutEmployee.fulfilled.match(result)) {
            toast.success("Logged out successfully");
            router.push('/employeelogin');
        } else {
            // Handle potential logout error (optional)
            toast.error("Logout failed on server, session cleared locally.");
             router.push('/employeelogin'); // Still redirect
        }
    };

    const navItems = [
        { href: '/employee/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { href: '/employee/leave-management', icon: Briefcase, label: 'Leave Management' },
        { href: '/employee/tasks', icon: ListTodo, label: 'My Tasks' },
        { href: '/employee/payslips', icon: DollarSign, label: 'My Payslips' },
    ];

    return (
        <aside className="w-60 bg-white text-gray-800 flex-shrink-0 flex flex-col shadow-md">
            {/* Logo/Brand */}
            <div className="h-16 flex items-center justify-center font-bold text-xl border-b text-blue-700">
                Employee Portal
            </div>
            {/* Navigation */}
            <nav className="flex-1 px-4 py-4 space-y-2">
                {navItems.map(item => {
                    const isActive = pathname === item.href;
                    return (
                        <Link key={item.label} href={item.href}
                              className={`flex items-center px-4 py-2.5 text-sm rounded-lg transition-colors duration-150 ease-in-out
                                         ${isActive ? 'bg-blue-600 text-white shadow-sm' : 'hover:bg-gray-100 text-gray-600'}`}>
                            <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                            <span className="ml-3 font-medium">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>
            {/* Logout Button */}
            <div className='p-4 border-t'>
                 <button onClick={handleLogout} className="flex items-center w-full px-4 py-2.5 text-sm text-red-600 rounded-lg hover:bg-red-50 transition-colors duration-150 ease-in-out">
                    <LogOut className="w-5 h-5" />
                    <span className="ml-3 font-medium">Logout</span>
                </button>
            </div>
        </aside>
    );
}