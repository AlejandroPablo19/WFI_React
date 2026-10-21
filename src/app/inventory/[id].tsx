import { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import {
	ActivityIndicator,
	Pressable,
	StyleSheet,
	Text,
	View,
} from "react-native";
import {
	deleteFruit,
	getFruitById,
	updateFruit,
} from "@/modules/inventory/infraestructure/fruitRepository";
import { DeleteFruit } from "@/modules/inventory/presentation/components/deleteFruit";
import type { Fruit, FruitFormValues } from "@/modules/inventory/presentation/components/fruit";
import { UpdateFruit } from "@/modules/inventory/presentation/components/updateFruit";

export default function EditInventoryFruitScreen() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const [fruit, setFruit] = useState<Fruit | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [loadAttempt, setLoadAttempt] = useState(0);
	const [confirmDelete, setConfirmDelete] = useState(false);

	useEffect(() => {
		let cancelled = false;

		getFruitById(id)
			.then((loadedFruit) => {
				if (cancelled) {
					return;
				}
				setFruit(loadedFruit);
				if (!loadedFruit) {
					setError("No se encontró esta fruta en el inventario.");
				}
				setIsLoading(false);
			})
			.catch((loadError: unknown) => {
				if (cancelled) {
					return;
				}
				console.error("No se pudo cargar la fruta desde Firestore.", loadError);
				setError("No se pudo cargar la fruta desde Firestore. Intenta de nuevo.");
				setIsLoading(false);
			});

		return () => {
			cancelled = true;
		};
	}, [id, loadAttempt]);

	const submitFruitUpdate = async (values: FruitFormValues) => {
		if (!fruit || isSubmitting) {
			return;
		}

		setIsSubmitting(true);
		setError(null);
		try {
			await updateFruit(fruit.id, values);
			router.replace("/");
		} catch (updateError) {
			console.error("No se pudo actualizar la fruta en Firestore.", updateError);
			setError("No se pudo guardar la fruta. Revisa los permisos e intenta de nuevo.");
		} finally {
			setIsSubmitting(false);
		}
	};

	const confirmFruitDeletion = async () => {
		if (!fruit || isDeleting) {
			return;
		}

		setIsDeleting(true);
		setError(null);
		try {
			await deleteFruit(fruit.id);
			router.replace("/");
		} catch (deleteError) {
			console.error("No se pudo eliminar la fruta de Firestore.", deleteError);
			setError("No se pudo eliminar la fruta. Revisa los permisos e intenta de nuevo.");
			setConfirmDelete(false);
		} finally {
			setIsDeleting(false);
		}
	};

	if (isLoading) {
		return (
			<View style={styles.centered}>
				<ActivityIndicator color="#27836F" />
				<Text style={styles.message}>Cargando fruta...</Text>
			</View>
		);
	}

	if (!fruit) {
		return (
			<View style={styles.centered}>
				<Text accessibilityRole="alert" style={styles.message}>
					{error}
				</Text>
				{error?.includes("Intenta de nuevo") && (
					<Pressable
						accessibilityRole="button"
						onPress={() => setLoadAttempt((attempt) => attempt + 1)}
						style={styles.retryButton}
					>
						<Text style={styles.retryText}>Reintentar</Text>
					</Pressable>
				)}
				<Pressable
					accessibilityRole="button"
					onPress={() => router.replace("/")}
					style={styles.backButton}
				>
					<Text style={styles.backText}>Volver al inventario</Text>
				</Pressable>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			{confirmDelete && (
				<DeleteFruit
					fruit={fruit}
					isProcessing={isDeleting}
					onCancel={() => setConfirmDelete(false)}
					onConfirm={() => void confirmFruitDeletion()}
				/>
			)}
			<UpdateFruit
				error={error}
				fruit={fruit}
				isSubmitting={isSubmitting || isDeleting}
				onCancel={() => router.back()}
				onSubmit={submitFruitUpdate}
			/>
			<Pressable
				accessibilityRole="button"
				disabled={isSubmitting || isDeleting}
				onPress={() => setConfirmDelete(true)}
				style={({ pressed }) => [
					styles.deleteButton,
					(isSubmitting || isDeleting) && styles.disabled,
					pressed && styles.pressed,
				]}
			>
				<Text style={styles.deleteText}>
					{isDeleting ? "Eliminando..." : "Eliminar fruta"}
				</Text>
			</Pressable>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: "#F3F8F7",
		flex: 1,
	},
	centered: {
		alignItems: "center",
		flex: 1,
		justifyContent: "center",
		padding: 24,
	},
	message: {
		color: "#667A7F",
		fontSize: 15,
		marginTop: 10,
		textAlign: "center",
	},
	retryButton: {
		marginTop: 12,
		padding: 8,
	},
	retryText: {
		color: "#28735F",
		fontSize: 14,
		fontWeight: "700",
	},
	backButton: {
		marginTop: 12,
		padding: 8,
	},
	backText: {
		color: "#173F4A",
		fontSize: 14,
		fontWeight: "700",
	},
	deleteButton: {
		alignItems: "center",
		backgroundColor: "#FFF1ED",
		borderColor: "#F2C9BE",
		borderRadius: 12,
		borderWidth: 1,
		marginHorizontal: 18,
		marginBottom: 18,
		minHeight: 48,
		justifyContent: "center",
	},
	deleteText: {
		color: "#C65340",
		fontSize: 14,
		fontWeight: "700",
	},
	disabled: {
		opacity: 0.55,
	},
	pressed: {
		opacity: 0.78,
	},
});
