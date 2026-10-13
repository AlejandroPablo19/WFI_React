import { Pressable, StyleSheet, Text, View } from "react-native";
import type { Fruit } from "./fruit";

interface DeleteFruitProps {
	fruit: Fruit | null;
	onCancel: () => void;
	onConfirm: () => void;
}

export function DeleteFruit({ fruit, onCancel, onConfirm }: DeleteFruitProps) {
	if (!fruit) {
		return null;
	}

	return (
		<View style={styles.card}>
			<View style={styles.icon}>
				<Text style={styles.iconText}>!</Text>
			</View>
			<View style={styles.content}>
				<Text style={styles.title}>¿Eliminar fruta?</Text>
				<Text style={styles.message}>
					¿Deseas eliminar {fruit.name} del inventario?
				</Text>
				<View style={styles.actions}>
					<Pressable
						accessibilityRole="button"
						onPress={onCancel}
						style={({ pressed }) => [
							styles.button,
							styles.cancelButton,
							pressed && styles.pressed,
						]}
					>
						<Text style={styles.cancelText}>Cancelar</Text>
					</Pressable>
					<Pressable
						accessibilityRole="button"
						onPress={onConfirm}
						style={({ pressed }) => [
							styles.button,
							styles.confirmButton,
							pressed && styles.pressed,
						]}
					>
						<Text style={styles.confirmText}>Sí, eliminar</Text>
					</Pressable>
				</View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	card: {
		backgroundColor: "#FFF9F6",
		borderColor: "#F2C9BE",
		borderRadius: 18,
		borderWidth: 1,
		flexDirection: "row",
		marginBottom: 18,
		padding: 16,
	},
	icon: {
		alignItems: "center",
		backgroundColor: "#FCE6E0",
		borderRadius: 13,
		height: 40,
		justifyContent: "center",
		marginRight: 12,
		width: 40,
	},
	iconText: {
		color: "#C65340",
		fontSize: 20,
		fontWeight: "800",
	},
	content: {
		flex: 1,
	},
	title: {
		color: "#7E3429",
		fontSize: 16,
		fontWeight: "800",
	},
	message: {
		color: "#745D58",
		fontSize: 14,
		lineHeight: 20,
		marginTop: 5,
	},
	actions: {
		flexDirection: "row",
		gap: 9,
		marginTop: 14,
	},
	button: {
		alignItems: "center",
		borderRadius: 9,
		justifyContent: "center",
		minHeight: 40,
		paddingHorizontal: 13,
	},
	cancelButton: {
		backgroundColor: "#FFFFFF",
		borderColor: "#E7D7D3",
		borderWidth: 1,
	},
	cancelText: {
		color: "#745D58",
		fontSize: 13,
		fontWeight: "700",
	},
	confirmButton: {
		backgroundColor: "#C65340",
	},
	confirmText: {
		color: "#FFFFFF",
		fontSize: 13,
		fontWeight: "700",
	},
	pressed: {
		opacity: 0.75,
	},
});