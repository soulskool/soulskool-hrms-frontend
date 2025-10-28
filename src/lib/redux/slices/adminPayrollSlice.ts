// src/lib/redux/slices/adminPayrollSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../api';
import { SalaryAdminInfo, SalaryFormData, PayslipGenerateFormData, Payslip, PayslipListResponse } from '../../../types';

// Define the pagination structure explicitly
interface PaginationInfo {
    currentPage: number;
    totalPages: number;
    totalPayslips: number; // Added totalPayslips
}

interface AdminPayrollState {
  salaries: SalaryAdminInfo[];
  payslips: Payslip[];
  selectedPayslip: Payslip | null; // For viewing details
  payslipPagination: PaginationInfo; // Use explicit type
  loadingSalaries: boolean;
  loadingPayslips: boolean;
  loadingDetail: boolean; // For viewing payslip detail
  actionLoading: boolean; // For create/update/delete salary, generate/release/delete payslip
  error: string | null;
}

const initialState: AdminPayrollState = {
  salaries: [],
  payslips: [],
  selectedPayslip: null,
  payslipPagination: { currentPage: 1, totalPages: 1, totalPayslips: 0 }, // Initialize fully
  loadingSalaries: false,
  loadingPayslips: false,
  loadingDetail: false,
  actionLoading: false,
  error: null,
};

// --- Thunks ---

// Salary Thunks
export const fetchSalaries = createAsyncThunk(
    'adminPayroll/fetchSalaries',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.get('/admin/salaries');
            return data as SalaryAdminInfo[];
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch salaries');
        }
    }
);

export const createSalary = createAsyncThunk(
    'adminPayroll/createSalary',
    async (formData: SalaryFormData, { rejectWithValue }) => {
        try {
            const { data } = await api.post('/admin/salaries', formData);
            return data as SalaryAdminInfo; // Assuming backend returns the created object populated
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create salary record');
        }
    }
);

export const updateSalary = createAsyncThunk(
    'adminPayroll/updateSalary',
    async ({ salaryId, formData }: { salaryId: string, formData: Partial<SalaryFormData> }, { rejectWithValue }) => {
         try {
            // Filter out employeeId if present, as it shouldn't be updated
            const { employeeId, ...updateData } = formData;
            const { data } = await api.put(`/admin/salaries/${salaryId}`, updateData);
            return data as SalaryAdminInfo; // Assuming backend returns updated object populated
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update salary record');
        }
    }
);

export const deleteSalary = createAsyncThunk(
    'adminPayroll/deleteSalary',
    async (salaryId: string, { rejectWithValue }) => {
         try {
            await api.delete(`/admin/salaries/${salaryId}`);
            return salaryId; // Return ID for removal from state
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete salary record');
        }
    }
);

// Payslip Thunks
export const generatePayslip = createAsyncThunk(
    'adminPayroll/generatePayslip',
    async (formData: PayslipGenerateFormData, { rejectWithValue }) => {
        try {
            const { data } = await api.post('/admin/payslips/generate', formData);
            return data.payslip as Payslip; // API returns { message, payslip }
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to generate payslip');
        }
    }
);

export const fetchPayslips = createAsyncThunk(
    'adminPayroll/fetchPayslips',
    async ({ page = 1, employeeId, status }: { page?: number, employeeId?: string, status?: 'Released' | 'Pending' }, { rejectWithValue, getState }) => {
        try {
            let url = `/admin/payslips?page=${page}&limit=10`;
            if (employeeId) url += `&employeeId=${employeeId}`;
            if (status) url += `&status=${status}`;

            const { data } = await api.get(url);
             const currentState = (getState() as RootState).adminPayroll;

            // Append or replace based on page number
            if (page > 1) {
                return {
                    ...data,
                    // Append new results to existing list
                    payslips: [...currentState.payslips, ...data.payslips]
                } as PayslipListResponse;
            } else {
                return data as PayslipListResponse; // Replace for page 1 or filters change
            }
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch payslips');
        }
    }
);

export const fetchPayslipById = createAsyncThunk(
    'adminPayroll/fetchPayslipById',
    async (payslipId: string, { rejectWithValue }) => {
        try {
            const { data } = await api.get(`/admin/payslips/${payslipId}`);
            return data as Payslip;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch payslip details');
        }
    }
);

export const releasePayslip = createAsyncThunk(
    'adminPayroll/releasePayslip',
    async (payslipId: string, { rejectWithValue }) => {
         try {
            const { data } = await api.patch(`/admin/payslips/${payslipId}/release`);
            return data.payslip as Payslip; // API returns { message, payslip }
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to release payslip');
        }
    }
);

export const deletePayslip = createAsyncThunk(
    'adminPayroll/deletePayslip',
    async (payslipId: string, { rejectWithValue }) => {
        try {
            await api.delete(`/admin/payslips/${payslipId}`);
            return payslipId; // Return ID for removal from state
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete payslip');
        }
    }
);


