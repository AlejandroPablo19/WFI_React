import { Pressable, StyleSheet, Text, View } from "react-native";
import type { Warehouse } from "../../domain/warehouse";

interface ReadWarehouseProps {
	warehouse: Warehouse;
	onEdit: (warehouse: Warehouse) => void;
	onDelete: (warehouse: Warehouse) => void;
}

export function ReadWarehouse({
	warehouse,
	onEdit,
	onDelete,
}: ReadWarehouseProps) {
	return (
		<View style={styles.card}>
			<Pressable
				accessibilityLabel={`Editar ${warehouse.name}`}
				accessibilityRole="button"
				onPress={() => onEdit(warehouse)}
				style={({ pressed }) => [
					styles.main,
					pressed && styles.pressed,
				]}
			>
				<View style={styles.icon}>
					<Text style={styles.iconText}>⌂</Text>
				</View>
				<View style={styles.info}>
					<Text numberOfLines={1} style={styles.name}>
						{warehouse.name}
					</Text>
					<Text numberOfLines={2} style={styles.location}>
						{warehouse.location}
					</Text>
					<Text style={styles.capacity}>
						<Text style={styles.capacityValue}>{warehouse.capacity}</Text>{" "}
						{warehouse.capacityUnit}
					</Text>
				</View>
			</Pressable>

			<Pressable
				accessibilityLabel={`Eliminar ${warehouse.name}`}
				accessibilityRole="button"
				onPress={() => onDelete(warehouse)}
				style={({ pressed }) => [
					styles.deleteButton,
					pressed && styles.pressed,
				]}
			>
				<Text style={styles.deleteText}>Eliminar</Text>
			</Pressable>
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
	main: {
		alignItems: "center",
		flex: 1,
		flexDirection: "row",
		minWidth: 0,
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
		color: "#27836F",
		fontSize: 28,
		fontWeight: "700",
	},
	info: {
		flex: 1,
		minWidth: 0,
	},
	name: {
		color: "#173F4A",
		fontSize: 16,
		fontWeight: "700",
		marginBottom: 4,
	},
	location: {
		color: "#65787B",
		fontSize: 13,
		lineHeight: 18,
	},
	capacity: {
		color: "#65787B",
		fontSize: 13,
		marginTop: 5,
	},
	capacityValue: {
		color: "#39806E",
		fontWeight: "800",
	},
	deleteButton: {
		alignItems: "center",
		backgroundColor: "#FFF1ED",
		borderRadius: 8,
		justifyContent: "center",
		marginLeft: 10,
		minHeight: 38,
		paddingHorizontal: 12,
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
