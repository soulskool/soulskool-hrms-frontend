// src/lib/redux/slices/employeeAuthSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../api'; // Use the shared api instance
import { EmployeeLoginCredentials, EmployeeInfo } from '../../../types';

interface EmployeeAuthState {
  employeeInfo: EmployeeInfo | null;
  loading: boolean;
  error: string | null;
  isEmployeeAuthChecked: boolean; // Tracks if initial auth check is done
}

const initialState: EmployeeAuthState = {
  employeeInfo: null,
  loading: false,
  error: null,
  isEmployeeAuthChecked: false,
};

// --- Async Thunks ---

// Login Employee
export const loginEmployee = createAsyncThunk(
  'employeeAuth/login',
  async (credentials: EmployeeLoginCredentials, { rejectWithValue }) => {
    try {
      // Make sure the API call uses the /employee prefix
      const { data } = await api.post('/employee/login', credentials);
      return data as EmployeeInfo;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

// Logout Employee
export const logoutEmployee = createAsyncThunk(
  'employeeAuth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await api.post('/employee/logout');
      return null; // Indicate successful logout
    } catch (error: any) {
       // Even if logout API fails, clear frontend state
       console.error("Logout API failed:", error.response?.data?.message);
       return null; // Still proceed with clearing state
    }
  }
);

// Check Employee Auth Status
export const checkEmployeeAuthStatus = createAsyncThunk(
  'employeeAuth/checkStatus',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/employee/profile');
      return data as EmployeeInfo;
    } catch (error: any) {
      // If profile fetch fails (e.g., 401), it means not logged in
      return rejectWithValue('Not authenticated');
    }
  }
);

// --- Slice Definition ---

const employeeAuthSlice = createSlice({
  name: 'employeeAuth',
  initialState,
  reducers: {
    // Manual clear state if needed
    clearEmployeeAuth: (state) => {
        state.employeeInfo = null;
        state.error = null;
        // Keep isEmployeeAuthChecked as true if it was checked once
    }
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(loginEmployee.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(loginEmployee.fulfilled, (state, action: PayloadAction<EmployeeInfo>) => {
        state.loading = false;
        state.employeeInfo = action.payload;
        state.isEmployeeAuthChecked = true; // Login implies auth is checked
      })
      .addCase(loginEmployee.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; state.isEmployeeAuthChecked = true; }) // Auth check is done even on fail

      // Logout cases
       .addCase(logoutEmployee.pending, (state) => { state.loading = true; }) // Optional: show loading on logout
      .addCase(logoutEmployee.fulfilled, (state) => {
        state.loading = false;
        state.employeeInfo = null;
        state.error = null;
      })
       .addCase(logoutEmployee.rejected, (state) => { // Still clear state on rejection
        state.loading = false;
        state.employeeInfo = null;
        state.error = "Logout failed, session cleared locally.";
      })

      // Check Status cases
      .addCase(checkEmployeeAuthStatus.pending, (state) => { state.isEmployeeAuthChecked = false; state.loading = true; }) // Show loading during initial check
      .addCase(checkEmployeeAuthStatus.fulfilled, (state, action: PayloadAction<EmployeeInfo>) => {
        state.isEmployeeAuthChecked = true;
        state.loading = false;
        state.employeeInfo = action.payload;
      })
      .addCase(checkEmployeeAuthStatus.rejected, (state) => {
        state.isEmployeeAuthChecked = true;
        state.loading = false;
        state.employeeInfo = null; // Ensure employeeInfo is null if check fails
      });
  },
});

export const { clearEmployeeAuth } = employeeAuthSlice.actions;
export default employeeAuthSlice.reducer;