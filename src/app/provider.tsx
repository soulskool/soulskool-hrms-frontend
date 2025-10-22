// src/app/provider.tsx
"use client";

import { Provider } from 'react-redux';
import { store, AppDispatch } from '../lib/redux/store';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import { checkAuthStatus } from '../lib/redux/slices/authSlice';

// Component to run the auth check on initial load
const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    // We can access dispatch directly from the store here
    (store.dispatch as AppDispatch)(checkAuthStatus());
  }, []);

  return <>{children}</>;
};

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AuthProvider>
        {children}
        <Toaster position="top-right" />
      </AuthProvider>
    </Provider>
  );
}