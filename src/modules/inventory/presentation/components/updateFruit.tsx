import { FruitForm } from "./addFruit";
import type { Fruit, FruitFormValues } from "./fruit";

interface UpdateFruitProps {
	fruit: Fruit;
	error: string | null;
	isSubmitting: boolean;
	onCancel: () => void;
	onSubmit: (values: FruitFormValues) => Promise<void>;
}

export function UpdateFruit({
	fruit,
	error,
	isSubmitting,
	onCancel,
	onSubmit,
}: UpdateFruitProps) {
	return (
		<FruitForm
			error={error}
			fruit={fruit}
			isSubmitting={isSubmitting}
			mode="edit"
			onCancel={onCancel}
			onSubmit={onSubmit}
		/>
	);
}