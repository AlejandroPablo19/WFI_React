import { useEffect, useState } from "react";
import {
	ActivityIndicator,
	FlatList,
	Platform,
	Pressable,
	StyleSheet,
	Text,
	useWindowDimensions,
	View,
} from "react-native";
import { router } from "expo-router";
import {
	deleteWarehouse,
	subscribeToWarehouses,
} from "../infraestructure/warehouseRepository";
import type { Warehouse } from "../domain/warehouse";
import { DeleteWarehouse } from "./components/deleteWarehouse";
import { ReadWarehouse } from "./components/readWarehouse";

export function WarehouseView() {
	const { width } = useWindowDimensions();
	const isCompact = width < 420;
	const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
	const [warehouseToDelete, setWarehouseToDelete] = useState<Warehouse | null>(
		null,
	);
	const [isLoading, setIsLoading] = useState(true);
	const [isDeleting, setIsDeleting] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [loadAttempt, setLoadAttempt] = useState(0);

	useEffect(() => {
		const unsubscribe = subscribeToWarehouses(
			(updatedWarehouses) => {
				setWarehouses(updatedWarehouses);
				setError(null);
				setIsLoading(false);
			},
			(loadError) => {
				console.error(
					"No se pudo cargar la lista de almacenes desde Firestore.",
					loadError,
				);
				setError(
					"No se pudieron cargar los almacenes. Revisa tu conexión y los permisos de Firestore.",
				);
				setIsLoading(false);
			},
		);

		return unsubscribe;
	}, [loadAttempt]);

	const confirmWarehouseDeletion = async () => {
		if (!warehouseToDelete || isDeleting) {
			return;
		}

		setIsDeleting(true);
		setError(null);
		try {
			await deleteWarehouse(warehouseToDelete.id);
			setWarehouseToDelete(null);
		} catch (deleteError) {
			console.error("No se pudo eliminar el almacén de Firestore.", deleteError);
			setError(
				"No se pudo eliminar el almacén. Revisa los permisos e intenta de nuevo.",
			);
		} finally {
			setIsDeleting(false);
		}
	};

	return (
		<View style={[styles.container, isCompact && styles.compactContainer]}>
			<View style={[styles.header, isCompact && styles.compactHeader]}>
				<View style={styles.headerText}>
					<Text style={styles.eyebrow}>CONTROL DE ALMACENAMIENTO</Text>
					<Text style={styles.title}>Almacenes</Text>
					<Text style={styles.subtitle}>
						Consulta y administra almacenes sincronizados con Firebase.
					</Text>
				</View>
				<Pressable
					accessibilityRole="button"
					onPress={() => router.push("/warehouse/add")}
					style={({ pressed }) => [
						styles.addButton,
						isCompact && styles.compactAddButton,
						pressed && styles.pressed,
					]}
				>
					<Text style={styles.addButtonText}>+ Agregar</Text>
				</Pressable>
			</View>

			{error && (
				<View accessibilityRole="alert" style={styles.errorCard}>
					<Text style={styles.errorText}>{error}</Text>
					<Pressable
						accessibilityRole="button"
						onPress={() => {
							setError(null);
							setIsLoading(true);
							setLoadAttempt((attempt) => attempt + 1);
						}}
						style={styles.retryButton}
					>
						<Text style={styles.retryText}>Reintentar</Text>
					</Pressable>
				</View>
			)}

			<DeleteWarehouse
				warehouse={warehouseToDelete}
				isDeleting={isDeleting}
				onCancel={() => setWarehouseToDelete(null)}
				onConfirm={() => void confirmWarehouseDeletion()}
			/>

			{isLoading ? (
				<View style={styles.loading}>
					<ActivityIndicator color="#27836F" />
					<Text style={styles.loadingText}>Cargando almacenes...</Text>
				</View>
			) : error ? null : (
				<FlatList
					contentContainerStyle={[
						styles.listContent,
						warehouses.length === 0 && styles.emptyListContent,
					]}
					data={warehouses}
					keyExtractor={(warehouse) => warehouse.id}
					ListEmptyComponent={
						<View style={styles.emptyCard}>
							<Text style={styles.emptyEmoji}>⌂</Text>
							<Text style={styles.emptyTitle}>Aún no hay almacenes</Text>
							<Text style={styles.emptyText}>
								Agrega un almacén para verlo en esta lista.
							</Text>
						</View>
					}
					renderItem={({ item }) => (
						<ReadWarehouse
							warehouse={item}
							onDelete={setWarehouseToDelete}
							onEdit={(selectedWarehouse) =>
								router.push(
									{
										pathname: "/warehouse/[id]",
										params: { id: selectedWarehouse.id },
									},
								)
							}
						/>
					)}
					showsVerticalScrollIndicator={false}
				/>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: "#F3F8F7",
		flex: 1,
		paddingHorizontal: 18,
		paddingTop: Platform.OS === "web" ? 24 : 16,
	},
	compactContainer: {
		paddingHorizontal: 14,
	},
	header: {
		alignItems: "center",
		flexDirection: "row",
		gap: 12,
		justifyContent: "space-between",
		marginBottom: 24,
	},
	compactHeader: {
		alignItems: "flex-start",
		flexDirection: "column",
	},
	headerText: {
		flex: 1,
		minWidth: 0,
	},
	eyebrow: {
		color: "#39806E",
		fontSize: 10,
		fontWeight: "800",
		letterSpacing: 1,
		marginBottom: 6,
	},
	title: {
		color: "#173F4A",
		fontSize: 28,
		fontWeight: "800",
	},
	subtitle: {
		color: "#667A7F",
		fontSize: 14,
		marginTop: 4,
	},
	addButton: {
		alignItems: "center",
		backgroundColor: "#27836F",
		borderRadius: 12,
		justifyContent: "center",
		marginLeft: 10,
		minHeight: 46,
		paddingHorizontal: 14,
	},
	compactAddButton: {
		alignSelf: "flex-start",
		marginLeft: 0,
	},
	addButtonText: {
		color: "#FFFFFF",
		fontSize: 14,
		fontWeight: "700",
	},
	errorCard: {
		backgroundColor: "#FFF1ED",
		borderColor: "#F2C9BE",
		borderRadius: 12,
		borderWidth: 1,
		marginBottom: 16,
		padding: 14,
	},
	errorText: {
		color: "#7E3429",
		fontSize: 14,
	},
	retryButton: {
		alignSelf: "flex-start",
		marginTop: 8,
		paddingVertical: 4,
	},
	retryText: {
		color: "#A84334",
		fontSize: 14,
		fontWeight: "700",
	},
	loading: {
		alignItems: "center",
		flex: 1,
		gap: 10,
		justifyContent: "center",
	},
	loadingText: {
		color: "#667A7F",
		fontSize: 14,
	},
	listContent: {
		paddingBottom: 24,
	},
	emptyListContent: {
		flexGrow: 1,
		justifyContent: "center",
	},
	emptyCard: {
		alignItems: "center",
		backgroundColor: "#FFFFFF",
		borderColor: "#E0E9E7",
		borderRadius: 20,
		borderWidth: 1,
		paddingHorizontal: 24,
		paddingVertical: 36,
	},
	emptyEmoji: {
		color: "#27836F",
		fontSize: 40,
		marginBottom: 12,
	},
	emptyTitle: {
		color: "#173F4A",
		fontSize: 18,
		fontWeight: "800",
	},
	emptyText: {
		color: "#718286",
		fontSize: 14,
		lineHeight: 20,
		marginTop: 7,
		textAlign: "center",
	},
	pressed: {
		opacity: 0.78,
	},
});
