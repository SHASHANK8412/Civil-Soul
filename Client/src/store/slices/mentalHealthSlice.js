import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  counselors: [],
  sessions: [],
  chatHistory: [],
  surveys: [],
  surveyResponses: [],
  resources: [],
  currentConversationId: null,
  isLoading: false,
  error: null,
};

const mentalHealthSlice = createSlice({
  name: 'mentalHealth',
  initialState,
  reducers: {
    setCounselors: (state, action) => {
      state.counselors = action.payload;
    },
    setSessions: (state, action) => {
      state.sessions = action.payload;
    },
    addChatMessage: (state, action) => {
      state.chatHistory.push(action.payload);
    },
    setChatHistory: (state, action) => {
      state.chatHistory = action.payload;
    },
    clearChatHistory: (state) => {
      state.chatHistory = [];
    },
    setCurrentConversationId: (state, action) => {
      state.currentConversationId = action.payload;
    },
    setSurveys: (state, action) => {
      state.surveys = action.payload;
    },
    setSurveyResponses: (state, action) => {
      state.surveyResponses = action.payload;
    },
    setResources: (state, action) => {
      state.resources = action.payload;
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
  setCounselors,
  setSessions,
  addChatMessage,
  setChatHistory,
  clearChatHistory,
  setCurrentConversationId,
  setSurveys,
  setSurveyResponses,
  setResources,
  setLoading,
  setError,
  clearError,
} = mentalHealthSlice.actions;

export default mentalHealthSlice.reducer;
