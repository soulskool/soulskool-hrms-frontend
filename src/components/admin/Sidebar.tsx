"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Users, LogOut } from 'lucide-react';
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
    ];

    return (
        <aside className="w-64 bg-card text-text flex-shrink-0 flex flex-col">
            <div className="h-16 flex items-center justify-center font-bold text-xl border-b">
                HR Portal
            </div>
            <nav className="flex-1 px-4 py-4">
                {navItems.map(item => (
                    <Link key={item.label} href={item.href} className={`flex items-center px-4 py-2 mt-2 text-sm rounded-lg ${pathname.startsWith(item.href) ? 'bg-primary text-white' : 'hover:bg-background'}`}>
                        <item.icon className="w-5 h-5" />
                        <span className="ml-3">{item.label}</span>
                    </Link>
                ))}
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
