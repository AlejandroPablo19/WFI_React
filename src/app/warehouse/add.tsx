import { useState } from "react";
import { router } from "expo-router";
import { StyleSheet, View } from "react-native";
import { createWarehouse } from "@/modules/warehouse/infraestructure/warehouseRepository";
import { WarehouseForm } from "@/modules/warehouse/presentacion/components/warehouseForm";
import type { WarehouseFormValues } from "@/modules/warehouse/domain/warehouse";

export default function AddWarehouseScreen() {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const submitWarehouse = async (values: WarehouseFormValues) => {
		if (isSubmitting) {
			return;
		}
		setIsSubmitting(true);
		setError(null);
		try {
			await createWarehouse(values);
			router.replace("/warehouse");
		} catch (createError) {
			console.error("No se pudo agregar el almacén a Firestore.", createError);
			setError(
				"No se pudo agregar el almacén. Revisa los permisos e intenta de nuevo.",
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<View style={styles.container}>
			<WarehouseForm
				error={error}
				isSubmitting={isSubmitting}
				mode="add"
				onCancel={() => router.back()}
				onSubmit={submitWarehouse}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: "#F3F8F7",
		flex: 1,
	},
});
