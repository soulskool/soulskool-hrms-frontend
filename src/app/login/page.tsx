// "use client";
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { loginSchema, LoginSchema } from '../../lib/validation/authSchema';
// import { useDispatch, useSelector } from 'react-redux';
// import { AppDispatch, RootState } from '../../lib/redux/store';
// import { loginAdmin } from '../../lib/redux/slices/authSlice';
// import { useRouter } from 'next/navigation';
// import { useEffect } from 'react';
// import toast from 'react-hot-toast';

// export default function LoginPage() {
//   const dispatch = useDispatch<AppDispatch>();
//   const router = useRouter();
//   const { adminInfo, loading, error } = useSelector((state: RootState) => state.auth);

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<LoginSchema>({
//     resolver: zodResolver(loginSchema),
//   });

//   const onSubmit = (data: LoginSchema) => {
//     dispatch(loginAdmin(data));
//   };

//   useEffect(() => {
//     if (adminInfo) {
//       toast.success('Login Successful!');
//       router.push('/dashboard/employees');
//     }
//     if (error) {
//       toast.error(error);
//     }
//   }, [adminInfo, error, router]);

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-background">
//       <div className="w-full max-w-md p-8 space-y-6 bg-card rounded-lg shadow-md">
//         <h1 className="text-2xl font-bold text-center text-text">Admin Login</h1>
//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//           <div>
//             <label htmlFor="email" className="block text-sm font-medium text-text-secondary">Email</label>
//             <input
//               id="email"
//               type="email"
//               {...register('email')}
//               className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
//             />
//             {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
//           </div>
//           <div>
//             <label htmlFor="password" className="block text-sm font-medium text-text-secondary">Password</label>
//             <input
//               id="password"
//               type="password"
//               {...register('password')}
//                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
//             />
//             {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
//           </div>
//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full py-2 text-red-700 rounded-md bg-primary hover:bg-primary-hover disabled:bg-gray-400"
//           >
//             {loading ? 'Logging in...' : 'Login'}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }






"use client";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginSchema } from '../../lib/validation/authSchema';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../lib/redux/store';
import { loginAdmin } from '../../lib/redux/slices/authSlice';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';


import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function LoginPage() {

  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { adminInfo, loading, error } = useSelector((state: RootState) => state.auth);

const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchema>({ resolver: zodResolver(loginSchema) });

  const onSubmit = (data: LoginSchema) => {
    dispatch(loginAdmin(data));
  };

  useEffect(() => {
    if (adminInfo) {
      toast.success('Login Successful!');
      router.push('/dashboard/employees');
    }
    if (error) {
      toast.error(error);
    }
  }, [adminInfo, error, router]);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-yellow-50 via-amber-50 to-emerald-50">
      {/* Brand auras */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-yellow-300/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-20 h-72 w-72 rounded-full bg-emerald-300/40 blur-3xl" />

      <div className="relative z-10 flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-md rounded-2xl bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-500 p-[2px] shadow-2xl">
          <Card className="rounded-2xl border-0 bg-white/80 backdrop-blur-md dark:bg-neutral-900/70">
            <CardHeader className="space-y-1.5">
              <CardTitle className="text-center text-2xl font-bold tracking-tight">Welcome back</CardTitle>
              <CardDescription className="text-center">Sign in to your account</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    className="h-11 border-amber-300/70 bg-white/80 placeholder:text-amber-700/50 focus-visible:ring-amber-500 dark:border-amber-700/60 dark:bg-neutral-900/60"
                    {...register('email')}
                  />
                  {errors.email && (
                    <p className="text-sm text-orange-700 dark:text-amber-400">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <button
                      type="button"
                      aria-label="Toggle password visibility"
                      onClick={() => setShowPassword((s) => !s)}
                      className="text-sm text-amber-700 underline-offset-4 hover:underline dark:text-amber-400"
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    className="h-11 border-emerald-300/70 bg-white/80 placeholder:text-emerald-700/50 focus-visible:ring-emerald-600 dark:border-emerald-700/60 dark:bg-neutral-900/60"
                    {...register('password')}
                  />
                  {errors.password && (
                    <p className="text-sm text-orange-700 dark:text-amber-400">{errors.password.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-11 w-full rounded-xl bg-gradient-to-r from-yellow-500 via-amber-500 to-emerald-600 text-white shadow-lg transition-all hover:brightness-110 focus-visible:ring-2 focus-visible:ring-amber-500"
                >
                  {isSubmitting ? 'Signing in…' : 'Sign in'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
