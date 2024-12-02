import { type PayloadAction, createSlice } from "@reduxjs/toolkit";

import { INITIAL_DATA } from "@/redux/features/model/data";
import type { Section, Variable } from "@/redux/features/model/types";
import type { RootState } from "@/redux/store";

export const modelSlice = createSlice({
	name: "model",
	initialState: { data: INITIAL_DATA },
	reducers: {
		updateInputValue(
			{ data: model },
			{ payload }: PayloadAction<{ id: Variable["id"]; value: string }>,
		) {
			for (const input of model.inputs) {
				if (input.id === payload.id) {
					input.value = payload.value;
					break;
				}
			}
		},
		updateSectionValue(
			{ data: model },
			{
				payload,
			}: PayloadAction<{
				sectionId: Section["id"];
				id: Variable["id"];
				value: string;
			}>,
		) {
			for (const section of model.calculations) {
				if (section.id === payload.sectionId) {
					for (const variable of section.variables) {
						if (variable.id === payload.id) {
							variable.formula = payload.value;
							break;
						}
					}
				}
			}
		},
	},
});

export const { updateInputValue, updateSectionValue } = modelSlice.actions;

export const selectModel = (state: RootState) => state.model.data;

export const modelReducer = modelSlice.reducer;
