import { useState } from "react";
import {
	KeyboardAvoidingView,
	Platform,
	Pressable,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	View,
} from "react-native";
import type { Fruit, FruitFormValues } from "./fruit";

interface FruitFormProps {
	mode: "add" | "edit";
	fruit?: Fruit;
	error: string | null;
	isSubmitting: boolean;
	onCancel: () => void;
	onSubmit: (values: FruitFormValues) => Promise<void>;
}

export function FruitForm({
	mode,
	fruit,
	error,
	isSubmitting,
	onCancel,
	onSubmit,
}: FruitFormProps) {
	const [name, setName] = useState(fruit?.name ?? "");
	const [quantity, setQuantity] = useState(fruit?.quantity ?? "");
	const [unit, setUnit] = useState(fruit?.unit ?? "piezas");
	const [validationError, setValidationError] = useState<string | null>(null);

	const isEditing = mode === "edit";

	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === "ios" ? "padding" : undefined}
			style={styles.container}
		>
			<ScrollView
				contentContainerStyle={styles.screen}
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
						accessibilityLabel="Nombre de la fruta"
						onChangeText={setName}
						placeholder="Ej. Manzana"
						placeholderTextColor="#8A9A9E"
						style={styles.input}
						value={name}
					/>

					<Text style={styles.label}>Cantidad</Text>
					<TextInput
						accessibilityLabel="Cantidad"
						keyboardType="decimal-pad"
						onChangeText={setQuantity}
						placeholder="Ej. 12"
						placeholderTextColor="#8A9A9E"
						style={styles.input}
						value={quantity}
					/>

					<Text style={styles.label}>Unidad</Text>
					<TextInput
						accessibilityLabel="Unidad"
						autoCapitalize="none"
						onChangeText={setUnit}
						placeholder="Ej. piezas o kg"
						placeholderTextColor="#8A9A9E"
						style={styles.input}
						value={unit}
					/>

					{(validationError || error) && (
						<Text accessibilityRole="alert" style={styles.errorText}>
							{validationError ?? error}
						</Text>
					)}

					<View style={styles.actions}>
						<Pressable
							accessibilityRole="button"
							disabled={isSubmitting}
							onPress={onCancel}
							style={({ pressed }) => [
								styles.secondaryButton,
								isSubmitting && styles.disabled,
								pressed && styles.pressed,
							]}
						>
							<Text style={styles.secondaryButtonText}>Cancelar</Text>
						</Pressable>
						<Pressable
							accessibilityRole="button"
							disabled={isSubmitting}
							onPress={() => {
								const normalizedValues = {
									name: name.trim(),
									quantity: quantity.trim(),
									unit: unit.trim(),
								};
								if (
									!normalizedValues.name ||
									!normalizedValues.quantity ||
									!normalizedValues.unit ||
									!Number.isFinite(Number(normalizedValues.quantity)) ||
									Number(normalizedValues.quantity) < 0
								) {
									setValidationError(
										"Ingresa nombre, cantidad válida y unidad.",
									);
									return;
								}
								setValidationError(null);
								void onSubmit(normalizedValues);
							}}
							style={({ pressed }) => [
								styles.primaryButton,
								isSubmitting && styles.disabled,
								pressed && styles.pressed,
							]}
						>
							<Text style={styles.primaryButtonText}>
								{isSubmitting
									? "Guardando..."
									: isEditing
										? "Guardar cambios"
										: "Agregar fruta"}
							</Text>
						</Pressable>
					</View>
				</View>
			</ScrollView>
		</KeyboardAvoidingView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	screen: {
		flexGrow: 1,
		padding: 18,
		paddingBottom: 32,
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
	errorText: {
		color: "#A84334",
		fontSize: 14,
		lineHeight: 20,
		marginTop: 14,
	},
	disabled: {
		opacity: 0.55,
	},
	pressed: {
		opacity: 0.78,
	},
});
