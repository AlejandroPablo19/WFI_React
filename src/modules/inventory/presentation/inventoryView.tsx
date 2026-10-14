import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, FlatList, Platform, Pressable, StyleSheet, Text, useWindowDimensions, View, } from "react-native";
import { loadFruits as readFruits, saveFruits, } from "../infraestructure/fruitStorage";
import { AddFruit, type FruitFormValues } from "./components/addFruit";
import { DeleteFruit } from "./components/deleteFruit";
import type { Fruit } from "./components/fruit";
import { ReadFruit } from "./components/readFruit";
import { UpdateFruit } from "./components/updateFruit";

export function InventoryView() {
	const { width } = useWindowDimensions();
	const isCompact = width < 420;
	const [fruits, setFruits] = useState<Fruit[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isSaving, setIsSaving] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [loadAttempt, setLoadAttempt] = useState(0);
	const [addVisible, setAddVisible] = useState(false);
	const [fruitToUpdate, setFruitToUpdate] = useState<Fruit | null>(null);
	const [fruitToDelete, setFruitToDelete] = useState<Fruit | null>(null);
	const savingRef = useRef(false);

	useEffect(() => {
		let cancelled = false;
		readFruits()
			.then((savedFruits) => {
				if (!cancelled) {
					setFruits(savedFruits);
					setError(null);
				}
			})
			.catch((loadError: unknown) => {
				if (!cancelled) {
					console.error("No se pudo cargar el inventario de frutas.", loadError);
					setError("No se pudo cargar el inventario. Intenta de nuevo.");
				}
			})
			.finally(() => {
				if (!cancelled) {
					setIsLoading(false);
				}
			});

		return () => {
			cancelled = true;
		};
	}, [loadAttempt]);

	const persistFruits = async (updatedFruits: Fruit[]) => {
		if (savingRef.current) {
			return false;
		}

		savingRef.current = true;
		setIsSaving(true);
		setError(null);
		try {
			await saveFruits(updatedFruits);
			setFruits(updatedFruits);
			return true;
		} catch (saveError) {
			console.error("No se pudo guardar el inventario de frutas.", saveError);
			setError("No se pudieron guardar los cambios. Intenta de nuevo.");
			return false;
		} finally {
			savingRef.current = false;
			setIsSaving(false);
		}
	};

	const submitNewFruit = async (values: FruitFormValues) => {
		const fruit: Fruit = {
			...values,
			id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
		};
		if (await persistFruits([...fruits, fruit])) {
			setAddVisible(false);
		}
	};

	const submitFruitUpdate = async (values: FruitFormValues) => {
		if (fruitToUpdate) {
			const updatedFruits = fruits.map((fruit) =>
				fruit.id === fruitToUpdate.id ? { ...fruit, ...values } : fruit,
			);
			if (await persistFruits(updatedFruits)) {
				setFruitToUpdate(null);
			}
		}
	};

	const confirmFruitDeletion = async () => {
		if (fruitToDelete) {
			const updatedFruits = fruits.filter(
				(fruit) => fruit.id !== fruitToDelete.id,
			);
			if (await persistFruits(updatedFruits)) {
				setFruitToDelete(null);
			}
		}
	};

	return (
		<View style={styles.container}>
			<View style={[styles.header, isCompact && styles.compactHeader]}>
				<View style={styles.headerText}>
					<Text style={styles.eyebrow}>CONTROL DE EXISTENCIAS</Text>
					<Text style={styles.title}>Inventario</Text>
					<Text style={styles.subtitle}>
						Administra las frutas disponibles; se guardan en este dispositivo.
					</Text>
				</View>
				<Pressable
					accessibilityRole="button"
					disabled={isLoading || Boolean(error) || isSaving}
					onPress={() => {
						setFruitToDelete(null);
						setAddVisible(true);
					}}
					style={({ pressed }) => [
						styles.addButton,
						isCompact && styles.compactAddButton,
						(isLoading || Boolean(error) || isSaving) && styles.disabled,
						pressed && styles.pressed,
					]}
				>
					<Text style={styles.addButtonText}>+ Agregar</Text>
				</Pressable>
			</View>

			{error && (
				<View accessibilityRole="alert" style={styles.errorCard}>
					<Text style={styles.errorText}>{error}</Text>
					{isLoading === false && fruits.length === 0 && (
						<Pressable
							accessibilityRole="button"
							onPress={() => {
								setIsLoading(true);
								setError(null);
								setLoadAttempt((attempt) => attempt + 1);
							}}
							style={styles.retryButton}
						>
							<Text style={styles.retryText}>Reintentar</Text>
						</Pressable>
					)}
				</View>
			)}

			<DeleteFruit
				fruit={fruitToDelete}
				onCancel={() => setFruitToDelete(null)}
				onConfirm={confirmFruitDeletion}
			/>

			{isLoading ? (
				<View style={styles.loading}>
					<ActivityIndicator color="#27836F" />
					<Text style={styles.loadingText}>Cargando inventario...</Text>
				</View>
			) : !error ? (
				<FlatList
					contentContainerStyle={[
						styles.listContent,
						fruits.length === 0 && styles.emptyListContent,
					]}
					data={fruits}
					keyExtractor={(fruit) => fruit.id}
					ListEmptyComponent={
						<View style={styles.emptyCard}>
							<Text style={styles.emptyEmoji}>🍐</Text>
							<Text style={styles.emptyTitle}>Aún no hay frutas</Text>
							<Text style={styles.emptyText}>
								Agrega una fruta para verla en esta lista.
							</Text>
						</View>
					}
					renderItem={({ item }) => (
						<ReadFruit
							fruit={item}
							onDelete={setFruitToDelete}
							onEdit={(fruit) => {
								setFruitToDelete(null);
								setFruitToUpdate(fruit);
							}}
						/>
					)}
					showsVerticalScrollIndicator={false}
				/>
			) : null}

			{addVisible && (
				<AddFruit
					onClose={() => setAddVisible(false)}
					onSubmit={submitNewFruit}
					visible
				/>
			)}
			{fruitToUpdate && (
				<UpdateFruit
					fruit={fruitToUpdate}
					onClose={() => setFruitToUpdate(null)}
					onSubmit={submitFruitUpdate}
					visible
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
		paddingTop: Platform.OS === "web" ? 88 : 28,
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
	disabled: {
		opacity: 0.55,
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