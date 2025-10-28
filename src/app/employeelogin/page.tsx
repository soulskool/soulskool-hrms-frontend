// src/app/employeelogin/page.tsx
"use client";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { employeeLoginSchema, EmployeeLoginSchema } from '../../lib/validation/employeeLoginSchema';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../lib/redux/store';
import { loginEmployee } from '../../lib/redux/slices/employeeAuthSlice';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { LogIn, Loader2 } from 'lucide-react';

export default function EmployeeLoginPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { employeeInfo, loading, error } = useSelector((state: RootState) => state.employeeAuth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmployeeLoginSchema>({
    resolver: zodResolver(employeeLoginSchema),
  });

  const onSubmit = (data: EmployeeLoginSchema) => {
    dispatch(loginEmployee(data));
  };

  // Effect to handle redirection and errors after login attempt
  useEffect(() => {
    if (employeeInfo) {
      toast.success('Login Successful!');
      router.push('/employee/dashboard'); // Redirect to employee dashboard
    }
    // Display error toast only if there's an error message and not loading
    if (error && !loading) {
      toast.error(error);
    }
  }, [employeeInfo, error, loading, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-sm p-8 space-y-6 bg-white rounded-xl shadow-lg">
        <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800">Employee Portal</h1>
            <p className="mt-2 text-sm text-gray-500">Sign in to access your dashboard</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label htmlFor="employeeId" className="block text-sm font-medium text-gray-600 mb-1">Employee ID</label>
            <input
              id="employeeId"
              type="text"
              {...register('employeeId')}
              className={`input ${errors.employeeId ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Enter your Employee ID"
            />
            {errors.employeeId && <p className="error-text">{errors.employeeId.message}</p>}
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-600 mb-1">Password</label>
            <input
              id="password"
              type="password"
              {...register('password')}
              className={`input ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Enter your password"
            />
            {errors.password && <p className="error-text">{errors.password.message}</p>}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary flex items-center justify-center space-x-2 h-10"
          >
            {loading ? (
                <>
                    <Loader2 className="animate-spin" size={20} />
                    <span>Signing In...</span>
                </>
             ) : (
                <>
                    <LogIn size={20} />
                    <span>Sign In</span>
                </>
             )}
          </button>
        </form>
      </div>
    </div>
  );
}