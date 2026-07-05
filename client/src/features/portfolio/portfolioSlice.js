import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import portfolioService from './portfolioService';
import { updateBalance } from '../auth/authSlice';

const initialState = {
  portfolio: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

// Get user portfolio
export const getPortfolio = createAsyncThunk('portfolio/get', async (_, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    return await portfolioService.getPortfolio(token);
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

// Execute trade
export const executeTrade = createAsyncThunk('portfolio/trade', async (tradeData, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    const response = await portfolioService.executeTrade(tradeData, token);
    // After trade, update auth balance and re-fetch portfolio
    thunkAPI.dispatch(updateBalance(response.balance));
    thunkAPI.dispatch(getPortfolio());
    return response;
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});


export const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState,
  reducers: {
    resetPortfolio: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPortfolio.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getPortfolio.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.portfolio = action.payload;
      })
      .addCase(getPortfolio.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(executeTrade.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(executeTrade.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(executeTrade.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { resetPortfolio } = portfolioSlice.actions;
export default portfolioSlice.reducer;
