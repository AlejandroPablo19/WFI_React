import { useState } from "react";
import {
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { AddFruit, type FruitFormValues } from "./components/addFruit";
import { DeleteFruit } from "./components/deleteFruit";
import type { Fruit } from "./components/fruit";
import { ReadFruit } from "./components/readFruit";
import { UpdateFruit } from "./components/updateFruit";

interface InventoryViewProps {
	fruits?: Fruit[];
	onAddFruit?: (values: FruitFormValues) => void;
	onUpdateFruit?: (fruit: Fruit, values: FruitFormValues) => void;
	onDeleteFruit?: (fruit: Fruit) => void;
}

export function InventoryView({
	fruits = [],
	onAddFruit,
	onUpdateFruit,
	onDeleteFruit,
}: InventoryViewProps) {
	const [addVisible, setAddVisible] = useState(false);
	const [fruitToUpdate, setFruitToUpdate] = useState<Fruit | null>(null);
	const [fruitToDelete, setFruitToDelete] = useState<Fruit | null>(null);

	const submitNewFruit = (values: FruitFormValues) => {
		onAddFruit?.(values);
		setAddVisible(false);
	};

	const submitFruitUpdate = (values: FruitFormValues) => {
		if (fruitToUpdate) {
			onUpdateFruit?.(fruitToUpdate, values);
			setFruitToUpdate(null);
		}
	};

	const confirmFruitDeletion = () => {
		if (fruitToDelete) {
			onDeleteFruit?.(fruitToDelete);
			setFruitToDelete(null);
		}
	};

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<View>
					<Text style={styles.eyebrow}>CONTROL DE EXISTENCIAS</Text>
					<Text style={styles.title}>Inventario</Text>
					<Text style={styles.subtitle}>
						Administra las frutas disponibles.
					</Text>
				</View>
				<Pressable
					accessibilityRole="button"
					onPress={() => {
						setFruitToDelete(null);
						setAddVisible(true);
					}}
					style={({ pressed }) => [
						styles.addButton,
						pressed && styles.pressed,
					]}
				>
					<Text style={styles.addButtonText}>+ Agregar</Text>
				</Pressable>
			</View>

			<DeleteFruit
				fruit={fruitToDelete}
				onCancel={() => setFruitToDelete(null)}
				onConfirm={confirmFruitDeletion}
			/>

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
		paddingTop: 28,
	},
	header: {
		alignItems: "center",
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 24,
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
	addButtonText: {
		color: "#FFFFFF",
		fontSize: 14,
		fontWeight: "700",
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