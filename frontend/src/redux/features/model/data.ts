import type {
	Chart,
	Model,
	Section,
	Variable,
} from "@/redux/features/model/types";

export const INITIAL_DATA: Model = {
	inputs: [
		{
			id: "17F546A3-0216-4702-96E1-8894453F7B01" as Variable["id"],
			type: "number",
			name: "Number of resources",
			value: "20",
		},
		{
			id: "FDF052EE-0037-4C82-B5A4-429057C456AD" as Variable["id"],
			type: "number",
			name: "Hours spent on tracking resources",
			value: "60",
		},
		{
			id: "BBABCB08-CA73-4DEE-A863-675E2F9D6856" as Variable["id"],
			type: "number",
			name: "Percentage reduction in time spent tracking and reporting costs",
			value: "50",
		},
	],
	calculations: [
		{
			id: "3134D890-F763-4C32-91F2-23FCADC38ADD" as Section["id"],
			name: "Calculations",
			variables: [
				{
					id: "3E9E1FBF-57B0-46A9-B960-F77EBB535277" as Variable["id"],
					type: "number",
					name: "Time effort to track and report (hours)",
					formula:
						"{{17F546A3-0216-4702-96E1-8894453F7B01}} * {{FDF052EE-0037-4C82-B5A4-429057C456AD}}",
					result: "",
				},
				{
					id: "241A01B8-67C3-4AB5-B856-9008CE73BA52" as Variable["id"],
					type: "number",
					name: "Time effort with X to track and report",
					formula:
						"{{3E9E1FBF-57B0-46A9-B960-F77EBB535277}} * (1 - {{BBABCB08-CA73-4DEE-A863-675E2F9D6856}} / 100)",
					result: "",
				},
				{
					id: "37140574-E730-478D-95ED-2B3CC134C82C" as Variable["id"],
					type: "currency",
					name: "Annual cost to track and report",
					formula: "{{3E9E1FBF-57B0-46A9-B960-F77EBB535277}} * 120000",
					result: "",
				},
			],
		},
	],
	charts: [
		{
			id: "4b62dddd-afa4-4e73-9376-c2a103f9d2d9" as Chart["id"],
			type: "bar",
			title: "Time effort to track and report",
			data: [
				{
					x: {
						ref: "3E9E1FBF-57B0-46A9-B960-F77EBB535277" as Variable["id"],
						type: "label",
						value: "Without X",
					},
					y: {
						ref: "3E9E1FBF-57B0-46A9-B960-F77EBB535277" as Variable["id"],
						type: "value",
					},
				},
				{
					x: {
						ref: "241A01B8-67C3-4AB5-B856-9008CE73BA52" as Variable["id"],
						type: "label",
						value: "With X",
					},
					y: {
						ref: "241A01B8-67C3-4AB5-B856-9008CE73BA52" as Variable["id"],
						type: "value",
					},
				},
			],
		},
	],
};
