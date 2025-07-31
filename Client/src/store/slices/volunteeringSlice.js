import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  opportunities: [],
  currentOpportunity: null,
  myApplications: [],
  performanceTracking: [],
  certificates: [],
  blockchainConnected: false,
  filters: {
    category: '',
    location: '',
    search: '',
  },
  pagination: {
    current: 1,
    pages: 1,
    total: 0,
  },
  isLoading: false,
  error: null,
};

const volunteeringSlice = createSlice({
  name: 'volunteering',
  initialState,
  reducers: {
    setOpportunities: (state, action) => {
      state.opportunities = action.payload;
    },
    setCurrentOpportunity: (state, action) => {
      state.currentOpportunity = action.payload;
    },
    setMyApplications: (state, action) => {
      state.myApplications = action.payload;
    },
    setPerformanceTracking: (state, action) => {
      state.performanceTracking = action.payload;
    },
    addPerformanceRecord: (state, action) => {
      state.performanceTracking.push(action.payload);
    },
    updatePerformanceRecord: (state, action) => {
      const index = state.performanceTracking.findIndex(record => record.id === action.payload.id);
      if (index !== -1) {
        state.performanceTracking[index] = { ...state.performanceTracking[index], ...action.payload };
      }
    },
    setCertificates: (state, action) => {
      state.certificates = action.payload;
    },
    addCertificate: (state, action) => {
      state.certificates.push(action.payload);
    },
    setBlockchainConnected: (state, action) => {
      state.blockchainConnected = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setPagination: (state, action) => {
      state.pagination = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setOpportunities,
  setCurrentOpportunity,
  setMyApplications,
  setPerformanceTracking,
  addPerformanceRecord,
  updatePerformanceRecord,
  setCertificates,
  addCertificate,
  setBlockchainConnected,
  setFilters,
  setPagination,
  setLoading,
  setError,
  clearError,
} = volunteeringSlice.actions;

export default volunteeringSlice.reducer;
