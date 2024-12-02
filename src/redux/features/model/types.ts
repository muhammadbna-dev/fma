type SectionUuid = Branded<string, "SectionUuid">;
type VariableUuid = Branded<string, "VariableUuid">;

type BaseVariable = {
	id: VariableUuid;
	type: "number" | "percentage" | "currency";
	name: string;
};

export type InputVariable = BaseVariable & {
	value: string;
};

export type SectionVariable = BaseVariable & {
	formula: string;
	result: string;
};

export type Variable = InputVariable | SectionVariable;

export type Section = {
	id: SectionUuid;
	name: string;
	variables: SectionVariable[];
};

export type Model = {
	inputs: InputVariable[];
	calculations: Section[];
};
