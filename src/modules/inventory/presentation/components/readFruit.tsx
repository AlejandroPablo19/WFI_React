import { Pressable, StyleSheet, Text, View } from "react-native";
import type { Fruit } from "./fruit";

interface ReadFruitProps {
	fruit: Fruit;
	onEdit: (fruit: Fruit) => void;
	onDelete: (fruit: Fruit) => void;
}

export function ReadFruit({ fruit, onEdit, onDelete }: ReadFruitProps) {
	return (
		<View style={styles.card}>
			<View style={styles.icon}>
				<Text style={styles.iconText}>🍎</Text>
			</View>
			<View style={styles.info}>
				<Text style={styles.name} numberOfLines={1}>
					{fruit.name}
				</Text>
				<Text style={styles.detail}>
					<Text style={styles.quantity}>{fruit.quantity}</Text>{" "}
					{fruit.unit || "piezas"}
				</Text>
			</View>
			<View style={styles.actions}>
				<Pressable
					accessibilityLabel={`Editar ${fruit.name}`}
					accessibilityRole="button"
					onPress={() => onEdit(fruit)}
					style={({ pressed }) => [
						styles.actionButton,
						styles.editButton,
						pressed && styles.pressed,
					]}
				>
					<Text style={styles.editText}>Editar</Text>
				</Pressable>
				<Pressable
					accessibilityLabel={`Eliminar ${fruit.name}`}
					accessibilityRole="button"
					onPress={() => onDelete(fruit)}
					style={({ pressed }) => [
						styles.actionButton,
						styles.deleteButton,
						pressed && styles.pressed,
					]}
				>
					<Text style={styles.deleteText}>Eliminar</Text>
				</Pressable>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	card: {
		alignItems: "center",
		backgroundColor: "#FFFFFF",
		borderColor: "#E0E9E7",
		borderRadius: 18,
		borderWidth: 1,
		elevation: 2,
		flexDirection: "row",
		marginBottom: 12,
		padding: 14,
		shadowColor: "#173F4A",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.06,
		shadowRadius: 6,
	},
	icon: {
		alignItems: "center",
		backgroundColor: "#F0F7EF",
		borderRadius: 14,
		height: 48,
		justifyContent: "center",
		marginRight: 12,
		width: 48,
	},
	iconText: {
		fontSize: 26,
	},
	info: {
		flex: 1,
		minWidth: 0,
	},
	name: {
		color: "#173F4A",
		fontSize: 16,
		fontWeight: "700",
		marginBottom: 5,
	},
	detail: {
		color: "#65787B",
		fontSize: 13,
	},
	quantity: {
		color: "#39806E",
		fontWeight: "800",
	},
	actions: {
		alignItems: "flex-end",
		gap: 6,
		marginLeft: 8,
	},
	actionButton: {
		alignItems: "center",
		borderRadius: 8,
		justifyContent: "center",
		minHeight: 32,
		minWidth: 76,
		paddingHorizontal: 10,
	},
	editButton: {
		backgroundColor: "#EAF4F1",
	},
	editText: {
		color: "#28735F",
		fontSize: 12,
		fontWeight: "700",
	},
	deleteButton: {
		backgroundColor: "#FFF1ED",
	},
	deleteText: {
		color: "#C65340",
		fontSize: 12,
		fontWeight: "700",
	},
	pressed: {
		opacity: 0.72,
	},
});
