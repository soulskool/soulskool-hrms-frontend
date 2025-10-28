// src/lib/redux/slices/adminAttendanceSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../api';
import { TodayOverviewData, AttendanceHistoryData } from '../../../types';

interface AdminAttendanceState {
  todayOverview: TodayOverviewData | null;
  history: {
    data: AttendanceHistoryData | null;
    loadingMore: boolean; // For pagination loading state
  };
  loadingOverview: boolean;
  loadingHistory: boolean; // Initial history load
  error: string | null;
}

const initialState: AdminAttendanceState = {
  todayOverview: null,
  history: {
    data: null,
    loadingMore: false,
  },
  loadingOverview: false,
  loadingHistory: false,
  error: null,
};

// --- Async Thunks ---

// Fetch Today's Overview
export const fetchTodayOverview = createAsyncThunk(
  'adminAttendance/fetchTodayOverview',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/admin/attendance/today-overview');
      return data as TodayOverviewData;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch today overview');
    }
  }
);

// Fetch Attendance History (Paginated)
export const fetchAttendanceHistory = createAsyncThunk(
  'adminAttendance/fetchHistory',
  async (page: number = 1, { rejectWithValue, getState }) => {
    try {
      const { data } = await api.get(`/admin/attendance/history?page=${page}&limit=15`);
      const currentState = (getState() as RootState).adminAttendance.history.data;

      // Logic to append or replace based on page number
      if (page > 1 && currentState) {
          // Append new employees if they don't exist, merge attendance data
          const existingEmployeeMap = new Map(currentState.employeesAttendance.map(e => [e._id, e]));
          const mergedEmployees = [...currentState.employeesAttendance];

          (data as AttendanceHistoryData).employeesAttendance.forEach(newEmp => {
              if (existingEmployeeMap.has(newEmp._id)) {
                  // Merge attendance records for existing employee
                  const existingEmp = existingEmployeeMap.get(newEmp._id)!;
                  existingEmp.attendance = { ...existingEmp.attendance, ...newEmp.attendance };
              } else {
                  // Add new employee if not in the current list (might happen with pagination edge cases)
                   mergedEmployees.push(newEmp);
              }
          });


        return {
          employeesAttendance: mergedEmployees, // Use the potentially merged list
          // Prepend new dates, ensuring uniqueness and correct order
          dates: [...new Set([...(data as AttendanceHistoryData).dates, ...currentState.dates])].sort().reverse(),
          currentPage: page,
        } as AttendanceHistoryData;
      } else {
        // Replace data for the first page
        return data as AttendanceHistoryData;
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch attendance history');
    }
  }
);


// --- Slice Definition ---

const adminAttendanceSlice = createSlice({
  name: 'adminAttendance',
  initialState,
  reducers: {
     clearAdminAttendanceError: (state) => {
        state.error = null;
     }
  },
  extraReducers: (builder) => {
    builder
      // Today Overview Cases
      .addCase(fetchTodayOverview.pending, (state) => { state.loadingOverview = true; state.error = null; })
      .addCase(fetchTodayOverview.fulfilled, (state, action: PayloadAction<TodayOverviewData>) => {
        state.loadingOverview = false;
        state.todayOverview = action.payload;
      })
      .addCase(fetchTodayOverview.rejected, (state, action) => { state.loadingOverview = false; state.error = action.payload as string; })

      // Attendance History Cases
      .addCase(fetchAttendanceHistory.pending, (state, action) => {
        // Differentiate between initial load and loading more
        if (action.meta.arg > 1) { // action.meta.arg holds the page number passed to the thunk
          state.history.loadingMore = true;
        } else {
          state.loadingHistory = true;
        }
        state.error = null;
      })
      .addCase(fetchAttendanceHistory.fulfilled, (state, action: PayloadAction<AttendanceHistoryData>) => {
         state.history.data = action.payload; // Always update with the latest merged/fetched data
         state.loadingHistory = false;
         state.history.loadingMore = false;
      })
      .addCase(fetchAttendanceHistory.rejected, (state, action) => {
        state.loadingHistory = false;
        state.history.loadingMore = false;
        state.error = action.payload as string;
      });
  },
});

// Need RootState for getState in thunk
import { RootState } from '../store';

export const { clearAdminAttendanceError } = adminAttendanceSlice.actions;
export default adminAttendanceSlice.reducer;