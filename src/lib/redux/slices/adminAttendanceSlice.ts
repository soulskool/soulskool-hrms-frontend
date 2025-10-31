// // src/lib/redux/slices/adminAttendanceSlice.ts
// import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
// import api from '../../api';
// import { TodayOverviewData, AttendanceHistoryData } from '../../../types';

// interface AdminAttendanceState {
//   todayOverview: TodayOverviewData | null;
//   history: {
//     data: AttendanceHistoryData | null;
//     loadingMore: boolean; // For pagination loading state
//   };
//   loadingOverview: boolean;
//   loadingHistory: boolean; // Initial history load
//   error: string | null;
// }

// const initialState: AdminAttendanceState = {
//   todayOverview: null,
//   history: {
//     data: null,
//     loadingMore: false,
//   },
//   loadingOverview: false,
//   loadingHistory: false,
//   error: null,
// };

// // --- Async Thunks ---

// // Fetch Today's Overview
// export const fetchTodayOverview = createAsyncThunk(
//   'adminAttendance/fetchTodayOverview',
//   async (_, { rejectWithValue }) => {
//     try {
//       const { data } = await api.get('/admin/attendance/today-overview');
//       return data as TodayOverviewData;
//     } catch (error: any) {
//       return rejectWithValue(error.response?.data?.message || 'Failed to fetch today overview');
//     }
//   }
// );

// // Fetch Attendance History (Paginated)
// export const fetchAttendanceHistory = createAsyncThunk(
//   'adminAttendance/fetchHistory',
//   async (page: number = 1, { rejectWithValue, getState }) => {
//     try {
//       const { data } = await api.get(`/admin/attendance/history?page=${page}&limit=15`);
//       const currentState = (getState() as RootState).adminAttendance.history.data;

//       // Logic to append or replace based on page number
//       if (page > 1 && currentState) {
//           // Append new employees if they don't exist, merge attendance data
//           const existingEmployeeMap = new Map(currentState.employeesAttendance.map(e => [e._id, e]));
//           const mergedEmployees = [...currentState.employeesAttendance];

//           (data as AttendanceHistoryData).employeesAttendance.forEach(newEmp => {
//               if (existingEmployeeMap.has(newEmp._id)) {
//                   // Merge attendance records for existing employee
//                   const existingEmp = existingEmployeeMap.get(newEmp._id)!;
//                   existingEmp.attendance = { ...existingEmp.attendance, ...newEmp.attendance };
//               } else {
//                   // Add new employee if not in the current list (might happen with pagination edge cases)
//                    mergedEmployees.push(newEmp);
//               }
//           });


//         return {
//           employeesAttendance: mergedEmployees, // Use the potentially merged list
//           // Prepend new dates, ensuring uniqueness and correct order
//           dates: [...new Set([...(data as AttendanceHistoryData).dates, ...currentState.dates])].sort().reverse(),
//           currentPage: page,
//         } as AttendanceHistoryData;
//       } else {
//         // Replace data for the first page
//         return data as AttendanceHistoryData;
//       }
//     } catch (error: any) {
//       return rejectWithValue(error.response?.data?.message || 'Failed to fetch attendance history');
//     }
//   }
// );


// // --- Slice Definition ---

// const adminAttendanceSlice = createSlice({
//   name: 'adminAttendance',
//   initialState,
//   reducers: {
//      clearAdminAttendanceError: (state) => {
//         state.error = null;
//      }
//   },
//   extraReducers: (builder) => {
//     builder
//       // Today Overview Cases
//       .addCase(fetchTodayOverview.pending, (state) => { state.loadingOverview = true; state.error = null; })
//       .addCase(fetchTodayOverview.fulfilled, (state, action: PayloadAction<TodayOverviewData>) => {
//         state.loadingOverview = false;
//         state.todayOverview = action.payload;
//       })
//       .addCase(fetchTodayOverview.rejected, (state, action) => { state.loadingOverview = false; state.error = action.payload as string; })

//       // Attendance History Cases
//       .addCase(fetchAttendanceHistory.pending, (state, action) => {
//         // Differentiate between initial load and loading more
//         if (action.meta.arg > 1) { // action.meta.arg holds the page number passed to the thunk
//           state.history.loadingMore = true;
//         } else {
//           state.loadingHistory = true;
//         }
//         state.error = null;
//       })
//       .addCase(fetchAttendanceHistory.fulfilled, (state, action: PayloadAction<AttendanceHistoryData>) => {
//          state.history.data = action.payload; // Always update with the latest merged/fetched data
//          state.loadingHistory = false;
//          state.history.loadingMore = false;
//       })
//       .addCase(fetchAttendanceHistory.rejected, (state, action) => {
//         state.loadingHistory = false;
//         state.history.loadingMore = false;
//         state.error = action.payload as string;
//       });
//   },
// });

// // Need RootState for getState in thunk
// import { RootState } from '../store';

// export const { clearAdminAttendanceError } = adminAttendanceSlice.actions;
// export default adminAttendanceSlice.reducer;












// src/lib/redux/slices/adminAttendanceSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../api';
import { TodayOverviewData, AttendanceHistoryData } from '../../../types';
import type { RootState } from '../store';

