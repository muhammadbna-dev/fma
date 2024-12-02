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
import type { Model, SectionVariable, Variable } from "@/model";

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
																	onChange={field.onChange}
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
																		<Input
																			value={field.value}
																			onChange={field.onChange}
																		/>
																	</FormControl>
																	<FormDescription>
																		{this.buildReadableFormulas()[variable.id]}
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
						section: section.name,
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
							? `"${value.sectionName}: ${value.name}"`
							: `"${value.name}"`;
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
		Object.entries(this.form.watch()).forEach(
			([variableId, value], index: number) => {
				const variable = variableObj[variableId as Variable["id"]];
				map.set(variable.id, {
					placeholderId: placeholderIds[index],
					value,
				});
			},
		);

		const placeholderIdToValue: { [placeholderId: string]: string } = {};
		const variableIdToValue: { [_: Variable["id"]]: string } = {};
		map.forEach((data, variableId) => {
			const newValue = recurseVariable(data.value);
			let result = "";
			try {
				result = Parser.evaluate(
					newValue,
					placeholderIdToValue,
				).toLocaleString();
			} catch {
				result = "";
			}
			placeholderIdToValue[data.placeholderId] = result;
			variableIdToValue[variableId] = result;
		});

		return variableIdToValue;
	}
}
