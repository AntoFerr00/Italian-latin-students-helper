import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchTextById = createAsyncThunk(
  'translation/fetchText',
  async (textId) => {
    const response = await axios.get(`http://localhost:5000/api/texts/${textId}`);
    return response.data;
  }
);

// We keep the initial state in a separate variable to easily reuse it.
const initialState = {
  text: null,
  status: 'idle',
  currentStep: 1,
  userAnswers: {},
  finalTranslation: '',
  feedback: '',
};

const translationSlice = createSlice({
  name: 'translation',
  initialState,
  reducers: {
    nextStep: (state) => {
      state.currentStep += 1;
    },
    // --- ADD THIS NEW REDUCER ---
    resetTranslation: (state) => {
      // This will reset the state to its initial values
      return initialState;
    },
    // ... other reducers like saveAnswer, etc.
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTextById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTextById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.text = action.payload;
      })
      .addCase(fetchTextById.rejected, (state) => {
        state.status = 'failed';
        state.text = null; // Clear text on failure
      });
  },
});

// Export the new action
export const { nextStep, resetTranslation } = translationSlice.actions;
export default translationSlice.reducer;