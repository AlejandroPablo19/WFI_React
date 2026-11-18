import { useState } from "react";
import { router } from "expo-router";
import { createFruit } from "../../modules/inventory/infraestructure/fruitRepository";
import { FruitForm } from "../../modules/inventory/presentation/components/addFruit";
import type { FruitFormValues } from "../../modules/inventory/presentation/components/fruit";

export default function AddInventoryFruitScreen() {
	const [error, setError] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const submit = async (values: FruitFormValues) => {
		setIsSubmitting(true);
		setError(null);
		try {
			await createFruit(values);
			router.back();
		} catch (saveError) {
			console.error("No se pudo agregar la fruta al inventario.", saveError);
			setError("No se pudo agregar la fruta. Revisa los permisos e intenta de nuevo.");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<FruitForm
			error={error}
			isSubmitting={isSubmitting}
			mode="add"
			onCancel={() => router.back()}
			onSubmit={submit}
		/>
	);
}
