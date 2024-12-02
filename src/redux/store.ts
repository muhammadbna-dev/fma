import { configureStore } from "@reduxjs/toolkit";

import { modelReducer } from "@/redux/features/model/reducer";

export const store = configureStore({
	reducer: {
		model: modelReducer,
	},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
