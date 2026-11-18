import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import {
	getFruitById,
	updateFruit,
} from "../../modules/inventory/infraestructure/fruitRepository";
import type { Fruit, FruitFormValues } from "../../modules/inventory/presentation/components/fruit";
import { UpdateFruit } from "../../modules/inventory/presentation/components/updateFruit";

export default function EditInventoryFruitScreen() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const router = useRouter();
	const [fruit, setFruit] = useState<Fruit | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isSubmitting, setIsSubmitting] = useState(false);

	useEffect(() => {
		let isActive = true;
		getFruitById(id)
			.then((result) => {
				if (isActive) {
					setFruit(result);
					if (!result) setError("No se encontró la fruta.");
				}
			})
			.catch((loadError) => {
				console.error("No se pudo cargar la fruta del inventario.", loadError);
				if (isActive) setError("No se pudo cargar la fruta. Intenta de nuevo.");
			})
			.finally(() => {
				if (isActive) setIsLoading(false);
			});

		return () => {
			isActive = false;
		};
	}, [id]);

	const submit = async (values: FruitFormValues) => {
		setIsSubmitting(true);
		setError(null);
		try {
			await updateFruit(id, values);
			router.back();
		} catch (saveError) {
			console.error("No se pudo actualizar la fruta del inventario.", saveError);
			setError("No se pudo actualizar la fruta. Revisa los permisos e intenta de nuevo.");
		} finally {
			setIsSubmitting(false);
		}
	};

	if (isLoading) {
		return <ActivityIndicator color="#27836F" style={styles.centered} />;
	}

	if (!fruit) {
		return (
			<View style={styles.centered}>
				<Text style={styles.error}>{error ?? "No se encontró la fruta."}</Text>
				<Pressable accessibilityRole="button" onPress={() => router.back()}>
					<Text style={styles.back}>Volver al inventario</Text>
				</Pressable>
			</View>
		);
	}

	return (
		<UpdateFruit
			error={error}
			fruit={fruit}
			isSubmitting={isSubmitting}
			onCancel={() => router.back()}
			onSubmit={submit}
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
