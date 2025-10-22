"use client";
import { useSelector } from 'react-redux';
import { RootState } from '../../lib/redux/store';

export default function Header() {
    const { adminInfo } = useSelector((state: RootState) => state.auth);

    return (
        <header className="h-16 bg-card shadow-sm flex justify-end items-center px-6">
            <div className='text-right'>
                <p className='font-semibold text-text'>{adminInfo?.name}</p>
                <p className='text-sm text-text-secondary'>{adminInfo?.email}</p>
            </div>
        </header>
    );
}
