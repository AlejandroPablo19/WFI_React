import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import type { Warehouse } from "../../domain/warehouse";

interface DeleteWarehouseProps {
	warehouse: Warehouse | null;
	isDeleting: boolean;
	onCancel: () => void;
	onConfirm: () => void;
}

export function DeleteWarehouse({
	warehouse,
	isDeleting,
	onCancel,
	onConfirm,
}: DeleteWarehouseProps) {
	if (!warehouse) {
		return null;
	}

	return (
		<Modal
			animationType="fade"
			transparent
			visible
			onRequestClose={onCancel}
		>
			<View style={styles.backdrop}>
				<View style={styles.card}>
					<View style={styles.icon}>
						<Text style={styles.iconText}>!</Text>
					</View>
					<Text style={styles.title}>¿Eliminar almacén?</Text>
					<Text style={styles.message}>
						¿Deseas eliminar {warehouse.name} del registro?
					</Text>
					<View style={styles.actions}>
						<Pressable
							accessibilityRole="button"
							disabled={isDeleting}
							onPress={onCancel}
							style={({ pressed }) => [
								styles.cancelButton,
								isDeleting && styles.disabled,
								pressed && styles.pressed,
							]}
						>
							<Text style={styles.cancelText}>Cancelar</Text>
						</Pressable>
						<Pressable
							accessibilityRole="button"
							disabled={isDeleting}
							onPress={onConfirm}
							style={({ pressed }) => [
								styles.confirmButton,
								isDeleting && styles.disabled,
								pressed && styles.pressed,
							]}
						>
							<Text style={styles.confirmText}>
								{isDeleting ? "Eliminando..." : "Sí, eliminar"}
							</Text>
						</Pressable>
					</View>
				</View>
			</View>
		</Modal>
	);
}

const styles = StyleSheet.create({
	backdrop: {
		alignItems: "center",
		backgroundColor: "rgba(17, 45, 49, 0.48)",
		flex: 1,
		justifyContent: "center",
		padding: 20,
	},
	card: {
		backgroundColor: "#FFF9F6",
		borderColor: "#F2C9BE",
		borderRadius: 20,
		borderWidth: 1,
		maxWidth: 420,
		padding: 22,
		width: "100%",
	},
	icon: {
		alignItems: "center",
		backgroundColor: "#FCE6E0",
		borderRadius: 13,
		height: 42,
		justifyContent: "center",
		marginBottom: 14,
		width: 42,
	},
	iconText: {
		color: "#C65340",
		fontSize: 20,
		fontWeight: "800",
	},
	title: {
		color: "#7E3429",
		fontSize: 18,
		fontWeight: "800",
	},
	message: {
		color: "#745D58",
		fontSize: 14,
		lineHeight: 20,
		marginTop: 6,
	},
	actions: {
		flexDirection: "row",
		gap: 10,
		justifyContent: "flex-end",
		marginTop: 20,
	},
	cancelButton: {
		alignItems: "center",
		backgroundColor: "#FFFFFF",
		borderColor: "#E7D7D3",
		borderRadius: 10,
		borderWidth: 1,
		justifyContent: "center",
		minHeight: 44,
		paddingHorizontal: 14,
	},
	cancelText: {
		color: "#745D58",
		fontSize: 13,
		fontWeight: "700",
	},
	confirmButton: {
		alignItems: "center",
		backgroundColor: "#C65340",
		borderRadius: 10,
		justifyContent: "center",
		minHeight: 44,
		paddingHorizontal: 14,
	},
	confirmText: {
		color: "#FFFFFF",
		fontSize: 13,
		fontWeight: "700",
	},
	disabled: {
		opacity: 0.55,
	},
	pressed: {
		opacity: 0.75,
	},
});
