"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Users, LogOut, CalendarCheck, Briefcase, ListTodo, DollarSign } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../lib/redux/store';
import { logoutAdmin } from '../../lib/redux/slices/authSlice';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function Sidebar() {
    const pathname = usePathname();
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();

    const handleLogout = async () => {
        const result = await dispatch(logoutAdmin());
        if(logoutAdmin.fulfilled.match(result)) {
            toast.success("Logged out successfully");
            router.push('/login');
        }
    };
    
    const navItems = [
        { href: '/dashboard/employees', icon: Users, label: 'Employees' },
        { href: '/attendance-overview', icon: CalendarCheck, label: 'Attendance' },
        { href: '/leave-admin', icon: Briefcase, label: 'Leave Admin' },
        { href: '/tasks', icon: ListTodo, label: 'Task Admin' },
        { href: '/payroll', icon: DollarSign, label: 'Payroll Admin' },
    ];

    return (
        <aside className="w-64 bg-card text-text flex-shrink-0 flex flex-col">
            <div className="h-16 flex items-center justify-center font-bold text-xl border-b">
                HR Portal
            </div>
            <nav className="flex-1 px-4 py-4">
                {navItems.map(item => {
                    const isActive = pathname.startsWith(item.href);
                    return(
                  <Link key={item.label} href={item.href}
                              className={`flex items-center px-4 py-2.5 text-sm rounded-lg transition-colors duration-150 ease-in-out group ${
                                isActive
                                ? 'bg-primary text-white shadow-sm'
                                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                              }`}
                        >
                            <item.icon className={`w-5 h-5 mr-3 flex-shrink-0 ${
                                isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-500'
                            }`} aria-hidden="true" />
                            <span className="font-medium">{item.label}</span>
                        </Link>
                    )
})}
            </nav>
            <div className='p-4 border-t'>
                 <button onClick={handleLogout} className="flex items-center w-full px-4 py-2 mt-2 text-sm text-red-500 rounded-lg hover:bg-red-50">
                    <LogOut className="w-5 h-5" />
                    <span className="ml-3">Logout</span>
                </button>
            </div>
        </aside>
    );
}
