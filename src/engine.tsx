import { zodResolver } from "@hookform/resolvers/zod";
import { Parser } from "expr-eval";
import { type UseFormReturn, useForm } from "react-hook-form";
import { z } from "zod";

import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import TextBadgeInput from "@/components/ui/input-with-badges";
import {
	updateInputValue,
	updateSectionValue,
} from "@/redux/features/model/reducer";
import type {
	Model,
	SectionVariable,
	Variable,
} from "@/redux/features/model/types";
import { store } from "@/redux/store";
import { SampleChart } from "@/sample-chart";

export class Engine {
	private model: Model;
	private form: UseFormReturn;
	private schema;

	constructor(model: Model) {
		this.model = model;
		this.schema = this.buildSchema();
		this.form = useForm<z.infer<typeof this.schema>>({
			resolver: zodResolver(this.schema),
			defaultValues: this.buildDefaultValues(),
		});
	}

	render() {
		return (
			<Form {...this.form}>
				<div className="flex flex-row gap-10 items-center">
					<form
						onChange={this.form.handleSubmit(
							(values: z.infer<typeof this.schema>) => {
								console.log(values);
							},
						)}
					>
						<div className="flex flex-col gap-10">
							<section className="bg-card border border-border rounded-lg p-4">
								<div className="flex flex-col gap-5">
									<p>Inputs</p>
									<div className="flex flex-col gap-5">
										{this.model.inputs.map((variable) => {
											return (
												<FormField
													key={variable.id}
													control={this.form.control}
													name={variable.id}
													render={({ field }) => {
														return (
															<FormItem>
																<FormLabel>{variable.name}</FormLabel>
																<FormControl>
																	<Input
																		value={field.value}
																		onChange={(e) => {
																			store.dispatch(
																				updateInputValue({
																					id: variable.id,
																					value: e.target.value,
																				}),
																			);
																			field.onChange(e);
																		}}
																	/>
																</FormControl>
																<FormMessage />
															</FormItem>
														);
													}}
												/>
											);
										})}
									</div>
								</div>
							</section>

							{this.model.calculations.map((section) => {
								return (
									<section
										className="bg-card border border-border rounded-lg p-4"
										key={section.id}
									>
										<div className="flex flex-col gap-5">
											<p>{section.name}</p>
											<div className="flex flex-col gap-5">
												{section.variables.map((variable) => {
													return (
														<FormField
															key={variable.id}
															control={this.form.control}
															name={variable.id}
															render={({ field }) => {
																return (
																	<FormItem>
																		<FormLabel>{variable.name}</FormLabel>
																		<FormControl>
																			<TextBadgeInput
																				options={this.buildVariables()}
																				inputValue={field.value}
																				onChange={(e) => {
																					store.dispatch(
																						updateSectionValue({
																							sectionId: section.id,
																							id: variable.id,
																							value: e,
																						}),
																					);
																					field.onChange(e);
																				}}
																			/>
																		</FormControl>
																		<FormDescription>
																			{
																				this.buildReadableFormulas()[
																					variable.id
																				]
																			}
																		</FormDescription>
																		<FormDescription>
																			Result: {this.buildResult()[variable.id]}
																		</FormDescription>
																		<FormMessage />
																	</FormItem>
																);
															}}
														/>
													);
												})}
											</div>
										</div>
									</section>
								);
							})}
						</div>
					</form>
					<section className="bg-card border border-border rounded-lg p-4">
						{this.model.charts.map((chart) => {
							const data = chart.data.map((item) => {
								const xData = item.x;
								const yData = item.y;

								const returnVal: { x: string | number; y: string | number } = {
									x: "",
									y: "",
								};
								if (xData.type === "label") {
									returnVal.x = xData.value ?? "";
								} else if (xData.type === "value") {
									returnVal.x = this.buildResult()[xData.ref];
								}
								if (yData.type === "label") {
									returnVal.y = yData.value ?? "";
								} else if (yData.type === "value") {
									returnVal.y = this.buildResult()[yData.ref];
								}
								return returnVal;
							});
							return (
								<SampleChart
									key={chart.id}
									title={chart.title}
									description={chart.description}
									data={data}
								/>
							);
						})}
					</section>
				</div>
			</Form>
		);
	}

	private buildSchema(model: Model = this.model) {
		const allVariableIds = [...model.inputs.map(({ id }) => id)];
		for (const section of model.calculations) {
			allVariableIds.push(...section.variables.map(({ id }) => id));
		}

		return z.object(
			allVariableIds.reduce((prev, id) => {
				return Object.assign(prev, {
					[id]: z.string(),
				});
			}, {}),
		);
	}

