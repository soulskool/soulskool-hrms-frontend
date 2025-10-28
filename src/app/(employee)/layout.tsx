// src/app/(employee)/layout.tsx
"use client";

import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../lib/redux/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import EmployeeSidebar from "../../components/employee/EmployeeSidebar"; // Create this
import EmployeeHeader from "../../components/employee/EmployeeHeader"; // Create this
import { checkEmployeeAuthStatus } from "../../lib/redux/slices/employeeAuthSlice";
import { Loader2 } from "lucide-react";

export default function EmployeeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { employeeInfo, isEmployeeAuthChecked, loading } = useSelector((state: RootState) => state.employeeAuth);

  // Run auth check on initial load if not already checked
  useEffect(() => {
      if (!isEmployeeAuthChecked) {
          dispatch(checkEmployeeAuthStatus());
      }
  }, [dispatch, isEmployeeAuthChecked])

  // Effect to handle redirection based on auth status
  useEffect(() => {
    // Only redirect if the auth check is complete and there's no employee info
    if (isEmployeeAuthChecked && !employeeInfo && !loading) {
      router.push("/employeelogin"); // Redirect to employee login page
    }
  }, [employeeInfo, isEmployeeAuthChecked, loading, router]);

  // Show loading screen while checking auth or if employeeInfo isn't available yet
  if (!isEmployeeAuthChecked || loading || (isEmployeeAuthChecked && !employeeInfo) ) {
    return (
        <div className="flex items-center justify-center h-screen bg-background">
            <Loader2 className="animate-spin text-blue-600" size={40} />
        </div>
    );
  }

  // If check is done and we have an employee, render the layout
  return (
    <div className="flex h-screen bg-gray-100">
      <EmployeeSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <EmployeeHeader />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}