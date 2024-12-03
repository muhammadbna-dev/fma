import { useEffect, useRef, useState } from "react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface Option {
	id: string;
	name: string;
}

interface TextBadgeInputProps {
	options: Option[];
	placeholder?: string;
	inputValue: string;
	onChange: (_: string) => void;
}

export const TextBadgeInput: React.FC<TextBadgeInputProps> = ({
	options,
	inputValue,
	onChange,
	placeholder = "Type to select...",
}) => {
	const [selectedItems, setSelectedItems] = useState<Option[]>([]);
	const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
	const inputRef = useRef<HTMLInputElement>(null);
	const dropdownRef = useRef<HTMLDivElement>(null);

	// Close dropdown on outside click
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsDropdownOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	// Handle input change
	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		onChange(value);

		// Find last word or partial match
		const words = value.split(/\s+/);
		const lastWord = words[words.length - 1];

		// Filter options by name
		const matched = options.filter(
			(option) =>
				option.name.toLowerCase().includes(lastWord.toLowerCase()) &&
				!selectedItems.find((item) => item.id === option.id),
		);

		setIsDropdownOpen(matched.length > 0);
	};

	// Select an option
	const handleSelectOption = (option: Option) => {
		const words = inputValue.split(/\s+/);
		const updatedWords = words.map((word, index) =>
			index === words.length - 1 ? `{{${option.id}}}` : word,
		);

		setSelectedItems((prev) => [...prev, option]);
		onChange(updatedWords.join(" "));
		setIsDropdownOpen(false);
	};

	return (
		<div className="relative space-y-1" ref={dropdownRef}>
			<Input
				ref={inputRef}
				value={inputValue}
				onChange={handleInputChange}
				placeholder={placeholder}
				className={cn(
					"block w-full rounded-md border border-input bg-background p-2 shadow-sm",
					"focus:ring focus:ring-primary focus:ring-offset-1",
				)}
			/>

			{isDropdownOpen && options.length > 0 && (
				<div className="absolute left-0 z-10 mt-2 w-full rounded-md border bg-popover shadow-md">
					<ul className="divide-y divide-border">
						{options.map((option) => (
							<li
								key={option.id}
								onClick={() => handleSelectOption(option)}
								onKeyDown={() => handleSelectOption(option)}
								className={cn(
									"px-4 py-2 cursor-pointer text-sm text-foreground",
									"hover:bg-muted hover:text-muted-foreground",
								)}
							>
								{option.name}
							</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
};

export default TextBadgeInput;
