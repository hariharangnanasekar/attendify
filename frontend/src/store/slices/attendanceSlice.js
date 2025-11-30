import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

const initialState = {
  todayStatus: null,
  history: [],
  summary: null,
  allAttendance: [],
  isLoading: false,
  isError: false,
  message: '',
};

export const checkIn = createAsyncThunk(
  'attendance/checkIn',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post('/attendance/checkin');
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Check-in failed'
      );
    }
  }
);

export const checkOut = createAsyncThunk(
  'attendance/checkOut',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post('/attendance/checkout');
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Check-out failed'
      );
    }
  }
);

export const getTodayStatus = createAsyncThunk(
  'attendance/getTodayStatus',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/attendance/today');
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to get today status'
      );
    }
  }
);

export const getMyHistory = createAsyncThunk(
  'attendance/getMyHistory',
  async ({ month, year }, { rejectWithValue }) => {
    try {
      const params = {};
      if (month) params.month = month;
      if (year) params.year = year;
      const response = await api.get('/attendance/my-history', { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to get history'
      );
    }
  }
);

export const getMySummary = createAsyncThunk(
  'attendance/getMySummary',
  async ({ month, year }, { rejectWithValue }) => {
    try {
      const params = {};
      if (month) params.month = month;
      if (year) params.year = year;
      const response = await api.get('/attendance/my-summary', { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to get summary'
      );
    }
  }
);

export const getAllAttendance = createAsyncThunk(
  'attendance/getAllAttendance',
  async (filters, { rejectWithValue }) => {
    try {
      const response = await api.get('/attendance/all', { params: filters });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to get attendance'
      );
    }
  }
);

export const getTodayStatusAll = createAsyncThunk(
  'attendance/getTodayStatusAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/attendance/today-status');
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to get today status'
      );
    }
  }
);

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState,
  reducers: {
    clearError: (state) => {
      state.isError = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkIn.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(checkIn.fulfilled, (state, action) => {
        state.isLoading = false;
        state.todayStatus = action.payload;
      })
      .addCase(checkIn.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(checkOut.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(checkOut.fulfilled, (state, action) => {
        state.isLoading = false;
        state.todayStatus = action.payload;
      })
      .addCase(checkOut.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getTodayStatus.fulfilled, (state, action) => {
        state.todayStatus = action.payload;
      })
      .addCase(getMyHistory.fulfilled, (state, action) => {
        state.history = action.payload;
      })
      .addCase(getMySummary.fulfilled, (state, action) => {
        state.summary = action.payload;
      })
      .addCase(getAllAttendance.fulfilled, (state, action) => {
        state.allAttendance = action.payload;
      })
      .addCase(getTodayStatusAll.fulfilled, (state, action) => {
        state.allAttendance = action.payload;
      });
  },
});

export const { clearError } = attendanceSlice.actions;
export default attendanceSlice.reducer;