// --- Slice Implementation ---
const adminPayrollSlice = createSlice({
  name: 'adminPayroll',
  initialState,
  reducers: {
    clearAdminPayrollError: (state) => { state.error = null; },
    clearSelectedAdminPayslip: (state) => { state.selectedPayslip = null; state.loadingDetail = false;}
  },
  extraReducers: (builder) => {
    // --- Salary Cases ---
    builder.addCase(fetchSalaries.pending, (state) => { state.loadingSalaries = true; state.error = null; });
    builder.addCase(fetchSalaries.fulfilled, (state, action: PayloadAction<SalaryAdminInfo[]>) => {
        state.loadingSalaries = false; state.salaries = action.payload;
    });
    builder.addCase(fetchSalaries.rejected, (state, action) => { state.loadingSalaries = false; state.error = action.payload as string; });

    builder.addCase(createSalary.pending, (state) => { state.actionLoading = true; state.error = null; });
    builder.addCase(createSalary.fulfilled, (state, action: PayloadAction<SalaryAdminInfo>) => {
        state.actionLoading = false; state.salaries.unshift(action.payload);
    });
    builder.addCase(createSalary.rejected, (state, action) => { state.actionLoading = false; state.error = action.payload as string; });

    builder.addCase(updateSalary.pending, (state) => { state.actionLoading = true; state.error = null; });
    builder.addCase(updateSalary.fulfilled, (state, action: PayloadAction<SalaryAdminInfo>) => {
        state.actionLoading = false;
        const index = state.salaries.findIndex(s => s._id === action.payload._id);
        if (index !== -1) {
             // Merge update with existing data if needed, or replace fully
             // Backend returns populated employee, so replace is fine
             state.salaries[index] = action.payload;
        }
    });
     builder.addCase(updateSalary.rejected, (state, action) => { state.actionLoading = false; state.error = action.payload as string; });

     builder.addCase(deleteSalary.pending, (state) => { state.actionLoading = true; state.error = null; });
    builder.addCase(deleteSalary.fulfilled, (state, action: PayloadAction<string>) => {
        state.actionLoading = false; state.salaries = state.salaries.filter(s => s._id !== action.payload);
    });
    builder.addCase(deleteSalary.rejected, (state, action) => { state.actionLoading = false; state.error = action.payload as string; });

    // --- Payslip Cases ---
    builder.addCase(generatePayslip.pending, (state) => { state.actionLoading = true; state.error = null; });
    builder.addCase(generatePayslip.fulfilled, (state, action: PayloadAction<Payslip>) => {
        state.actionLoading = false; state.payslips.unshift(action.payload); // Add to payslip list
    });
     builder.addCase(generatePayslip.rejected, (state, action) => { state.actionLoading = false; state.error = action.payload as string; });

     builder.addCase(fetchPayslips.pending, (state) => { state.loadingPayslips = true; state.error = null; });
     builder.addCase(fetchPayslips.fulfilled, (state, action: PayloadAction<PayslipListResponse>) => {
        state.loadingPayslips = false;
        state.payslips = action.payload.payslips; // Assumes thunk handled append/replace
        state.payslipPagination = { currentPage: action.payload.currentPage, totalPages: action.payload.totalPages, totalPayslips: action.payload.totalPayslips };
     });
     builder.addCase(fetchPayslips.rejected, (state, action) => { state.loadingPayslips = false; state.error = action.payload as string; });

     builder.addCase(fetchPayslipById.pending, (state) => { state.loadingDetail = true; state.error = null; state.selectedPayslip = null;});
     builder.addCase(fetchPayslipById.fulfilled, (state, action: PayloadAction<Payslip>) => {
         state.loadingDetail = false; state.selectedPayslip = action.payload;
     });
     builder.addCase(fetchPayslipById.rejected, (state, action) => { state.loadingDetail = false; state.error = action.payload as string; });

     builder.addCase(releasePayslip.pending, (state) => { state.actionLoading = true; state.error = null;});
     builder.addCase(releasePayslip.fulfilled, (state, action: PayloadAction<Payslip>) => {
         state.actionLoading = false;
         const index = state.payslips.findIndex(p => p._id === action.payload._id);
         if (index !== -1) {
             state.payslips[index].isReleased = true; // Update status in list
             state.payslips[index].releasedAt = action.payload.releasedAt; // Update timestamp
         }
         if (state.selectedPayslip?._id === action.payload._id) {
            state.selectedPayslip.isReleased = true; // Update detail view
            state.selectedPayslip.releasedAt = action.payload.releasedAt;
         }
     });
     builder.addCase(releasePayslip.rejected, (state, action) => { state.actionLoading = false; state.error = action.payload as string; });

     builder.addCase(deletePayslip.pending, (state) => { state.actionLoading = true; state.error = null;});
     builder.addCase(deletePayslip.fulfilled, (state, action: PayloadAction<string>) => {
         state.actionLoading = false; state.payslips = state.payslips.filter(p => p._id !== action.payload);
         if(state.selectedPayslip?._id === action.payload) state.selectedPayslip = null;
     });
     builder.addCase(deletePayslip.rejected, (state, action) => { state.actionLoading = false; state.error = action.payload as string; });

  },
});

// Need RootState for getState in thunk
import { RootState } from '../store';

export const { clearAdminPayrollError, clearSelectedAdminPayslip } = adminPayrollSlice.actions;
export default adminPayrollSlice.reducer;