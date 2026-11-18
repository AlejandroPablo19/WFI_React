import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import {
	getWarehouseById,
	updateWarehouse,
} from "../../modules/warehouse/infraestructure/warehouseRepository";
import type { Warehouse, WarehouseFormValues } from "../../modules/warehouse/domain/warehouse";
import { WarehouseForm } from "../../modules/warehouse/presentacion/components/warehouseForm";

export default function EditWarehouseScreen() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const router = useRouter();
	const [warehouse, setWarehouse] = useState<Warehouse | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isSubmitting, setIsSubmitting] = useState(false);

	useEffect(() => {
		let isActive = true;
		getWarehouseById(id)
			.then((result) => {
				if (isActive) {
					setWarehouse(result);
					if (!result) setError("No se encontró el almacén.");
				}
			})
			.catch((loadError) => {
				console.error("No se pudo cargar el almacén.", loadError);
				if (isActive) setError("No se pudo cargar el almacén. Intenta de nuevo.");
			})
			.finally(() => {
				if (isActive) setIsLoading(false);
			});

		return () => {
			isActive = false;
		};
	}, [id]);

	const submit = async (values: WarehouseFormValues) => {
		setIsSubmitting(true);
		setError(null);
		try {
			await updateWarehouse(id, values);
			router.back();
		} catch (saveError) {
			console.error("No se pudo actualizar el almacén.", saveError);
			setError("No se pudo actualizar el almacén. Revisa los permisos e intenta de nuevo.");
		} finally {
			setIsSubmitting(false);
		}
	};

	if (isLoading) {
		return <ActivityIndicator color="#27836F" style={styles.centered} />;
	}

	if (!warehouse) {
		return (
			<View style={styles.centered}>
				<Text style={styles.error}>{error ?? "No se encontró el almacén."}</Text>
				<Pressable accessibilityRole="button" onPress={() => router.back()}>
					<Text style={styles.back}>Volver a almacenes</Text>
				</Pressable>
			</View>
		);
	}

	return (
		<WarehouseForm
			error={error}
			isSubmitting={isSubmitting}
			mode="edit"
			onCancel={() => router.back()}
			onSubmit={submit}
			warehouse={warehouse}
		/>
	);
}

const styles = StyleSheet.create({
	centered: {
		alignItems: "center",
		flex: 1,
		justifyContent: "center",
		padding: 24,
	},
	error: {
		color: "#A84334",
		fontSize: 15,
		marginBottom: 14,
		textAlign: "center",
	},
	back: {
		color: "#27836F",
		fontSize: 15,
		fontWeight: "700",
		padding: 10,
	},
});
