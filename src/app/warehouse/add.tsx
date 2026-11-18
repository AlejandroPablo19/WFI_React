import { useState } from "react";
import { router } from "expo-router";
import { createWarehouse } from "../../modules/warehouse/infraestructure/warehouseRepository";
import { WarehouseForm } from "../../modules/warehouse/presentacion/components/warehouseForm";
import type { WarehouseFormValues } from "../../modules/warehouse/domain/warehouse";

export default function AddWarehouseScreen() {
	const [error, setError] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const submit = async (values: WarehouseFormValues) => {
		setIsSubmitting(true);
		setError(null);
		try {
			await createWarehouse(values);
			router.back();
		} catch (saveError) {
			console.error("No se pudo agregar el almacén.", saveError);
			setError("No se pudo agregar el almacén. Revisa los permisos e intenta de nuevo.");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<WarehouseForm
			error={error}
			isSubmitting={isSubmitting}
			mode="add"
			onCancel={() => router.back()}
			onSubmit={submit}
		/>
	);
}
