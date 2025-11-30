import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

const initialState = {
  employeeDashboard: null,
  managerDashboard: null,
  isLoading: false,
  isError: false,
  message: '',
};

export const getEmployeeDashboard = createAsyncThunk(
  'dashboard/getEmployeeDashboard',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/dashboard/employee');
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to get dashboard data'
      );
    }
  }
);

export const getManagerDashboard = createAsyncThunk(
  'dashboard/getManagerDashboard',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/dashboard/manager');
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to get dashboard data'
      );
    }
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    clearError: (state) => {
      state.isError = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getEmployeeDashboard.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getEmployeeDashboard.fulfilled, (state, action) => {
        state.isLoading = false;
        state.employeeDashboard = action.payload;
      })
      .addCase(getEmployeeDashboard.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getManagerDashboard.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getManagerDashboard.fulfilled, (state, action) => {
        state.isLoading = false;
        state.managerDashboard = action.payload;
      })
      .addCase(getManagerDashboard.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { clearError } = dashboardSlice.actions;
export default dashboardSlice.reducer;

