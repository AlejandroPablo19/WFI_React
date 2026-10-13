import { FruitFormModal, type FruitFormValues } from "./addFruit";
import type { Fruit } from "./fruit";

interface UpdateFruitProps {
	visible: boolean;
	fruit: Fruit;
	onClose: () => void;
	onSubmit: (values: FruitFormValues) => void;
}

export function UpdateFruit({
	visible,
	fruit,
	onClose,
	onSubmit,
}: UpdateFruitProps) {
	return (
		<FruitFormModal
			fruit={fruit}
			mode="edit"
			onClose={onClose}
			onSubmit={onSubmit}
			visible={visible}
		/>
	);
}
