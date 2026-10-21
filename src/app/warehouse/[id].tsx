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
	deleteWarehouse,
	getWarehouseById,
	updateWarehouse,
} from "@/modules/warehouse/infraestructure/warehouseRepository";
import { DeleteWarehouse } from "@/modules/warehouse/presentacion/components/deleteWarehouse";
import { WarehouseForm } from "@/modules/warehouse/presentacion/components/warehouseForm";
import type {
	Warehouse,
	WarehouseFormValues,
} from "@/modules/warehouse/domain/warehouse";

export default function EditWarehouseScreen() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const [warehouse, setWarehouse] = useState<Warehouse | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [loadAttempt, setLoadAttempt] = useState(0);
	const [confirmDelete, setConfirmDelete] = useState(false);

	useEffect(() => {
		let cancelled = false;

		getWarehouseById(id)
			.then((loadedWarehouse) => {
				if (cancelled) {
					return;
				}
				setWarehouse(loadedWarehouse);
				if (!loadedWarehouse) {
					setError("No se encontró este almacén.");
				}
				setIsLoading(false);
			})
			.catch((loadError: unknown) => {
				if (cancelled) {
					return;
				}
				console.error("No se pudo cargar el almacén desde Firestore.", loadError);
				setError(
					"No se pudo cargar el almacén desde Firestore. Revisa los permisos e intenta de nuevo.",
				);
				setIsLoading(false);
			});

		return () => {
			cancelled = true;
		};
	}, [id, loadAttempt]);

	const submitWarehouseUpdate = async (values: WarehouseFormValues) => {
		if (!warehouse || isSubmitting) {
			return;
		}

		setIsSubmitting(true);
		setError(null);
		try {
			await updateWarehouse(warehouse.id, values);
			router.replace("/warehouse");
		} catch (updateError) {
			console.error("No se pudo actualizar el almacén en Firestore.", updateError);
			setError(
				"No se pudieron guardar los cambios. Revisa los permisos e intenta de nuevo.",
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	const confirmWarehouseDeletion = async () => {
		if (!warehouse || isDeleting) {
			return;
		}

		setIsDeleting(true);
		setError(null);
		try {
			await deleteWarehouse(warehouse.id);
			router.replace("/warehouse");
		} catch (deleteError) {
			console.error("No se pudo eliminar el almacén de Firestore.", deleteError);
			setError(
				"No se pudo eliminar el almacén. Revisa los permisos e intenta de nuevo.",
			);
			setConfirmDelete(false);
		} finally {
			setIsDeleting(false);
		}
	};

	if (isLoading) {
		return (
			<View style={styles.centered}>
				<ActivityIndicator color="#27836F" />
				<Text style={styles.message}>Cargando almacén...</Text>
			</View>
		);
	}

	if (!warehouse) {
		return (
			<View style={styles.centered}>
				<Text accessibilityRole="alert" style={styles.message}>
					{error}
				</Text>
				{error?.includes("intenta de nuevo") && (
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
					onPress={() => router.replace("/warehouse")}
					style={styles.backButton}
				>
					<Text style={styles.backText}>Volver a almacenes</Text>
				</Pressable>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<DeleteWarehouse
				warehouse={confirmDelete ? warehouse : null}
				isDeleting={isDeleting}
				onCancel={() => setConfirmDelete(false)}
				onConfirm={() => void confirmWarehouseDeletion()}
			/>
			<WarehouseForm
				error={error}
				isSubmitting={isSubmitting || isDeleting}
				mode="edit"
				onCancel={() => router.back()}
				onSubmit={submitWarehouseUpdate}
				warehouse={warehouse}
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
					{isDeleting ? "Eliminando..." : "Eliminar almacén"}
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
		justifyContent: "center",
		marginBottom: 18,
		marginHorizontal: 18,
		minHeight: 48,
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
