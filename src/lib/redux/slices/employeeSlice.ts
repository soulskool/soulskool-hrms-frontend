// import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
// import api from '../../api';
// import { Employee } from '../../../types';

// interface EmployeeState {
//   employees: Employee[];
//   loading: boolean;
//   error: string | null;
// }

// const initialState: EmployeeState = {
//   employees: [],
//   loading: false,
//   error: null,
// };

// // Async Thunks
// export const fetchEmployees = createAsyncThunk('employees/fetchAll', async (_, { rejectWithValue }) => {
//     try {
//         const { data } = await api.get('/admin/employees');
//         return data;
//     } catch (error: any) {
//         return rejectWithValue('Failed to fetch employees');
//     }
// });

// export const createEmployee = createAsyncThunk('employees/create', async (employeeData: FormData, { rejectWithValue }) => {
//     try {
//         const { data } = await api.post('/admin/employees', employeeData, {
//             headers: { 'Content-Type': 'multipart/form-data' },
//         });
//         return data;
//     } catch (error: any) {
//         return rejectWithValue(error.response?.data?.message || 'Failed to create employee');
//     }
// });


// export const updateEmployee = createAsyncThunk(
//   'employees/update',
//   async ({ id, employeeData }: { id: string; employeeData: FormData }, { rejectWithValue }) => {
//     try {
//       const { data } = await api.put(`/admin/employees/${id}`, employeeData, {
//         headers: { 'Content-Type': 'multipart/form-data' },
//       });
//       return data;
//     } catch (error: any) {
//       return rejectWithValue(error.response?.data?.message || 'Failed to update employee');
//     }
//   }
// );

// // NEW: Delete Employee Thunk
// export const deleteEmployee = createAsyncThunk(
//   'employees/delete',
//   async (id: string, { rejectWithValue }) => {
//     try {
//       await api.delete(`/admin/employees/${id}`);
//       return id;
//     } catch (error: any) {
//       return rejectWithValue('Failed to delete employee');
//     }
//   }
// );









// const employeeSlice = createSlice({
//     name: 'employees',
//     initialState,
//     reducers: {},
//     extraReducers: builder => {
//         builder
//             // Fetch employees
//             .addCase(fetchEmployees.pending, state => {
//                 state.loading = true;
//             })
//             .addCase(fetchEmployees.fulfilled, (state, action: PayloadAction<Employee[]>) => {
//                 state.loading = false;
//                 state.employees = action.payload;
//             })
//             .addCase(fetchEmployees.rejected, (state, action) => {
//                 state.loading = false;
//                 state.error = action.payload as string;
//             })
//             // Create employee
//             .addCase(createEmployee.pending, state => {
//                 state.loading = true;
//             })
//             .addCase(createEmployee.fulfilled, (state, action: PayloadAction<Employee>) => {
//                 state.loading = false;
//                 state.employees.push(action.payload);
//             })
//             .addCase(createEmployee.rejected, (state, action) => {
//                 state.loading = false;
//                 state.error = action.payload as string;
//             })

//             .addCase(updateEmployee.fulfilled, (state, action: PayloadAction<Employee>) => {
//         const index = state.employees.findIndex(emp => emp._id === action.payload._id);
//         if (index !== -1) {
//           state.employees[index] = action.payload;
//         }
//       })
//       // NEW: Delete employee cases
//       .addCase(deleteEmployee.fulfilled, (state, action: PayloadAction<string>) => {
//         state.employees = state.employees.filter(emp => emp._id !== action.payload);
//       });
//     }
// });

// export default employeeSlice.reducer;







import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../api';
import { Employee } from '../../../types';

interface EmployeeState {
  employees: Employee[]; // Contains FULL data for all employees
  loadingList: boolean;
  loadingAction: boolean; // Single loading state for Create/Update/Delete modal actions
  error: string | null;
}

const initialState: EmployeeState = {
  employees: [],
  loadingList: false,
  loadingAction: false,
  error: null,
};

// --- Async Thunks ---

export const fetchEmployees = createAsyncThunk('employees/fetchAll', async (_, { rejectWithValue }) => {
    try {
        // This now fetches ALL employee data
        const { data } = await api.get('/admin/employees');
        return data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch employees');
    }
});

// NEW: Fetch single employee by ID



export const createEmployee = createAsyncThunk(
  'employees/create',
  async (employeeData: FormData, { rejectWithValue }) => {
    try {
        const { data } = await api.post('/admin/employees', employeeData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'Failed to create employee');
    }
});


export const updateEmployee = createAsyncThunk(
  'employees/update',
  async ({ id, employeeData }: { id: string; employeeData: FormData }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/admin/employees/${id}`, employeeData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update employee');
    }
  }
);

// Changed to hard delete
export const deleteEmployee = createAsyncThunk(
  'employees/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(`/admin/employees/${id}`);
      return id; // Return the ID of the deleted employee
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete employee');
    }
  }
);

// --- Slice Definition ---
const employeeSlice = createSlice({
    name: 'employees',
    initialState,
    reducers: {
        // Simple reducer to clear errors if needed
        clearEmployeeError: (state) => {
            state.error = null;
        }
    },
    extraReducers: builder => {
        builder
            // Fetch Employee List
            .addCase(fetchEmployees.pending, state => { state.loadingList = true; state.error = null; })
            .addCase(fetchEmployees.fulfilled, (state, action: PayloadAction<Employee[]>) => {
                state.loadingList = false;
                state.employees = action.payload; // Store the full list
            })
            .addCase(fetchEmployees.rejected, (state, action) => { state.loadingList = false; state.error = action.payload as string; })

            // REMOVED fetchEmployeeById cases

            // Create Employee
            .addCase(createEmployee.pending, state => { state.loadingAction = true; state.error = null; })
            .addCase(createEmployee.fulfilled, (state, action: PayloadAction<Employee>) => {
                state.loadingAction = false;
                state.employees.unshift(action.payload); // Add the new employee (with full data)
            })
            .addCase(createEmployee.rejected, (state, action) => { state.loadingAction = false; state.error = action.payload as string; })

            // Update Employee
            .addCase(updateEmployee.pending, state => { state.loadingAction = true; state.error = null; })
            .addCase(updateEmployee.fulfilled, (state, action: PayloadAction<Employee>) => {
                state.loadingAction = false;
                // Find and replace the updated employee in the main list
                const index = state.employees.findIndex(emp => emp._id === action.payload._id);
                if (index !== -1) {
                  state.employees[index] = action.payload; // Replace with the full updated object from backend
                }
            })
            .addCase(updateEmployee.rejected, (state, action) => { state.loadingAction = false; state.error = action.payload as string; })

            // Delete Employee
             .addCase(deleteEmployee.pending, state => { state.loadingAction = true; state.error = null; })
            .addCase(deleteEmployee.fulfilled, (state, action: PayloadAction<string>) => {
                state.loadingAction = false;
                state.employees = state.employees.filter(emp => emp._id !== action.payload);
            })
            .addCase(deleteEmployee.rejected, (state, action) => { state.loadingAction = false; state.error = action.payload as string; });
    }
});

export const { clearEmployeeError } = employeeSlice.actions;
export default employeeSlice.reducer;