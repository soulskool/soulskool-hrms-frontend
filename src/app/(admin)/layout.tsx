// src/app/(admin)/layout.tsx

"use client";

import { useSelector } from "react-redux";
import { RootState } from "../../lib/redux/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Sidebar from "../../components/admin/Sidebar";
import Header from "../../components/admin/Header";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { adminInfo, isAuthChecked } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    // This effect is correct. It triggers the redirect when the auth check is
    // complete and we know for sure there is no logged-in admin.
    if (isAuthChecked && !adminInfo) {
      router.push("/login");
    }
  }, [adminInfo, isAuthChecked, router]);

  // **THE BUG FIX IS HERE**
  // We simplify the loading state. If the initial auth check isn't done, OR
  // if there's no admin info (meaning we are waiting for the redirect),
  // we show a loading screen. This prevents the blank page.
  if (!isAuthChecked || !adminInfo) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <p>Loading...</p>
      </div>
    );
  }

  // This part only runs if isAuthChecked is true AND adminInfo exists.
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}