import { useState } from "react";
import { router } from "expo-router";
import { StyleSheet, View } from "react-native";
import { createFruit } from "@/modules/inventory/infraestructure/fruitRepository";
import {
	FruitForm,
} from "@/modules/inventory/presentation/components/addFruit";
import type { FruitFormValues } from "@/modules/inventory/presentation/components/fruit";

export default function AddInventoryFruitScreen() {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const submitFruit = async (values: FruitFormValues) => {
		setIsSubmitting(true);
		setError(null);
		try {
			await createFruit(values);
			router.replace("/");
		} catch (createError) {
			console.error("No se pudo agregar la fruta a Firestore.", createError);
			setError("No se pudo agregar la fruta. Revisa los permisos e intenta de nuevo.");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<View style={styles.container}>
			<FruitForm
				error={error}
				isSubmitting={isSubmitting}
				mode="add"
				onCancel={() => router.back()}
				onSubmit={submitFruit}
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
