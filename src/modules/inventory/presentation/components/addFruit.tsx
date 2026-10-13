import { useState } from "react";
import {
	KeyboardAvoidingView,
	Modal,
	Platform,
	Pressable,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	View,
} from "react-native";
import type { Fruit } from "./fruit";

export type FruitFormValues = Omit<Fruit, "id">;

interface FruitFormModalProps {
	visible: boolean;
	mode: "add" | "edit";
	fruit?: Fruit | null;
	onClose: () => void;
	onSubmit: (values: FruitFormValues) => void;
}

export function FruitFormModal({
	visible,
	mode,
	fruit,
	onClose,
	onSubmit,
}: FruitFormModalProps) {
	const [name, setName] = useState(fruit?.name ?? "");
	const [quantity, setQuantity] = useState(fruit?.quantity ?? "");
	const [unit, setUnit] = useState(fruit?.unit ?? "piezas");

	const isEditing = mode === "edit";

	return (
		<Modal
			animationType="fade"
			transparent
			visible={visible}
			onRequestClose={onClose}
		>
			<KeyboardAvoidingView
				behavior={Platform.OS === "ios" ? "padding" : undefined}
				style={styles.backdrop}
			>
				<ScrollView
					contentContainerStyle={styles.modalScroll}
					keyboardShouldPersistTaps="handled"
				>
					<View style={styles.card}>
						<View style={styles.heading}>
							<Text style={styles.eyebrow}>
								{isEditing ? "ACTUALIZAR INVENTARIO" : "NUEVO INGREDIENTE"}
							</Text>
							<Text style={styles.title}>
								{isEditing ? "Editar fruta" : "Agregar fruta"}
							</Text>
							<Text style={styles.subtitle}>
								{isEditing
									? "Modifica los datos de esta fruta."
									: "Completa los datos para agregarla al inventario."}
							</Text>
						</View>

						<Text style={styles.label}>Nombre de la fruta</Text>
						<TextInput
							autoCapitalize="words"
							onChangeText={setName}
							placeholder="Ej. Manzana"
							placeholderTextColor="#8A9A9E"
							style={styles.input}
							value={name}
						/>

						<Text style={styles.label}>Cantidad</Text>
						<TextInput
							keyboardType="decimal-pad"
							onChangeText={setQuantity}
							placeholder="Ej. 12"
							placeholderTextColor="#8A9A9E"
							style={styles.input}
							value={quantity}
						/>

						<Text style={styles.label}>Unidad</Text>
						<TextInput
							autoCapitalize="none"
							onChangeText={setUnit}
							placeholder="Ej. piezas o kg"
							placeholderTextColor="#8A9A9E"
							style={styles.input}
							value={unit}
						/>

						<View style={styles.actions}>
							<Pressable
								accessibilityRole="button"
								onPress={onClose}
								style={({ pressed }) => [
									styles.secondaryButton,
									pressed && styles.pressed,
								]}
							>
								<Text style={styles.secondaryButtonText}>Cancelar</Text>
							</Pressable>
							<Pressable
								accessibilityRole="button"
								onPress={() => onSubmit({ name, quantity, unit })}
								style={({ pressed }) => [
									styles.primaryButton,
									pressed && styles.pressed,
								]}
							>
								<Text style={styles.primaryButtonText}>
									{isEditing ? "Guardar cambios" : "Agregar fruta"}
								</Text>
							</Pressable>
						</View>
					</View>
				</ScrollView>
			</KeyboardAvoidingView>
		</Modal>
	);
}

export function AddFruit({
	visible,
	onClose,
	onSubmit,
}: Omit<FruitFormModalProps, "mode" | "fruit">) {
	return (
		<FruitFormModal
			mode="add"
			onClose={onClose}
			onSubmit={onSubmit}
			visible={visible}
		/>
	);
}

const styles = StyleSheet.create({
	backdrop: {
		backgroundColor: "rgba(17, 45, 49, 0.48)",
		flex: 1,
		justifyContent: "center",
		padding: 20,
	},
	modalScroll: {
		flexGrow: 1,
		justifyContent: "center",
	},
	card: {
		backgroundColor: "#FFFFFF",
		borderColor: "#D7E4E8",
		borderRadius: 22,
		borderWidth: 1,
		elevation: 8,
		padding: 22,
		shadowColor: "#173F4A",
		shadowOffset: { width: 0, height: 6 },
		shadowOpacity: 0.16,
		shadowRadius: 16,
	},
	heading: {
		marginBottom: 22,
	},
	eyebrow: {
		color: "#39806E",
		fontSize: 11,
		fontWeight: "800",
		letterSpacing: 1.1,
		marginBottom: 8,
	},
	title: {
		color: "#173F4A",
		fontSize: 24,
		fontWeight: "800",
	},
	subtitle: {
		color: "#667A7F",
		fontSize: 14,
		lineHeight: 20,
		marginTop: 6,
	},
	label: {
		color: "#294D54",
		fontSize: 13,
		fontWeight: "700",
		marginBottom: 7,
		marginTop: 14,
	},
	input: {
		backgroundColor: "#F7FAF9",
		borderColor: "#D7E4E8",
		borderRadius: 12,
		borderWidth: 1,
		color: "#173F4A",
		fontSize: 16,
		minHeight: 50,
		paddingHorizontal: 14,
	},
	actions: {
		flexDirection: "row",
		gap: 10,
		marginTop: 26,
	},
	primaryButton: {
		alignItems: "center",
		backgroundColor: "#27836F",
		borderRadius: 12,
		flex: 1,
		justifyContent: "center",
		minHeight: 50,
		paddingHorizontal: 12,
	},
	primaryButtonText: {
		color: "#FFFFFF",
		fontSize: 14,
		fontWeight: "700",
	},
	secondaryButton: {
		alignItems: "center",
		backgroundColor: "#F1F5F4",
		borderColor: "#D7E4E8",
		borderRadius: 12,
		borderWidth: 1,
		justifyContent: "center",
		minHeight: 50,
		paddingHorizontal: 16,
	},
	secondaryButtonText: {
		color: "#35575D",
		fontSize: 14,
		fontWeight: "700",
	},
	pressed: {
		opacity: 0.78,
	},
});
