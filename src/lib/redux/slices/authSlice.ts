import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../api';
import { LoginCredentials, Admin } from '../../../types';

interface AuthState {
  adminInfo: Admin | null;
  loading: boolean;
  error: string | null;
  isAuthChecked: boolean;
}

const initialState: AuthState = {
  adminInfo: null,
  loading: false,
  error: null,
  isAuthChecked: false,
};

// Async Thunk for login
export const loginAdmin = createAsyncThunk(
  'auth/loginAdmin',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/admin/login', credentials);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

// Async Thunk for logout
export const logoutAdmin = createAsyncThunk(
  'auth/logoutAdmin',
  async (_, { rejectWithValue }) => {
    try {
      await api.post('/admin/logout');
      return null;
    } catch (error: any) {
       return rejectWithValue(error.response?.data?.message || 'Logout failed');
    }
  }
);


export const checkAuthStatus = createAsyncThunk(
  'auth/checkAuthStatus',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/admin/profile');
      return data;
    } catch (error: any) {
      return rejectWithValue('Session expired or not authenticated.');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
     // Reducer to manually set admin info if needed (e.g., from session storage)
    setAdminInfo: (state, action: PayloadAction<Admin>) => {
      state.adminInfo = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(loginAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAdmin.fulfilled, (state, action: PayloadAction<Admin>) => {
        state.loading = false;
        state.adminInfo = action.payload;
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Logout cases
      .addCase(logoutAdmin.fulfilled, (state) => {
        state.adminInfo = null;
      })
     .addCase(checkAuthStatus.pending, (state) => {
        state.isAuthChecked = false;
      })
      .addCase(checkAuthStatus.fulfilled, (state, action: PayloadAction<Admin>) => {
        state.isAuthChecked = true;
        state.adminInfo = action.payload;
      })
      .addCase(checkAuthStatus.rejected, (state) => {
        state.isAuthChecked = true;
        state.adminInfo = null;
      });
      
  },
});

export const { setAdminInfo } = authSlice.actions;
export default authSlice.reducer;