	private buildDefaultValues(model: Model = this.model) {
		let values: { [_: Variable["id"]]: string } = model.inputs.reduce(
			(prev, variable) => {
				return Object.assign(prev, {
					[variable.id]: variable.value,
				});
			},
			{},
		);

		for (const section of model.calculations) {
			values = section.variables.reduce((prev, variable) => {
				return Object.assign(prev, {
					[variable.id]: variable.formula,
				});
			}, values);
		}

		return values;
	}

	private buildVariables(): { id: Variable["id"]; name: Variable["name"] }[] {
		let variables = this.model.inputs.map((input) => {
			return {
				id: input.id,
				name: input.name,
			};
		});

		for (const section of this.model.calculations) {
			variables = section.variables.reduce((prev, variable) => {
				return prev.concat({ id: variable.id, name: variable.name });
			}, variables);
		}

		return variables;
	}

	private buildReadableFormulas() {
		let variableObj: {
			[_: Variable["id"]]: {
				type: "input" | "section";
				name: string;
				sectionName?: string;
			};
		} = {};

		variableObj = this.model.inputs.reduce((prev, curr) => {
			return Object.assign(prev, {
				[curr.id]: {
					type: "input",
					name: curr.name,
				},
			});
		}, variableObj);

		for (const section of this.model.calculations) {
			variableObj = section.variables.reduce((prev, curr) => {
				return Object.assign(prev, {
					[curr.id]: {
						type: "section",
						name: curr.name,
						sectionName: section.name,
					},
				});
			}, variableObj);
		}

		const returnVal: { [_: Variable["id"]]: string } = {};
		for (const section of this.model.calculations) {
			section.variables.map(({ formula, id }) => {
				const variableFormulaRegex = /{{[A-Za-z0-9-]+}}/g;

				const newFormula = formula.replace(
					variableFormulaRegex,
					(matched: string) => {
						const matchedId = matched.slice(2, -2) as Variable["id"];
						if (!Object.hasOwn(variableObj, matchedId)) {
							throw new Error("Not matched");
						}
						const value = variableObj[matchedId];
						return value.sectionName
							? `${value.sectionName}: ${value.name}`
							: value.name;
					},
				);

				returnVal[id] = newFormula;
			});
		}

		return returnVal;
	}

	private buildPlaceholderIds(size: number): string[] {
		const result: string[] = new Array(size);
		for (let i = 0; i < size; i++) {
			result[i] = `v${i}`;
		}
		return result;
	}

	private buildResult() {
		function recurseVariable(value: string) {
			const variableFormulaRegex = /{{[A-Za-z0-9-]+}}/g;

			const newValue = value.replaceAll(
				variableFormulaRegex,
				(matched: string) => {
					const matchedId = matched.slice(2, -2) as Variable["id"];
					const value = map.get(matchedId);
					if (value === undefined) {
						throw new Error("Not matched");
					}
					return value.value;
				},
			);

			if (newValue.includes("{{")) {
				return recurseVariable(newValue);
			}
			return newValue;
		}

		const inputs = this.model.inputs;
		const calculations = this.model.calculations.reduce((prev, section) => {
			return prev.concat(section.variables);
		}, [] as SectionVariable[]);
		const variables: Variable[] = (inputs as Variable[]).concat(calculations);
		const variableObj: { [_: Variable["id"]]: Variable } = variables.reduce(
			(prev, curr) => {
				return Object.assign(prev, { [curr.id]: curr });
			},
			{},
		);

		const formData = this.form.watch();

		const placeholderIds = this.buildPlaceholderIds(
			Object.keys(formData).length,
		);

		const map = new Map<
			Variable["id"],
			{ placeholderId: string; value: string }
		>();
		Object.entries(formData).forEach(([variableId, value], index: number) => {
			const variable = variableObj[variableId as Variable["id"]];
			map.set(variable.id, {
				placeholderId: placeholderIds[index],
				value,
			});
		});

		const placeholderIdToValue: { [placeholderId: string]: number } = {};
		const variableIdToValue: { [_: Variable["id"]]: number } = {};
		map.forEach((data, variableId) => {
			const newValue = recurseVariable(data.value);
			let result = Number.NaN;
			try {
				result = Parser.evaluate(newValue, placeholderIdToValue);
			} catch (err) {
				console.error(err);
			}
			placeholderIdToValue[data.placeholderId] = result;
			variableIdToValue[variableId] = result;
		});

		return variableIdToValue;
	}
}
