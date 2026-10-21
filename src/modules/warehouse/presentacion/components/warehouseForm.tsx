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
import type {
	Warehouse,
	WarehouseFormValues,
} from "../../domain/warehouse";

interface WarehouseFormProps {
	mode: "add" | "edit";
	warehouse?: Warehouse;
	error: string | null;
	isSubmitting: boolean;
	onCancel: () => void;
	onSubmit: (values: WarehouseFormValues) => Promise<void>;
}

export function WarehouseForm({
	mode,
	warehouse,
	error,
	isSubmitting,
	onCancel,
	onSubmit,
}: WarehouseFormProps) {
	const [name, setName] = useState(warehouse?.name ?? "");
	const [location, setLocation] = useState(warehouse?.location ?? "");
	const [capacity, setCapacity] = useState(
		warehouse ? String(warehouse.capacity) : "",
	);
	const [capacityUnit, setCapacityUnit] = useState(
		warehouse?.capacityUnit ?? "pallets",
	);
	const [validationError, setValidationError] = useState<string | null>(null);
	const isEditing = mode === "edit";

	const submit = () => {
		const normalizedName = name.trim();
		const normalizedLocation = location.trim();
		const normalizedUnit = capacityUnit.trim();
		const parsedCapacity = Number(capacity.replace(",", "."));

		if (
			!normalizedName ||
			!normalizedLocation ||
			!normalizedUnit ||
			capacity.trim() === "" ||
			!Number.isFinite(parsedCapacity) ||
			parsedCapacity < 0
		) {
			setValidationError(
				"Ingresa nombre, ubicación, capacidad válida y unidad.",
			);
			return;
		}

		setValidationError(null);
		void onSubmit({
			name: normalizedName,
			location: normalizedLocation,
			capacity: parsedCapacity,
			capacityUnit: normalizedUnit,
		});
	};

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
							{isEditing ? "ACTUALIZAR ALMACÉN" : "NUEVO ALMACÉN"}
						</Text>
						<Text style={styles.title}>
							{isEditing ? "Editar almacén" : "Agregar almacén"}
						</Text>
						<Text style={styles.subtitle}>
							{isEditing
								? "Actualiza la información de este almacén."
								: "Registra la ubicación y capacidad del almacén."}
						</Text>
					</View>

					<Text style={styles.label}>Nombre del almacén</Text>
					<TextInput
						accessibilityLabel="Nombre del almacén"
						autoCapitalize="words"
						onChangeText={setName}
						placeholder="Ej. Almacén central"
						placeholderTextColor="#8A9A9E"
						style={styles.input}
						value={name}
					/>

					<Text style={styles.label}>Ubicación</Text>
					<TextInput
						accessibilityLabel="Ubicación"
						autoCapitalize="words"
						onChangeText={setLocation}
						placeholder="Ej. Izúcar de Matamoros"
						placeholderTextColor="#8A9A9E"
						style={styles.input}
						value={location}
					/>

					<Text style={styles.label}>Capacidad</Text>
					<TextInput
						accessibilityLabel="Capacidad"
						keyboardType="decimal-pad"
						onChangeText={setCapacity}
						placeholder="Ej. 120"
						placeholderTextColor="#8A9A9E"
						style={styles.input}
						value={capacity}
					/>

					<Text style={styles.label}>Unidad de capacidad</Text>
					<TextInput
						accessibilityLabel="Unidad de capacidad"
						autoCapitalize="none"
						onChangeText={setCapacityUnit}
						placeholder="Ej. pallets o toneladas"
						placeholderTextColor="#8A9A9E"
						style={styles.input}
						value={capacityUnit}
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
							onPress={submit}
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
										: "Agregar almacén"}
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