interface AdminAttendanceState {
  todayOverview: TodayOverviewData | null;
  history: {
    data: AttendanceHistoryData | null;
    loadingMore: boolean;
  };
  loadingOverview: boolean;
  loadingHistory: boolean;
   exporting?: boolean;
  exportError?: string | null;
  error: string | null;
}

const initialState: AdminAttendanceState = {
  todayOverview: null,
  history: { data: null, loadingMore: false },
  loadingOverview: false,
  loadingHistory: false,
  exporting: false,
  exportError: null,
  error: null,
};

export const fetchTodayOverview = createAsyncThunk(
  'adminAttendance/fetchTodayOverview',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/admin/attendance/today-overview');
      return data as TodayOverviewData;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || 'Failed to fetch today overview');
    }
  }
);

// Always return fulfilled for 200 responses, even when empty
export const fetchAttendanceHistory = createAsyncThunk<
  AttendanceHistoryData,
  number,
  { state: RootState; rejectValue: string }
>(
  'adminAttendance/fetchHistory',
  async (page = 1, { rejectWithValue, getState }) => {
    try {
      const { data } = await api.get(`/admin/attendance/history?page=${page}&limit=15`);
      const server = data as AttendanceHistoryData;

      // Normalize server shapes
      const normalized: AttendanceHistoryData = {
        employeesAttendance: Array.isArray(server.employeesAttendance) ? server.employeesAttendance : [],
        dates: Array.isArray(server.dates) ? server.dates : [],
        currentPage: Number.isFinite(server.currentPage) ? server.currentPage : page,
        hasMore: !!server.hasMore,
      };

      const current = (getState().adminAttendance.history.data ?? null) as AttendanceHistoryData | null;

      // First page: replace
      if (page <= 1 || !current) return normalized;

      // Merge older page into existing state
      const existingEmployeeMap = new Map(current.employeesAttendance.map(e => [e._id, e]));
      const mergedEmployees = [...current.employeesAttendance];

      for (const newEmp of normalized.employeesAttendance) {
        const existing = existingEmployeeMap.get(newEmp._id);
        if (existing) {
          // Append older dates to the same object; older dates must not overwrite newer ones
          existing.attendance = { ...newEmp.attendance, ...existing.attendance };
        } else {
          mergedEmployees.push(newEmp);
        }
      }

      // Dates: server sends newest-first for the page.
      // Keep existing newest-first, then append older dates (avoid duplicates).
      const existingDates = current.dates;
      const newDates = normalized.dates;
      const mergedDates = [...existingDates, ...newDates.filter(d => !existingDates.includes(d))];

      return {
        employeesAttendance: mergedEmployees,
        dates: mergedDates,
        currentPage: page,
        hasMore: normalized.hasMore,
      };
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || 'Failed to fetch attendance history');
    }
  }
);


export const exportMonthlyAttendance = createAsyncThunk<
  void,
  { year: number; month: number },
  { rejectValue: string }
>(
  'adminAttendance/exportMonthlyAttendance',
  async ({ year, month }, { rejectWithValue }) => {
    try {
      const res = await api.get(`/admin/attendance/export?year=${year}&month=${month}`, {
        responseType: 'blob',
      });
      // Create filename
      const y = String(year);
      const m = String(month).padStart(2, '0');
      const filename = `Attendance_${y}-${m}.xlsx`;

      // Download
      const url = URL.createObjectURL(res.data);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message || 'Failed to export attendance');
    }
  }
);






const adminAttendanceSlice = createSlice({
  name: 'adminAttendance',
  initialState,
  reducers: {
    clearAdminAttendanceError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      // Today overview
      .addCase(fetchTodayOverview.pending, (state) => {
        state.loadingOverview = true;
        state.error = null;
      })
      .addCase(fetchTodayOverview.fulfilled, (state, action: PayloadAction<TodayOverviewData>) => {
        state.loadingOverview = false;
        state.todayOverview = action.payload;
      })
      .addCase(fetchTodayOverview.rejected, (state, action) => {
        state.loadingOverview = false;
        state.error = action.payload as string;
      })

      // History
      .addCase(fetchAttendanceHistory.pending, (state, action) => {
        if (action.meta.arg > 1) state.history.loadingMore = true;
        else state.loadingHistory = true;
        // Do not clear to avoid flicker; but clear previous fatal errors
        // Keep neutral UI for no-more-data cases
      })
      .addCase(fetchAttendanceHistory.fulfilled, (state, action: PayloadAction<AttendanceHistoryData>) => {
        state.history.data = action.payload;
        state.loadingHistory = false;
        state.history.loadingMore = false;
        // Crucial: clear error on success so the red banner disappears
        state.error = null;
      })
      .addCase(fetchAttendanceHistory.rejected, (state, action) => {
        state.loadingHistory = false;
        state.history.loadingMore = false;
        // Show error only for true failures; if network ok but UI merged wrong previously,
        // this still catches real errors from catch branch.
        state.error = action.payload as string;
      })

       .addCase(exportMonthlyAttendance.pending, (state) => {
    state.exporting = true;
    state.exportError = null;
  })
  .addCase(exportMonthlyAttendance.fulfilled, (state) => {
    state.exporting = false;
  })
  .addCase(exportMonthlyAttendance.rejected, (state, action) => {
    state.exporting = false;
    state.exportError = action.payload as string;
  });

      

  },
});

export const { clearAdminAttendanceError } = adminAttendanceSlice.actions;
export default adminAttendanceSlice.reducer;
